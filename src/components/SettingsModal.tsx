import React, { useRef, useState } from 'react';
import { CupSize, DayRecord, TeaPreferences } from '../types';
import { TEA_VARIETIES } from '../utils/constants';
import {
  X,
  Settings,
  HardDrive,
  Download,
  Upload,
  Trash2,
  Check,
  Vibrate,
  ShieldCheck,
  Award,
  AlertTriangle,
  Smartphone,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: TeaPreferences;
  onUpdatePreferences: (updated: TeaPreferences) => void;
  records: Record<string, DayRecord>;
  onRestoreData: (records: Record<string, DayRecord>, prefs: TeaPreferences) => void;
  onClearAllData: () => void;
  exportJsonFn: () => string;
  onOpenInstallModal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  records,
  onRestoreData,
  onClearAllData,
  exportJsonFn,
  onOpenInstallModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = exportJsonFn();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tea-counter-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && parsed.records) {
          onRestoreData(parsed.records, parsed.preferences || preferences);
          setImportStatus('Backup restored successfully!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Invalid backup file structure.');
        }
      } catch (err) {
        setImportStatus('Failed to read file.');
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  const handleClear = () => {
    if (
      window.confirm(
        'Are you sure you want to erase all tea tracking history from this device? This cannot be undone.'
      )
    ) {
      onClearAllData();
      onClose();
    }
  };

  const totalStoredDays = Object.keys(records).length;
  const totalCupsLogged = (Object.values(records) as DayRecord[]).reduce((sum, r) => sum + r.count, 0);

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="settings-modal-content"
        className="w-full max-w-lg bg-stone-50 rounded-2xl border border-stone-200 shadow-2xl p-6 text-stone-900 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-lg leading-tight">Settings & Storage</h3>
              <p className="text-xs text-stone-500">Preferences and device persistence</p>
            </div>
          </div>
          <button
            id="close-settings-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto pt-4 space-y-6 pr-1 text-sm">
          {/* Local Storage Architecture Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <span>Phone Local Storage Active</span>
                <span className="bg-emerald-200/80 text-emerald-800 px-1.5 py-0.5 rounded text-[10px]">
                  Offline / SharedPreferences
                </span>
              </div>
              <p className="text-emerald-700/90 mt-1 leading-relaxed">
                All daily counts are safely stored in your device’s internal client storage. No accounts, zero API calls, 100% private and works without internet.
              </p>
            </div>
          </div>

          {/* Daily Goal Setting */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="daily-goal-select" className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" /> Daily Target Goal
              </label>
              <span className="font-bold text-amber-900 text-sm">{preferences.dailyGoal} cups / day</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onUpdatePreferences({ ...preferences, dailyGoal: num })}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                    preferences.dailyGoal === num
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-500">
              Typical recommendation is 2 to 4 cups daily for balanced antioxidant benefits without excessive caffeine.
            </p>
          </div>

          {/* Default Tea Type */}
          <div className="space-y-2">
            <label htmlFor="default-tea-type" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Default Quick-Add Variety
            </label>
            <select
              id="default-tea-type"
              value={preferences.defaultTeaType}
              onChange={(e) => onUpdatePreferences({ ...preferences, defaultTeaType: e.target.value })}
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer text-xs"
            >
              {TEA_VARIETIES.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.category})
                </option>
              ))}
            </select>
          </div>

          {/* Default Cup Size */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Default Cup Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cutting', label: 'Cutting / Half' },
                { id: 'regular', label: 'Regular Cup' },
                { id: 'large', label: 'Big Mug' },
              ].map((sz) => (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => onUpdatePreferences({ ...preferences, defaultCupSize: sz.id as CupSize })}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    preferences.defaultCupSize === sz.id
                      ? 'bg-amber-100 border-amber-500 text-amber-900 ring-1 ring-amber-500'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {sz.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vibration / Haptic feedback */}
          <div className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl">
            <div className="flex items-center gap-2.5">
              <Vibrate className="w-4 h-4 text-amber-700" />
              <div>
                <div className="text-xs font-bold text-stone-800">Haptic Vibration on Tap</div>
                <div className="text-[11px] text-stone-500">Phone vibrates gently when tea cup is logged</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onUpdatePreferences({ ...preferences, vibrationEnabled: !preferences.vibrationEnabled })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                preferences.vibrationEnabled ? 'bg-amber-600' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  preferences.vibrationEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Android APK & App Installation */}
          {onOpenInstallModal && (
            <div className="p-3.5 bg-linear-to-r from-amber-50 to-amber-100/60 border border-amber-200/90 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-800 text-amber-100 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-950">Install App / Download APK</div>
                    <div className="text-[11px] text-amber-900/80">
                      Save to phone home screen or generate .apk
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenInstallModal();
                  }}
                  className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                >
                  Get APK
                </button>
              </div>
            </div>
          )}

          {/* Device Storage Status & Backup */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-stone-500" /> Backup & Data Security
              </div>
              <div className="text-[11px] text-stone-500">
                {totalStoredDays} days recorded ({totalCupsLogged} cups)
              </div>
            </div>

            {importStatus && (
              <div className="p-2.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-700" /> {importStatus}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                id="export-backup-btn"
                type="button"
                onClick={handleExport}
                className="py-2.5 px-3 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-700" />
                <span>Export Backup</span>
              </button>

              <button
                id="import-backup-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-amber-700" />
                <span>Restore Backup</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <button
              id="clear-all-data-btn"
              type="button"
              onClick={handleClear}
              className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Local Storage</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-200 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
