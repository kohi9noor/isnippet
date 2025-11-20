export type IpcResponse<T = unknown> =
  | { success: true; data: T; vaultPath: string }
  | { success: false; error: string };

export type InitializeVaultResponse = IpcResponse<{
  vaultName: string;
}>;
