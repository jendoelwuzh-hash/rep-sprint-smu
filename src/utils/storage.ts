import { STORAGE_KEY } from '../data/constants';
import type { StoredState } from '../types';

const DEFAULT_STATE: StoredState = {
  progress: {},
  xpTotal: 0,
  streak: 0,
  lastActive: null,
  chats: {},
  parentPhone: '',
  session: { start: null, topics: [], agents: [], msgCount: 0, xpStart: 0 },
};

export function loadStored(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load stored state:', e);
  }
  return DEFAULT_STATE;
}

export function saveStored(state: StoredState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}