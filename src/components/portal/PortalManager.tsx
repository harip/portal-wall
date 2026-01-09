'use client';

import React from 'react';
import Portal from './Portal';
import { usePortalStore } from '@/lib/stores/portalStore';
import WeatherApp from '@/portals/weather/WeatherApp';
import ClockApp from '@/portals/clock/ClockApp';
import CryptoApp from '@/portals/crypto/CryptoApp';
import { motion, AnimatePresence } from 'framer-motion';
import { portalAnimations, portalTransition } from '@/lib/animations';

export default function PortalManager() {
  const { portals } = usePortalStore();

  // Get the active portal (first in array)
  const activePortal = portals[0];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center items-start gap-6 px-6 pt-2 pb-6">
      <div className="w-full sm:w-[600px] h-[600px] flex-shrink-0 relative">
        <AnimatePresence mode="wait" initial={false}>
          {activePortal && (
            <motion.div
              key={activePortal.id}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={portalAnimations}
              transition={portalTransition}
              className="absolute inset-0"
            >
              <Portal portal={activePortal}>
                {activePortal.type === 'weather' && <WeatherApp />}
                {activePortal.type === 'clock' && <ClockApp />}
                {activePortal.type === 'crypto' && <CryptoApp />}
              </Portal>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Show remaining portals */}
      {portals.slice(1).map((portal) => (
        <div 
          key={portal.id}
          className="w-full sm:w-[600px] h-[600px] flex-shrink-0"
        >
          <Portal portal={portal}>
            {portal.type === 'weather' && <WeatherApp />}
            {portal.type === 'clock' && <ClockApp />}
            {portal.type === 'crypto' && <CryptoApp />}
          </Portal>
        </div>
      ))}
    </div>
  );
}
