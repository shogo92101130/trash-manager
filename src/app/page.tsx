'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Trash2,
  Settings,
  Plus,
  Tag as TagIcon,
  Download,
  Upload,
  Bell,
  Pencil,
  Trash,
  LayoutDashboard,
  List,
  BellOff,
} from 'lucide-react';
import { useTrash } from '@/hooks/useTrash';
import { Dashboard } from '@/components/Dashboard';
import { WeekView } from '@/components/WeekView';
import { SearchBar } from '@/components/SearchBar';
import { TrashFormModal } from '@/components/TrashFormModal';
import { TagFormModal } from '@/components/TagFormModal';
import { TrashItem, Tag, DayOfWeek, DAY_LABELS } from '@/types/trash';

type Tab = 'dashboard' | 'manage' | 'settings';

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'ダッシュボード', Icon: LayoutDashboard },
  { id: 'manage', label: '管理', Icon: List },
  { id: 'settings', label: '設定', Icon: Settings },
];

export default function Home() {
  const {
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
  } = useTrash();

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
  const [editingTrash, setEditingTrash] = useState<TrashItem | undefined>();

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | undefined>();

  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ('Notification' in window) setNotifPermission(Notification.permission);
  }, []);

  // Schedule next notification
  useEffect(() => {
    if (!hydrated || !notificationConfig.enabled || notifPermission !== 'granted') return;

    const [h, m] = notificationConfig.time.split(':').map(Number);
    const now = new Date();
    const target = new Date(now);
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);

    const delay = target.getTime() - now.getTime();

    const timer = setTimeout(() => {
      const targetDay =
        notificationConfig.reminderType === 'previous-night'
          ? ((target.getDay() + 1) % 7 as DayOfWeek)
          : (target.getDay() as DayOfWeek);

      const notifItems = trashItems.filter(
        item => item.dayOfWeek === targetDay && item.notificationEnabled
      );

      if (notifItems.length > 0) {
        const dayLabel =
          notificationConfig.reminderType === 'previous-night' ? '明日' : '今日';
        new Notification('🗑️ ゴミ出しリマインダー', {
          body: `${dayLabel}は${notifItems.map(i => i.name).join('、')}の日です`,
          icon: '/favicon.ico',
        });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [hydrated, notificationConfig, trashItems, notifPermission]);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
  };

  const sendTestNotification = () => {
    if (notifPermission !== 'granted') return;
    new Notification('🗑️ テスト通知', {
      body: 'ゴミ出しリマインダーが正常に動作しています！',
      icon: '/favicon.ico',
    });
  };

  const handleTagToggle = (tagId: string) =>
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );

  const filteredItems = trashItems.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q || item.name.toLowerCase().includes(q) || item.memo.toLowerCase().includes(q);
    const matchesTags =
      selectedTagIds.length === 0 || selectedTagIds.some(id => item.tagIds.includes(id));
    return matchesSearch && matchesTags;
  });

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const ok = importData(ev.target?.result as string);
      setImportStatus(ok ? 'success' : 'error');
      setTimeout(() => setImportStatus('idle'), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <Trash2 className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-base font-bold text-white">ゴミ出し管理</h1>
          </div>
        </div>

        {/* Tab bar inside header */}
        <div className="max-w-2xl mx-auto px-4 flex border-t border-white/10">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-white text-white'
                  : 'border-transparent text-white/50 hover:text-white/80'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-5 pb-10">
        {/* ── Dashboard ── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            <Dashboard trashItems={trashItems} tags={tags} />
            <WeekView trashItems={trashItems} tags={tags} />
          </div>
        )}

        {/* ── Manage ── */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              tags={tags}
              selectedTagIds={selectedTagIds}
              onTagToggle={handleTagToggle}
            />

            {/* Trash items section */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-700">ゴミ一覧</h2>
                <button
                  onClick={() => { setEditingTrash(undefined); setIsTrashModalOpen(true); }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  追加
                </button>
              </div>

              {filteredItems.length > 0 ? (
                <div className="space-y-2">
                  {filteredItems.map(item => {
                    const itemTags = item.tagIds
                      .map(id => tags.find(t => t.id === id))
                      .filter(Boolean) as Tag[];
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                      >
                        <div
                          className="w-1 self-stretch rounded-full shrink-0 min-h-[40px]"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-sm text-gray-900">{item.name}</span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                              style={{ backgroundColor: item.color }}
                            >
                              {DAY_LABELS[item.dayOfWeek as DayOfWeek]}曜日
                            </span>
                            {item.notificationEnabled && (
                              <Bell className="h-3 w-3 text-blue-400" />
                            )}
                          </div>
                          {item.memo && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{item.memo}</p>
                          )}
                          {itemTags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {itemTags.map(tag => (
                                <span
                                  key={tag.id}
                                  className="text-xs px-2 py-0.5 rounded-full text-white"
                                  style={{ backgroundColor: tag.color }}
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center shrink-0">
                          <button
                            onClick={() => { setEditingTrash(item); setIsTrashModalOpen(true); }}
                            className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`「${item.name}」を削除しますか？`))
                                deleteTrashItem(item.id);
                            }}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-14 text-gray-300">
                  <Trash2 className="h-12 w-12 mx-auto mb-3" />
                  <p className="text-sm">
                    {searchQuery || selectedTagIds.length > 0
                      ? '検索結果がありません'
                      : 'まだゴミが登録されていません'}
                  </p>
                </div>
              )}
            </section>

            {/* Tags section */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-700">タグ</h2>
                <button
                  onClick={() => { setEditingTag(undefined); setIsTagModalOpen(true); }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-gray-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  追加
                </button>
              </div>

              {tags.length > 0 ? (
                <div className="space-y-2">
                  {tags.map(tag => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                    >
                      <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                      <span className="flex-1 text-sm font-semibold text-gray-900">{tag.name}</span>
                      <div className="flex items-center shrink-0">
                        <button
                          onClick={() => { setEditingTag(tag); setIsTagModalOpen(true); }}
                          className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`タグ「${tag.name}」を削除しますか？`))
                              deleteTag(tag.id);
                          }}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-300">
                  <TagIcon className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">タグを追加してください</p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ── Settings ── */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Notification card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <h2 className="text-sm font-bold text-gray-700">通知設定</h2>
              </div>
              <div className="p-4 space-y-4">
                {/* Permission banner */}
                {!('Notification' in window) ? (
                  <div className="px-3 py-2.5 bg-yellow-50 text-yellow-700 rounded-xl text-xs">
                    このブラウザは通知をサポートしていません
                  </div>
                ) : notifPermission === 'denied' ? (
                  <div className="px-3 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs">
                    通知がブロックされています。ブラウザの設定から許可してください。
                  </div>
                ) : notifPermission === 'default' ? (
                  <button
                    onClick={requestPermission}
                    className="w-full py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
                  >
                    通知を許可する
                  </button>
                ) : (
                  <div className="px-3 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-medium flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5" /> 通知が許可されています
                  </div>
                )}

                {/* Enable toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {notificationConfig.enabled ? (
                      <Bell className="h-4 w-4 text-blue-500" />
                    ) : (
                      <BellOff className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-700">通知を有効にする</span>
                  </div>
                  <button
                    onClick={() =>
                      updateNotificationConfig({ enabled: !notificationConfig.enabled })
                    }
                    disabled={notifPermission !== 'granted'}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-40"
                    style={{
                      backgroundColor: notificationConfig.enabled ? '#3b82f6' : '#d1d5db',
                    }}
                  >
                    <span
                      className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform"
                      style={{
                        transform: notificationConfig.enabled
                          ? 'translateX(22px)'
                          : 'translateX(4px)',
                      }}
                    />
                  </button>
                </div>

                {/* Reminder type */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    タイミング
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { value: 'previous-night', label: '前日夜' },
                        { value: 'morning', label: '当日朝' },
                      ] as const
                    ).map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => updateNotificationConfig({ reminderType: value })}
                        className="py-2 rounded-xl text-sm font-semibold transition-colors"
                        style={
                          notificationConfig.reminderType === value
                            ? { backgroundColor: '#3b82f6', color: '#fff' }
                            : { backgroundColor: '#f3f4f6', color: '#6b7280' }
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    通知時刻
                  </p>
                  <input
                    type="time"
                    value={notificationConfig.time}
                    onChange={e => updateNotificationConfig({ time: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Test */}
                <button
                  onClick={sendTestNotification}
                  disabled={notifPermission !== 'granted'}
                  className="w-full py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors disabled:opacity-40"
                >
                  テスト通知を送信
                </button>
              </div>
            </div>

            {/* Data card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <Download className="h-4 w-4 text-gray-500" />
                <h2 className="text-sm font-bold text-gray-700">データ管理</h2>
              </div>
              <div className="p-4 space-y-3">
                {importStatus === 'success' && (
                  <div className="px-3 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-medium">
                    データをインポートしました
                  </div>
                )}
                {importStatus === 'error' && (
                  <div className="px-3 py-2 bg-red-50 text-red-600 rounded-xl text-xs">
                    インポートに失敗しました。JSONファイルを確認してください。
                  </div>
                )}

                <button
                  onClick={exportData}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  JSONにエクスポート
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  JSONからインポート
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />

                <p className="text-xs text-gray-300 text-center">
                  ※ インポートすると既存データは上書きされます
                </p>

                <div className="pt-2 border-t border-gray-100 space-y-1">
                  {[
                    { label: '登録ゴミ数', value: `${trashItems.length} 件` },
                    { label: 'タグ数', value: `${tags.length} 件` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-xs text-gray-500">
                      <span>{label}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <TrashFormModal
        isOpen={isTrashModalOpen}
        onClose={() => { setIsTrashModalOpen(false); setEditingTrash(undefined); }}
        onSave={
          editingTrash
            ? item => updateTrashItem(editingTrash.id, item)
            : addTrashItem
        }
        editItem={editingTrash}
        tags={tags}
      />

      <TagFormModal
        isOpen={isTagModalOpen}
        onClose={() => { setIsTagModalOpen(false); setEditingTag(undefined); }}
        onSave={editingTag ? tag => updateTag(editingTag.id, tag) : addTag}
        editTag={editingTag}
      />
    </div>
  );
}
