import React from "react";
import { HydratedProps } from "./types";
import { useStorageContext } from "./StorageProvider";

/**
 * Display a loading screen until storage is hydrated.
 */
export const Hydrated: React.FC<HydratedProps> = (props) => {
  const context = useStorageContext();

  const hydrated = React.useMemo(
    () => Object.values(context.hydrated).every(Boolean),
    [context.hydrated]
  );

  return (
    <React.Fragment>
      {hydrated ? props.children : props.fallback}
    </React.Fragment>
  );
};
