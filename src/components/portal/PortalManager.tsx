'use client';

import React from 'react';
import Portal from './Portal';
import { usePortalStore } from '@/lib/stores/portalStore';
import WeatherApp from '@/portals/weather/WeatherApp';
import ClockApp from '@/portals/clock/ClockApp';

export default function PortalManager() {
  const { portals } = usePortalStore();

  return (
    <>
      {portals.map((portal) => (
        <Portal key={portal.id} portal={portal}>
          {portal.type === 'weather' && <WeatherApp />}
          {portal.type === 'clock' && <ClockApp />}
        </Portal>
      ))}
    </>
  );
}
