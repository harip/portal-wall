'use client';

import React, { useEffect } from 'react';
import PortalManager from '@/components/portal/PortalManager';
import Atmosphere from '@/components/Atmosphere';
import PortalIconBar from '@/components/PortalIconBar';
import DashboardHeader from '@/components/DashboardHeader';
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
    <main className="min-h-screen relative overflow-x-hidden bg-black">
      {/* Immersive Background & Particles */}
      <Atmosphere />

      {/* Dashboard Header */}
      <DashboardHeader userName="Hari" />

      {/* Portal Container */}
      <div className="relative w-full z-10 pb-24">
        <PortalManager />
      </div>

      {/* Floating Bottom Toolbar */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-30 w-full max-w-full">
        <PortalIconBar />
      </div>
    </main>
  );
}
