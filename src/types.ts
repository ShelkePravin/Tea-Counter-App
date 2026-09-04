export type CupSize = 'cutting' | 'regular' | 'large';

export interface CupEntry {
  id: string;
  timestamp: number;
  type: string;
  size: CupSize;
  note?: string;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  count: number;
  cups: CupEntry[];
  note?: string;
}

export interface TeaPreferences {
  dailyGoal: number; // default e.g. 4 cups
  vibrationEnabled: boolean;
  defaultTeaType: string;
  defaultCupSize: CupSize;
  themeColor: 'amber' | 'matcha' | 'terracotta' | 'slate';
}

export interface StatsSummary {
  todayCount: number;
  yesterdayCount: number;
  weeklyTotal: number;
  weeklyAverage: number;
  currentStreak: number;
  allTimeTotal: number;
  topTeaType: string;
  bestDay: {
    date: string;
    count: number;
  } | null;
}

export interface TeaVariety {
  name: string;
  category: string;
  color: string;
  iconColor: string;
  caffeineMgPerCup: number;
}
