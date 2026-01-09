import { create } from 'zustand';
import { PortalState, PortalType } from '@/types/portal';
import { getStorage, setStorage } from '@/lib/storage';

interface PortalStore {
  portals: PortalState[];
  openPortal: (type: PortalType, title: string) => void;
  bringToFront: (type: PortalType) => void;
  closePortal: (type: PortalType) => void;
  hydrated: boolean;
  setHydrated: () => void;
}

const loadPortalsFromStorage = (): PortalState[] => {
  const storage = getStorage();
  return storage.portals.open.map((p, index) => ({
    id: p.id,
    type: p.type as PortalType,
    title: p.title,
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    zIndex: index + 1,
    minimized: false,
    isOpen: true,
  }));
};

const savePortalsToStorage = (portals: PortalState[]) => {
  const storage = getStorage();
  storage.portals = {
    open: portals.map(p => ({
      id: p.id,
      type: p.type,
      title: p.title,
    })),
  };
  setStorage(storage);
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

    // Add new portal at the beginning (top) of the array
    const newPortals = [newPortal, ...get().portals];
    set({ portals: newPortals });
    savePortalsToStorage(newPortals);
  },

  bringToFront: (type: PortalType) => {
    const portals = get().portals;
    const portalIndex = portals.findIndex((p) => p.type === type);
    
    if (portalIndex === -1 || portalIndex === 0) {
      return; // Portal doesn't exist or already at front
    }

    // Move the portal to the beginning of the array (front/top)
    const newPortals = [
      portals[portalIndex],
      ...portals.slice(0, portalIndex),
      ...portals.slice(portalIndex + 1),
    ];

    set({ portals: newPortals });
    savePortalsToStorage(newPortals);
  },

  closePortal: (type: PortalType) => {
    const portals = get().portals.filter((p) => p.type !== type);
    set({ portals });
    savePortalsToStorage(portals);
  },
}));
