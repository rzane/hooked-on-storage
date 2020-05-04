import React, { createContext } from "react";
import { ProviderProps } from "./types";

export interface Values {
  [key: string]: any;
}

export interface Hydrated {
  [key: string]: boolean;
}

export interface StorageContext {
  values: Values;
  hydrated: Hydrated;
}

const Context = createContext<StorageContext>({
  values: {},
  hydrated: {},
});

export const useContext = (): StorageContext => {
  return React.useContext(Context);
};

/**
 * Stores information about stored properties and provides them to children.
 */
export const Provider: React.FC<ProviderProps> = ({ storages, children }) => {
  const [values, setValues] = React.useState<Values>(() => {
    const initialState: Values = {};

    for (const storage of storages) {
      initialState[storage.key] = storage.defaultValue;
    }

    return initialState;
  });

  const [hydrated, setHydrated] = React.useState<Values>(() => {
    const initialState: Values = {};

    for (const storage of storages) {
      initialState[storage.key] = false;
    }

    return initialState;
  });

  React.useEffect(() => {
    let mounted = true;

    const setValue = (key: string, value: any) => {
      if (mounted) {
        setValues((state) => ({ ...state, [key]: value }));
        setHydrated((hydrated) => ({ ...hydrated, [key]: true }));
      }
    };

    // Load initial values
    for (const storage of storages) {
      storage.get().then((value) => setValue(storage.key, value));
    }

    // Subscribe to changes
    const unsubscribe = storages.map((storage) => {
      return storage.onChange((value) => setValue(storage.key, value));
    });

    return () => {
      mounted = false;
      unsubscribe.forEach((fn) => fn());
    };
  }, [storages, setValues, setHydrated]);

  return (
    <Context.Provider value={{ values, hydrated }}>{children}</Context.Provider>
  );
};
