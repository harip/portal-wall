import { create } from 'zustand';
import { Countdown } from './types';
import { getPortalData, setPortalData } from '@/lib/storage';

interface CountdownStore {
  countdowns: Countdown[];
  hydrated: boolean;
  
  setHydrated: () => void;
  addCountdown: (countdown: Omit<Countdown, 'id'>) => void;
  updateCountdown: (id: string, countdown: Partial<Countdown>) => void;
  deleteCountdown: (id: string) => void;
}

const saveCountdowns = (countdowns: Countdown[]) => {
  setPortalData('countdown', { countdowns });
};

export const useCountdownStore = create<CountdownStore>((set, get) => ({
  countdowns: [],
  hydrated: false,

  setHydrated: () => {
    const stored = getPortalData<{ countdowns: Countdown[] }>('countdown');
    const countdowns = stored?.countdowns || [];
    
    set({
      countdowns,
      hydrated: true,
    });
  },

  addCountdown: (countdownData) => {
    const newCountdown: Countdown = {
      ...countdownData,
      id: `countdown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const countdowns = [...get().countdowns, newCountdown];
    set({ countdowns });
    saveCountdowns(countdowns);
  },

  updateCountdown: (id, updates) => {
    const countdowns = get().countdowns.map(countdown =>
      countdown.id === id ? { ...countdown, ...updates } : countdown
    );
    set({ countdowns });
    saveCountdowns(countdowns);
  },

  deleteCountdown: (id) => {
    const countdowns = get().countdowns.filter(countdown => countdown.id !== id);
    set({ countdowns });
    saveCountdowns(countdowns);
  },
}));
