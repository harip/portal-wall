import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'auto' | 'noir' | 'fall' | 'winter' | 'summer';

interface ThemeStore {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            theme: 'auto',
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'portal-theme-storage',
        }
    )
);
