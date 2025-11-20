import { useState } from "react";
import Button from "../ui/button";
import Input from "../ui/input";

const CreateNewVault = () => {
  const [step, setStep] = useState<"choose" | "create">("choose");
  const [vaultName, setVaultName] = useState("");
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [error, setError] = useState<null | "name" | "path">(null);

  const clearError = () => error && setError(null);

  const selectPath = async () => {
    const folder = await window.api.selectPath();
    if (folder) {
      setSelectedPath(folder);
      clearError();
    }
  };

  const createVault = () => {
    if (!vaultName) return setError("name");
    if (!selectedPath) return setError("path");
    window.api.initializeVault({ basePath: selectedPath, vaultName });
  };

  const importVault = async () => {
    const result = await window.api.importVault();
    if (result.success) {
      console.log("Vault imported successfully", result);
    } else {
      console.error("Failed to import vault:", result);
    }
  };

  return step === "choose" ? (
    <div className="flex flex-col space-y-2">
      <Button onClick={importVault}>Import vault</Button>
      <Button onClick={() => setStep("create")}>Create a vault</Button>
    </div>
  ) : (
    <div className="flex flex-col space-y-2">
      <Input
        value={vaultName}
        error={error === "name"}
        onChange={(e) => {
          setVaultName(e.target.value);
          clearError();
        }}
        placeholder="Vault name"
      />

      <div
        onClick={selectPath}
        className={`text-sm cursor-pointer w-full px-4 py-3 border rounded-md truncate ${
          error === "path" ? "border-red-500" : "border-muted/20"
        }`}
      >
        {selectedPath || <span>Select vault location</span>}
      </div>

      <Button onClick={createVault} className="hover:bg-muted/60">
        Create Vault
      </Button>

      <Button
        className="bg-transparent border-none"
        onClick={() => setStep("choose")}
      >
        ← back
      </Button>
    </div>
  );
};

export default CreateNewVault;
