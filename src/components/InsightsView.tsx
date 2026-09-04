import React from 'react';
import { DayRecord, StatsSummary, TeaPreferences } from '../types';
import { formatFriendlyDate } from '../utils/storage';
import {
  Flame,
  Coffee,
  Trophy,
  Calendar,
  Sun,
  Sunset,
  Moon,
  Heart,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface InsightsViewProps {
  stats: StatsSummary;
  preferences: TeaPreferences;
  records: Record<string, DayRecord>;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ stats, preferences, records }) => {
  // Compute timing habits across all logged cups
  let morningCups = 0; // 5 AM - 11:59 AM
  let afternoonCups = 0; // 12 PM - 4:59 PM
  let eveningCups = 0; // 5 PM - 4:59 AM

  (Object.values(records) as DayRecord[]).forEach((r) => {
    r.cups.forEach((c) => {
      const hour = new Date(c.timestamp).getHours();
      if (hour >= 5 && hour < 12) morningCups++;
      else if (hour >= 12 && hour < 17) afternoonCups++;
      else eveningCups++;
    });
  });

  const totalTimedCups = morningCups + afternoonCups + eveningCups || 1;
  const morningPct = Math.round((morningCups / totalTimedCups) * 100);
  const afternoonPct = Math.round((afternoonCups / totalTimedCups) * 100);
  const eveningPct = Math.round((eveningCups / totalTimedCups) * 100);

  return (
    <div className="space-y-4">
      {/* Top Highlights Bento */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Streak Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Day Streak
            </span>
            <Flame className="w-5 h-5 text-amber-600 fill-amber-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-amber-950">{stats.currentStreak}</div>
            <div className="text-xs text-amber-800/80 font-medium">Consecutive days</div>
          </div>
          <p className="text-[10px] text-amber-700/80">Keep the daily tea habit going!</p>
        </div>

        {/* Total Cups Card */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              All-Time Total
            </span>
            <Coffee className="w-5 h-5 text-amber-700" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-stone-900">{stats.allTimeTotal}</div>
            <div className="text-xs text-stone-500 font-medium">Cups recorded</div>
          </div>
          <p className="text-[10px] text-stone-400">Stored on your local device</p>
        </div>

        {/* Weekly Average */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              7-Day Average
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-stone-900">{stats.weeklyAverage}</div>
            <div className="text-xs text-stone-500 font-medium">Cups / day</div>
          </div>
          <p className="text-[10px] text-stone-400">Target is {preferences.dailyGoal} cups</p>
        </div>

        {/* Favorite Tea */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Top Variety
            </span>
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="my-2">
            <div className="text-base font-black text-stone-900 line-clamp-1">
              {stats.topTeaType}
            </div>
            <div className="text-xs text-stone-500 font-medium">Most brewed</div>
          </div>
          <p className="text-[10px] text-stone-400">Your signature drink</p>
        </div>
      </div>

      {/* Habit Time Distribution */}
      <div className="bg-white rounded-3xl border border-stone-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-700" /> Brewing Habits by Time
          </h3>
          <span className="text-xs text-stone-400">{morningCups + afternoonCups + eveningCups} logged cups</span>
        </div>

        <div className="space-y-3 pt-1">
          {/* Morning */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-stone-700 font-semibold flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" /> Morning (5 AM - 12 PM)
              </span>
              <span className="font-bold text-stone-800">
                {morningCups} ({morningPct}%)
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${morningPct}%` }}
              />
            </div>
          </div>

          {/* Afternoon */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-stone-700 font-semibold flex items-center gap-1.5">
                <Sunset className="w-3.5 h-3.5 text-orange-500" /> Afternoon (12 PM - 5 PM)
              </span>
              <span className="font-bold text-stone-800">
                {afternoonCups} ({afternoonPct}%)
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all"
                style={{ width: `${afternoonPct}%` }}
              />
            </div>
          </div>

          {/* Evening */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-stone-700 font-semibold flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-500" /> Evening / Night
              </span>
              <span className="font-bold text-stone-800">
                {eveningCups} ({eveningPct}%)
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${eveningPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Best Day & Wellness Tips */}
      <div className="bg-amber-50/60 border border-amber-200/70 rounded-3xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
          <Heart className="w-4 h-4 text-amber-700" />
          <span>Tea & Wellness Notes</span>
        </div>
        <p className="text-xs text-amber-900/80 leading-relaxed">
          {stats.bestDay ? (
            <>
              Your highest daily record is <strong>{stats.bestDay.count} cups</strong> on{' '}
              {formatFriendlyDate(stats.bestDay.date)}.
            </>
          ) : (
            'Track your daily cups to establish a mindful routine.'
          )}{' '}
          Traditional tea provides natural flavonoids (L-theanine and catechins). Drinking your last cup 3-4 hours before bedtime helps promote restful sleep.
        </p>
      </div>
    </div>
  );
};
