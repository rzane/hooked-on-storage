import { Config, Storage, Listener } from "./types";

export function createStorage<T>({
  adapter,
  key,
  defaultValue,
  parse = JSON.parse,
  stringify = JSON.stringify,
}: Config<T>): Storage<T> {
  const listeners: Array<Listener<T>> = [];

  const change = (value: T) => {
    listeners.forEach((listener) => listener(value));
  };

  const onChange = (listener: Listener<T>) => {
    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  };

  const get = async () => {
    const value = await adapter.getItem(key);
    return value === null ? defaultValue : parse(value);
  };

  const set = async (value: T) => {
    await adapter.setItem(key, stringify(value));
    change(value);
  };

  const remove = async () => {
    await adapter.removeItem(key);
    change(defaultValue);
  };

  return {
    key,
    defaultValue,
    get,
    set,
    remove,
    onChange,
  };
}
