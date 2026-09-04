import React, { useState } from 'react';
import { CupSize, DayRecord, TeaPreferences } from '../types';
import { TeaCupVisualizer } from './TeaCupVisualizer';
import { TEA_VARIETIES } from '../utils/constants';
import { formatTimeOnly } from '../utils/storage';
import {
  Plus,
  Minus,
  SlidersHorizontal,
  Coffee,
  Trash2,
  Sparkles,
  Zap,
  Droplets,
  Edit3,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TodayViewProps {
  currentRecord: DayRecord;
  preferences: TeaPreferences;
  onQuickAdd: () => void;
  onUndoLast: () => void;
  onDeleteCup: (cupId: string) => void;
  onOpenQuickAddModal: () => void;
  onOpenEditCountModal: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  currentRecord,
  preferences,
  onQuickAdd,
  onUndoLast,
  onDeleteCup,
  onOpenQuickAddModal,
  onOpenEditCountModal,
}) => {
  const [isAddingAnimation, setIsAddingAnimation] = useState(false);
  const count = currentRecord.count;
  const goal = preferences.dailyGoal;
  const progressPercent = Math.min(100, Math.round((count / Math.max(1, goal)) * 100));
  const isGoalReached = count >= goal && goal > 0;

  // Find color of user's default or current top tea
  const defaultVariety =
    TEA_VARIETIES.find((v) => v.name === preferences.defaultTeaType) || TEA_VARIETIES[0];

  const handleTapAdd = () => {
    setIsAddingAnimation(true);
    setTimeout(() => setIsAddingAnimation(false), 400);

    // If reaching goal exactly on this tap, fire celebration confetti!
    if (count + 1 === goal) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d97706', '#b45309', '#10b981', '#f59e0b'],
      });
    }
    onQuickAdd();
  };

  // Estimate caffeine and liquid volume for today
  let totalCaffeineMg = 0;
  let totalVolumeMl = 0;
  currentRecord.cups.forEach((cup) => {
    const variety = TEA_VARIETIES.find((v) => v.name === cup.type) || defaultVariety;
    const sizeMultiplier = cup.size === 'cutting' ? 0.6 : cup.size === 'large' ? 1.6 : 1.0;
    totalCaffeineMg += Math.round(variety.caffeineMgPerCup * sizeMultiplier);
    totalVolumeMl += Math.round(
      cup.size === 'cutting' ? 80 : cup.size === 'large' ? 250 : 150
    );
  });

  return (
    <div className="space-y-4">
      {/* Visual Cup Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-5 relative overflow-hidden flex flex-col items-center">
        {/* Subtle background ambient ring */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-100/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header inside card */}
        <div className="w-full flex items-center justify-between text-stone-500 text-xs mb-1">
          <span className="font-semibold text-stone-700">Today's Brew Counter</span>
          <button
            id="open-edit-count-btn"
            type="button"
            onClick={onOpenEditCountModal}
            className="flex items-center gap-1 text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Direct Edit</span>
          </button>
        </div>

        {/* Steaming Cup */}
        <TeaCupVisualizer
          count={count}
          dailyGoal={goal}
          onAddCup={handleTapAdd}
          selectedTeaColor={defaultVariety.iconColor}
          isAdding={isAddingAnimation}
        />

        {/* Goal Progress bar */}
        <div className="w-full max-w-xs mt-3">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-stone-600">Daily Target: {goal} cups</span>
            <span className={isGoalReached ? 'text-emerald-700 font-bold' : 'text-stone-700 font-semibold'}>
              {count} / {goal} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isGoalReached ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {isGoalReached && (
            <div className="flex items-center justify-center gap-1 mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50 py-1 px-2.5 rounded-full border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target reached! Enjoy mindfully.</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Buttons Bar */}
      <div className="grid grid-cols-4 gap-2">
        {/* Quick Add +1 Button */}
        <button
          id="main-quick-add-btn"
          type="button"
          onClick={handleTapAdd}
          className="col-span-2 py-3.5 px-4 bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span className="text-base">+1 Cup</span>
        </button>

        {/* Custom Variety / Note Button */}
        <button
          id="open-variety-picker-btn"
          type="button"
          onClick={onOpenQuickAddModal}
          className="py-3 px-2 bg-white hover:bg-amber-50 active:bg-amber-100 border border-stone-200 text-stone-800 rounded-2xl font-semibold flex flex-col items-center justify-center gap-1 text-xs transition-colors cursor-pointer"
        >
          <Coffee className="w-4 h-4 text-amber-700" />
          <span className="text-[11px] leading-tight">Choose Variety</span>
        </button>

        {/* Undo / Minus Button */}
        <button
          id="main-undo-cup-btn"
          type="button"
          onClick={onUndoLast}
          disabled={count === 0}
          className={`py-3 px-2 rounded-2xl font-semibold flex flex-col items-center justify-center gap-1 text-xs border transition-colors cursor-pointer ${
            count > 0
              ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
              : 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed opacity-60'
          }`}
        >
          <Minus className="w-4 h-4 text-stone-500" />
          <span className="text-[11px] leading-tight">Undo -1</span>
        </button>
      </div>

      {/* Quick Metrics (Caffeine & Fluid volume) */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-stone-100/70 rounded-2xl p-3 border border-stone-200/70 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">Est. Caffeine</div>
            <div className="text-sm font-bold text-stone-800">
              {totalCaffeineMg} <span className="text-xs font-normal text-stone-500">mg</span>
            </div>
          </div>
        </div>

        <div className="bg-stone-100/70 rounded-2xl p-3 border border-stone-200/70 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">Est. Fluid</div>
            <div className="text-sm font-bold text-stone-800">
              {totalVolumeMl} <span className="text-xs font-normal text-stone-500">ml</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Cups Timeline */}
      <div className="bg-white rounded-3xl border border-stone-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-700" />
            <h3 className="font-bold text-stone-900 text-sm">Today’s Cup Log</h3>
          </div>
          <span className="text-xs font-semibold text-stone-500">
            {count} {count === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {currentRecord.cups.length === 0 ? (
          <div className="text-center py-6 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <p className="text-stone-500 text-xs font-medium">No cups counted yet today.</p>
            <button
              type="button"
              onClick={handleTapAdd}
              className="mt-2 text-xs font-bold text-amber-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Log your first cup of tea
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto pr-1">
            {[...currentRecord.cups].reverse().map((cup, idx) => {
              const variety =
                TEA_VARIETIES.find((v) => v.name === cup.type) || {
                  name: cup.type,
                  category: 'Tea',
                  color: 'bg-amber-100 text-amber-900 border-amber-300',
                  iconColor: '#b45309',
                  caffeineMgPerCup: 35,
                };

              return (
                <div key={cup.id} className="py-2.5 flex items-center justify-between gap-2 group">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-600 shrink-0">
                      {currentRecord.cups.length - idx}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-stone-900">{cup.type}</span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                          {cup.size}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                        <span>{formatTimeOnly(cup.timestamp)}</span>
                        {cup.note && <span className="text-stone-600 italic font-normal">“{cup.note}”</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteCup(cup.id)}
                    className="p-1.5 text-stone-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove this cup"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
