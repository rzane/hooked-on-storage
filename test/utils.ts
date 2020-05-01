import { Adapter } from "../src/types";

export const createMemoryAdapter = (): Adapter => {
  const stored: Record<string, any> = {};

  return {
    getItem(key) {
      return key in stored ? stored[key] : null;
    },
    setItem(key, value) {
      stored[key] = value;
    },
    removeItem(key) {
      delete stored[key];
    },
  };
};
