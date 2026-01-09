'use client';

import React from 'react';
import Portal from './Portal';
import { usePortalStore } from '@/lib/stores/portalStore';
import WeatherApp from '@/portals/weather/WeatherApp';
import ClockApp from '@/portals/clock/ClockApp';

export default function PortalManager() {
  const { portals } = usePortalStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 h-full">
      {portals.map((portal) => (
        <div key={portal.id} className="min-h-[400px]">
          <Portal portal={portal}>
            {portal.type === 'weather' && <WeatherApp />}
            {portal.type === 'clock' && <ClockApp />}
          </Portal>
        </div>
      ))}
    </div>
  );
}
