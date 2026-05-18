'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { AppData, TrashItem, Tag, NotificationConfig } from '@/types/trash';

const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  enabled: false,
  reminderType: 'morning',
  time: '07:00',
};

const DEFAULT_DATA: AppData = {
  trashItems: [],
  tags: [],
  notificationConfig: DEFAULT_NOTIFICATION_CONFIG,
};

export function useTrash() {
  const { value: data, setValue: setData, hydrated } = useLocalStorage<AppData>(
    'trash-manager-v1',
    DEFAULT_DATA
  );

  const trashItems = data.trashItems ?? [];
  const tags = data.tags ?? [];
  const notificationConfig = data.notificationConfig ?? DEFAULT_NOTIFICATION_CONFIG;

  const addTrashItem = useCallback(
    (item: Omit<TrashItem, 'id'>) => {
      const newItem: TrashItem = { ...item, id: crypto.randomUUID() };
      setData(prev => ({ ...prev, trashItems: [...(prev.trashItems ?? []), newItem] }));
    },
    [setData]
  );

  const updateTrashItem = useCallback(
    (id: string, updates: Partial<Omit<TrashItem, 'id'>>) => {
      setData(prev => ({
        ...prev,
        trashItems: (prev.trashItems ?? []).map(item =>
          item.id === id ? { ...item, ...updates } : item
        ),
      }));
    },
    [setData]
  );

  const deleteTrashItem = useCallback(
    (id: string) => {
      setData(prev => ({
        ...prev,
        trashItems: (prev.trashItems ?? []).filter(item => item.id !== id),
      }));
    },
    [setData]
  );

  const addTag = useCallback(
    (tag: Omit<Tag, 'id'>) => {
      const newTag: Tag = { ...tag, id: crypto.randomUUID() };
      setData(prev => ({ ...prev, tags: [...(prev.tags ?? []), newTag] }));
    },
    [setData]
  );

  const updateTag = useCallback(
    (id: string, updates: Partial<Omit<Tag, 'id'>>) => {
      setData(prev => ({
        ...prev,
        tags: (prev.tags ?? []).map(tag => (tag.id === id ? { ...tag, ...updates } : tag)),
      }));
    },
    [setData]
  );

  const deleteTag = useCallback(
    (id: string) => {
      setData(prev => ({
        ...prev,
        tags: (prev.tags ?? []).filter(tag => tag.id !== id),
        trashItems: (prev.trashItems ?? []).map(item => ({
          ...item,
          tagIds: item.tagIds.filter(tagId => tagId !== id),
        })),
      }));
    },
    [setData]
  );

  const updateNotificationConfig = useCallback(
    (config: Partial<NotificationConfig>) => {
      setData(prev => ({
        ...prev,
        notificationConfig: {
          ...(prev.notificationConfig ?? DEFAULT_NOTIFICATION_CONFIG),
          ...config,
        },
      }));
    },
    [setData]
  );

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trash-manager-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback(
    (jsonString: string): boolean => {
      try {
        const parsed = JSON.parse(jsonString) as Partial<AppData>;
        if (!Array.isArray(parsed.trashItems) || !Array.isArray(parsed.tags)) return false;
        setData({
          trashItems: parsed.trashItems,
          tags: parsed.tags,
          notificationConfig: parsed.notificationConfig ?? DEFAULT_NOTIFICATION_CONFIG,
        });
        return true;
      } catch {
        return false;
      }
    },
    [setData]
  );

  return {
    trashItems,
    tags,
    notificationConfig,
    hydrated,
    addTrashItem,
    updateTrashItem,
    deleteTrashItem,
    addTag,
    updateTag,
    deleteTag,
    updateNotificationConfig,
    exportData,
    importData,
  };
}
