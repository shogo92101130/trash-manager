'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Tag, PRESET_COLORS } from '@/types/trash';

interface TagFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tag: Omit<Tag, 'id'>) => void;
  editTag?: Tag;
}

export function TagFormModal({ isOpen, onClose, onSave, editTag }: TagFormModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    if (!isOpen) return;
    if (editTag) {
      setName(editTag.name);
      setColor(editTag.color);
    } else {
      setName('');
      setColor(PRESET_COLORS[0]);
    }
  }, [isOpen, editTag]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), color });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-bold text-gray-900 text-base">
            {editTag ? 'タグを編集' : 'タグを追加'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              名前 *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例: 資源ごみ"
              required
              autoFocus
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

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

          {/* Preview */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ backgroundColor: color + '20' }}
          >
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium" style={{ color }}>
              {name || 'タグのプレビュー'}
            </span>
          </div>

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
              {editTag ? '保存する' : '追加する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
