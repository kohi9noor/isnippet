import fs from "fs";
import nodePath from "path";
import {
  VaultIndex,
  VaultSettings,
  VaultWorkspace,
  VaultData,
} from "@shared/types/vault";

export const readJsonFile = <T>(filePath: string): T => {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

export function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeJsonFile(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export const getIsnippetData = (vaultPath: string): VaultData => {
  const indexPath = nodePath.join(vaultPath, ".isnippet", "index.json");
  const settingsPath = nodePath.join(vaultPath, ".isnippet", "settings.json");
  const workspacePath = nodePath.join(vaultPath, ".isnippet", "workspace.json");

  const indexData = readJsonFile<VaultIndex>(indexPath);
  const settingsData = readJsonFile<VaultSettings>(settingsPath);
  const workspaceData = readJsonFile<VaultWorkspace>(workspacePath);

  return {
    index: indexData,
    settings: settingsData,
    workspace: workspaceData,
  };
};
