import { create } from "zustand";
import { Config } from "@shared/types/vault";

type ConfigStore = {
  config: Config | null;
  setConfig: (config: Config) => void;
};

export const useConfigStore = create<ConfigStore>((set) => ({
  config: null,
  setConfig: (config: Config) => set({ config }),
}));
