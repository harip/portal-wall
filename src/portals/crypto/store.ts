import { create } from 'zustand';
import { CryptoAsset, CryptoDetail, PricePoint, POPULAR_CRYPTOS } from './types';
import { getCryptoPrices, getCryptoDetails, getCryptoChart } from './api';
import { getPortalData, setPortalData } from '@/lib/storage';

interface CryptoStore {
  cryptos: CryptoAsset[];
  selectedCrypto: CryptoDetail | null;
  chartData: PricePoint[];
  watchlist: string[]; // crypto IDs
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  hydrated: boolean;
  
  setHydrated: () => void;
  fetchCryptoPrices: () => Promise<void>;
  fetchCryptoDetails: (cryptoId: string) => Promise<void>;
  addToWatchlist: (cryptoId: string) => void;
  removeFromWatchlist: (cryptoId: string) => void;
  refreshPrices: () => Promise<void>;
  clearSelectedCrypto: () => void;
}

const saveWatchlist = (watchlist: string[]) => {
  setPortalData('crypto', { watchlist });
};

export const useCryptoStore = create<CryptoStore>((set, get) => ({
  cryptos: [],
  selectedCrypto: null,
  chartData: [],
  watchlist: POPULAR_CRYPTOS.map(c => c.id), // Default watchlist
  loading: false,
  error: null,
  lastUpdated: null,
  hydrated: false,

  setHydrated: () => {
    // Load saved watchlist
    const stored = getPortalData<{ watchlist: string[] }>('crypto');
    const watchlist = stored?.watchlist || POPULAR_CRYPTOS.map(c => c.id);
    
    set({ watchlist, hydrated: true });
    get().fetchCryptoPrices();
  },
  
  fetchCryptoPrices: async () => {
    set({ loading: true, error: null });
    
    try {
      const watchlist = get().watchlist;
      const cryptos = await getCryptoPrices(watchlist);
      
      set({
        cryptos,
        loading: false,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      set({ 
        error: 'Failed to fetch crypto prices',
        loading: false 
      });
    }
  },

  fetchCryptoDetails: async (cryptoId: string) => {
    set({ loading: true, error: null });
    
    try {
      const [details, chartData] = await Promise.all([
        getCryptoDetails(cryptoId),
        getCryptoChart(cryptoId, 7),
      ]);
      
      set({
        selectedCrypto: details,
        chartData,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching crypto details:', error);
      set({ 
        error: 'Failed to fetch crypto details',
        loading: false 
      });
    }
  },

  addToWatchlist: (cryptoId: string) => {
    const watchlist = [...get().watchlist, cryptoId];
    set({ watchlist });
    saveWatchlist(watchlist);
    get().fetchCryptoPrices();
  },

  removeFromWatchlist: (cryptoId: string) => {
    const watchlist = get().watchlist.filter(id => id !== cryptoId);
    set({ watchlist });
    saveWatchlist(watchlist);
    get().fetchCryptoPrices();
  },

  refreshPrices: async () => {
    await get().fetchCryptoPrices();
  },

  clearSelectedCrypto: () => {
    set({ selectedCrypto: null, chartData: [] });
  },
}));
