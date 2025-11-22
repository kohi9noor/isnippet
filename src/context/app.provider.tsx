import { useConfigStore } from "@/store/config.store";
import { useVaultStore } from "@/store/vault.store";
import { Config } from "@shared/types/vault";
import React, { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AppProviderProps {
  children: React.ReactNode;
}

const AppContext = createContext<AppProviderProps | null>(null);

const AppProvider = ({ children }: AppProviderProps) => {
  const { setConfig } = useConfigStore();
  const { setVaultData } = useVaultStore();
  const navigate = useNavigate();
  useEffect(() => {
    window.events.autoOpenVault(async (config: Config) => {
      if (config.activeVault != null) {
        const resposne = await window.api.readVault(config.activeVault);
        setConfig(config);
        setVaultData(resposne);
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    });
  }, [setConfig, setVaultData, navigate]);

  return <AppContext.Provider value={null}>{children}</AppContext.Provider>;
};

export default AppProvider;
