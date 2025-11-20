/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import("electron").IpcRenderer;
  api: {
    readVault: (filePath: string) => Promise<string>;
    selectPath: () => Promise<string | null>;
    initializeVault: (options: {
      basePath: string;
      vaultName: string;
    }) => Promise<{ success: boolean; vaultName: string; message?: string }>;
  };
}
