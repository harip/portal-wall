'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';
import { usePortalStore } from '@/lib/stores/portalStore';

interface DashboardHeaderProps {
    userName?: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
    const { openPortal, bringToFront, portals } = usePortalStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleOpenSettings = () => {
        const isSettingsOpen = portals.some(p => p.type === 'settings');
        if (isSettingsOpen) {
            bringToFront('settings');
        } else {
            openPortal('settings', 'Settings');
        }
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="relative z-20 pt-6 sm:pt-12 pb-2 sm:pb-6 px-6 sm:px-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-row items-center justify-between w-full gap-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                    <h1 className="text-2xl sm:text-6xl font-light tracking-tight text-white text-left">
                        {getGreeting().split(' ')[1] === 'Morning' ? 'Morning' : getGreeting().split(' ')[1]} {userName ? <span className="font-bold">{userName}</span> : ''}
                    </h1>
                    <span className="text-slate-400 text-xs sm:text-lg font-medium opacity-80 mt-0.5 sm:mt-0">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Subtle Activity Pulse - Hidden on mobile to save space */}
                    <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full h-fit shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest text-center">Live</span>
                    </motion.div>

                    {/* Settings Gear Shortcut */}
                    <motion.button
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                        onClick={handleOpenSettings}
                        className="p-2 rounded-lg sm:p-2.5 sm:rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                        aria-label="Open Settings"
                    >
                        <SettingsIcon size={18} className="sm:w-5 sm:h-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
