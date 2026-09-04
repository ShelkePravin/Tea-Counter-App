import React, { useState } from 'react';
import { CupSize } from '../types';
import { TEA_VARIETIES } from '../utils/constants';
import { X, Coffee, Clock, FileText, Check } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCup: (teaType: string, size: CupSize, note?: string) => void;
  initialTeaType?: string;
  initialCupSize?: CupSize;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddCup,
  initialTeaType = 'Masala Chai',
  initialCupSize = 'regular',
}) => {
  const [selectedType, setSelectedType] = useState<string>(initialTeaType);
  const [selectedSize, setSelectedSize] = useState<CupSize>(initialCupSize);
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCup(selectedType, selectedSize, note.trim() || undefined);
    setNote('');
    onClose();
  };

  const quickNotes = ['With Biscuits', 'Office Break', 'Morning Chai', 'Evening Tapri', 'After Lunch'];

  return (
    <div
      id="quick-add-modal-overlay"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="quick-add-modal-content"
        className="w-full max-w-md bg-stone-50 rounded-t-3xl sm:rounded-2xl border border-stone-200 shadow-2xl p-6 text-stone-900 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-lg leading-tight">Log a Cup of Tea</h3>
              <p className="text-xs text-stone-500">Stored locally on your phone</p>
            </div>
          </div>
          <button
            id="close-quick-add-btn"
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pt-4 space-y-5 pr-1">
          {/* Variety Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              Select Tea Variety
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TEA_VARIETIES.map((variety) => {
                const isSelected = selectedType === variety.name;
                return (
                  <button
                    key={variety.name}
                    type="button"
                    onClick={() => setSelectedType(variety.name)}
                    className={`p-2.5 rounded-xl text-left border transition-all flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm font-semibold'
                        : 'bg-white text-stone-800 border-stone-200 hover:border-amber-300 hover:bg-amber-50/50'
                    }`}
                  >
                    <div>
                      <div className="text-sm leading-snug">{variety.name}</div>
                      <div
                        className={`text-[11px] ${
                          isSelected ? 'text-amber-100' : 'text-stone-500'
                        }`}
                      >
                        {variety.category}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 shrink-0 text-white mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cup Size */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              Cup Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cutting', label: 'Cutting / Half', desc: '~80 ml' },
                { id: 'regular', label: 'Regular Cup', desc: '~150 ml' },
                { id: 'large', label: 'Big Mug', desc: '~250 ml' },
              ].map((sz) => {
                const isSelected = selectedSize === sz.id;
                return (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setSelectedSize(sz.id as CupSize)}
                    className={`py-2 px-3 rounded-xl text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100 border-amber-500 text-amber-900 font-semibold ring-1 ring-amber-500'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{sz.label}</div>
                    <div className="text-[10px] text-stone-500">{sz.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Note Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="tea-cup-note" className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Note (Optional)
              </label>
              <span className="text-[11px] text-stone-400">e.g. at tea stall</span>
            </div>
            <input
              id="tea-cup-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. With snacks, at tapri..."
              maxLength={40}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickNotes.map((qn) => (
                <button
                  key={qn}
                  type="button"
                  onClick={() => setNote(qn)}
                  className="text-xs px-2.5 py-1 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 cursor-pointer transition-colors"
                >
                  +{qn}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="submit-log-tea-cup-btn"
              type="submit"
              className="w-full py-3.5 px-4 bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Coffee className="w-5 h-5" />
              <span>Log {selectedType}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
