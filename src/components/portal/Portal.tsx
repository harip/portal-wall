'use client';

import React from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus } from 'lucide-react';
import { PortalState } from '@/types/portal';
import { usePortalStore } from '@/lib/stores/portalStore';
import { motion, AnimatePresence } from 'framer-motion';

interface PortalProps {
  portal: PortalState;
  children: React.ReactNode;
}

export default function Portal({ portal, children }: PortalProps) {
  const { closePortal, focusPortal, updatePortalPosition, updatePortalSize, toggleMinimize } = usePortalStore();

  return (
    <AnimatePresence>
      {!portal.minimized && (
        <Rnd
          position={portal.position}
          size={portal.size}
          onDragStop={(e, d) => {
            updatePortalPosition(portal.id, { x: d.x, y: d.y });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            updatePortalSize(portal.id, {
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
            });
            updatePortalPosition(portal.id, position);
          }}
          minWidth={280}
          minHeight={180}
          bounds="parent"
          dragHandleClassName="portal-drag-handle"
          style={{ zIndex: portal.zIndex }}
          onMouseDown={() => focusPortal(portal.id)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col"
          >
            {/* Card Header */}
            <div className="portal-drag-handle flex items-center justify-between px-5 py-3 border-b border-white/10 cursor-move bg-white/5">
              <h2 className="text-sm font-medium text-white/90">{portal.title}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMinimize(portal.id)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Minimize"
                >
                  <Minus size={14} className="text-white/70" />
                </button>
                <button
                  onClick={() => closePortal(portal.id)}
                  className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X size={14} className="text-white/70" />
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </motion.div>
        </Rnd>
      )}
    </AnimatePresence>
  );
}
