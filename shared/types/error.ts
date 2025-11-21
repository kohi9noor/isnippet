export const ERROR_MESSAGES = {
  INVALID_VAULT:
    "This folder is not a valid isnippet vault. Make sure it contains a .isnippet folder.",
  VAULT_PATH_NOT_EXIST:
    "The vault folder no longer exists. Try selecting it again.",
  VAULT_NAME_EMPTY: "Please enter a vault name.",
  NO_VAULT_SELECTED: "Please select a vault location.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGES;
export type ErrorValues = (typeof ERROR_MESSAGES)[ErrorCode];

export type ErrorRespones = {
  code: ErrorCode;
  error: ErrorValues;
  success: false;
};
