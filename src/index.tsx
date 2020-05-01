import React from "react";
import {
  Config,
  ProviderProps,
  Storage,
  StorageContext,
  UseStorage,
} from "./types";

export function createStorage<Value>({
  adapter,
  key,
  parse = JSON.parse,
  stringify = JSON.stringify,
}: Config<Value>): Storage<Value> {
  const get = async () => {
    const value = await adapter.getItem(key);

    if (value === null) {
      return undefined;
    }

    return parse(value);
  };

  const set = async (value: Value) => {
    await adapter.setItem(key, stringify(value));
  };

  const remove = async () => {
    await adapter.removeItem(key);
  };

  const Context = React.createContext<StorageContext<Value> | undefined>(
    undefined
  );

  const Provider: React.FC<ProviderProps> = ({ children }) => {
    const [value, setValue] = React.useState<Value>();
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
      get()
        .then(setValue)
        .finally(() => setLoading(false));
    }, [setValue]);

    React.useEffect(() => {
      if (typeof value === "undefined") {
        remove();
      } else {
        set(value);
      }
    }, [value]);

    return (
      <Context.Provider value={{ loading, value, setValue }}>
        {children}
      </Context.Provider>
    );
  };

  const useStorage = (): UseStorage<Value> => {
    const storage = React.useContext(Context);

    if (!storage) {
      throw new Error("Your component needs to be wrapped in a <Provider />");
    }

    return [storage.value, storage.setValue];
  };

  return { get, set, remove, Provider, useStorage };
}
