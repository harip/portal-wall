'use client';

import React from 'react';
import Portal from './Portal';
import { usePortalStore } from '@/lib/stores/portalStore';
import WeatherApp from '@/portals/weather/WeatherApp';
import ClockApp from '@/portals/clock/ClockApp';

export default function PortalManager() {
  const { portals } = usePortalStore();

  return (
    <div className="flex flex-wrap gap-6 p-6">
      {portals.map((portal) => (
        <div 
          key={portal.id} 
          className="w-full sm:w-[400px]"
          style={{ height: getPortalHeight(portal.type) }}
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

function getPortalHeight(type: string): string {
  switch (type) {
    case 'weather':
      return '600px';
    case 'clock':
      return '280px';
    default:
      return '400px';
  }
}
