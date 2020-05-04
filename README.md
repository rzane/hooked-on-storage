# hooked-on-storage

A React hook to store properties in storage. It is compatible with the following storage adapters:

- `localStorage`
- `sessionStorage`
- `@react-native-community/AsyncStorage`

## Usage

## Step 1: Define your stored property

```typescript
import { createStorage } from "hooked-on-storage";

const counter = createStorage<number>({
  key: "count",
  adapter: localStorage,
  defaultValue: 0,
});
```

The `counter` provides some conveniences over using `localStorage` directly.

If you directly modify a value in `localStorage` or your components won't rerender. So, always mutate `localStorage` using the value returned from `createStorage`.

#### Set the value

The value will automatically be serialized using `JSON.stringify` before being inserted into storage. You can customize this behavior by specifing the `parse` option.

```typescript
await counter.set(1);
```

#### Get the current value

The value will automatically be deserialized using `JSON.parse`. You can customize this behavior by specifing the `parse` option.

If the value does not exist in storage, the `defaultValue` will be returned.

```typescript
await counter.get();
```

#### Remove the value

```typescript
await counter.remove();
```

#### Subscribe to changes

```typescript
counter.onChange((value) => {
  console.log("changed:", value);
});
```

## Step 2: Setup the provider

At the top of your component tree, you'll need to define a provider for your storage.

```jsx
import { StorageProvider, Hydrated } from "hooked-on-storage";

ReactDOM.render(
  <StorageProvider hydrate={[counter]}>
    <h1>Counter</h1>

    <Hydrated fallback={<p>Hydrating...</p>}>
      <Counter />
    </Hydrated>
  </StorageProvider>
);
```

Using the `<Hydrated />` component is entirely optional. It allows us to render
a loading screen while we load the values from storage.

## Step 3: Read a value from storage

```jsx
import { useStorage } from "hooked-on-storage";

const Counter = () => {
  const [count, setCount, hydrated] = useStorage(counter);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);

  // Because we used `<Hydrated />` above, this should never be true.
  if (!hydrated) {
    return <p>Hydrating...</p>;
  }

  return (
    <div>
      <h4>{count}</h4>
      <button onClick={increment}>-</button>
      <button onClick={decrement}>+</button>
    </div>
  );
};
```