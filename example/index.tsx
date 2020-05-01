import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStorage } from "use-hydrated-storage";

const Count = createStorage<number>({
  key: "count",
  adapter: localStorage,
  defaultValue: 0,
});

const Counter = () => {
  const [count, setCount, hydrated] = Count.useStorage();

  if (!hydrated) {
    return <p>Loading...</p>;
  }

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
    <Counter />
  </Count.Provider>,
  document.getElementById("root")
);
