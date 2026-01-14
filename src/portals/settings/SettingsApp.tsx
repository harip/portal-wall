'use client';

import React from 'react';
import { useThemeStore, ThemeType } from '@/lib/stores/themeStore';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Leaf, Snowflake, Settings as SettingsIcon } from 'lucide-react';

const THEME_OPTIONS: { type: ThemeType; icon: any; label: string; description: string; color: string }[] = [
    {
        type: 'auto',
        icon: Sparkles,
        label: 'Auto (Weather/Time)',
        description: 'Breathes with the world around you.',
        color: 'from-indigo-500 to-purple-500'
    },
    {
        type: 'noir',
        icon: Moon,
        label: 'Noir',
        description: 'Pure, stark monochrome. For the focused mind.',
        color: 'from-gray-700 to-black'
    },
    {
        type: 'summer',
        icon: Sun,
        label: 'Summer',
        description: 'Vibrant emeralds and golden glows.',
        color: 'from-emerald-600 to-teal-400'
    },
    {
        type: 'fall',
        icon: Leaf,
        label: 'Fall',
        description: 'Deep ambers and warm wooden tones.',
        color: 'from-orange-600 to-red-800'
    },
    {
        type: 'winter',
        icon: Snowflake,
        label: 'Winter',
        description: 'Icy blues and crisp morning frosting.',
        color: 'from-blue-400 to-slate-600'
    },
];

export default function SettingsApp() {
    const { theme, setTheme } = useThemeStore();

    return (
        <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-md">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
                <SettingsIcon className="text-white/60" size={24} />
                <div>
                    <h2 className="text-xl font-semibold text-white">Dashboard Settings</h2>
                    <p className="text-sm text-white/40">Customize your workspace visuals and behavior.</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <section className="space-y-6">
                    <div>
                        <h3 className="text-sm font-uppercase tracking-widest text-white/40 mb-4">THEME SELECTION</h3>

                        <div className="grid grid-cols-1 gap-3">
                            {THEME_OPTIONS.map((opt) => {
                                const Icon = opt.icon;
                                const isActive = theme === opt.type;

                                return (
                                    <button
                                        key={opt.type}
                                        onClick={() => setTheme(opt.type)}
                                        className={`
                      relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 group
                      ${isActive
                                                ? 'bg-white/10 border-[var(--accent-primary)] shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                            }
                    `}
                                    >
                                        <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${opt.color} shadow-lg
                      ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'} transition-transform
                    `}>
                                            <Icon size={24} className="text-white" />
                                        </div>

                                        <div className="text-left flex-1">
                                            <div className="font-medium text-white flex items-center gap-2">
                                                {opt.label}
                                                {isActive && (
                                                    <motion.span
                                                        layoutId="active-badge"
                                                        className="px-2 py-0.5 rounded-full bg-[var(--accent-primary)] text-[10px] text-white font-bold"
                                                    >
                                                        ACTIVE
                                                    </motion.span>
                                                )}
                                            </div>
                                            <p className="text-xs text-white/40 mt-0.5">{opt.description}</p>
                                        </div>

                                        {isActive && (
                                            <motion.div
                                                layoutId="active-ring"
                                                className="absolute inset-0 border-2 border-[var(--accent-primary)] rounded-2xl pointer-events-none"
                                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <h3 className="text-sm font-uppercase tracking-widest text-white/40 mb-2">ABOUT PORTAL WALL</h3>
                        <p className="text-xs text-white/30 leading-relaxed">
                            Designed as a personalized OS layer for the web. Built with low-latency state management and dynamic styling. Version 1.2.0
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
