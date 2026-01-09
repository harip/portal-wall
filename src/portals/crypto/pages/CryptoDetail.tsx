'use client';

import React, { useMemo } from 'react';
import { useCryptoStore } from '../store';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, formatMarketCap, formatPercentage } from '../api';

export default function CryptoDetail() {
  const { selectedCrypto, chartData, loading, clearSelectedCrypto } = useCryptoStore();

  const chartStats = useMemo(() => {
    if (chartData.length === 0) return null;

    const prices = chartData.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    return { minPrice, maxPrice, priceRange };
  }, [chartData]);

  if (!selectedCrypto) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/60">Select a crypto to view details</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/60">Loading details...</div>
      </div>
    );
  }

  const isPositive = selectedCrypto.priceChangePercentage24h >= 0;

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 py-3 z-10">
        <button
          onClick={clearSelectedCrypto}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back to list</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Crypto header */}
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={selectedCrypto.image} 
            alt={selectedCrypto.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold text-white">{selectedCrypto.name}</h2>
            <div className="text-sm text-white/60">{selectedCrypto.symbol}</div>
          </div>
        </div>

        {/* Current price */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-sm text-white/60 mb-1">Current Price</div>
          <div className="text-3xl font-bold text-white mb-2">
            {formatPrice(selectedCrypto.currentPrice)}
          </div>
          <div className={`flex items-center gap-2 text-sm font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{formatPercentage(selectedCrypto.priceChangePercentage24h)}</span>
            <span className="text-white/60">
              ({formatPrice(Math.abs(selectedCrypto.priceChange24h))})
            </span>
          </div>
        </div>

        {/* 7-day chart */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-sm font-semibold text-white/90 mb-3">7-Day Price Chart</h3>
          {chartData.length > 0 && chartStats ? (
            <div className="relative h-40">
              {/* Simple line chart using SVG */}
              <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  points={chartData.map((point, index) => {
                    const x = (index / (chartData.length - 1)) * 400;
                    const y = 160 - ((point.price - chartStats.minPrice) / chartStats.priceRange) * 140 - 10;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Chart labels */}
              <div className="flex justify-between text-xs text-white/50 mt-2">
                <span>7d ago</span>
                <span>Today</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              No chart data available
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-white/60 mb-1">24h High</div>
            <div className="text-sm font-semibold text-green-400">
              {formatPrice(selectedCrypto.high24h)}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-white/60 mb-1">24h Low</div>
            <div className="text-sm font-semibold text-red-400">
              {formatPrice(selectedCrypto.low24h)}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-white/60 mb-1">Market Cap</div>
            <div className="text-sm font-semibold text-white">
              {formatMarketCap(selectedCrypto.marketCap)}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-white/60 mb-1">24h Volume</div>
            <div className="text-sm font-semibold text-white">
              {formatMarketCap(selectedCrypto.volume24h)}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-white/60 mb-1">All-Time High</div>
            <div className="text-sm font-semibold text-white">
              {formatPrice(selectedCrypto.ath)}
            </div>
            <div className="text-xs text-white/40 mt-0.5">
              {new Date(selectedCrypto.athDate).toLocaleDateString()}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-xs text-white/60 mb-1">All-Time Low</div>
            <div className="text-sm font-semibold text-white">
              {formatPrice(selectedCrypto.atl)}
            </div>
            <div className="text-xs text-white/40 mt-0.5">
              {new Date(selectedCrypto.atlDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
