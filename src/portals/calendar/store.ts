import { create } from 'zustand';
import { CalendarEvent } from './types';
import { getPortalData, setPortalData } from '@/lib/storage';

interface CalendarStore {
  events: CalendarEvent[];
  selectedDate: Date;
  currentMonth: number;
  currentYear: number;
  hydrated: boolean;
  
  setHydrated: () => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setSelectedDate: (date: Date) => void;
  goToToday: () => void;
  nextMonth: () => void;
  prevMonth: () => void;
  setMonth: (month: number, year: number) => void;
}

const saveEvents = (events: CalendarEvent[]) => {
  setPortalData('calendar', { events });
};

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [],
  selectedDate: new Date(),
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  hydrated: false,

  setHydrated: () => {
    const stored = getPortalData<{ events: CalendarEvent[] }>('calendar');
    const events = stored?.events || [];
    
    const today = new Date();
    set({
      events,
      selectedDate: today,
      currentMonth: today.getMonth(),
      currentYear: today.getFullYear(),
      hydrated: true,
    });
  },

  addEvent: (eventData) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const events = [...get().events, newEvent];
    set({ events });
    saveEvents(events);
  },

  updateEvent: (id, updates) => {
    const events = get().events.map(event =>
      event.id === id ? { ...event, ...updates } : event
    );
    set({ events });
    saveEvents(events);
  },

  deleteEvent: (id) => {
    const events = get().events.filter(event => event.id !== id);
    set({ events });
    saveEvents(events);
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  goToToday: () => {
    const today = new Date();
    set({
      selectedDate: today,
      currentMonth: today.getMonth(),
      currentYear: today.getFullYear(),
    });
  },

  nextMonth: () => {
    const { currentMonth, currentYear } = get();
    if (currentMonth === 11) {
      set({ currentMonth: 0, currentYear: currentYear + 1 });
    } else {
      set({ currentMonth: currentMonth + 1 });
    }
  },

  prevMonth: () => {
    const { currentMonth, currentYear } = get();
    if (currentMonth === 0) {
      set({ currentMonth: 11, currentYear: currentYear - 1 });
    } else {
      set({ currentMonth: currentMonth - 1 });
    }
  },

  setMonth: (month, year) => {
    set({ currentMonth: month, currentYear: year });
  },
}));
