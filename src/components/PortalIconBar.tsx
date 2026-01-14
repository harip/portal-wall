'use client';

import React from 'react';
import { usePortalStore } from '@/lib/stores/portalStore';
import { PortalType } from '@/types/portal';
import { motion } from 'framer-motion';

interface PortalIcon {
  type: PortalType;
  icon: string;
  label: string;
  gradient: string;
}

const portalIcons: PortalIcon[] = [
  {
    type: 'weather',
    icon: '🌤️',
    label: 'Weather',
    gradient: 'from-blue-400 to-cyan-400',
  },
  {
    type: 'clock',
    icon: '🕐',
    label: 'Clock',
    gradient: 'from-purple-400 to-pink-400',
  },
  {
    type: 'calendar',
    icon: '📅',
    label: 'Calendar',
    gradient: 'from-green-400 to-emerald-400',
  },
  {
    type: 'countdown',
    icon: '⏱️',
    label: 'Countdown',
    gradient: 'from-orange-400 to-red-400',
  },
  {
    type: 'quicksave',
    icon: '📌',
    label: 'Quick Save',
    gradient: 'from-indigo-400 to-purple-400',
  },
  {
    type: 'unitconverter',
    icon: '📏',
    label: 'Unit Converter',
    gradient: 'from-teal-400 to-cyan-400',
  },
  {
    type: 'passwordgen',
    icon: '🔐',
    label: 'Password Generator',
    gradient: 'from-amber-400 to-orange-400',
  },
  {
    type: 'news',
    icon: '📰',
    label: 'News Feed',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    type: 'radio',
    icon: '📻',
    label: 'Radio',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    type: 'crypto',
    icon: '📈',
    label: 'Crypto',
    gradient: 'from-emerald-400 to-green-600',
  },
  {
    type: 'ai',
    icon: '🤖',
    label: 'AI Tech',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    type: 'voice',
    icon: '🎙️',
    label: 'Voice Memo',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    type: 'settings',
    icon: '⚙️',
    label: 'Settings',
    gradient: 'from-gray-400 to-slate-600',
  },
];

export default function PortalIconBar() {
  const { portals, bringToFront, openPortal, setPeekingPortalType } = usePortalStore();

  const handleIconClick = (portalIcon: PortalIcon) => {
    const existingPortal = portals.find((p) => p.type === portalIcon.type);

    if (existingPortal) {
      bringToFront(portalIcon.type);
    } else {
      openPortal(portalIcon.type, portalIcon.label);
    }

    setPeekingPortalType(null); // Clear peek on click
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPortalOpen = (type: PortalType) => {
    return portals.some((p) => p.type === type);
  };

  const isPortalOnTop = (type: PortalType) => {
    const portalIndex = portals.findIndex((p) => p.type === type);
    return portalIndex === 0;
  };

  return (
    <div className="relative w-screen max-w-full">
      <div
        className="relative overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <div className="flex items-center gap-2 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory py-2 px-6 sm:px-0 sm:justify-center">
          {portalIcons.map((portalIcon) => {
            const isOpen = isPortalOpen(portalIcon.type);
            const isTop = isPortalOnTop(portalIcon.type);

            return (
              <motion.button
                key={portalIcon.type}
                onClick={() => handleIconClick(portalIcon)}
                onMouseEnter={() => setPeekingPortalType(portalIcon.type)}
                onMouseLeave={() => setPeekingPortalType(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`
                  relative flex-shrink-0 flex items-center justify-center rounded-full
                  transition-all duration-300 snap-center
                  ${isOpen && isTop
                    ? 'shadow-xl shadow-[var(--accent-glow)]'
                    : isOpen
                      ? 'shadow-md shadow-[var(--accent-glow)]'
                      : 'shadow-sm hover:shadow-md hover:shadow-[var(--accent-glow)]'
                  }
                `}
                aria-label={`${isOpen ? 'Focus' : 'Open'} ${portalIcon.label}`}
              >
                <div className={`
                  text-2xl w-10 h-10 flex items-center justify-center rounded-full
                  bg-gradient-to-br ${portalIcon.gradient}
                `}>
                  {portalIcon.icon}
                </div>

                {isOpen && isTop && (
                  <motion.div
                    layoutId="active-portal"
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full shadow-md shadow-[var(--accent-glow)]"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
