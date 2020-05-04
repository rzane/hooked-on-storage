/**
 * Any storage implementation (ex. `localStorage`, `sessionStorage`, or `AsyncStorage`)
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
 * This function receives an updated value.
 */
export type Listener<T> = (value: T) => void;

/**
 * This function can be called to unsubscribe from events.
 */
export type RemoveListener = () => void;

/**
 * Represents a property in storage.
 */
export interface Storage<T> {
  key: string;
  defaultValue: T;
  get(): Promise<T>;
  set(value: T): Promise<void>;
  remove(): Promise<void>;
  onChange(listener: Listener<T>): RemoveListener;
}

/**
 * The props that should be passed to `<Provider />`.
 */
export interface ProviderProps {
  storages: Array<Storage<any>>;
  children: React.ReactNode;
}

/**
 * The props that should be passed to `<Hydrated />`.
 */
export interface HydratedProps {
  storages: Array<Storage<any>>;
  fallback: React.ReactNode;
  children: React.ReactNode;
}
