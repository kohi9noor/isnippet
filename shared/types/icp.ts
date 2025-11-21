import { VaultData } from "@shared/types/vault";

export type IpcResponse<T = unknown> =
  | { success: true; data: T; vaultPath: string; vaultName: string }
  | { success: false; error: string };

export type InitializeVaultResponse = IpcResponse<VaultData>;

export type ImportVaultResponse = IpcResponse<VaultData>;
