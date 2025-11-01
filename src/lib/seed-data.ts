import { subDays, startOfDay } from 'date-fns';

const today = startOfDay(new Date());

export const seedData = [
  // Last week's data
  { category: 'transport', mode: 'car', distance: 20, date: subDays(today, 8) },
  { category: 'energy', electricity: 15, naturalGas: 5, date: subDays(today, 8) },
  { category: 'diet', beef: 1, chicken: 2, vegetarian: 1, date: subDays(today, 9) },
  { category: 'transport', mode: 'bus', distance: 10, date: subDays(today, 10) },
  { category: 'diet', beef: 0, chicken: 3, vegetarian: 2, date: subDays(today, 11) },
  { category: 'transport', mode: 'train', distance: 50, date: subDays(today, 12) },
  { category: 'energy', electricity: 12, naturalGas: 0, date: subDays(today, 13) },

  // This week's data
  { category: 'diet', beef: 2, chicken: 1, vegetarian: 1, date: subDays(today, 1) },
  { category: 'transport', mode: 'car', distance: 15, date: subDays(today, 1) },
  { category: 'energy', electricity: 18, naturalGas: 6, date: subDays(today, 2) },
  { category: 'diet', beef: 0, chicken: 2, vegetarian: 3, date: subDays(today, 3) },
  { category: 'transport', mode: 'walk', distance: 3, date: subDays(today, 4) },
  { category: 'energy', electricity: 14, naturalGas: 4, date: subDays(today, 5) },
  { category: 'diet', beef: 1, chicken: 0, vegetarian: 4, date: subDays(today, 6) },
  { category: 'transport', mode: 'car', distance: 25, date: subDays(today, 0) }, // Today
];
