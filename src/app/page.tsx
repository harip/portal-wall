'use client';

import React from 'react';
import PortalManager from '@/components/portal/PortalManager';
import Taskbar from '@/components/portal/Taskbar';
import { usePortalStore } from '@/lib/stores/portalStore';
import { Cloud, Clock, Plus } from 'lucide-react';

export default function Home() {
  const { openPortal } = usePortalStore();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Portal Wall</h1>
            <p className="text-sm text-white/60">Your personal dashboard</p>
          </div>
          
          {/* Quick Launch Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openPortal('weather', 'Weather')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 transition-all text-white text-sm font-medium"
            >
              <Cloud size={16} />
              Weather
            </button>
            <button
              onClick={() => openPortal('clock', 'Clock')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 transition-all text-white text-sm font-medium"
            >
              <Clock size={16} />
              Clock
            </button>
          </div>
        </div>
      </header>

      {/* Portal Container */}
      <div className="relative w-full h-[calc(100vh-120px)]">
        <PortalManager />
      </div>

      {/* Taskbar for minimized portals */}
      <Taskbar />

      {/* Add Portal Button (Floating) */}
      <button
        className="fixed bottom-6 right-6 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/20 transition-all shadow-2xl group z-40"
        title="Add portal"
      >
        <Plus size={24} className="text-white group-hover:rotate-90 transition-transform" />
      </button>
    </main>
  );
}
