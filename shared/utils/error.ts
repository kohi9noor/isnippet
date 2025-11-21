import { ERROR_MESSAGES, ErrorCode, ErrorRespones } from "../types/error";

export function AppError(code: ErrorCode): ErrorRespones {
  return {
    success: false,
    code,
    error: ERROR_MESSAGES[code],
  };
}
