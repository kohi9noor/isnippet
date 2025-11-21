import { useCallback, useEffect, useState } from "react";
import Button from "../ui/button";
import Input from "../ui/input";
import { useVaultStore } from "@/store/vault.store";

const CreateNewVault = () => {
  const [step, setStep] = useState<"choose" | "create">("choose");

  const [vaultName, setVaultName] = useState("");

  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const [error, setError] = useState<
    null | { type: "name" } | { type: "path"; message?: string }
  >(null);

  const { initializeVault, importVault, vaultData } = useVaultStore();

  const clearError = useCallback(() => {
    error && setError(null);
  }, [error]);

  const selectPath = async () => {
    const folder = await window.api.selectPath();
    if (folder) {
      setSelectedPath(folder);
      clearError();
    }
  };

  useEffect(() => {
    if (vaultData.status === "idle" || vaultData.status === "loading") return;
    if (vaultData.data?.success) {
      setVaultName("");
      setSelectedPath(null);
      clearError();
    }
  }, [clearError, vaultData]);

  const handleCreateVault = async () => {
    if (!vaultName) return setError({ type: "name" });
    if (!selectedPath) return setError({ type: "path" });
    await initializeVault({ basePath: selectedPath, vaultName });
  };

  const handleImportVault = async () => {
    const result = await importVault();
    if (!result.success) {
      console.log("Import vault error:", result.error);
      setError({ message: result.error, type: "path" });
    }
  };

  const handleBackclick = () => {
    setStep("choose");
    clearError();
    setSelectedPath(null);
    setVaultName("");
  };

  return step === "choose" ? (
    <div className="flex flex-col space-y-2">
      <Button onClick={handleImportVault}>Import vault</Button>
      <Button onClick={() => setStep("create")}>Create a vault</Button>
      <div className=" text-center text-red-400">
        <p className="text-sm ">{error?.type === "path" && error.message}</p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col space-y-2">
      <Input
        value={vaultName}
        error={error?.type === "name"}
        onChange={(e) => {
          setVaultName(e.target.value);
          clearError();
        }}
        placeholder="Vault name"
      />

      <div
        onClick={selectPath}
        className={`text-sm cursor-pointer w-full px-4 py-3 border rounded-md truncate ${
          error?.type === "path" ? "border-red-500" : "border-muted/20"
        }`}
      >
        {selectedPath || <span>Select vault location</span>}
      </div>

      <Button onClick={handleCreateVault} className="hover:bg-muted/60">
        Create Vault
      </Button>

      <Button
        className="bg-transparent border-none"
        onClick={() => handleBackclick()}
      >
        ← back
      </Button>
    </div>
  );
};

export default CreateNewVault;
