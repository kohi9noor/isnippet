import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});
contextBridge.exposeInMainWorld("api", {
  readVault: (filePath: string) => {
    return ipcRenderer.invoke("read_vault", filePath);
  },

  selectPath: () => {
    return ipcRenderer.invoke("select-path");
  },
  initializeVault: (options: { basePath: string; vaultName: string }) => {
    return ipcRenderer.invoke("initialize-vault", options);
  },
});
