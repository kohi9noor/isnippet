import { create } from "zustand";

interface VaultStore {
  vaultPath: string | null;
  metaData: Record<string, unknown> | null;
  settins: Record<string, unknown> | null;
  workspace: Record<string, unknown> | null;
  setVaultData: (data: VaultStore) => void;
  importVault: () => void;
}

export const useVaultStore = create<VaultStore>((set, get) => ({
  vaultPath: null,
  metaData: null,
  settins: null,
  workspace: null,
  setVaultData: (data: VaultStore) => set({ ...data }),
  importVault: async () => {
    const result = await window.api.importVault();
    if (result.success) {
      set({
        vaultPath: result.vaultPath,
        metaData: result.data,
      });
      console.log("Vault imported successfully", result);
    } else {
      console.error("Failed to import vault:", result);
    }
  },

  getVaultData: () => {
    return {
      vaultPath: get().vaultPath,
      metaData: get().metaData,
      settins: get().settins,
      workspace: get().workspace,
    };
  },
}));
