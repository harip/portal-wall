export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time?: string; // HH:MM format
  color: EventColor;
  reminder?: boolean;
}

export type EventColor = 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'red' | 'yellow';

export interface DayInfo {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export const EVENT_COLORS: { value: EventColor; label: string; bg: string; text: string }[] = [
  { value: 'blue', label: 'Blue', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  { value: 'green', label: 'Green', bg: 'bg-green-500/20', text: 'text-green-400' },
  { value: 'purple', label: 'Purple', bg: 'bg-purple-500/20', text: 'text-purple-400' },
  { value: 'pink', label: 'Pink', bg: 'bg-pink-500/20', text: 'text-pink-400' },
  { value: 'orange', label: 'Orange', bg: 'bg-orange-500/20', text: 'text-orange-400' },
  { value: 'red', label: 'Red', bg: 'bg-red-500/20', text: 'text-red-400' },
  { value: 'yellow', label: 'Yellow', bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
];
