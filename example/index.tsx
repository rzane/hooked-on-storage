import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  createStorage,
  Adapter,
  Provider,
  Hydrated,
  useStorage,
} from "use-hydrated-storage";

// Slow down local storage so we see the hydration
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

const Count = createStorage<number>({
  key: "count",
  defaultValue: 0,
  adapter: slowLocalStorage,
});

const Counter = () => {
  const [count, setCount] = useStorage(Count);

  return (
    <div>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(count + 1)}>+</button>
      <h1>{count}</h1>
    </div>
  );
};

ReactDOM.render(
  <Provider storages={[Count]}>
    <Hydrated storages={[Count]} fallback={<p>Rehydrating...</p>}>
      <Counter />
    </Hydrated>
  </Provider>,
  document.getElementById("root")
);
