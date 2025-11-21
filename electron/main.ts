import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import {
  ImportVaultResponse,
  InitializeVaultResponse,
  IpcResponse,
} from "../shared/types/icp";
import { Config, VaultData } from "../shared/types/vault";
import {
  ensureDir,
  getIsnippetData,
  loadConfig,
  saveConfig,
  writeJsonFile,
} from "../shared/utils/fs";
import { initializeVaultDefaultJson } from "../shared/utils/vault";
import { AppError } from "../shared/utils/error";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

const VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

process.env.VITE_PUBLIC = VITE_PUBLIC;

let win: BrowserWindow | null;

const configPath = path.join(app.getPath("userData"), "config.json");

function createWindow(config?: Config) {
  win = new BrowserWindow({
    icon: path.join(VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });
  win.webContents.openDevTools();

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
    if (config?.activeVault) {
      win?.webContents.send("auto-open-vault", config);
    }
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("select-path", async () => {
  const result = await dialog.showOpenDialog({
    title: "Select Vault Location",
    properties: ["openDirectory", "createDirectory"],
  });

  if (result.canceled) return null;

  return result.filePaths[0];
});

ipcMain.handle(
  "initialize-vault",
  async (
    _,
    { basePath, vaultName }: { basePath: string; vaultName: string }
  ): Promise<InitializeVaultResponse> => {
    const vaultPath = path.join(basePath, vaultName);

    if (fs.existsSync(vaultPath)) {
      throw AppError("VAULT_ALREADY_EXISTS");
    }

    ensureDir(vaultPath);
    ensureDir(path.join(vaultPath, "snippets"));
    ensureDir(path.join(vaultPath, ".isnippet"));

    const { settings, workspace, index } = initializeVaultDefaultJson();

    writeJsonFile(path.join(vaultPath, ".isnippet", "index.json"), index);

    writeJsonFile(path.join(vaultPath, ".isnippet", "settings.json"), settings);

    writeJsonFile(
      path.join(vaultPath, ".isnippet", "workspace.json"),
      workspace
    );

    const config = loadConfig(configPath) || {
      activeVault: null,
      recentVaults: [],
    };

    config.activeVault = vaultPath;

    config.recentVaults = [
      vaultPath,
      ...config.recentVaults.filter((v) => v !== vaultPath),
    ];

    saveConfig(configPath, config);

    return {
      success: true,
      data: { settings, workspace, index },
      vaultPath,
      vaultName,
    };
  }
);

ipcMain.handle("import-vault", async (): Promise<ImportVaultResponse> => {
  const vaultPath = await dialog
    .showOpenDialog({
      title: "Select Vault Folder",
      properties: ["openDirectory"],
    })
    .then((result) => result.filePaths[0]);

  if (!fs.existsSync(vaultPath)) {
    return AppError("VAULT_PATH_NOT_EXIST");
  }

  const isnippetDir = path.join(vaultPath, ".isnippet");

  if (!fs.existsSync(isnippetDir)) {
    return AppError("INVALID_VAULT");
  }

  const data = getIsnippetData(vaultPath);

  const config = loadConfig(configPath) || {
    activeVault: null,
    recentVaults: [],
  };

  config.activeVault = vaultPath;

  config.recentVaults = [
    vaultPath,
    ...config.recentVaults.filter((v) => v !== vaultPath),
  ];
  console.log("config_path", configPath);
  saveConfig(configPath, config);

  return {
    success: true,
    vaultPath,
    vaultName: path.basename(vaultPath),
    data,
  };
});

ipcMain.handle(
  "read-vault",
  async (_, vaultPath: string): Promise<IpcResponse<VaultData>> => {
    const isnippetDir = path.join(vaultPath, ".isnippet");
    if (!fs.existsSync(isnippetDir)) {
      throw AppError("INVALID_VAULT");
    }

    const data = getIsnippetData(vaultPath);

    return {
      success: true,
      vaultPath,
      vaultName: path.basename(vaultPath),
      data,
    };
  }
);

app.whenReady().then(() => {
  const config = loadConfig(configPath) || undefined;
  createWindow(config);
});
