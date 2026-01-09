'use client';

import React, { useEffect } from 'react';
import PortalManager from '@/components/portal/PortalManager';
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
    }
  }, [hydrated, portals.length, openPortal]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10"></div>
      
      {/* Portal Container */}
      <div className="relative w-full min-h-screen">
        <PortalManager />
      </div>
    </main>
  );
}
