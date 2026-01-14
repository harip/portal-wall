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
import CryptoApp from '@/portals/crypto/CryptoApp';
import AIApp from '@/portals/ai/AIApp';
import VoiceApp from '@/portals/voice/VoiceApp';

export default function PortalManager() {
  const { portals } = usePortalStore();

  // Don't render anything if there are no portals
  if (!portals || portals.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row overflow-x-auto sm:overflow-visible sm:flex-wrap sm:justify-center items-start gap-4 sm:gap-6 px-4 sm:px-6 pt-2 pb-6 no-scrollbar snap-x snap-mandatory sm:snap-none">
      {portals.map((portal) => (
        <div
          key={portal.id}
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
          </Portal>
        </div>
      ))}
    </div>
  );
}
