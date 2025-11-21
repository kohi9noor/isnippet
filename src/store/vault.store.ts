import { create } from "zustand";
import {
  VaultDataStore,
  InitializeVaultReq,
  VaultData,
} from "@shared/types/vault";
import { ImportVaultResponse, SucessResposne } from "@shared/types/icp";

type VaultStore = {
  vaultData: VaultDataStore;
  initializeVault: (payload: InitializeVaultReq) => Promise<VaultDataStore>;
  importVault: () => Promise<ImportVaultResponse>;
  setVaultData: (data: SucessResposne<VaultData>) => void;
  resetStore: () => void;
};

export const useVaultStore = create<VaultStore>((set) => ({
  initializeVault: async (payload) => {
    const response = await window.api.initializeVault(payload);
    if (response.success === false) {
      set({ vaultData: { status: "error", error: response.error } });
      return response;
    }

    set({ vaultData: { status: "success", data: response } });

    return response;
  },

  vaultData: { status: "idle", data: null },

  importVault: async () => {
    const response = await window.api.importVault();

    if (response.success === false) {
      set({ vaultData: { status: "error", error: response.error } });
      return response;
    }
    set({ vaultData: { status: "success", data: response } });

    return response;
  },
  setVaultData: (data: SucessResposne<VaultData>) => {
    set({ vaultData: { status: "success", data } });
  },
  resetStore: () => set({ vaultData: { status: "idle" } as VaultDataStore }),
}));
