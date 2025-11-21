import { SucessResposne } from "@shared/types/icp";
export interface VaultSettings {
  autoOrganize: boolean;
  autoTags: boolean;
  autoSummary: boolean;
}

export interface VaultWorkspace {
  lastOpened: number;
  sidebarOpen: boolean;
}

export interface VaultIndex {
  snippets: Array<Record<string, unknown>>;
}

export interface VaultData {
  settings: VaultSettings;
  workspace: VaultWorkspace;
  index: VaultIndex;
}

export interface Vault {
  vaultName: string;
  data: VaultData;
  vaultPath: string;
}

export type InitializeVaultReq = {
  basePath: string;
  vaultName: string;
};

export interface ImportVaultReq {}

export interface Config {
  activeVault: string | null;
  recentVaults: string[];
}

/**
 *
 * VaultDataStore: inside the data,
 * status: indicates the current state of the vault data (idle, loading, success, error)
 * data: holds the actual vault data or null if not available
 *
 */

export type VaultDataStore =
  | { status: "idle"; data: null }
  | { status: "loading"; data: null }
  | { status: "success"; data: SucessResposne<VaultData> }
  | { status: "error"; error: string };
