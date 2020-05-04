import { Adapter, createStorage } from "../src";

const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0));

const createMemoryAdapter = (): Adapter => {
  const stored: Record<string, any> = {};

  return {
    async getItem(key) {
      await nextTick();
      return key in stored ? stored[key] : null;
    },
    async setItem(key, value) {
      stored[key] = value;
    },
    async removeItem(key) {
      delete stored[key];
    },
  };
};

export const makeCounter = () => {
  return createStorage<number>({
    key: "counter",
    defaultValue: 0,
    adapter: createMemoryAdapter(),
  });
};
