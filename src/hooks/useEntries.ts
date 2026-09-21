import { useCallback, useEffect, useState } from 'react';
import { seedEntries, CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/entries';
import type { Entry } from '../data/types';

const STORAGE_KEY = 'qma:submitted-entries';

function loadSubmitted(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

function saveSubmitted(entries: Entry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage unavailable (private mode, quota) — submission still
    // renders for this session, it just won't persist across reloads.
  }
}

export function useEntries() {
  const [submitted, setSubmitted] = useState<Entry[]>(() => loadSubmitted());

  useEffect(() => {
    saveSubmitted(submitted);
  }, [submitted]);

  const addEntry = useCallback((entry: Omit<Entry, 'id' | 'x' | 'y'>) => {
    const newEntry: Entry = {
      ...entry,
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      x: Math.round(140 + Math.random() * (CANVAS_WIDTH - 400)),
      y: Math.round(120 + Math.random() * (CANVAS_HEIGHT - 300)),
    };
    setSubmitted((prev) => [...prev, newEntry]);
    return newEntry;
  }, []);

  const entries = [...seedEntries, ...submitted];

  return { entries, addEntry };
}
