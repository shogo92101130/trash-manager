export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DAY_LABELS: Record<DayOfWeek, string> = {
  0: '日',
  1: '月',
  2: '火',
  3: '水',
  4: '木',
  5: '金',
  6: '土',
};

export const PRESET_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#64748b',
  '#78716c',
];

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface TrashItem {
  id: string;
  name: string;
  dayOfWeek: DayOfWeek;
  memo: string;
  notificationEnabled: boolean;
  tagIds: string[];
  color: string;
}

export interface NotificationConfig {
  enabled: boolean;
  reminderType: 'previous-night' | 'morning';
  time: string;
}

export interface AppData {
  trashItems: TrashItem[];
  tags: Tag[];
  notificationConfig: NotificationConfig;
}
