'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useClockStore } from '../store';
import { getTimeInTimezone } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function CurrentTime() {
  const { locations, activeLocationId, setActiveLocation, hydrated } = useClockStore();
  const [time, setTime] = useState(new Date());

  const currentIndex = locations.findIndex(loc => loc.id === activeLocationId);
  const activeLocation = locations[currentIndex];
  const nextLocation = locations[currentIndex + 1];
  const prevLocation = locations[currentIndex - 1];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!hydrated || !activeLocation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
      </div>
    );
  }

  const currentTime = getTimeInTimezone(activeLocation.timezone);
  const hours = format(currentTime, 'HH');
  const minutes = format(currentTime, 'mm');
  const seconds = format(currentTime, 'ss');
  const ampm = format(currentTime, 'a');
  const date = format(currentTime, 'EEEE, MMMM d, yyyy');

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      {/* Horizontal Scrollable Location */}
      {locations.length > 1 && (
        <div className="relative flex items-center justify-center mb-6 h-10 w-full">
          {/* Previous Location */}
          {prevLocation && (
            <button
              onClick={() => setActiveLocation(prevLocation.id)}
              className="absolute left-0 pl-2 pr-12"
            >
              <div
                className="text-sm font-medium truncate max-w-[140px]"
                style={{
                  background: 'linear-gradient(to right, rgba(255,255,255,0.35), transparent)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {prevLocation.city}
              </div>
            </button>
          )}

          {/* Current Location */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLocationId}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <h3 className="text-base font-medium text-white/90">
                {activeLocation.city}, <span className="text-sm text-white/60">{activeLocation.country}</span>
              </h3>
            </motion.div>
          </AnimatePresence>

          {/* Next Location */}
          {nextLocation && (
            <button
              onClick={() => setActiveLocation(nextLocation.id)}
              className="absolute right-0 pr-2 pl-12"
            >
              <div
                className="text-sm font-medium truncate max-w-[140px] text-right"
                style={{
                  background: 'linear-gradient(to left, rgba(255,255,255,0.35), transparent)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {nextLocation.city}
              </div>
            </button>
          )}

          {/* Dots */}
          {locations.length > 1 && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {locations.map((location, index) => (
                <button
                  key={location.id}
                  onClick={() => setActiveLocation(location.id)}
                  className={`transition-all ${
                    index === currentIndex
                      ? 'w-4 h-1 bg-white/80 rounded-full'
                      : 'w-1 h-1 bg-white/30 rounded-full hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Time Display */}
      <div className="flex items-center gap-2 mb-6">
        <div className="text-7xl font-light text-white tabular-nums tracking-tight">
          {hours}
        </div>
        <div className="text-7xl font-light text-white/50 animate-pulse">:</div>
        <div className="text-7xl font-light text-white tabular-nums tracking-tight">
          {minutes}
        </div>
        <div className="flex flex-col gap-1 ml-2">
          <div className="text-2xl font-light text-white/40 tabular-nums tracking-tight">
            {seconds}
          </div>
          <div className="text-sm font-medium text-white/40 uppercase">
            {ampm}
          </div>
        </div>
      </div>

      {/* Date Display */}
      <div className="text-white/60 text-base font-medium mb-6">{date}</div>

      {/* Timezone */}
      <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10">
        <p className="text-sm text-white/50 text-center">
          {activeLocation.timezone}
        </p>
      </div>
    </div>
  );
}
