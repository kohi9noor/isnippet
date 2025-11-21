export {};
import { InitializeVaultResponse, IpcResponse } from "@shared/types/ipc";
declare global {
  interface Window {
    api: {
      selectPath: () => Promise<string | null>;
      initializeVault: (options: {
        basePath: string;
        vaultName: string;
      }) => Promise<InitializeVaultResponse>;
      importVault: () => Promise<IpcResponse<VaultData>>;
    };
  }
}
