export interface Countdown {
  id: string;
  title: string;
  targetDate: string; // ISO date string
  targetTime?: string; // HH:MM format
  color: CountdownColor;
  category: CountdownCategory;
}

export type CountdownColor = 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'red' | 'yellow';
export type CountdownCategory = 'vacation' | 'deadline' | 'event' | 'birthday' | 'other';

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const COUNTDOWN_COLORS: { value: CountdownColor; label: string; bg: string; text: string }[] = [
  { value: 'blue', label: 'Blue', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  { value: 'green', label: 'Green', bg: 'bg-green-500/20', text: 'text-green-400' },
  { value: 'purple', label: 'Purple', bg: 'bg-purple-500/20', text: 'text-purple-400' },
  { value: 'pink', label: 'Pink', bg: 'bg-pink-500/20', text: 'text-pink-400' },
  { value: 'orange', label: 'Orange', bg: 'bg-orange-500/20', text: 'text-orange-400' },
  { value: 'red', label: 'Red', bg: 'bg-red-500/20', text: 'text-red-400' },
  { value: 'yellow', label: 'Yellow', bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
];

export const COUNTDOWN_CATEGORIES: { value: CountdownCategory; label: string; emoji: string }[] = [
  { value: 'vacation', label: 'Vacation', emoji: '✈️' },
  { value: 'deadline', label: 'Deadline', emoji: '⏰' },
  { value: 'event', label: 'Event', emoji: '🎉' },
  { value: 'birthday', label: 'Birthday', emoji: '🎂' },
  { value: 'other', label: 'Other', emoji: '📌' },
];
