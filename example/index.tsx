import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  createStorage,
  Adapter,
  StorageProvider,
  Hydrated,
  useStorage,
} from "hooked-on-storage";

/**
 * Create a custom storage implementation that takes a long time
 * to read values. This allows us to see the hydration fallback.
 */
const slowLocalStorage: Adapter = {
  async getItem(key) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return localStorage.getItem(key);
  },
  setItem(key, value) {
    return localStorage.setItem(key, value);
  },
  removeItem(key) {
    return localStorage.removeItem(key);
  },
};

/**
 * Create our stored property.
 */
const counter = createStorage<number>({
  key: "count",
  defaultValue: 0,
  adapter: slowLocalStorage,
});

/**
 * Create a component to inteact with storage.
 */
const Counter = () => {
  const [count, setCount] = useStorage(counter);

  return (
    <div>
      <h2>{count}</h2>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};

/**
 * Render our component, but before we do, make sure it's hydrated.
 */
ReactDOM.render(
  <StorageProvider hydrate={[counter]}>
    <h1>Counter</h1>

    <Hydrated fallback={<p>Hydrating...</p>}>
      <Counter />
    </Hydrated>
  </StorageProvider>,
  document.getElementById("root")
);
