import React from "react";
import { createStorage, Storage, Adapter } from "../src";
import { renderHook } from "@testing-library/react-hooks";

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

const makeStorage = () => {
  const adapter = createMemoryAdapter();
  const storage = createStorage<string | undefined>({
    adapter,
    key: "@Storage",
    defaultValue: undefined,
  });

  return storage;
};

const renderStorage = (storage: Storage<string | undefined>) => {
  return renderHook(() => storage.useStorage(), {
    wrapper: ({ children }) => <storage.Provider>{children}</storage.Provider>,
  });
};

const renderHydrate = (storage: Storage<string | undefined>) => {
  return renderHook(() => storage.useHydrated(), {
    wrapper: ({ children }) => <storage.Provider>{children}</storage.Provider>,
  });
};

describe("createStorage", () => {
  describe("set", () => {
    it("set the value", async () => {
      const storage = makeStorage();
      expect(await storage.set("foo")).toBeUndefined();
    });
  });

  describe("get", () => {
    it("retrieves the value", async () => {
      const storage = makeStorage();
      expect(await storage.get()).toBeUndefined();
      await storage.set("foo");
      expect(await storage.get()).toEqual("foo");
    });
  });

  describe("remove", () => {
    it("removes the value", async () => {
      const storage = makeStorage();
      await storage.set("foo");
      expect(await storage.remove()).toBeUndefined();
      expect(await storage.get()).toBeUndefined();
    });
  });

  describe("useStorage", () => {
    it("errors without provider", () => {
      const storage = makeStorage();
      const hook = renderHook(() => storage.useStorage());
      expect(hook.result.error.message).toMatch(/wrap this component/);
    });

    it("automatically hydrates itself", async () => {
      const storage = makeStorage();
      await storage.set("foo");

      const hook = renderStorage(storage);
      expect(hook.result.current[0]).toBeUndefined();
      expect(hook.result.current[2]).toEqual(false);

      await hook.waitForNextUpdate();
      expect(hook.result.current[0]).toEqual("foo");
      expect(hook.result.current[2]).toEqual(true);
    });

    it("sets a value", async () => {
      const storage = makeStorage();
      const hook = renderStorage(storage);

      await hook.waitForNextUpdate();
      expect(hook.result.current[0]).toBeUndefined();
      expect(hook.result.current[2]).toEqual(true);

      hook.result.current[1]("bar");
      await hook.waitForNextUpdate();

      expect(hook.result.current[0]).toEqual("bar");
    });
  });

  describe("useHydrated", () => {
    it("errors without provider", () => {
      const storage = makeStorage();
      const hook = renderHook(() => storage.useHydrated());
      expect(hook.result.error.message).toMatch(/wrap this component/);
    });

    it("preemptively hydrates the value", async () => {
      const storage = makeStorage();
      await storage.set("foo");

      const hydrate = renderHydrate(storage);
      expect(hydrate.result.current).toEqual(false);

      await hydrate.waitForNextUpdate();
      expect(hydrate.result.current).toEqual(true);
    });
  });
});
