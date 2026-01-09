import { create } from 'zustand';
import { PortalState, PortalType } from '@/types/portal';

interface PortalStore {
  portals: PortalState[];
  openPortal: (type: PortalType, title: string) => void;
  hydrated: boolean;
  setHydrated: () => void;
}

const STORAGE_KEY = 'portal-wall-portals';

const loadPortalsFromStorage = (): PortalState[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

const savePortalsToStorage = (portals: PortalState[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(portals));
};

export const usePortalStore = create<PortalStore>((set, get) => ({
  portals: [],
  hydrated: false,

  setHydrated: () => {
    set({ portals: loadPortalsFromStorage(), hydrated: true });
  },

  openPortal: (type: PortalType, title: string) => {
    const existingPortal = get().portals.find((p) => p.type === type);
    
    if (existingPortal) {
      return; // Portal already exists
    }

    const newPortal: PortalState = {
      id: `${type}-${Date.now()}`,
      type,
      title,
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 },
      zIndex: 1,
      minimized: false,
      isOpen: true,
    };

    const newPortals = [...get().portals, newPortal];
    set({ portals: newPortals });
    savePortalsToStorage(newPortals);
  },
}));
