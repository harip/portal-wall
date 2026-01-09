'use client';

import React from 'react';
import { PortalState } from '@/types/portal';
import { motion } from 'framer-motion';

interface PortalProps {
  portal: PortalState;
  children: React.ReactNode;
}

export default function Portal({ portal, children }: PortalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
        <h2 className="text-sm font-medium text-white/90">{portal.title}</h2>
      </div>

      {/* Card Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </motion.div>
  );
}
