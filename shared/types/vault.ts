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

export type VaultDataStore =
  | { status: "idle"; data: null }
  | { status: "loading"; data: null }
  | { status: "success"; vaultName: string; vaultPath: string; data: VaultData }
  | { status: "error"; error: string };
