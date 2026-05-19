'use client';

import { Bell, CheckCircle, Circle, Sparkles } from 'lucide-react';
import { TrashItem, Tag, DayOfWeek, DAY_LABELS } from '@/types/trash';
import { useChecked } from '@/hooks/useChecked';

interface DashboardProps {
  trashItems: TrashItem[];
  tags: Tag[];
}

function TomorrowCard({ date, items, tags }: { date: Date; items: TrashItem[]; tags: Tag[] }) {
  const dow = date.getDay() as DayOfWeek;
  const isSun = dow === 0;
  const isSat = dow === 6;
  const dayColor = isSun ? '#ef4444' : isSat ? '#3b82f6' : '#374151';
  const getTag = (id: string) => tags.find(t => t.id === id);

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">明日</span>
          <span className="text-sm font-bold" style={{ color: dayColor }}>
            {date.getMonth() + 1}/{date.getDate()} ({DAY_LABELS[dow]})
          </span>
        </div>
        {items.length > 0 && (
          <span className="text-xs font-bold text-gray-300">{items.length}件</span>
        )}
      </div>

      <div className="p-4">
        {items.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {items.map(item => {
              const itemTags = item.tagIds.map(id => getTag(id)).filter(Boolean) as Tag[];
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-white text-sm font-bold"
                  style={{ backgroundColor: item.color }}
                >
                  <span>{item.name}</span>
                  {item.notificationEnabled && <Bell className="h-3 w-3 opacity-70" />}
                  {itemTags.map(tag => (
                    <span key={tag.id} className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                      {tag.name}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-300 text-center py-2">ゴミ出しはありません</p>
        )}
      </div>
    </div>
  );
}

function TodayCard({ date, items, tags }: { date: Date; items: TrashItem[]; tags: Tag[] }) {
  const { isChecked, toggleCheck, todayCheckedCount } = useChecked();
  const dow = date.getDay() as DayOfWeek;
  const isSun = dow === 0;
  const isSat = dow === 6;
  const dayColor = isSun ? '#ef4444' : isSat ? '#3b82f6' : '#1e40af';
  const allDone = items.length > 0 && todayCheckedCount >= items.length;
  const getTag = (id: string) => tags.find(t => t.id === id);

  return (
    <div className={`rounded-2xl overflow-hidden shadow-md transition-all ${
      allDone ? 'shadow-green-200' : 'shadow-blue-100'
    }`}>
      {/* Header band */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: allDone
            ? 'linear-gradient(135deg, #16a34a, #22c55e)'
            : 'linear-gradient(135deg, #1e40af, #3b82f6)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-white/70">今日</span>
          <span className="text-sm font-bold text-white">
            {date.getMonth() + 1}/{date.getDate()} ({DAY_LABELS[dow]})
          </span>
        </div>
        {items.length > 0 && (
          allDone ? (
            <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span className="text-xs font-bold text-white">全完了！</span>
            </div>
          ) : (
            <span className="text-xs font-bold text-white/70">
              {todayCheckedCount}/{items.length} 完了
            </span>
          )
        )}
      </div>

      {/* Body */}
      <div className="bg-white p-4">
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map(item => {
              const checked = isChecked(item.id);
              const itemTags = item.tagIds.map(id => getTag(id)).filter(Boolean) as Tag[];
              return (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all active:scale-95"
                  style={{
                    borderColor: checked ? item.color : '#f1f5f9',
                    backgroundColor: checked ? item.color + '12' : '#f8fafc',
                  }}
                >
                  <div
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: checked ? item.color : '#e2e8f0' }}
                  >
                    {checked
                      ? <CheckCircle className="h-5 w-5 text-white" />
                      : <Circle className="h-5 w-5 text-gray-300" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-bold text-sm ${checked ? 'line-through text-gray-400' : 'text-gray-800'}`}
                      >
                        {item.name}
                      </span>
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.notificationEnabled && (
                        <Bell className="h-3 w-3 text-gray-300 shrink-0" />
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
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-300 text-center py-3">今日のゴミ出しはありません</p>
        )}

        {allDone && (
          <div className="mt-3 py-2 text-center text-sm text-green-600 font-bold bg-green-50 rounded-xl">
            🎉 今日のゴミ出し完了！お疲れ様です
          </div>
        )}
      </div>
    </div>
  );
}

export function Dashboard({ trashItems, tags }: DashboardProps) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayItems = trashItems.filter(item => item.dayOfWeek === (today.getDay() as DayOfWeek));
  const tomorrowItems = trashItems.filter(item => item.dayOfWeek === (tomorrow.getDay() as DayOfWeek));

  return (
    <div className="space-y-3">
      <TodayCard date={today} items={todayItems} tags={tags} />
      <TomorrowCard date={tomorrow} items={tomorrowItems} tags={tags} />
    </div>
  );
}
