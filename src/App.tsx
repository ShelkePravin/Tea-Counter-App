import React, { useEffect, useState } from 'react';
import { CupSize, DayRecord, TeaPreferences } from './types';
import {
  addCupToRecord,
  calculateStats,
  clearAllLocalData,
  clearDayRecord,
  exportLocalDataJson,
  formatFriendlyDate,
  getOrCreateDayRecord,
  getTodayDateString,
  importLocalDataJson,
  loadAllRecords,
  loadPreferences,
  removeLastCupFromRecord,
  removeSpecificCup,
  savePreferences,
  triggerHaptic,
  updateDayTotalCount,
} from './utils/storage';
import { TodayView } from './components/TodayView';
import { HistoryView } from './components/HistoryView';
import { InsightsView } from './components/InsightsView';
import { QuickAddModal } from './components/QuickAddModal';
import { EditCountModal } from './components/EditCountModal';
import { SettingsModal } from './components/SettingsModal';
import { InstallModal } from './components/InstallModal';
import { SplashScreen } from './components/SplashScreen';
import { usePWAInstall } from './hooks/usePWAInstall';
import {
  Coffee,
  Calendar,
  BarChart3,
  Settings,
  HardDrive,
  CheckCircle,
  Smartphone,
} from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<Record<string, DayRecord>>(() => loadAllRecords());
  const [preferences, setPreferences] = useState<TeaPreferences>(() => loadPreferences());
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'insights'>('today');

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isEditCountOpen, setIsEditCountOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [modalTargetDate, setModalTargetDate] = useState<string>(getTodayDateString());

  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Listen to midnight day changes
  useEffect(() => {
    const timer = setInterval(() => {
      const today = getTodayDateString();
      if (!records[today]) {
        setRecords((prev) => ({
          ...prev,
          [today]: getOrCreateDayRecord(prev, today),
        }));
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [records]);

  const todayKey = getTodayDateString();
  const currentTodayRecord = getOrCreateDayRecord(records, todayKey);
  const stats = calculateStats(records);

  // Quick Add (+1 cup with default preference)
  const handleQuickAddToday = () => {
    if (preferences.vibrationEnabled) {
      triggerHaptic();
    }
    const { updatedRecords } = addCupToRecord(
      records,
      todayKey,
      preferences.defaultTeaType,
      preferences.defaultCupSize
    );
    setRecords(updatedRecords);
  };

  // Detailed Add via Modal
  const handleAddCupDetailed = (teaType: string, size: CupSize, note?: string) => {
    if (preferences.vibrationEnabled) {
      triggerHaptic();
    }
    const { updatedRecords } = addCupToRecord(records, modalTargetDate, teaType, size, note);
    setRecords(updatedRecords);
  };

  // Undo last cup
  const handleUndoLast = () => {
    if (preferences.vibrationEnabled) {
      triggerHaptic();
    }
    const updated = removeLastCupFromRecord(records, todayKey);
    setRecords(updated);
  };

  // Remove specific cup
  const handleDeleteCup = (dateKey: string, cupId: string) => {
    const updated = removeSpecificCup(records, dateKey, cupId);
    setRecords(updated);
  };

  // Direct count edit
  const handleSaveDirectCount = (newCount: number) => {
    const updated = updateDayTotalCount(records, modalTargetDate, newCount);
    setRecords(updated);
  };

  // Reset count for a day
  const handleResetDayCount = () => {
    const updated = clearDayRecord(records, modalTargetDate);
    setRecords(updated);
  };

  // Update preferences
  const handleUpdatePreferences = (newPrefs: TeaPreferences) => {
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

  // Clear all data
  const handleClearAllData = () => {
    clearAllLocalData();
    const freshToday: Record<string, DayRecord> = {
      [todayKey]: { date: todayKey, count: 0, cups: [] },
    };
    setRecords(freshToday);
  };

  // Restore data from backup
  const handleRestoreData = (newRecords: Record<string, DayRecord>, newPrefs: TeaPreferences) => {
    setRecords(newRecords);
    setPreferences(newPrefs);
  };

  return (
    <div className="min-h-screen bg-stone-200/70 flex justify-center py-0 sm:py-6 px-0 sm:px-4 font-sans antialiased selection:bg-amber-200">
      {/* Phone App Container */}
      <div className="w-full max-w-md bg-stone-100 min-h-screen sm:min-h-[780px] sm:rounded-3xl border-0 sm:border border-stone-300 shadow-xl flex flex-col overflow-hidden relative">
        {/* Top App Header */}
        <header className="bg-white px-5 pt-4 pb-3 border-b border-stone-200/80 sticky top-0 z-30 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-700 text-white flex items-center justify-center shadow-xs">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black text-stone-900 tracking-tight leading-tight">
                Tea Counter
              </h1>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
                <span>{formatFriendlyDate(todayKey)}</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Local Storage
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="open-install-top-btn"
              type="button"
              onClick={() => setIsInstallOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Get APK & Phone Install"
              aria-label="Get APK and Phone Install"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-800" />
              <span>{isInstalled ? 'App Ready' : 'Get APK'}</span>
            </button>

            <button
              id="open-settings-top-btn"
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              title="Settings & Storage"
              aria-label="Open Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Tab Navigation Pill Header */}
        <div className="px-4 pt-3 pb-1 bg-stone-100">
          <nav className="flex items-center bg-stone-200/80 p-1 rounded-2xl gap-1 text-xs font-bold" aria-label="Main Navigation">
            <button
              id="tab-today-btn"
              type="button"
              onClick={() => setActiveTab('today')}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Today</span>
              {currentTodayRecord.count > 0 && (
                <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {currentTodayRecord.count}
                </span>
              )}
            </button>

            <button
              id="tab-history-btn"
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Every Day</span>
            </button>

            <button
              id="tab-insights-btn"
              type="button"
              onClick={() => setActiveTab('insights')}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'insights'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Insights</span>
            </button>
          </nav>
        </div>

        {/* Main View Body */}
        <main className="flex-1 p-4 overflow-y-auto pb-20">
          {activeTab === 'today' && (
            <TodayView
              currentRecord={currentTodayRecord}
              preferences={preferences}
              onQuickAdd={handleQuickAddToday}
              onUndoLast={handleUndoLast}
              onDeleteCup={(cupId) => handleDeleteCup(todayKey, cupId)}
              onOpenQuickAddModal={() => {
                setModalTargetDate(todayKey);
                setIsQuickAddOpen(true);
              }}
              onOpenEditCountModal={() => {
                setModalTargetDate(todayKey);
                setIsEditCountOpen(true);
              }}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              records={records}
              preferences={preferences}
              onAddCupToDate={(dateKey) => {
                setModalTargetDate(dateKey);
                setIsQuickAddOpen(true);
              }}
              onDeleteCupFromDate={(dateKey, cupId) => handleDeleteCup(dateKey, cupId)}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsView stats={stats} preferences={preferences} records={records} />
          )}
        </main>

        {/* Bottom Persistent Bar showing offline storage guarantee */}
        <footer className="bg-white/95 backdrop-blur-xs border-t border-stone-200/80 px-4 py-2.5 flex items-center justify-between text-[11px] text-stone-500 sticky bottom-0 z-20">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-stone-400" />
            <span>Saved in device storage (Offline)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="footer-get-apk-btn"
              type="button"
              onClick={() => setIsInstallOpen(true)}
              className="text-amber-800 hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <Smartphone className="w-3 h-3" />
              <span>Get APK</span>
            </button>
            <span>•</span>
            <button
              id="footer-settings-btn"
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="text-stone-600 hover:text-stone-900 hover:underline font-medium cursor-pointer"
            >
              Settings
            </button>
          </div>
        </footer>

        {/* Modals */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onAddCup={handleAddCupDetailed}
          initialTeaType={preferences.defaultTeaType}
          initialCupSize={preferences.defaultCupSize}
        />

        <EditCountModal
          isOpen={isEditCountOpen}
          onClose={() => setIsEditCountOpen(false)}
          currentCount={records[modalTargetDate]?.count || 0}
          dateKey={modalTargetDate}
          onSaveCount={handleSaveDirectCount}
          onResetCount={handleResetDayCount}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          preferences={preferences}
          onUpdatePreferences={handleUpdatePreferences}
          records={records}
          onRestoreData={handleRestoreData}
          onClearAllData={handleClearAllData}
          exportJsonFn={() => exportLocalDataJson(records, preferences)}
          onOpenInstallModal={() => setIsInstallOpen(true)}
        />

        <InstallModal
          isOpen={isInstallOpen}
          onClose={() => setIsInstallOpen(false)}
          isInstallable={isInstallable}
          isInstalled={isInstalled}
          onInstall={install}
        />

        {/* Startup Native Splash Screen */}
        {showSplash && (
          <SplashScreen
            appName="Tea Counter"
            subtitle="Daily Chai & Tea Tracker"
            onComplete={() => setShowSplash(false)}
          />
        )}
      </div>
    </div>
  );
}
