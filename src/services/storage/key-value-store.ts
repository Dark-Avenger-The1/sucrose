import Storage from 'expo-sqlite/kv-store';

import type { KeyValueStore } from './key-value-store.types';

/** iOS and Android: SQLite-backed key-value store that works in Expo Go. */
export function createDeviceStore(): KeyValueStore {
  return {
    getItem: (key) => Storage.getItemSync(key),
    setItem: (key, value) => Storage.setItemSync(key, value),
    removeItem: (key) => void Storage.removeItemSync(key),
  };
}
