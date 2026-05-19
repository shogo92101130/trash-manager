'use client';

import { useState, useEffect, useCallback } from 'react';

const storageKey = 'trash-checked-v1';

type CheckedData = Record<string, string[]>; // { "2026-05-19": ["id1", "id2"] }

function todayKey() {
  return new Date().toISOString().split('T')[0];
}

export function useChecked() {
  const [checkedData, setCheckedData] = useState<CheckedData>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setCheckedData(JSON.parse(raw));
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  const save = useCallback((data: CheckedData) => {
    setCheckedData(data);
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  }, []);

  const toggleCheck = useCallback((itemId: string) => {
    const key = todayKey();
    setCheckedData(prev => {
      const current = prev[key] ?? [];
      const next = current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId];
      const updated = { ...prev, [key]: next };
      window.localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isChecked = useCallback(
    (itemId: string) => {
      return (checkedData[todayKey()] ?? []).includes(itemId);
    },
    [checkedData]
  );

  const todayCheckedCount = (checkedData[todayKey()] ?? []).length;

  return { isChecked, toggleCheck, todayCheckedCount, hydrated };
}
