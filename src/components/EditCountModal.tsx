import React, { useState } from 'react';
import { X, Hash, RotateCcw } from 'lucide-react';

interface EditCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCount: number;
  dateKey: string;
  onSaveCount: (newCount: number) => void;
  onResetCount: () => void;
}

export const EditCountModal: React.FC<EditCountModalProps> = ({
  isOpen,
  onClose,
  currentCount,
  dateKey,
  onSaveCount,
  onResetCount,
}) => {
  const [val, setVal] = useState<number>(currentCount);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCount(Math.max(0, val));
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Reset tea count for this day to 0?')) {
      onResetCount();
      onClose();
    }
  };

  return (
    <div
      id="edit-count-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="edit-count-modal-content"
        className="w-full max-w-sm bg-white rounded-2xl border border-stone-200 shadow-2xl p-6 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
              <Hash className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-stone-900 text-lg">Direct Count Edit</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-4 space-y-4">
          <p className="text-xs text-stone-500">
            Directly adjust the cup count stored in your phone storage for <span className="font-semibold text-stone-700">{dateKey}</span>.
          </p>

          <div className="flex items-center justify-center gap-4 py-3">
            <button
              type="button"
              onClick={() => setVal((v) => Math.max(0, v - 1))}
              className="w-12 h-12 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xl font-bold flex items-center justify-center cursor-pointer transition-transform"
            >
              -
            </button>
            <input
              type="number"
              min="0"
              max="50"
              value={val}
              onChange={(e) => setVal(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-24 h-14 text-center text-3xl font-black bg-stone-50 border border-stone-300 rounded-xl text-amber-950 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setVal((v) => v + 1)}
              className="w-12 h-12 rounded-xl bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-900 text-xl font-bold flex items-center justify-center cursor-pointer transition-transform"
            >
              +
            </button>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to 0
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Save Count
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
