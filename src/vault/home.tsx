import CreateNewVault from "../components/main/create-new-vault";
import { useEffect } from "react";
import { Config } from "@shared/types/vault";
import { useVaultStore } from "@/store/vault.store";
import { useConfigStore } from "@/store/config.store";

const Home = () => {
  const { setConfig } = useConfigStore();
  const { setVaultData } = useVaultStore();
  useEffect(() => {
    window.events.autoOpenVault(async (config: Config) => {
      if (config.activeVault != null) {
        const resposne = await window.api.readVault(config.activeVault);
        setConfig(config);
        setVaultData(resposne);
      }
    });
  }, [setConfig, setVaultData]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <div className="flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-light tracking-wide">isnippet</h1>
          <p className="text-xs text-muted font-light tracking-widest uppercase">
            Where Your snippets make sense
          </p>
        </div>

        <div className="w-72">
          <CreateNewVault />
        </div>
      </div>
    </div>
  );
};

export default Home;
