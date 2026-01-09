'use client';

import React from 'react';
import Portal from './Portal';
import { usePortalStore } from '@/lib/stores/portalStore';
import WeatherApp from '@/portals/weather/WeatherApp';
import ClockApp from '@/portals/clock/ClockApp';

export default function PortalManager() {
  const { portals } = usePortalStore();

  return (
    <div className="flex justify-center items-center min-h-full p-6">
      <div className="flex flex-wrap justify-center gap-6 max-w-[1800px]">
        {portals.map((portal) => (
          <div 
            key={portal.id} 
            className="w-full sm:w-[450px] sm:h-[450px] h-[500px]"
          >
            <Portal portal={portal}>
              {portal.type === 'weather' && <WeatherApp />}
              {portal.type === 'clock' && <ClockApp />}
            </Portal>
          </div>
        ))}
      </div>
    </div>
  );
}
