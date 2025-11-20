import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });
  win.webContents.openDevTools();

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
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

ipcMain.handle("initialize-vault", async (_, { basePath, vaultName }) => {
  const vaultPath = path.join(basePath, vaultName);

  try {
    ensureDir(vaultPath);
    ensureDir(path.join(vaultPath, "snippets"));
    ensureDir(path.join(vaultPath, ".isnippet"));
    const indexJson = { snippets: {} };
    const settingsJson = {
      autoOrganize: true,
      autoTags: true,
      autoSummary: false,
      createdAt: Date.now(),
    };
    const workspaceJson = {
      lastOpened: Date.now(),
      sidebarOpen: true,
    };

    fs.writeFileSync(
      path.join(vaultPath, ".isnippet", "index.json"),
      JSON.stringify(indexJson, null, 2)
    );
    fs.writeFileSync(
      path.join(vaultPath, ".isnippet", "settings.json"),
      JSON.stringify(settingsJson, null, 2)
    );
    fs.writeFileSync(
      path.join(vaultPath, ".isnippet", "workspace.json"),
      JSON.stringify(workspaceJson, null, 2)
    );
    return { success: true, vaultPath };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

app.whenReady().then(createWindow);
