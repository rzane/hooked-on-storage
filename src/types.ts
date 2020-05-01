export interface AsyncStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export interface ProviderProps {
  children: React.ReactNode;
}

export type Config<Value> = {
  key: string;
  adapter: AsyncStorage;
  parse?: (value: string) => Value;
  stringify?: (value: Value) => string;
};

export type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;
export type UseStorage<T> = [T | undefined, SetValue<T | undefined>];

export interface StorageContext<Value> {
  loading: boolean;
  value: Value | undefined;
  setValue: SetValue<Value | undefined>;
}

export interface Storage<Value> {
  get(): Promise<Value | undefined>;
  set(value: Value): Promise<void>;
  remove(): Promise<void>;
  useStorage(): UseStorage<Value>;
  Provider: React.FC<ProviderProps>;
}
