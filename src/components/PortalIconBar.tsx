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
];

export default function PortalIconBar() {
  const { portals, bringToFront, openPortal } = usePortalStore();

  const handleIconClick = (portalIcon: PortalIcon) => {
    const existingPortal = portals.find((p) => p.type === portalIcon.type);

    if (existingPortal) {
      // Portal exists, bring it to front
      bringToFront(portalIcon.type);
    } else {
      // Portal doesn't exist, open it
      openPortal(portalIcon.type, portalIcon.label);
    }

    // Scroll to top for better UX on mobile
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
    <div className="flex justify-center gap-3">
      {portalIcons.map((portalIcon) => {
        const isOpen = isPortalOpen(portalIcon.type);
        const isTop = isPortalOnTop(portalIcon.type);

        return (
          <motion.button
            key={portalIcon.type}
            onClick={() => handleIconClick(portalIcon)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={`
              relative flex items-center justify-center rounded-full
              transition-all duration-300
              ${isOpen && isTop
                ? 'shadow-2xl shadow-purple-500/50'
                : isOpen
                  ? 'shadow-lg shadow-purple-500/30'
                  : 'shadow-md hover:shadow-lg hover:shadow-purple-500/20'
              }
            `}
            aria-label={`${isOpen ? 'Focus' : 'Open'} ${portalIcon.label}`}
          >
            {/* Icon */}
            <div className={`
              text-3xl w-12 h-12 flex items-center justify-center rounded-full
              bg-gradient-to-br ${portalIcon.gradient}
            `}>
              {portalIcon.icon}
            </div>

            {/* Active indicator dot */}
            {isOpen && isTop && (
              <motion.div
                layoutId="active-portal"
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg shadow-green-500/50"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
