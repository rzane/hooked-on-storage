import React from "react";
import { createStorage, Storage, Adapter } from "../src";
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

export const createMemoryAdapter = (): Adapter => {
  const stored: Record<string, any> = {};

  return {
    async getItem(key) {
      await new Promise((resolve) => setTimeout(resolve, 0));
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

  describe("<Hydrated />", () => {
    it("does not render children until hydration has completed", async () => {
      const storage = makeStorage();
      await storage.set("Loaded");

      const Display = () => {
        const [value] = storage.useStorage();
        return <p>{value}</p>;
      };

      const { findByText } = render(
        <storage.Provider>
          <storage.Hydrated fallback={<p>Loading...</p>}>
            <Display />
          </storage.Hydrated>
        </storage.Provider>
      );

      await expect(findByText("Loading...")).resolves.toBeDefined();
      await expect(findByText("Loaded")).resolves.toBeDefined();
    });
  });
});
