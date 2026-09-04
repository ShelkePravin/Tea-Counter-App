import React, { useState } from 'react';
import { DayRecord, TeaPreferences } from '../types';
import { formatDateToKey, formatFriendlyDate, formatTimeOnly, getTodayDateString } from '../utils/storage';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  TrendingUp,
  Award,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

interface HistoryViewProps {
  records: Record<string, DayRecord>;
  preferences: TeaPreferences;
  onAddCupToDate: (dateKey: string) => void;
  onDeleteCupFromDate: (dateKey: string, cupId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  records,
  preferences,
  onAddCupToDate,
  onDeleteCupFromDate,
}) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const todayKey = getTodayDateString();
  const goal = preferences.dailyGoal;

  // Generate last 7 days array for visual chart
  const last7Days: { dateKey: string; label: string; count: number; dayOfWeek: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = formatDateToKey(d);
    const dayRecord = records[key];
    last7Days.push({
      dateKey: key,
      label: formatFriendlyDate(key),
      dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      count: dayRecord?.count || 0,
    });
  }

  const maxChartCount = Math.max(goal + 1, ...last7Days.map((d) => d.count), 5);

  // Sorted list of all recorded dates descending
  const sortedDateKeys = Object.keys(records).sort((a, b) => b.localeCompare(a));

  const toggleExpand = (dateKey: string) => {
    setExpandedDate((prev) => (prev === dateKey ? null : dateKey));
  };

  return (
    <div className="space-y-4">
      {/* 7-Day Bar Chart */}
      <div className="bg-white rounded-3xl border border-stone-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-700" />
            <h3 className="font-bold text-stone-900 text-sm">Last 7 Days Activity</h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">Target: {goal}/day</span>
        </div>

        {/* Chart Bars */}
        <div className="flex items-end justify-between gap-2 h-36 pt-4 px-1 pb-1 border-b border-stone-100 relative">
          {/* Daily Goal Target Guideline */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-amber-400/80 pointer-events-none z-0 flex justify-end"
            style={{ bottom: `${(goal / maxChartCount) * 100}%` }}
          >
            <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-1 rounded -translate-y-1/2 mr-1">
              Goal ({goal})
            </span>
          </div>

          {last7Days.map((item) => {
            const isToday = item.dateKey === todayKey;
            const heightPercent = Math.min(100, Math.round((item.count / maxChartCount) * 100));
            const metGoal = item.count >= goal && goal > 0;

            return (
              <div key={item.dateKey} className="flex-1 flex flex-col items-center h-full justify-end z-10">
                {/* Count badge */}
                <span className="text-[11px] font-bold text-stone-700 mb-1">
                  {item.count > 0 ? item.count : '0'}
                </span>
                {/* Bar */}
                <div className="w-full max-w-[28px] bg-stone-100 rounded-t-lg overflow-hidden flex items-end h-full">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      metGoal
                        ? 'bg-emerald-600'
                        : isToday
                        ? 'bg-amber-600'
                        : item.count > 0
                        ? 'bg-amber-800/80'
                        : 'bg-transparent'
                    }`}
                    style={{ height: `${heightPercent}%`, minHeight: item.count > 0 ? '6px' : '0px' }}
                  />
                </div>
                {/* Day label */}
                <span
                  className={`text-xs mt-1.5 font-bold ${
                    isToday ? 'text-amber-800 font-black' : 'text-stone-500'
                  }`}
                >
                  {item.dayOfWeek}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2.5 text-[11px] text-stone-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-emerald-600" />
            <span>Goal Reached</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-amber-600" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-amber-800/80" />
            <span>Logged Days</span>
          </div>
        </div>
      </div>

      {/* Everyday Log Archive */}
      <div className="bg-white rounded-3xl border border-stone-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-amber-700" />
            <h3 className="font-bold text-stone-900 text-sm">Everyday Log History</h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {sortedDateKeys.length} recorded {sortedDateKeys.length === 1 ? 'day' : 'days'}
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {sortedDateKeys.map((dateKey) => {
            const record = records[dateKey];
            const isExpanded = expandedDate === dateKey;
            const isToday = dateKey === todayKey;
            const metGoal = record.count >= goal && goal > 0;

            return (
              <div key={dateKey} className="py-3 first:pt-1 last:pb-1">
                {/* Day Row Header */}
                <div
                  onClick={() => toggleExpand(dateKey)}
                  className="flex items-center justify-between cursor-pointer group select-none hover:bg-stone-50/70 p-1.5 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="text-stone-400 group-hover:text-stone-700 transition-colors">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-stone-900">
                          {formatFriendlyDate(dateKey)}
                        </span>
                        {isToday && (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            Today
                          </span>
                        )}
                        {metGoal && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-[11px] text-stone-400">{dateKey}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-black text-xs text-stone-900">
                        {record.count} {record.count === 1 ? 'cup' : 'cups'}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {record.cups.length} detailed logs
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Day Details */}
                {isExpanded && (
                  <div className="mt-2.5 ml-6 pl-3 border-l-2 border-amber-200/80 space-y-2 text-xs">
                    {record.cups.length === 0 ? (
                      <p className="text-stone-400 italic text-[11px]">No individual cup timestamps recorded.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {record.cups.map((cup, cIdx) => (
                          <div
                            key={cup.id}
                            className="flex items-center justify-between py-1 px-2 rounded-lg bg-stone-50 border border-stone-100"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-stone-800">{cup.type}</span>
                              <span className="text-[10px] text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-200">
                                {cup.size}
                              </span>
                              {cup.note && (
                                <span className="text-stone-500 italic text-[11px]">“{cup.note}”</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-stone-400">
                                {formatTimeOnly(cup.timestamp)}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteCupFromDate(dateKey, cup.id);
                                }}
                                className="text-stone-300 hover:text-red-600 p-0.5 cursor-pointer"
                                title="Delete cup"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Retroactive quick add button for past day */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddCupToDate(dateKey);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Log Cup for {formatFriendlyDate(dateKey)}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
