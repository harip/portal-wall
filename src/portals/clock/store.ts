import { create } from 'zustand';
import { ClockLocation, Reminder } from './types';
import { getPortalData, setPortalData } from '@/lib/storage';

interface ClockStore {
  locations: ClockLocation[];
  activeLocationId: string;
  reminders: Reminder[];
  hydrated: boolean;
  
  setHydrated: () => void;
  addLocation: (location: ClockLocation) => void;
  removeLocation: (id: string) => void;
  setActiveLocation: (id: string) => void;
  addReminder: (reminder: Reminder) => void;
  removeReminder: (id: string) => void;
  markReminderNotified: (id: string) => void;
}

// Get current timezone info
const getCurrentTimezone = (): ClockLocation => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offset = -new Date().getTimezoneOffset();
  
  return {
    id: '1',
    city: 'Local Time',
    country: tz.split('/')[1]?.replace('_', ' ') || tz,
    timezone: tz,
    offset,
  };
};

const saveClockSettings = (locations: ClockLocation[], activeId: string, reminders: Reminder[]) => {
  setPortalData('clock', {
    locations,
    activeLocationId: activeId,
    reminders,
  });
};

export const useClockStore = create<ClockStore>((set, get) => ({
  locations: [getCurrentTimezone()],
  activeLocationId: '1',
  reminders: [],
  hydrated: false,

  setHydrated: () => {
    const stored = getPortalData<{
      locations: ClockLocation[];
      activeLocationId: string;
      reminders: Reminder[];
    }>('clock');

    if (stored && stored.locations && stored.locations.length > 0) {
      set({
        locations: stored.locations,
        activeLocationId: stored.activeLocationId,
        reminders: stored.reminders || [],
        hydrated: true,
      });
    } else {
      // First time - use current timezone
      const defaultLocation = getCurrentTimezone();
      set({
        locations: [defaultLocation],
        activeLocationId: '1',
        reminders: [],
        hydrated: true,
      });
      saveClockSettings([defaultLocation], '1', []);
    }
  },

  addLocation: (location) => {
    const newLocations = [...get().locations, location];
    set({ locations: newLocations });
    saveClockSettings(newLocations, get().activeLocationId, get().reminders);
  },

  removeLocation: (id) => {
    const newLocations = get().locations.filter(l => l.id !== id);
    let newActiveId = get().activeLocationId;
    
    if (id === newActiveId && newLocations.length > 0) {
      newActiveId = newLocations[0].id;
    }
    
    set({ 
      locations: newLocations,
      activeLocationId: newActiveId,
    });
    saveClockSettings(newLocations, newActiveId, get().reminders);
  },

  setActiveLocation: (id) => {
    set({ activeLocationId: id });
    saveClockSettings(get().locations, id, get().reminders);
  },

  addReminder: (reminder) => {
    const newReminders = [...get().reminders, reminder];
    set({ reminders: newReminders });
    saveClockSettings(get().locations, get().activeLocationId, newReminders);
  },

  removeReminder: (id) => {
    const newReminders = get().reminders.filter(r => r.id !== id);
    set({ reminders: newReminders });
    saveClockSettings(get().locations, get().activeLocationId, newReminders);
  },

  markReminderNotified: (id) => {
    const newReminders = get().reminders.map(r =>
      r.id === id ? { ...r, notified: true } : r
    );
    set({ reminders: newReminders });
    saveClockSettings(get().locations, get().activeLocationId, newReminders);
  },
}));
