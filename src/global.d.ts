export {};
import { ImportVaultResponse } from "@shared/types/icp";
import { InitializeVaultResponse, IpcResponse } from "@shared/types/ipc";
import { Config } from "@shared/types/vault";
declare global {
  interface Window {
    api: {
      selectPath: () => Promise<string | null>;
      initializeVault: (options: {
        basePath: string;
        vaultName: string;
      }) => Promise<InitializeVaultResponse>;
      importVault: () => Promise<ImportVaultResponse>;
      readVault: (vaultPath: string) => Promise<IpcResponse<VaultData>>;
    };

    events: {
      autoOpenVault: (callback: (config: Config) => void) => void;
    };
  }
}
