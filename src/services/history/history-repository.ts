import type { CheckInput } from '@/types/check.types';
import { STORAGE_KEYS } from '@/constant/storage';
import type { KeyValueStore } from '@/services/storage/key-value-store.types';

export interface HistoryEntry {
  id: string;
  /** ISO 8601 timestamp of when the check was made. */
  createdAt: string;
  input: CheckInput;
}

/** Observable list of past checks, newest first. Matches `useSyncExternalStore`'s contract. */
export interface HistoryRepository {
  getSnapshot(): readonly HistoryEntry[];
  subscribe(listener: () => void): () => void;
  add(input: CheckInput): HistoryEntry;
  remove(id: string): void;
  clear(): void;
}

const MAX_ENTRIES = 50;

function isEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Partial<HistoryEntry>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.createdAt === 'string' &&
    typeof entry.input?.glucoseMgDl === 'number' &&
    typeof entry.input.age === 'number' &&
    (entry.input.gender === 'female' || entry.input.gender === 'male')
  );
}

function read(store: KeyValueStore): HistoryEntry[] {
  try {
    const parsed: unknown = JSON.parse(store.getItem(STORAGE_KEYS.history) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch {
    return [];
  }
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createHistoryRepository(store: KeyValueStore): HistoryRepository {
  let entries: readonly HistoryEntry[] = read(store);
  const listeners = new Set<() => void>();

  function commit(next: readonly HistoryEntry[]) {
    entries = next;
    store.setItem(STORAGE_KEYS.history, JSON.stringify(next));
    listeners.forEach((listener) => listener());
  }

  return {
    getSnapshot: () => entries,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    add(input) {
      const entry: HistoryEntry = { id: makeId(), createdAt: new Date().toISOString(), input };
      commit([entry, ...entries].slice(0, MAX_ENTRIES));
      return entry;
    },
    remove(id) {
      commit(entries.filter((entry) => entry.id !== id));
    },
    clear() {
      commit([]);
    },
  };
}
