'use client';

import { useEffect } from 'react';

const THEMES = [
    { hour: 6, primary: '#f59e0b', name: 'sunrise' }, // Amber
    { hour: 10, primary: '#0ea5e9', name: 'day' },     // Sky
    { hour: 18, primary: '#f43f5e', name: 'sunset' },  // Rose
    { hour: 21, primary: '#8b5cf6', name: 'night' },   // Violet
];

export default function ThemeWatcher() {
    useEffect(() => {
        const updateTheme = () => {
            const hour = new Date().getHours();
            // Find the theme for the current hour
            const theme = THEMES.slice().reverse().find(t => hour >= t.hour) || THEMES[THEMES.length - 1];

            document.documentElement.style.setProperty('--accent-primary', theme.primary);
            document.documentElement.style.setProperty('--accent-glow', `${theme.primary}40`); // 25% opacity
        };

        updateTheme();
        const interval = setInterval(updateTheme, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return null;
}
