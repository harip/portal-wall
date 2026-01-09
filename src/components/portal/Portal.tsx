'use client';

import React, { useState, useEffect } from 'react';
import { PortalState, PortalType } from '@/types/portal';
import { motion } from 'framer-motion';
import { PortalHeaderProvider, usePortalHeader } from './PortalHeaderContext';

interface PortalProps {
  portal: PortalState;
  children: React.ReactNode;
}

const portalHeaderIcons: Record<PortalType, string> = {
  weather: '🌤️',
  clock: '🕐',
  calendar: '📅',
  countdown: '⏱️',
  quicksave: '📌',
  unitconverter: '📏',
  passwordgen: '🔐',
};

function PortalHeader({ portal }: { portal: PortalState }) {
  const { headerRight } = usePortalHeader();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update date/time every second for countdown portal
  useEffect(() => {
    if (portal.type === 'countdown') {
      const interval = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [portal.type]);

  const formatDateTime = (date: Date) => {
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return `${dateStr} ${timeStr}`;
  };

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
      <div className="flex items-center gap-2">
        <span className="text-lg">{portalHeaderIcons[portal.type]}</span>
        <h2 className="text-sm font-medium text-white/90">{portal.title}</h2>
      </div>
      <div className="flex items-center gap-3">
        {headerRight}
        {portal.type === 'countdown' && (
          <div className="text-[10px] text-white/40 font-mono">
            {formatDateTime(currentDateTime)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Portal({ portal, children }: PortalProps) {
  return (
    <PortalHeaderProvider>
      <div
        className="h-full w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col"
      >
        {/* Card Header */}
        <PortalHeader portal={portal} />

        {/* Card Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </PortalHeaderProvider>
  );
}
