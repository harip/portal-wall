'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import CryptoList from './pages/CryptoList';
import CryptoDetail from './pages/CryptoDetail';
import { useCryptoStore } from './store';

export default function CryptoApp() {
  const { setHydrated, hydrated, selectedCrypto } = useCryptoStore();

  useEffect(() => {
    if (!hydrated) {
      setHydrated();
    }
  }, [hydrated, setHydrated]);

  // Auto-switch to detail view when crypto is selected
  const activeView = selectedCrypto ? 'detail' : 'list';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
        <TrendingUp size={16} className="text-blue-400" />
        <h2 className="text-sm font-medium text-white/90">
          {activeView === 'detail' ? 'Crypto Details' : 'Cryptocurrency'}
        </h2>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'list' ? <CryptoList /> : <CryptoDetail />}
      </div>
    </div>
  );
}
