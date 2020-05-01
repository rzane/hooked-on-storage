import React from "react";
import {
  Config,
  HydratedProps,
  ProviderProps,
  Storage,
  StorageContext,
  UseStorage,
} from "./types";

type Listener<T> = (value: T) => void;

export function createStorage<T>({
  adapter,
  key,
  defaultValue,
  parse = JSON.parse,
  stringify = JSON.stringify,
}: Config<T>): Storage<T> {
  const listeners: Array<Listener<T>> = [];
  const Context = React.createContext<StorageContext<T> | null>(null);

  const change = (value: T) => {
    listeners.forEach((listener) => listener(value));
  };

  const onChange = (listener: Listener<T>) => {
    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  };

  const get = async () => {
    const value = await adapter.getItem(key);
    return value === null ? defaultValue : parse(value);
  };

  const set = async (value: T) => {
    await adapter.setItem(key, stringify(value));
    change(value);
  };

  const remove = async () => {
    await adapter.removeItem(key);
    change(defaultValue);
  };

  const Provider: React.FC<ProviderProps> = ({ children }) => {
    const [value, setState] = React.useState<T>(defaultValue);
    const [hydrated, setHydrated] = React.useState<boolean>(false);

    /**
     * Subscribe to changes and set the initial state on mount.
     */
    React.useEffect(() => {
      let mounted = true;

      get().then((value) => {
        if (mounted) {
          setState(value);
          setHydrated(true);
        }
      });

      const unsubscribe = onChange((value) => {
        if (mounted) {
          setState(value);
          setHydrated(true);
        }
      });

      return () => {
        mounted = false;
        unsubscribe();
      };
    }, []);

    return (
      <Context.Provider value={{ value, hydrated }}>
        {children}
      </Context.Provider>
    );
  };

  const useContext = (): StorageContext<T> => {
    const context = React.useContext(Context);
    if (!context) {
      throw new Error("You need to wrap this component in a <Provider />");
    }
    return context;
  };

  const useStorage = (): UseStorage<T> => {
    const { value, hydrated } = useContext();
    return [value, set, hydrated];
  };

  const Hydrated: React.FC<HydratedProps> = ({ fallback, children }) => {
    const { hydrated } = useContext();
    return <React.Fragment>{hydrated ? children : fallback}</React.Fragment>;
  };

  return { get, set, remove, useStorage, Hydrated, Provider };
}
