import { create } from 'zustand';
import { Conversion } from './types';
import { getPortalData, setPortalData } from '@/lib/storage';

interface UnitConverterStore {
  conversions: Conversion[];
  favorites: string[]; // Array of unit keys (e.g., "length-meter-kilometer")
  hydrated: boolean;
  
  setHydrated: () => void;
  addConversion: (conversion: Omit<Conversion, 'id' | 'createdAt'>) => void;
  deleteConversion: (id: string) => void;
  clearHistory: () => void;
  toggleFavorite: (key: string) => void;
}

const saveData = (conversions: Conversion[], favorites: string[]) => {
  setPortalData('unitconverter', { conversions, favorites });
};

export const useUnitConverterStore = create<UnitConverterStore>((set, get) => ({
  conversions: [],
  favorites: [],
  hydrated: false,

  setHydrated: () => {
    const stored = getPortalData<{ conversions: Conversion[]; favorites: string[] }>('unitconverter');
    set({
      conversions: stored?.conversions || [],
      favorites: stored?.favorites || [],
      hydrated: true,
    });
  },

  addConversion: (conversionData) => {
    const newConversion: Conversion = {
      ...conversionData,
      id: `conversion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    
    const conversions = [newConversion, ...get().conversions].slice(0, 50); // Keep last 50
    set({ conversions });
    saveData(conversions, get().favorites);
  },

  deleteConversion: (id) => {
    const conversions = get().conversions.filter(c => c.id !== id);
    set({ conversions });
    saveData(conversions, get().favorites);
  },

  clearHistory: () => {
    set({ conversions: [] });
    saveData([], get().favorites);
  },

  toggleFavorite: (key) => {
    const favorites = get().favorites;
    const newFavorites = favorites.includes(key)
      ? favorites.filter(f => f !== key)
      : [...favorites, key];
    set({ favorites: newFavorites });
    saveData(get().conversions, newFavorites);
  },
}));
