import { create } from 'zustand';
import { PortalState, PortalType } from '@/types/portal';

interface PortalStore {
  portals: PortalState[];
  maxZIndex: number;
  openPortal: (type: PortalType, title: string) => void;
  closePortal: (id: string) => void;
  focusPortal: (id: string) => void;
  updatePortalPosition: (id: string, position: { x: number; y: number }) => void;
  updatePortalSize: (id: string, size: { width: number; height: number }) => void;
  toggleMinimize: (id: string) => void;
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
  portals: loadPortalsFromStorage(),
  maxZIndex: 1,

  openPortal: (type: PortalType, title: string) => {
    const existingPortal = get().portals.find((p) => p.type === type);
    
    if (existingPortal) {
      // If portal exists, just focus it
      get().focusPortal(existingPortal.id);
      if (existingPortal.minimized) {
        get().toggleMinimize(existingPortal.id);
      }
      return;
    }

    const newZIndex = get().maxZIndex + 1;
    const newPortal: PortalState = {
      id: `${type}-${Date.now()}`,
      type,
      title,
      position: { 
        x: 100 + get().portals.length * 30, 
        y: 100 + get().portals.length * 30 
      },
      size: getDefaultSize(type),
      zIndex: newZIndex,
      minimized: false,
      isOpen: true,
    };

    const newPortals = [...get().portals, newPortal];
    set({ portals: newPortals, maxZIndex: newZIndex });
    savePortalsToStorage(newPortals);
  },

  closePortal: (id: string) => {
    const newPortals = get().portals.filter((p) => p.id !== id);
    set({ portals: newPortals });
    savePortalsToStorage(newPortals);
  },

  focusPortal: (id: string) => {
    const newZIndex = get().maxZIndex + 1;
    const newPortals = get().portals.map((p) =>
      p.id === id ? { ...p, zIndex: newZIndex } : p
    );
    set({ portals: newPortals, maxZIndex: newZIndex });
    savePortalsToStorage(newPortals);
  },

  updatePortalPosition: (id: string, position: { x: number; y: number }) => {
    const newPortals = get().portals.map((p) =>
      p.id === id ? { ...p, position } : p
    );
    set({ portals: newPortals });
    savePortalsToStorage(newPortals);
  },

  updatePortalSize: (id: string, size: { width: number; height: number }) => {
    const newPortals = get().portals.map((p) =>
      p.id === id ? { ...p, size } : p
    );
    set({ portals: newPortals });
    savePortalsToStorage(newPortals);
  },

  toggleMinimize: (id: string) => {
    const newPortals = get().portals.map((p) =>
      p.id === id ? { ...p, minimized: !p.minimized } : p
    );
    set({ portals: newPortals });
    savePortalsToStorage(newPortals);
  },
}));

function getDefaultSize(type: PortalType): { width: number; height: number } {
  switch (type) {
    case 'weather':
      return { width: 400, height: 500 };
    case 'clock':
      return { width: 300, height: 200 };
    default:
      return { width: 400, height: 400 };
  }
}
