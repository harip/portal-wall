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
  };

  const isPortalOpen = (type: PortalType) => {
    return portals.some((p) => p.type === type);
  };

  const isPortalOnTop = (type: PortalType) => {
    const portalIndex = portals.findIndex((p) => p.type === type);
    return portalIndex === 0;
  };

  return (
    <div className="flex justify-center gap-4 mt-6">
      {portalIcons.map((portalIcon) => {
        const isOpen = isPortalOpen(portalIcon.type);
        const isTop = isPortalOnTop(portalIcon.type);

        return (
          <motion.button
            key={portalIcon.type}
            onClick={() => handleIconClick(portalIcon)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative flex flex-col items-center gap-2 p-4 rounded-2xl
              backdrop-blur-xl border transition-all duration-300
              ${
                isOpen
                  ? isTop
                    ? 'bg-white/20 border-white/40 shadow-xl'
                    : 'bg-white/10 border-white/20 shadow-lg'
                  : 'bg-white/5 border-white/10 shadow-md hover:bg-white/10'
              }
            `}
            aria-label={`${isOpen ? 'Focus' : 'Open'} ${portalIcon.label}`}
          >
            {/* Icon */}
            <div className={`
              text-4xl w-16 h-16 flex items-center justify-center rounded-xl
              bg-gradient-to-br ${portalIcon.gradient}
              ${isOpen && isTop ? 'shadow-lg' : ''}
            `}>
              {portalIcon.icon}
            </div>

            {/* Label */}
            <span className="text-white/90 text-xs font-medium">
              {portalIcon.label}
            </span>

            {/* Active indicator */}
            {isOpen && isTop && (
              <motion.div
                layoutId="active-portal"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
