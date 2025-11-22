import { useVaultStore } from "@/store/vault.store";
import { Loader2Icon, SearchIcon, SettingsIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { vaultData } = useVaultStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Vault Data:", vaultData);
  }, [vaultData]);

  if (vaultData.status === "error") {
    return navigate("/");
  }
  if (vaultData.status === "loading" || vaultData.status === "idle") {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <Loader2Icon className="w-6 h-6 mr-2 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex w-full h-full relative">
      <div className=" w-12 min-h-screen border-muted flex flex-col space-y-7 items-center justify-start p-4 border-r">
        <p>SF</p>

        <div className=" flex flex-col space-y-4">
          <div className=" p-2 w-8 h-8 border text-gray-400 border-muted rounded-full bg-secondary hover:scale-105 flex items-center justify-center">
            <SearchIcon className="w-5 h-5" />
          </div>

          <div className=" p-2 w-8 h-8 hover:border hover:border-muted rounded-xl hover:bg-secondary hover:scale-105 flex items-center justify-center">
            <img src="/create.svg" className="w-8 h-8" />
          </div>

          <div className=" p-2 w-8 h-8 hover:border text-gray-400 hover:border-muted rounded-xl hover:bg-secondary hover:scale-105 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className=" absolute w-full h-px bg-muted top-12"></div>
      <div className=" flex-1 "></div>
    </div>
  );
};

export default Dashboard;
