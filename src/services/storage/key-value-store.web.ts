import { createMemoryStore, type KeyValueStore } from './key-value-store.types';

/**
 * Web: `localStorage`, so the web build needs no SQLite wasm or COOP/COEP headers.
 * Falls back to memory during static rendering and in browsers that block storage.
 */
export function createDeviceStore(): KeyValueStore {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return createMemoryStore();
    return {
      getItem: (key) => storage.getItem(key),
      setItem: (key, value) => storage.setItem(key, value),
      removeItem: (key) => storage.removeItem(key),
    };
  } catch {
    return createMemoryStore();
  }
}
