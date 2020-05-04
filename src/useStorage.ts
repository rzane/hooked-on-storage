import { useStorageContext } from "./StorageProvider";
import { Storage } from "./types";

/**
 * Read stored properties.
 */
export const useStorage = <T>(
  storage: Storage<T>
): [T, (value: T) => Promise<void>, boolean] => {
  const context = useStorageContext();
  const value = context.values[storage.key];
  const hydrated = context.hydrated[storage.key];

  if (typeof hydrated === "undefined") {
    throw new Error(
      `Storage for key '${storage.key}' was not passed to the <Provider />.`
    );
  }

  return [value, storage.set, hydrated];
};
