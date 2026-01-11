import { create } from 'zustand';
import { Station } from './types';
import { getPortalData, setPortalData } from '@/lib/storage';

interface RadioStore {
    currentStationId: string;
    volume: number;
    hydrated: boolean;
    setHydrated: () => void;
    setStation: (id: string) => void;
    setVolume: (volume: number) => void;
}

const saveRadioState = (stationId: string, volume: number) => {
    setPortalData('radio', { lastStationId: stationId, volume });
};

export const useRadioStore = create<RadioStore>((set, get) => ({
    currentStationId: 'lofi',
    volume: 1,
    hydrated: false,

    setHydrated: () => {
        const stored = getPortalData<{ lastStationId: string; volume: number }>('radio');
        if (stored) {
            set({
                currentStationId: stored.lastStationId || 'lofi',
                volume: stored.volume ?? 1,
                hydrated: true
            });
        } else {
            set({ hydrated: true });
        }
    },

    setStation: (id) => {
        set({ currentStationId: id });
        saveRadioState(id, get().volume);
    },

    setVolume: (volume) => {
        set({ volume });
        saveRadioState(get().currentStationId, volume);
    }
}));
