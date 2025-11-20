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
