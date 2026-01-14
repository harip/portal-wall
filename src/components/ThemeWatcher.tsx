'use client';

import { useEffect } from 'react';
import { useThemeStore, ThemeType } from '@/lib/stores/themeStore';

const SEASONAL_CONFIG = {
    noir: { primary: '#ffffff', glow: 'rgba(255, 255, 255, 0.2)' },
    fall: { primary: '#d97706', glow: 'rgba(217, 119, 6, 0.3)' },
    summer: { primary: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)' },
    winter: { primary: '#38bdf8', glow: 'rgba(56, 189, 248, 0.3)' },
};

export default function ThemeWatcher() {
    const { theme } = useThemeStore();

    useEffect(() => {
        const applyTheme = () => {
            if (theme !== 'auto') {
                document.documentElement.setAttribute('data-theme', theme);
                const config = SEASONAL_CONFIG[theme as keyof typeof SEASONAL_CONFIG];
                if (config) {
                    document.documentElement.style.setProperty('--accent-primary', config.primary);
                    document.documentElement.style.setProperty('--accent-glow', config.glow);
                }
            } else {
                const date = new Date();
                const month = date.getMonth();
                const hour = date.getHours();

                let currentSeasonalTheme: ThemeType = 'winter';
                if (month >= 2 && month <= 8) currentSeasonalTheme = 'summer'; // Combined Spring/Summer
                else if (month >= 9 && month <= 10) currentSeasonalTheme = 'fall';
                else currentSeasonalTheme = 'winter';

                document.documentElement.setAttribute('data-theme', currentSeasonalTheme);

                let baseColor = '#38bdf8'; // Winter
                if (currentSeasonalTheme === 'summer') baseColor = '#fbbf24';
                if (currentSeasonalTheme === 'fall') baseColor = '#d97706';

                // Night Override
                if (hour >= 20 || hour < 6) baseColor = '#8b5cf6';

                document.documentElement.style.setProperty('--accent-primary', baseColor);
                document.documentElement.style.setProperty('--accent-glow', `${baseColor}40`);
            }
        };

        applyTheme();
        const interval = setInterval(applyTheme, 60000);
        return () => clearInterval(interval);
    }, [theme]);

    return null;
}
