import { create } from 'zustand';
import { QuickSaveItem } from './types';
import { getPortalData, setPortalData } from '@/lib/storage';

interface QuickSaveStore {
  items: QuickSaveItem[];
  hydrated: boolean;
  
  setHydrated: () => void;
  addItem: (item: Omit<QuickSaveItem, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, updates: Partial<Pick<QuickSaveItem, 'title' | 'category'>>) => void;
  deleteItem: (id: string) => void;
}

const saveItems = (items: QuickSaveItem[]) => {
  setPortalData('quicksave', { items });
};

export const useQuickSaveStore = create<QuickSaveStore>((set, get) => ({
  items: [],
  hydrated: false,

  setHydrated: () => {
    const stored = getPortalData<{ items: QuickSaveItem[] }>('quicksave');
    const items = stored?.items || [];
    
    set({
      items,
      hydrated: true,
    });
  },

  addItem: (itemData) => {
    const newItem: QuickSaveItem = {
      ...itemData,
      id: `quicksave-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    
    const items = [newItem, ...get().items]; // Add to beginning for newest first
    set({ items });
    saveItems(items);
  },

  updateItem: (id, updates) => {
    const items = get().items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    set({ items });
    saveItems(items);
  },

  deleteItem: (id) => {
    const items = get().items.filter(item => item.id !== id);
    set({ items });
    saveItems(items);
  },
}));
