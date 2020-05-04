import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { Storage, StorageProvider, useStorage } from "../src";
import { makeCounter } from "./utils";

const mount = (storage: Storage<number>) => {
  return renderHook(() => useStorage(storage), {
    wrapper({ children }) {
      return <StorageProvider hydrate={[storage]}>{children}</StorageProvider>;
    },
  });
};

test("useStorage", async () => {
  const counter = makeCounter();
  await counter.set(100);

  const { result, waitForNextUpdate } = mount(counter);
  expect(result.current[0]).toEqual(0);
  expect(result.current[1]).toBeInstanceOf(Function);
  expect(result.current[2]).toEqual(false);

  await act(() => waitForNextUpdate());
  expect(result.current[0]).toEqual(100);
  expect(result.current[1]).toBeInstanceOf(Function);
  expect(result.current[2]).toEqual(true);

  await act(() => result.current[1](200));
  expect(result.current[0]).toEqual(200);
  expect(result.current[1]).toBeInstanceOf(Function);
  expect(result.current[2]).toEqual(true);
});
