'use client';

import React from 'react';
import Portal from './Portal';
import { usePortalStore } from '@/lib/stores/portalStore';
import WeatherApp from '@/portals/weather/WeatherApp';
import ClockApp from '@/portals/clock/ClockApp';

export default function PortalManager() {
  const { portals } = usePortalStore();

  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 p-6 min-h-screen">
      {portals.map((portal) => (
        <div 
          key={portal.id} 
          className="w-full sm:w-[600px] h-[600px] flex-shrink-0"
        >
          <Portal portal={portal}>
            {portal.type === 'weather' && <WeatherApp />}
            {portal.type === 'clock' && <ClockApp />}
          </Portal>
        </div>
      ))}
    </div>
  );
}
