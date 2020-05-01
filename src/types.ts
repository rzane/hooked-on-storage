export interface Adapter {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}

export interface ProviderProps {
  children: React.ReactNode;
}

export type Config<Value> = {
  key: string;
  adapter: Adapter;
  defaultValue: Value;
  parse?: (value: string) => Value;
  stringify?: (value: Value) => string;
};

export type SetValue<T> = (value: T) => Promise<void>;
export type UseStorage<T> = [T, SetValue<T>, boolean];

export interface StorageContext<Value> {
  hydrated: boolean;
  value: Value;
  setValue: SetValue<Value>;
}

export interface Storage<Value> {
  get(): Promise<Value>;
  set(value: Value): Promise<void>;
  remove(): Promise<void>;
  useHydrate(): boolean;
  useStorage(): UseStorage<Value>;
  Provider: React.FC<ProviderProps>;
}
