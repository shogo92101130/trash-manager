'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // ignore parse errors
    } finally {
      setHydrated(true);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue(prev => {
          const next = typeof value === 'function' ? (value as (val: T) => T)(prev) : value;
          window.localStorage.setItem(key, JSON.stringify(next));
          return next;
        });
      } catch {
        // ignore storage errors
      }
    },
    [key]
  );

  return { value: storedValue, setValue, hydrated };
}
