import { VaultData } from "./vault";

export type SucessResposne<T> = {
  success: true;
  data: T;
  vaultPath: string;
  vaultName: string;
};

export type FailureResponse = {
  success: false;
  error: string;
};

export type IpcResponse<T = unknown> = SucessResposne<T> | FailureResponse;
export type ImportVaultResponse = IpcResponse<VaultData>;
export type InitializeVaultResponse = IpcResponse<VaultData>;
