'use client';

import React from 'react';
import Portal from './Portal';
import { usePortalStore } from '@/lib/stores/portalStore';
import WeatherApp from '@/portals/weather/WeatherApp';
import ClockApp from '@/portals/clock/ClockApp';
import CalendarApp from '@/portals/calendar/CalendarApp';
import CountdownApp from '@/portals/countdown/CountdownApp';
import QuickSaveApp from '@/portals/quicksave/QuickSaveApp';
import UnitConverterApp from '@/portals/unitconverter/UnitConverterApp';
import PasswordGeneratorApp from '@/portals/passwordgen/PasswordGeneratorApp';
import NewsApp from '@/portals/news/NewsApp';
import RadioApp from '@/portals/radio/RadioApp';
import StocksApp from '@/portals/stocks/StocksApp';
import { motion, AnimatePresence } from 'framer-motion';
import { portalAnimations, portalTransition } from '@/lib/animations';

export default function PortalManager() {
  const { portals } = usePortalStore();

  // Don't render anything if there are no portals
  if (!portals || portals.length === 0) {
    return null;
  }

  // Get the active portal (first in array)
  const activePortal = portals[0];
  const remainingPortals = portals.slice(1);

  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center items-start gap-6 px-6 pt-2 pb-6">
      {activePortal && (
        <div className="w-full sm:w-[600px] h-[600px] flex-shrink-0 relative">
          <AnimatePresence mode="wait" initial={false}>
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
                {activePortal.type === 'calendar' && <CalendarApp />}
                {activePortal.type === 'countdown' && <CountdownApp />}
                {activePortal.type === 'quicksave' && <QuickSaveApp />}
                {activePortal.type === 'unitconverter' && <UnitConverterApp />}
                {activePortal.type === 'passwordgen' && <PasswordGeneratorApp />}
                {activePortal.type === 'news' && <NewsApp />}
                {activePortal.type === 'radio' && <RadioApp />}
                {activePortal.type === 'stocks' && <StocksApp />}
              </Portal>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Show remaining portals */}
      {remainingPortals.map((portal) => (
        <div
          key={portal.id}
          className="w-full sm:w-[600px] h-[600px] flex-shrink-0"
        >
          <Portal portal={portal}>
            {portal.type === 'weather' && <WeatherApp />}
            {portal.type === 'clock' && <ClockApp />}
            {portal.type === 'calendar' && <CalendarApp />}
            {portal.type === 'countdown' && <CountdownApp />}
            {portal.type === 'quicksave' && <QuickSaveApp />}
            {portal.type === 'unitconverter' && <UnitConverterApp />}
            {portal.type === 'passwordgen' && <PasswordGeneratorApp />}
            {portal.type === 'news' && <NewsApp />}
            {portal.type === 'radio' && <RadioApp />}
            {portal.type === 'stocks' && <StocksApp />}
          </Portal>
        </div>
      ))}
    </div>
  );
}
