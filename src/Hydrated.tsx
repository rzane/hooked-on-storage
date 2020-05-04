import React from "react";
import { HydratedProps } from "./types";
import { useContext } from "./Provider";

/**
 * Used to display a loading screen until the specified storage
 * properties are loaded.
 */
export const Hydrated: React.FC<HydratedProps> = ({
  storages,
  fallback,
  children,
}) => {
  const context = useContext();

  const hydrated = React.useMemo(() => {
    return storages.every((storage) => {
      if (storage.key in context.hydrated) {
        return context.hydrated[storage.key];
      }

      throw new Error(
        `Storage for key '${storage.key}' was not passed to the <Provider />.`
      );
    });
  }, [storages, context.hydrated]);

  return <React.Fragment>{hydrated ? children : fallback}</React.Fragment>;
};
