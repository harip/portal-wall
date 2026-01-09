'use client';

import React from 'react';
import { useCryptoStore } from '../store';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, formatMarketCap, formatPercentage } from '../api';

export default function CryptoList() {
  const { cryptos, loading, lastUpdated, refreshPrices, fetchCryptoDetails } = useCryptoStore();

  const handleRefresh = () => {
    refreshPrices();
  };

  const handleCryptoClick = (cryptoId: string) => {
    fetchCryptoDetails(cryptoId);
  };

  if (loading && cryptos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/60">Loading crypto prices...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      {/* Header with refresh */}
      <div className="sticky top-0 bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-white/90 font-semibold">Crypto Prices</h3>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            aria-label="Refresh prices"
          >
            <RefreshCw 
              size={16} 
              className={`text-white/70 ${loading ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
        {lastUpdated && (
          <div className="text-xs text-white/40 mt-1">
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Crypto list */}
      <div className="p-4 space-y-2">
        {cryptos.map((crypto) => {
          const isPositive = crypto.priceChangePercentage24h >= 0;
          
          return (
            <button
              key={crypto.id}
              onClick={() => handleCryptoClick(crypto.id)}
              className="w-full bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all text-left group"
            >
              {/* Top row: Icon, name, price */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <img 
                    src={crypto.image} 
                    alt={crypto.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                      {crypto.name}
                    </div>
                    <div className="text-xs text-white/50">{crypto.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">
                    {formatPrice(crypto.currentPrice)}
                  </div>
                </div>
              </div>

              {/* Bottom row: 24h change, market cap */}
              <div className="flex items-center justify-between text-xs">
                <div className={`flex items-center gap-1 font-medium ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{formatPercentage(crypto.priceChangePercentage24h)}</span>
                </div>
                <div className="text-white/50">
                  MCap: {formatMarketCap(crypto.marketCap)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info note */}
      <div className="p-4">
        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="text-xs text-blue-300">
            Click on any crypto to view detailed 7-day chart
          </div>
        </div>
      </div>
    </div>
  );
}
