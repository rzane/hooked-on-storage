import { Adapter } from "../src/types";

export const createMemoryAdapter = (): Adapter => {
  const stored: Record<string, any> = {};

  return {
    getItem(key) {
      return Promise.resolve(key in stored ? stored[key] : null);
    },
    setItem(key, value) {
      stored[key] = value;
      return Promise.resolve();
    },
    removeItem(key) {
      delete stored[key];
      return Promise.resolve();
    },
  };
};
