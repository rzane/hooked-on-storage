import React, { useEffect } from "react";
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
  defaultValue,
  parse = JSON.parse,
  stringify = JSON.stringify,
}: Config<Value>): Storage<Value> {
  const get = async () => {
    const value = await adapter.getItem(key);

    if (value === null) {
      return defaultValue;
    }

    return parse(value);
  };

  const set = async (value: Value) => {
    await adapter.setItem(key, stringify(value));
  };

  const remove = async () => {
    await adapter.removeItem(key);
  };

  const Context = React.createContext<StorageContext<Value> | null>(null);

  const Provider: React.FC<ProviderProps> = ({ children }) => {
    const [value, setState] = React.useState<Value>(defaultValue);
    const [hydrated, setHydrated] = React.useState(false);

    const setValue = React.useCallback(
      async (value: Value) => {
        if (typeof value === "undefined") {
          await remove();
        } else {
          await set(value);
        }

        setState(value);
        setHydrated(true);
      },
      [setState, setHydrated]
    );

    return (
      <Context.Provider value={{ hydrated, value, setValue }}>
        {children}
      </Context.Provider>
    );
  };

  const useContext = (): StorageContext<Value> => {
    const storage = React.useContext(Context);

    if (!storage) {
      throw new Error("You need to wrap this component in a <Provider />.");
    }

    return storage;
  };

  const useHydrate = (): boolean => {
    const { hydrated, setValue } = useContext();

    useEffect(() => {
      if (hydrated) {
        return;
      }

      let mounted = true;
      get().then((value) => {
        if (mounted) {
          setValue(value);
        }
      });

      return () => {
        mounted = false;
      };
    }, []);

    return hydrated;
  };

  const useStorage = (): UseStorage<Value> => {
    const { hydrated, value, setValue } = useContext();
    useHydrate();
    return [value, setValue, hydrated];
  };

  return { get, set, remove, Provider, useStorage, useHydrate };
}
