'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/lib/stores/themeStore';

const PARTICLE_COUNTS = {
    fall: 20,
    winter: 40,
    summer: 15,
    noir: 0,
    auto: 20
};

const Particle = ({ type }: { type: string }) => {
    const isSnow = type === 'winter';
    const isLeaf = type === 'fall' || type === 'auto';

    const initialX = Math.random() * 100;
    const duration = 5 + Math.random() * 10;
    const delay = Math.random() * 5;
    const size = isSnow ? 2 + Math.random() * 4 : 8 + Math.random() * 12;

    return (
        <motion.div
            initial={{ y: -20, x: `${initialX}vw`, opacity: 0, rotate: 0 }}
            animate={{
                y: '110vh',
                x: `${initialX + (Math.random() * 20 - 10)}vw`,
                opacity: [0, 0.8, 0.8, 0],
                rotate: 360
            }}
            transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "linear"
            }}
            className="fixed pointer-events-none z-0"
            style={{
                width: size,
                height: size,
                backgroundColor: isSnow ? 'white' : undefined,
                borderRadius: isSnow ? '50%' : '2px 10px',
                background: isLeaf ? (Math.random() > 0.5 ? '#d97706' : '#92400e') : undefined,
                filter: isSnow ? 'blur(1px)' : 'none',
                boxShadow: isSnow ? '0 0 5px white' : 'none'
            }}
        />
    );
};

export default function Atmosphere() {
    const { theme } = useThemeStore();

    const particles = useMemo(() => {
        const count = PARTICLE_COUNTS[theme as keyof typeof PARTICLE_COUNTS] || 0;
        return Array.from({ length: count }).map((_, i) => (
            <Particle key={`${theme}-${i}`} type={theme} />
        ));
    }, [theme]);

    const getBackgroundUrl = () => {
        if (theme === 'auto') return '/backgrounds/fall.png'; // Mocking auto as fall for now
        return `/backgrounds/${theme}.png`;
    };

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <AnimatePresence mode="wait">
                <motion.div
                    key={theme}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Main Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] scale-105"
                        style={{ backgroundImage: `url(${getBackgroundUrl()})` }}
                    />

                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                    {/* Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                </motion.div>
            </AnimatePresence>

            {/* Particle Effects Layer */}
            <div className="relative z-10 w-full h-full">
                {particles}
            </div>
        </div>
    );
}
