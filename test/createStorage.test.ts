import { makeCounter } from "./utils";

describe("createStorage", () => {
  it("has a key", () => {
    const counter = makeCounter();
    expect(counter.key).toEqual("counter");
  });

  it("has a defaultValue", () => {
    const counter = makeCounter();
    expect(counter.defaultValue).toEqual(0);
  });

  it("set the value", async () => {
    const counter = makeCounter();
    expect(await counter.set(1)).toBeUndefined();
  });

  it("retrieves the value", async () => {
    const counter = makeCounter();
    expect(await counter.get()).toEqual(0);
    await counter.set(1);
    expect(await counter.get()).toEqual(1);
  });

  it("removes the value", async () => {
    const counter = makeCounter();
    await counter.set(1);
    expect(await counter.get()).toEqual(1);
    expect(await counter.remove()).toBeUndefined();
    expect(await counter.get()).toEqual(0);
  });

  it("subscribes to changes", async () => {
    const counter = makeCounter();
    const listener = jest.fn();
    const remove = counter.onChange(listener);

    await counter.set(5);
    await counter.remove();
    remove();
    await counter.set(6);

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith(5);
    expect(listener).toHaveBeenCalledWith(0);
  });
});
