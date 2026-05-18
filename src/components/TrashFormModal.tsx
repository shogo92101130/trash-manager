'use client';

import { useState, useEffect } from 'react';
import { X, Bell, BellOff } from 'lucide-react';
import { TrashItem, Tag, DayOfWeek, DAY_LABELS, PRESET_COLORS } from '@/types/trash';

const ALL_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];

interface TrashFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<TrashItem, 'id'>) => void;
  editItem?: TrashItem;
  tags: Tag[];
}

export function TrashFormModal({ isOpen, onClose, onSave, editItem, tags }: TrashFormModalProps) {
  const [name, setName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(1);
  const [memo, setMemo] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [color, setColor] = useState(PRESET_COLORS[4]);

  useEffect(() => {
    if (!isOpen) return;
    if (editItem) {
      setName(editItem.name);
      setDayOfWeek(editItem.dayOfWeek);
      setMemo(editItem.memo);
      setNotificationEnabled(editItem.notificationEnabled);
      setSelectedTagIds(editItem.tagIds);
      setColor(editItem.color);
    } else {
      setName('');
      setDayOfWeek(1);
      setMemo('');
      setNotificationEnabled(true);
      setSelectedTagIds([]);
      setColor(PRESET_COLORS[4]);
    }
  }, [isOpen, editItem]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), dayOfWeek, memo: memo.trim(), notificationEnabled, tagIds: selectedTagIds, color });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ backgroundColor: color + '18' }}
        >
          <h2 className="font-bold text-gray-900 text-base">
            {editItem ? 'ゴミを編集' : 'ゴミを追加'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/10 transition-colors">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              名前 *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例: 燃えるゴミ"
              required
              autoFocus
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              カラー
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full transition-transform"
                  style={{
                    backgroundColor: c,
                    outline: color === c ? `3px solid ${c}` : 'none',
                    outlineOffset: '2px',
                    transform: color === c ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Day of week */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              曜日 *
            </label>
            <div className="grid grid-cols-7 gap-1">
              {ALL_DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setDayOfWeek(day)}
                  className="py-2 rounded-lg text-sm font-bold transition-all"
                  style={
                    dayOfWeek === day
                      ? { backgroundColor: color, color: '#fff' }
                      : { backgroundColor: '#f3f4f6', color: '#6b7280' }
                  }
                >
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                タグ
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => {
                  const active = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                      style={
                        active
                          ? { backgroundColor: tag.color, color: '#fff' }
                          : { backgroundColor: '#f3f4f6', color: '#4b5563' }
                      }
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Memo */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              メモ
            </label>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="補足情報を入力..."
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            />
          </div>

          {/* Notification toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              {notificationEnabled ? (
                <Bell className="h-4 w-4 text-blue-500" />
              ) : (
                <BellOff className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-700">通知</span>
            </div>
            <button
              type="button"
              onClick={() => setNotificationEnabled(v => !v)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{ backgroundColor: notificationEnabled ? '#3b82f6' : '#d1d5db' }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                style={{ transform: notificationEnabled ? 'translateX(22px)' : 'translateX(4px)' }}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-40"
              style={{ backgroundColor: color }}
            >
              {editItem ? '保存する' : '追加する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
