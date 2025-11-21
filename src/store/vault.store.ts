import { create } from "zustand";
import { VaultDataStore, InitializeVaultReq } from "@shared/types/vault";
import { ImportVaultResponse } from "@shared/types/icp";

type VaultStore = {
  vaultData: VaultDataStore;
  initializeVault: (payload: InitializeVaultReq) => Promise<VaultDataStore>;
  importVault: () => Promise<ImportVaultResponse>;
  resetStore: () => void;
};

export const useVaultStore = create<VaultStore>((set) => ({
  initializeVault: async (payload) => {
    const response = await window.api.initializeVault(payload);
    set({ vaultData: { status: "success", data: response } });
    if (response.success === false) {
      set({ vaultData: { status: "error", data: null } });
      return response;
    }
    return response;
  },

  vaultData: { status: "idle", data: null },

  importVault: async () => {
    const response = await window.api.importVault();
    set({ vaultData: { status: "success", data: response } });
    if (response.success === false) {
      set({ vaultData: { status: "error", data: null } });
      return response;
    }
    return response;
  },

  resetStore: () => set({ vaultData: { status: "idle" } as VaultDataStore }),
}));
