'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PortalState, PortalType } from '@/types/portal';
import { motion } from 'framer-motion';
import { PortalHeaderProvider, usePortalHeader } from './PortalHeaderContext';
import { usePortalStore } from '@/lib/stores/portalStore';

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
  news: '📰',
  radio: '📻',
  crypto: '📈',
  ai: '🤖',
  voice: '🎙️',
  settings: '⚙️',
};

function PortalHeader({ portal }: { portal: PortalState }) {
  const { headerRight } = usePortalHeader();
  const { closePortal } = usePortalStore();
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
        <button
          onClick={() => closePortal(portal.type)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          aria-label="Close portal"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

import { useMotionValue, useTransform } from 'framer-motion';

export default function Portal({ portal, children }: PortalProps) {
  const { peekingPortalType } = usePortalStore();
  const isPeeking = peekingPortalType === portal.type;

  // 3D Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [0, 400], [5, -5]);
  const rotateY = useTransform(x, [0, 600], [-5, 5]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  function handleMouseLeave() {
    x.set(300); // Reset to center
    y.set(300);
  }

  return (
    <PortalHeaderProvider>
      <motion.div
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`
          h-full w-full bg-[var(--portal-bg)] backdrop-blur-xl rounded-2xl flex flex-col
          transition-all duration-500 relative
          ${isPeeking
            ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-glow)] shadow-[0_0_30px_var(--accent-glow)] scale-[1.02]'
            : 'border-[var(--portal-border)] shadow-2xl'
          }
        `}
      >
        {/* Glow inner layer */}
        {isPeeking && (
          <div className="absolute inset-0 rounded-2xl bg-[var(--accent-glow)] animate-pulse pointer-events-none" />
        )}

        {/* Card Header */}
        <PortalHeader portal={portal} />

        {/* Card Content */}
        <div className="flex-1 overflow-auto relative z-10">
          {children}
        </div>
      </motion.div>
    </PortalHeaderProvider>
  );
}
