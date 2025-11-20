import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { InitializeVaultResponse, IpcResponse } from "@shared/types/icp";
import { VaultData } from "@shared/types/vault";
import { ensureDir, getIsnippetData, writeJsonFile } from "@shared/utils/fs";
import { initializeVaultDefaultJson } from "@shared/utils/vault";

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

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });
  win.webContents.openDevTools();

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
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

    try {
      ensureDir(vaultPath);
      ensureDir(path.join(vaultPath, "snippets"));
      ensureDir(path.join(vaultPath, ".isnippet"));

      const { settings, workspace, index } = initializeVaultDefaultJson();

      writeJsonFile(path.join(vaultPath, ".isnippet", "index.json"), index);

      writeJsonFile(
        path.join(vaultPath, ".isnippet", "settings.json"),
        settings
      );

      writeJsonFile(
        path.join(vaultPath, ".isnippet", "workspace.json"),
        workspace
      );

      return { success: true, data: { vaultName }, vaultPath };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
);

ipcMain.handle("import-vault", async (): Promise<IpcResponse<VaultData>> => {
  const vaultPath = await dialog
    .showOpenDialog({
      title: "Select Vault Folder",
      properties: ["openDirectory"],
    })
    .then((result) => result.filePaths[0]);

  if (!fs.existsSync(vaultPath)) {
    return { success: false, error: "Vault path does not exist." };
  }

  const isnippetDir = path.join(vaultPath, ".isnippet");

  if (!fs.existsSync(isnippetDir)) {
    return { success: false, error: "Not a valid isnippet vault." };
  }

  try {
    const data = getIsnippetData(vaultPath);
    return { success: true, vaultPath, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

app.whenReady().then(createWindow);
