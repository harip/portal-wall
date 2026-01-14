'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import CryptoApp from '@/portals/crypto/CryptoApp';
import AIApp from '@/portals/ai/AIApp';
import VoiceApp from '@/portals/voice/VoiceApp';
import SettingsApp from '@/portals/settings/SettingsApp';

export default function PortalManager() {
  const { portals, lastInteraction } = usePortalStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / (width * 0.85)); // 85vw
    setActiveIndex(newIndex);
  };

  const scrollToPortal = (index: number) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    // Each portal is 85vw. The gap is 4 (16px). 
    // The snap-center does the heavy lifting, but we need to get close.
    const scrollAmount = index * (width * 0.85 + 16);
    scrollRef.current.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  // Automatically scroll to front when a new portal is opened, brought to front, or focused
  useEffect(() => {
    if (portals.length > 0) {
      scrollToPortal(0);
    }
  }, [portals[0]?.id, lastInteraction]);

  if (!portals || portals.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex flex-row overflow-x-auto sm:overflow-visible sm:flex-wrap sm:justify-center items-start gap-4 sm:gap-8 px-[7.5vw] sm:px-12 pt-4 pb-12 no-scrollbar snap-x snap-mandatory sm:snap-none w-full"
      >
        <AnimatePresence mode="popLayout">
          {portals.map((portal) => (
            <motion.div
              key={portal.id}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 120,
              }}
              className="w-[85vw] sm:w-[600px] h-[70vh] sm:h-[600px] flex-shrink-0 snap-center sm:snap-align-none"
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
                {portal.type === 'crypto' && <CryptoApp />}
                {portal.type === 'ai' && <AIApp />}
                {portal.type === 'voice' && <VoiceApp />}
                {portal.type === 'settings' && <SettingsApp />}
              </Portal>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Dots (Mobile Only) */}
      <div className="flex sm:hidden gap-2 mt-2">
        {portals.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPortal(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i
              ? 'w-6 bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-glow)]'
              : 'w-1.5 bg-white/20'
              }`}
            aria-label={`Go to portal ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
