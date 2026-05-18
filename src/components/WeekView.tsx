'use client';

import { TrashItem, Tag, DayOfWeek, DAY_LABELS } from '@/types/trash';

interface WeekViewProps {
  trashItems: TrashItem[];
  tags: Tag[];
}

export function WeekView({ trashItems, tags }: WeekViewProps) {
  const today = new Date();

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const getTag = (id: string) => tags.find(t => t.id === id);

  return (
    <div>
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
        今週のスケジュール
      </h2>
      <div className="space-y-2">
        {days.map((date, idx) => {
          const dow = date.getDay() as DayOfWeek;
          const items = trashItems.filter(item => item.dayOfWeek === dow);
          const isToday = idx === 0;
          const isSun = dow === 0;
          const isSat = dow === 6;
          const dayColor = isSun ? '#ef4444' : isSat ? '#3b82f6' : '#374151';

          return (
            <div
              key={date.toDateString()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                isToday
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-100 bg-white'
              }`}
            >
              {/* Date column */}
              <div className="w-12 shrink-0 text-center">
                <div className="text-xs text-gray-400 font-medium">
                  {date.getMonth() + 1}/{date.getDate()}
                </div>
                <div className="text-sm font-extrabold" style={{ color: dayColor }}>
                  {DAY_LABELS[dow]}
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-gray-200 shrink-0" />

              {/* Items */}
              <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                {items.length > 0 ? (
                  items.map(item => {
                    const itemTags = item.tagIds.map(id => getTag(id)).filter(Boolean) as Tag[];
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-xs font-bold"
                        style={{ backgroundColor: item.color }}
                        title={
                          [item.name, item.memo, ...itemTags.map(t => t.name)]
                            .filter(Boolean)
                            .join(' / ')
                        }
                      >
                        {item.name}
                        {itemTags.length > 0 && (
                          <span className="opacity-70">
                            {itemTags.map(t => `#${t.name}`).join(' ')}
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-xs text-gray-300 italic">なし</span>
                )}
              </div>

              {/* Today indicator */}
              {isToday && (
                <span className="text-xs font-bold text-blue-500 shrink-0">今日</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
