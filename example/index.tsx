import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStorage, Adapter } from "use-hydrated-storage";

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
  adapter: slowLocalStorage,
  defaultValue: 0,
});

const Counter = () => {
  const [count, setCount] = Count.useStorage();

  return (
    <div>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(count + 1)}>+</button>
      <h1>{count}</h1>
    </div>
  );
};

ReactDOM.render(
  <Count.Provider>
    <Count.Hydrated fallback={<p>Rehydrating...</p>}>
      <Counter />
    </Count.Hydrated>
  </Count.Provider>,
  document.getElementById("root")
);
