import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Storage, StorageProvider, Hydrated } from "../src";
import { makeCounter } from "./utils";

const mount = (storage: Storage<number>) => {
  return render(
    <StorageProvider hydrate={[storage]}>
      <Hydrated fallback={<p>Loading...</p>}>
        <p>Loaded</p>
      </Hydrated>
    </StorageProvider>
  );
};

describe("<Hydrated />", () => {
  it("shows a loading message until hydration is complete", async () => {
    const counter = makeCounter();
    const { container } = mount(counter);
    expect(container.textContent).toEqual("Loading...");

    await waitFor(() => {
      expect(container.textContent).toEqual("Loaded");
    });
  });
});
