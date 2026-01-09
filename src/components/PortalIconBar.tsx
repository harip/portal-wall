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
    <div className="flex justify-center gap-3 mt-6">
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
              ${
                isOpen && isTop
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
              ${isOpen && isTop ? 'ring-2 ring-white/40' : ''}
            `}>
              {portalIcon.icon}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
