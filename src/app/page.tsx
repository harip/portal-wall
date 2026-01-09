'use client';

import React, { useEffect } from 'react';
import PortalManager from '@/components/portal/PortalManager';
import { usePortalStore } from '@/lib/stores/portalStore';

export default function Home() {
  const { openPortal, portals } = usePortalStore();

  // Auto-open portals on initial load
  useEffect(() => {
    if (portals.length === 0) {
      openPortal('weather', 'Weather');
      openPortal('clock', 'Clock');
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Portal Container */}
      <div className="relative w-full h-screen">
        <PortalManager />
      </div>
    </main>
  );
}
