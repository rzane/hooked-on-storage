import React from "react";
import { createStorage, Storage } from "../src";
import { createMemoryAdapter } from "./utils";
import { renderHook } from "@testing-library/react-hooks";

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
  return renderHook(() => storage.useHydrate(), {
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

  describe("useHydrate", () => {
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
