'use client';

import React from 'react';
import { usePortalStore } from '@/lib/stores/portalStore';
import { motion } from 'framer-motion';

export default function Taskbar() {
  const { portals, toggleMinimize, focusPortal } = usePortalStore();

  const minimizedPortals = portals.filter((p) => p.minimized);

  if (minimizedPortals.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl px-4 py-3">
        <div className="flex items-center gap-3">
          {minimizedPortals.map((portal) => (
            <button
              key={portal.id}
              onClick={() => {
                toggleMinimize(portal.id);
                focusPortal(portal.id);
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm text-white/90 font-medium"
            >
              {portal.title}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
