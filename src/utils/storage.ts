import { CupEntry, CupSize, DayRecord, StatsSummary, TeaPreferences } from '../types';
import { DEFAULT_PREFERENCES, STORAGE_KEYS, TEA_VARIETIES } from './constants';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateToKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function formatFriendlyDate(dateKey: string): string {
  const today = getTodayDateString();
  if (dateKey === today) return 'Today';

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateToKey(yesterday);
  if (dateKey === yesterdayKey) return 'Yesterday';

  const date = parseDateKey(dateKey);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTimeOnly(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function triggerHaptic() {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate?.([30, 20, 30]);
    } catch {
      // Haptics not allowed or supported
    }
  }
}

// Local Storage Helper
function getStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading ${key} from local storage:`, err);
    return fallback;
  }
}

function setStoredJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to local storage:`, err);
  }
}

// Initial Sample Seeding so the user immediately sees everyday tracking history on day 1
function seedInitialDataIfEmpty(): Record<string, DayRecord> {
  const records: Record<string, DayRecord> = {};
  const today = new Date();

  // Create entries for yesterday and previous 3 days
  const sampleData = [
    {
      offset: 3,
      count: 3,
      types: [
        { type: 'Masala Chai', time: '08:15 AM', size: 'regular' as CupSize },
        { type: 'Green Tea', time: '01:30 PM', size: 'regular' as CupSize },
        { type: 'Ginger Chai', time: '05:45 PM', size: 'cutting' as CupSize },
      ],
    },
    {
      offset: 2,
      count: 4,
      types: [
        { type: 'Masala Chai', time: '07:45 AM', size: 'regular' as CupSize },
        { type: 'Regular Chai', time: '11:15 AM', size: 'cutting' as CupSize },
        { type: 'Green Tea', time: '03:10 PM', size: 'regular' as CupSize },
        { type: 'Masala Chai', time: '06:30 PM', size: 'regular' as CupSize },
      ],
    },
    {
      offset: 1,
      count: 3,
      types: [
        { type: 'Ginger Chai', time: '08:00 AM', size: 'regular' as CupSize },
        { type: 'Lemon Honey Tea', time: '02:00 PM', size: 'large' as CupSize },
        { type: 'Masala Chai', time: '05:20 PM', size: 'regular' as CupSize },
      ],
    },
    {
      offset: 0, // today
      count: 2,
      types: [
        { type: 'Masala Chai', time: '08:30 AM', size: 'regular' as CupSize },
        { type: 'Green Tea', time: '11:45 AM', size: 'regular' as CupSize },
      ],
    },
  ];

  sampleData.forEach((sample) => {
    const d = new Date(today);
    d.setDate(d.getDate() - sample.offset);
    const dateKey = formatDateToKey(d);

    const cups: CupEntry[] = sample.types.map((t, idx) => {
      const [timePart, meridiem] = t.time.split(' ');
      const [h, m] = timePart.split(':').map(Number);
      const cupTime = new Date(d);
      let hours = h;
      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
      cupTime.setHours(hours, m, 0, 0);

      return {
        id: `cup-${dateKey}-${idx}-${cupTime.getTime()}`,
        timestamp: cupTime.getTime(),
        type: t.type,
        size: t.size,
        note: idx === 0 ? 'Morning brew' : undefined,
      };
    });

    records[dateKey] = {
      date: dateKey,
      count: cups.length,
      cups,
    };
  });

  return records;
}

export function loadAllRecords(): Record<string, DayRecord> {
  const existing = getStoredJson<Record<string, DayRecord> | null>(STORAGE_KEYS.RECORDS, null);
  if (!existing || Object.keys(existing).length === 0) {
    const seeded = seedInitialDataIfEmpty();
    setStoredJson(STORAGE_KEYS.RECORDS, seeded);
    return seeded;
  }
  return existing;
}

export function saveAllRecords(records: Record<string, DayRecord>): void {
  setStoredJson(STORAGE_KEYS.RECORDS, records);
}

export function loadPreferences(): TeaPreferences {
  return getStoredJson<TeaPreferences>(STORAGE_KEYS.SETTINGS, DEFAULT_PREFERENCES);
}

export function savePreferences(preferences: TeaPreferences): void {
  setStoredJson(STORAGE_KEYS.SETTINGS, preferences);
}

export function getOrCreateDayRecord(records: Record<string, DayRecord>, dateKey: string): DayRecord {
  if (records[dateKey]) {
    return records[dateKey];
  }
  return {
    date: dateKey,
    count: 0,
    cups: [],
  };
}

export function addCupToRecord(
  records: Record<string, DayRecord>,
  dateKey: string,
  teaType: string,
  size: CupSize = 'regular',
  note?: string
): { updatedRecords: Record<string, DayRecord>; addedCup: CupEntry } {
  const current = getOrCreateDayRecord(records, dateKey);
  const newCup: CupEntry = {
    id: `cup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    type: teaType,
    size,
    note: note?.trim() || undefined,
  };

  const updatedCups = [...current.cups, newCup];
  const updatedDay: DayRecord = {
    ...current,
    count: updatedCups.length,
    cups: updatedCups,
  };

  const nextRecords = {
    ...records,
    [dateKey]: updatedDay,
  };

  saveAllRecords(nextRecords);
  return { updatedRecords: nextRecords, addedCup: newCup };
}

export function removeLastCupFromRecord(
  records: Record<string, DayRecord>,
  dateKey: string
): Record<string, DayRecord> {
  const current = getOrCreateDayRecord(records, dateKey);
  if (current.cups.length === 0 && current.count === 0) {
    return records;
  }

  const updatedCups = current.cups.slice(0, -1);
  const newCount = Math.max(0, current.count - 1);

  const updatedDay: DayRecord = {
    ...current,
    count: newCount,
    cups: updatedCups,
  };

  const nextRecords = {
    ...records,
    [dateKey]: updatedDay,
  };

  saveAllRecords(nextRecords);
  return nextRecords;
}

export function removeSpecificCup(
  records: Record<string, DayRecord>,
  dateKey: string,
  cupId: string
): Record<string, DayRecord> {
  const current = getOrCreateDayRecord(records, dateKey);
  const updatedCups = current.cups.filter((c) => c.id !== cupId);
  const newCount = updatedCups.length;

  const updatedDay: DayRecord = {
    ...current,
    count: newCount,
    cups: updatedCups,
  };

  const nextRecords = {
    ...records,
    [dateKey]: updatedDay,
  };

  saveAllRecords(nextRecords);
  return nextRecords;
}

export function updateDayTotalCount(
  records: Record<string, DayRecord>,
  dateKey: string,
  newCount: number
): Record<string, DayRecord> {
  const safeCount = Math.max(0, Math.floor(newCount));
  const current = getOrCreateDayRecord(records, dateKey);

  let updatedCups = [...current.cups];
  if (safeCount < updatedCups.length) {
    updatedCups = updatedCups.slice(0, safeCount);
  } else if (safeCount > updatedCups.length) {
    const diff = safeCount - updatedCups.length;
    for (let i = 0; i < diff; i++) {
      updatedCups.push({
        id: `cup_${Date.now()}_manual_${i}`,
        timestamp: Date.now() - (diff - i) * 60000,
        type: 'Masala Chai',
        size: 'regular',
      });
    }
  }

  const updatedDay: DayRecord = {
    ...current,
    count: safeCount,
    cups: updatedCups,
  };

  const nextRecords = {
    ...records,
    [dateKey]: updatedDay,
  };

  saveAllRecords(nextRecords);
  return nextRecords;
}

export function clearDayRecord(
  records: Record<string, DayRecord>,
  dateKey: string
): Record<string, DayRecord> {
  const updatedDay: DayRecord = {
    date: dateKey,
    count: 0,
    cups: [],
  };

  const nextRecords = {
    ...records,
    [dateKey]: updatedDay,
  };

  saveAllRecords(nextRecords);
  return nextRecords;
}

export function calculateStats(records: Record<string, DayRecord>): StatsSummary {
  const todayKey = getTodayDateString();
  const todayRecord = records[todayKey] || { count: 0, cups: [] };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateToKey(yesterday);
  const yesterdayRecord = records[yesterdayKey] || { count: 0, cups: [] };

  // Last 7 days
  let weeklyTotal = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = formatDateToKey(d);
    weeklyTotal += records[k]?.count || 0;
  }
  const weeklyAverage = Math.round((weeklyTotal / 7) * 10) / 10;

  // Streak: count consecutive past days with count > 0 starting from today (or yesterday if today is 0 so far)
  let streak = 0;
  let checkDate = new Date();
  const todayHasCups = todayRecord.count > 0;
  if (!todayHasCups) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const k = formatDateToKey(checkDate);
    const count = records[k]?.count || 0;
    if (count > 0) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
    if (streak > 365) break; // safety guard
  }

  // All time total & best day & top tea type
  let allTimeTotal = 0;
  let bestDay: { date: string; count: number } | null = null;
  const typeCounts: Record<string, number> = {};

  (Object.values(records) as DayRecord[]).forEach((r) => {
    allTimeTotal += r.count;
    if (!bestDay || r.count > bestDay.count) {
      if (r.count > 0) {
        bestDay = { date: r.date, count: r.count };
      }
    }
    r.cups.forEach((c) => {
      typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
    });
  });

  let topTeaType = 'Masala Chai';
  let maxTypeCount = 0;
  Object.entries(typeCounts).forEach(([t, cnt]) => {
    if (cnt > maxTypeCount) {
      maxTypeCount = cnt;
      topTeaType = t;
    }
  });

  return {
    todayCount: todayRecord.count,
    yesterdayCount: yesterdayRecord.count,
    weeklyTotal,
    weeklyAverage,
    currentStreak: streak,
    allTimeTotal,
    topTeaType,
    bestDay,
  };
}

export function exportLocalDataJson(records: Record<string, DayRecord>, preferences: TeaPreferences): string {
  const payload = {
    exportedAt: new Date().toISOString(),
    formatVersion: 'tea_counter_v1',
    storageEngine: 'local_device_storage',
    preferences,
    records,
  };
  return JSON.stringify(payload, null, 2);
}

export function importLocalDataJson(
  rawJson: string
): { success: boolean; records?: Record<string, DayRecord>; preferences?: TeaPreferences; error?: string } {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON file format.' };
    }
    if (!parsed.records || typeof parsed.records !== 'object') {
      return { success: false, error: 'File missing tea records.' };
    }

    const records = parsed.records as Record<string, DayRecord>;
    const preferences = parsed.preferences || DEFAULT_PREFERENCES;

    saveAllRecords(records);
    savePreferences(preferences);

    return { success: true, records, preferences };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to parse JSON backup.' };
  }
}

export function clearAllLocalData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  } catch (err) {
    console.error('Error clearing local storage:', err);
  }
}
