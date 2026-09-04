import { TeaPreferences, TeaVariety } from '../types';

export const TEA_VARIETIES: TeaVariety[] = [
  {
    name: 'Masala Chai',
    category: 'Spiced Milk Tea',
    color: 'bg-amber-100 text-amber-900 border-amber-300',
    iconColor: '#b45309',
    caffeineMgPerCup: 45,
  },
  {
    name: 'Regular Chai',
    category: 'Classic Milk Tea',
    color: 'bg-orange-100 text-orange-900 border-orange-300',
    iconColor: '#c2410c',
    caffeineMgPerCup: 40,
  },
  {
    name: 'Ginger Chai',
    category: 'Adrak Chai',
    color: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    iconColor: '#ca8a04',
    caffeineMgPerCup: 40,
  },
  {
    name: 'Green Tea',
    category: 'Herbal & Antioxidant',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    iconColor: '#047857',
    caffeineMgPerCup: 25,
  },
  {
    name: 'Black Tea',
    category: 'Pure Brew',
    color: 'bg-stone-200 text-stone-900 border-stone-400',
    iconColor: '#44403c',
    caffeineMgPerCup: 50,
  },
  {
    name: 'Lemon Honey Tea',
    category: 'Citrus & Soothing',
    color: 'bg-lime-100 text-lime-900 border-lime-300',
    iconColor: '#65a30d',
    caffeineMgPerCup: 15,
  },
  {
    name: 'Elaichi Chai',
    category: 'Cardamom Scented',
    color: 'bg-teal-100 text-teal-900 border-teal-300',
    iconColor: '#0f766e',
    caffeineMgPerCup: 40,
  },
  {
    name: 'Herbal / Chamomile',
    category: 'Caffeine Free',
    color: 'bg-rose-100 text-rose-900 border-rose-300',
    iconColor: '#be123c',
    caffeineMgPerCup: 0,
  },
];

export const DEFAULT_PREFERENCES: TeaPreferences = {
  dailyGoal: 4,
  vibrationEnabled: true,
  defaultTeaType: 'Masala Chai',
  defaultCupSize: 'regular',
  themeColor: 'amber',
};

export const STORAGE_KEYS = {
  RECORDS: 'tea_counter_daily_records_v1',
  SETTINGS: 'tea_counter_preferences_v1',
};
