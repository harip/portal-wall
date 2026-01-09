'use client';

import React, { useEffect } from 'react';
import PortalManager from '@/components/portal/PortalManager';
import GridLights from '@/components/GridLights';
import PortalIconBar from '@/components/PortalIconBar';
import { usePortalStore } from '@/lib/stores/portalStore';

export default function Home() {
  const { openPortal, portals, hydrated, setHydrated } = usePortalStore();

  // Hydrate from localStorage first
  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  // Auto-open portals on initial load if none exist
  useEffect(() => {
    if (hydrated && portals.length === 0) {
      openPortal('weather', 'Weather');
      openPortal('clock', 'Clock');
      openPortal('calendar', 'Calendar');
      openPortal('countdown', 'Countdown');
    }
  }, [hydrated, portals.length, openPortal]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none"></div>
      
      {/* Animated Grid Lights */}
      <GridLights />
      
      {/* Header */}
      <div className="relative z-20 pt-8 pb-2 px-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center">
          Wall
        </h1>
        <p className="text-center text-slate-300 mt-2 text-sm">
          Your personal dashboard
        </p>
      </div>
      
      {/* Portal Container */}
      <div className="relative w-full z-10 pb-24">
        <PortalManager />
      </div>

      {/* Floating Bottom Toolbar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <PortalIconBar />
      </div>
    </main>
  );
}
