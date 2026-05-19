'use client';

import { Bell, CheckCircle, Circle } from 'lucide-react';
import { TrashItem, Tag, DayOfWeek, DAY_LABELS } from '@/types/trash';
import { useChecked } from '@/hooks/useChecked';

interface DashboardProps {
  trashItems: TrashItem[];
  tags: Tag[];
}

function TomorrowCard({
  date,
  items,
  tags,
}: {
  date: Date;
  items: TrashItem[];
  tags: Tag[];
}) {
  const dow = date.getDay() as DayOfWeek;
  const isSun = dow === 0;
  const isSat = dow === 6;
  const dayColor = isSun ? '#ef4444' : isSat ? '#3b82f6' : '#374151';
  const getTag = (id: string) => tags.find(t => t.id === id);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">明日</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm text-gray-500">{date.getMonth() + 1}/{date.getDate()}</span>
            <span className="text-base font-bold" style={{ color: dayColor }}>
              {DAY_LABELS[dow]}曜日
            </span>
          </div>
        </div>
        {items.length > 0 && (
          <span className="text-2xl font-extrabold text-gray-200">{items.length}</span>
        )}
      </div>

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map(item => {
            const itemTags = item.tagIds.map(id => getTag(id)).filter(Boolean) as Tag[];
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-xl text-white"
                style={{ backgroundColor: item.color }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{item.name}</span>
                    {item.notificationEnabled && <Bell className="h-3.5 w-3.5 opacity-70 shrink-0" />}
                  </div>
                  {item.memo && <p className="text-xs opacity-80 mt-0.5">{item.memo}</p>}
                  {itemTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {itemTags.map(tag => (
                        <span key={tag.id} className="px-2 py-0.5 rounded-full text-xs bg-white/25 font-medium">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center py-5">
          <p className="text-sm text-gray-400">ゴミ出しはありません</p>
        </div>
      )}
    </div>
  );
}

function TodayCard({
  date,
  items,
  tags,
}: {
  date: Date;
  items: TrashItem[];
  tags: Tag[];
}) {
  const { isChecked, toggleCheck, todayCheckedCount } = useChecked();
  const dow = date.getDay() as DayOfWeek;
  const isSun = dow === 0;
  const isSat = dow === 6;
  const dayColor = isSun ? '#ef4444' : isSat ? '#3b82f6' : '#374151';
  const getTag = (id: string) => tags.find(t => t.id === id);

  const allDone = items.length > 0 && todayCheckedCount >= items.length;

  return (
    <div className={`rounded-2xl border p-4 shadow-lg transition-all ${
      allDone
        ? 'border-green-200 bg-gradient-to-br from-green-50 to-white'
        : 'border-blue-200 bg-gradient-to-br from-blue-50 to-white'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className={`text-xs font-bold uppercase tracking-widest ${allDone ? 'text-green-500' : 'text-blue-500'}`}>
            今日
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm text-gray-500">{date.getMonth() + 1}/{date.getDate()}</span>
            <span className="text-base font-bold" style={{ color: dayColor }}>
              {DAY_LABELS[dow]}曜日
            </span>
          </div>
        </div>

        {items.length > 0 && (
          allDone ? (
            <div className="flex items-center gap-1.5 bg-green-100 text-green-600 px-3 py-1 rounded-full">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs font-bold">完了！</span>
            </div>
          ) : (
            <span className="text-xs font-medium text-gray-400">
              {todayCheckedCount}/{items.length} 完了
            </span>
          )
        )}
      </div>

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map(item => {
            const checked = isChecked(item.id);
            const itemTags = item.tagIds.map(id => getTag(id)).filter(Boolean) as Tag[];
            return (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className="w-full flex items-start gap-3 p-3 rounded-xl text-white text-left transition-all active:scale-95"
                style={{
                  backgroundColor: item.color,
                  opacity: checked ? 0.6 : 1,
                }}
              >
                <div className="shrink-0 mt-0.5">
                  {checked
                    ? <CheckCircle className="h-5 w-5 text-white" />
                    : <Circle className="h-5 w-5 text-white/60" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${checked ? 'line-through opacity-70' : ''}`}>
                      {item.name}
                    </span>
                    {item.notificationEnabled && <Bell className="h-3.5 w-3.5 opacity-70 shrink-0" />}
                  </div>
                  {item.memo && <p className="text-xs opacity-80 mt-0.5">{item.memo}</p>}
                  {itemTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {itemTags.map(tag => (
                        <span key={tag.id} className="px-2 py-0.5 rounded-full text-xs bg-white/25 font-medium">
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
        <div className="flex items-center justify-center py-5">
          <p className="text-sm text-gray-400">ゴミ出しはありません</p>
        </div>
      )}

      {allDone && (
        <div className="mt-3 text-center text-sm text-green-600 font-semibold">
          今日のゴミ出し全部完了！お疲れ様です 🎉
        </div>
      )}
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
