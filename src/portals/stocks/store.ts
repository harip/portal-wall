import { create } from 'zustand';
import { getPortalData, setPortalData } from '@/lib/storage';

interface StocksStore {
    watchlist: string[];
    hydrated: boolean;
    setHydrated: () => void;
    addToWatchlist: (id: string) => void;
    removeFromWatchlist: (id: string) => void;
    resetWatchlist: () => void;
}

const DEFAULT_WATCHLIST = ['bitcoin', 'ethereum', 'solana'];

const saveStocksState = (watchlist: string[]) => {
    setPortalData('stocks', { watchlist });
};

export const useStocksStore = create<StocksStore>((set, get) => ({
    watchlist: DEFAULT_WATCHLIST,
    hydrated: false,

    setHydrated: () => {
        const stored = getPortalData<{ watchlist: string[] }>('stocks');
        set({
            watchlist: stored?.watchlist || DEFAULT_WATCHLIST,
            hydrated: true,
        });
    },

    addToWatchlist: (id) => {
        const watchlist = [...get().watchlist, id];
        set({ watchlist });
        saveStocksState(watchlist);
    },

    removeFromWatchlist: (id) => {
        const watchlist = get().watchlist.filter(item => item !== id);
        set({ watchlist });
        saveStocksState(watchlist);
    },

    resetWatchlist: () => {
        set({ watchlist: DEFAULT_WATCHLIST });
        saveStocksState(DEFAULT_WATCHLIST);
    }
}));
