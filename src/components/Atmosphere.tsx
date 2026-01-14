'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
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
        const t = theme === 'auto' ? 'fall' : theme;
        return `/backgrounds/${t}.jpg`;
    };

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <AnimatePresence mode="wait">
                <motion.div
                    key={theme}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Optimized Background Image using Next.js Image */}
                    <div className="absolute inset-0 transition-transform duration-[20s] scale-110">
                        <Image
                            src={getBackgroundUrl()}
                            alt={`${theme} background`}
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                            quality={75}
                        />
                    </div>

                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

                    {/* Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                </motion.div>
            </AnimatePresence>

            {/* Particle Effects Layer */}
            <div className="relative z-10 w-full h-full">
                {particles}
            </div>
        </div>
    );
}
