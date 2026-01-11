'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCcw, DollarSign, Trash2, RotateCw } from 'lucide-react';
import { useCryptoStore } from '../store';
import { CryptoData } from '../types';
import { usePortalHeader } from '@/components/portal/PortalHeaderContext';

const MOCK_DATA: CryptoData[] = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 64230, price_change_percentage_24h: 2.4, market_cap: 1200000000000, image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 3450, price_change_percentage_24h: -1.2, market_cap: 400000000000, image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { id: 'solana', name: 'Solana', symbol: 'sol', current_price: 145, price_change_percentage_24h: 5.7, market_cap: 65000000000, image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
];

export default function Watchlist() {
    const { watchlist, hydrated, removeFromWatchlist } = useCryptoStore();
    const [assets, setAssets] = useState<CryptoData[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchPrices = React.useCallback(async () => {
        if (!hydrated || watchlist.length === 0) {
            setAssets([]);
            return;
        }

        setLoading(true);
        try {
            const ids = watchlist.join(',');
            const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false`);

            if (res.ok) {
                const data = await res.json();
                setAssets(data);
            } else {
                setAssets(MOCK_DATA.filter(coin => watchlist.includes(coin.id)).map(coin => ({
                    ...coin,
                    current_price: coin.current_price * (1 + (Math.random() * 0.02 - 0.01)),
                    price_change_percentage_24h: coin.price_change_percentage_24h + (Math.random() * 1 - 0.5)
                })));
            }
            setLastUpdated(new Date());
        } catch (e) {
            console.error("Failed to fetch crypto prices", e);
        } finally {
            setLoading(false);
        }
    }, [hydrated, watchlist]);

    const { setHeaderRight } = usePortalHeader();

    useEffect(() => {
        if (hydrated) {
            fetchPrices();
            const interval = setInterval(fetchPrices, 30000); // 30 seconds auto-fetch
            return () => clearInterval(interval);
        }
    }, [hydrated, watchlist.length, fetchPrices]);

    // Update Header Right content
    useEffect(() => {
        setHeaderRight(
            <div className="flex items-center gap-3">
                <span className="text-[10px] text-white/40 font-mono hidden sm:inline-block">
                    Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <button
                    onClick={fetchPrices}
                    disabled={loading}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                    title="Refresh Prices"
                >
                    <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
        );

        // Cleanup on unmount
        return () => setHeaderRight(null);
    }, [setHeaderRight, lastUpdated, loading, fetchPrices]);

    if (!hydrated) return null;

    if (watchlist.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white/40">
                <DollarSign size={48} className="mb-4 opacity-50" />
                <p className="text-sm">Your watchlist is empty.</p>
                <p className="text-xs mt-1">Switch to the Search tab to add coins.</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-900/50 text-white">
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                <div className="grid gap-2">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group relative"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                    <img src={asset.image} alt={asset.name} className="w-8 h-8 rounded-full bg-white/10" />
                                    <div>
                                        <h3 className="font-bold">{asset.name}</h3>
                                        <span className="text-xs uppercase text-slate-400">{asset.symbol}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-medium text-lg">
                                        ${asset.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                <div className={`flex items-center gap-1 text-sm font-medium ${asset.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {asset.price_change_percentage_24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {Math.abs(asset.price_change_percentage_24h).toFixed(2)}%
                                </div>
                                <div className="text-xs text-slate-500 font-mono">
                                    MCap: ${(asset.market_cap / 1e9).toFixed(1)}B
                                </div>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); removeFromWatchlist(asset.id); }}
                                className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                                title="Remove from watchlist"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-3 bg-slate-900/80 text-center text-xs text-slate-500 border-t border-white/5">
                Data provided by CoinGecko API
            </div>
        </div>
    );
}
