export const createIpcHandler = <T, R>(
  handler: (args: T) => Promise<R>
): ((_, args: T) => Promise<R>) => {
  return async (_, args) => handler(args);
};
