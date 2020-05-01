/**
 * Any storage implementation, such as:
 *
 *   - `localStorage`
 *   - `sessionStorage`
 *   - `AsyncStorage`
 */
export interface Adapter {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}

/**
 * Configuration settings for stored properties.
 */
export type Config<T> = {
  key: string;
  adapter: Adapter;
  defaultValue: T;
  parse?: (value: string) => T;
  stringify?: (value: T) => string;
};

/**
 * Props for the `<Provider />` component.
 */
export interface ProviderProps {
  children: React.ReactNode;
}

/**
 * Props for the `<Hydrated />` component.
 */
export interface HydratedProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

/**
 * The context that is passed down via the provider.
 */
export interface StorageContext<T> {
  value: T;
  hydrated: boolean;
}

/**
 * The function used to change a value in state.
 */
export type SetStorage<T> = (value: T) => Promise<void>;

/**
 * The value returned from `useStorage`.
 */
export type UseStorage<T> = [T, SetStorage<T>, boolean];

/**
 * Represents a stored property
 */
export interface Storage<T> {
  get(): Promise<T>;
  set(value: T): Promise<void>;
  remove(): Promise<void>;
  useStorage(): UseStorage<T>;
  Hydrated: React.FC<HydratedProps>;
  Provider: React.FC<ProviderProps>;
}
