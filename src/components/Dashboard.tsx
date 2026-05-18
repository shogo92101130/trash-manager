'use client';

import { Bell } from 'lucide-react';
import { TrashItem, Tag, DayOfWeek, DAY_LABELS } from '@/types/trash';

interface DashboardProps {
  trashItems: TrashItem[];
  tags: Tag[];
}

function DayCard({
  label,
  date,
  items,
  tags,
  highlight,
}: {
  label: string;
  date: Date;
  items: TrashItem[];
  tags: Tag[];
  highlight: boolean;
}) {
  const dow = date.getDay() as DayOfWeek;
  const isSun = dow === 0;
  const isSat = dow === 6;
  const dayColor = isSun ? '#ef4444' : isSat ? '#3b82f6' : '#374151';

  const getTag = (id: string) => tags.find(t => t.id === id);

  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight ? 'shadow-lg border-blue-200 bg-gradient-to-br from-blue-50 to-white' : 'border-gray-100 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className={`text-xs font-bold uppercase tracking-widest ${
              highlight ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            {label}
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm text-gray-500">
              {date.getMonth() + 1}/{date.getDate()}
            </span>
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
                    {item.notificationEnabled && (
                      <Bell className="h-3.5 w-3.5 opacity-70 shrink-0" />
                    )}
                  </div>
                  {item.memo && (
                    <p className="text-xs opacity-80 mt-0.5 leading-relaxed">{item.memo}</p>
                  )}
                  {itemTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {itemTags.map(tag => (
                        <span
                          key={tag.id}
                          className="px-2 py-0.5 rounded-full text-xs bg-white/25 font-medium"
                        >
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

export function Dashboard({ trashItems, tags }: DashboardProps) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayItems = trashItems.filter(item => item.dayOfWeek === (today.getDay() as DayOfWeek));
  const tomorrowItems = trashItems.filter(item => item.dayOfWeek === (tomorrow.getDay() as DayOfWeek));

  return (
    <div className="space-y-3">
      <DayCard label="今日" date={today} items={todayItems} tags={tags} highlight={true} />
      <DayCard label="明日" date={tomorrow} items={tomorrowItems} tags={tags} highlight={false} />
    </div>
  );
}
