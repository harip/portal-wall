'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
    userName?: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="relative z-20 pt-12 pb-6 px-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-col items-center sm:items-start transition-all">
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-white">
                        {getGreeting()}{userName ? <>, <span className="font-bold">{userName}</span></> : ''}
                    </h1>

                    {/* Subtle Activity Pulse */}
                    <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full h-fit self-center"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">Live</span>
                    </motion.div>
                </div>

                <div className="flex items-center gap-3 mt-3">
                    <p className="text-slate-400 text-sm sm:text-lg font-medium opacity-80">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                    <p className="text-slate-500 text-sm sm:text-lg font-medium opacity-60">
                        Your system is active.
                    </p>
                </div>
            </div>
        </div>
    );
}
