import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'qma:favorites';

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

// Favorites are per-browser only, stored in save order so connecting lines
// can be drawn as a trail through the order things were saved.
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(loadFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // favorites just won't persist across reloads in this browser
    }
  }, [favoriteIds]);

  const isFavorited = useCallback((id: string) => favoriteIds.includes(id), [favoriteIds]);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((existing) => existing !== id) : [...current, id],
    );
  }, []);

  return { favoriteIds, isFavorited, toggleFavorite };
}
