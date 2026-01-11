// Central storage key
const STORAGE_KEY = 'portal-wall';

// Storage structure interface
export interface PortalWallStorage {
  portals: {
    open: Array<{
      id: string;
      type: string;
      title: string;
    }>;
  };
  weather?: {
    locations: Array<{
      id: string;
      city: string;
      country: string;
      lat?: number;
      lon?: number;
    }>;
    activeLocationId: string;
    unit: 'F' | 'C';
  };
  clock?: {
    format: '12' | '24';
    showSeconds: boolean;
  };
  calendar?: {
    events: Array<{
      id: string;
      title: string;
      description?: string;
      date: string;
      time?: string;
      color: string;
      reminder?: boolean;
    }>;
  };
  countdown?: {
    countdowns: Array<{
      id: string;
      title: string;
      targetDate: string;
      targetTime?: string;
      color: string;
      category: string;
    }>;
  };
  quicksave?: {
    items: Array<{
      id: string;
      title: string;
      category: string;
      createdAt: number;
    }>;
  };
  unitconverter?: {
    conversions: Array<{
      id: string;
      fromValue: number;
      fromUnit: string;
      toValue: number;
      toUnit: string;
      unitType: string;
      createdAt: number;
    }>;
    favorites: string[];
  };
  news?: {
    readHistory: number[];
    bookmarks: number[];
  };
  radio?: {
    lastStationId: string;
    volume: number;
  };
  crypto?: {
    watchlist: string[];
  };
  // Future portals can add their own sections here
}

// Get all data
export function getStorage(): PortalWallStorage {
  if (typeof window === 'undefined') {
    return { portals: { open: [] } };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }

  return { portals: { open: [] } };
}

// Save all data
export function setStorage(data: PortalWallStorage): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

// Get specific portal data
export function getPortalData<T>(portalKey: keyof Omit<PortalWallStorage, 'portals'>): T | null {
  const storage = getStorage();
  return (storage[portalKey] as T) || null;
}

// Set specific portal data
export function setPortalData<T>(portalKey: keyof Omit<PortalWallStorage, 'portals'>, data: T): void {
  const storage = getStorage();
  storage[portalKey] = data as any;
  setStorage(storage);
}

// Clear all data (useful for reset)
export function clearStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Get storage size (for debugging/monitoring)
export function getStorageSize(): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? new Blob([stored]).size : 0;
}
