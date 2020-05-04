import React, { createContext } from "react";
import { StorageProviderProps } from "./types";

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

/**
 * Access the context from the `<StorageProvider />`.
 */
export const useStorageContext = (): StorageContext => {
  return React.useContext(Context);
};

/**
 * Stores information about stored properties and provides them to children.
 */
export const StorageProvider: React.FC<StorageProviderProps> = (props) => {
  /**
   * Keep track of the value of each stored property.
   */
  const [values, setValues] = React.useState<Values>(() => {
    const initialState: Values = {};

    for (const storage of props.hydrate) {
      initialState[storage.key] = storage.defaultValue;
    }

    return initialState;
  });

  /**
   * Keep track of which properties have been loaded from storage.
   */
  const [hydrated, setHydrated] = React.useState<Values>(() => {
    const initialState: Values = {};

    for (const storage of props.hydrate) {
      initialState[storage.key] = false;
    }

    return initialState;
  });

  /**
   * On the initial mount, we'll setup each property.
   */
  React.useEffect(() => {
    let mounted = true;

    const setValue = (key: string, value: any) => {
      if (mounted) {
        setValues((state) => ({ ...state, [key]: value }));
        setHydrated((hydrated) => ({ ...hydrated, [key]: true }));
      }
    };

    /**
     * Load the stored property from storage.
     */
    for (const storage of props.hydrate) {
      storage.get().then((value) => setValue(storage.key, value));
    }

    /**
     * Subscribe to each property and update state when it changes.
     */
    const unsubscribe = props.hydrate.map((storage) => {
      return storage.onChange((value) => setValue(storage.key, value));
    });

    /**
     * When the component unmounts, unsubscribe and avoid updating state.
     */
    return () => {
      mounted = false;
      unsubscribe.forEach((fn) => fn());
    };
  }, [props.hydrate, setValues, setHydrated]);

  return (
    <Context.Provider value={{ values, hydrated }}>
      {props.children}
    </Context.Provider>
  );
};
