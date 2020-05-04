import * as out from "../src";

it("exports", () => {
  expect(Object.keys(out).sort()).toEqual([
    "Hydrated",
    "StorageProvider",
    "createStorage",
    "useStorage",
  ]);
});
