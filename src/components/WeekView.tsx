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

  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
        今週のスケジュール
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
        {days.map((date, idx) => {
          const dow = date.getDay() as DayOfWeek;
          const items = trashItems.filter(item => item.dayOfWeek === dow);
          const isToday = idx === 0;
          const isSun = dow === 0;
          const isSat = dow === 6;

          return (
            <div
              key={date.toDateString()}
              className={`shrink-0 snap-start flex flex-col items-center rounded-2xl p-3 min-w-[72px] transition-all ${
                isToday
                  ? 'bg-blue-500 shadow-lg shadow-blue-200'
                  : 'bg-white border border-gray-100'
              }`}
            >
              <span className={`text-xs font-bold mb-1 ${
                isToday ? 'text-blue-100' : isSun ? 'text-red-400' : isSat ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {DAY_LABELS[dow]}
              </span>
              <span className={`text-lg font-extrabold mb-2 ${isToday ? 'text-white' : 'text-gray-800'}`}>
                {date.getDate()}
              </span>

              <div className="flex flex-col gap-1 w-full">
                {items.length > 0 ? (
                  items.map(item => (
                    <div
                      key={item.id}
                      className="w-full px-1.5 py-1 rounded-lg text-white text-center"
                      style={{ backgroundColor: isToday ? 'rgba(255,255,255,0.25)' : item.color }}
                      title={item.name}
                    >
                      <span className="text-xs font-bold leading-none block truncate">
                        {item.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className={`w-full h-1 rounded-full mx-auto ${isToday ? 'bg-white/20' : 'bg-gray-100'}`} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
