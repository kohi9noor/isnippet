import {
  VaultData,
  VaultIndex,
  VaultSettings,
  VaultWorkspace,
} from "../../shared/types/vault";

export function initializeVaultDefaultJson(): VaultData {
  const settings: VaultSettings = {
    autoOrganize: true,
    autoTags: true,
    autoSummary: false,
  };
  const workspace: VaultWorkspace = {
    lastOpened: Date.now(),
    sidebarOpen: true,
  };
  const index: VaultIndex = {
    snippets: [],
  };
  return { settings, workspace, index };
}
