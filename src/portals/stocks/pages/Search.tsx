'use client';

import React, { useState } from 'react';
import { Search as SearchIcon, Plus, Check, Loader2, X } from 'lucide-react';
import { useStocksStore } from '../store';
import { CryptoData } from '../types';

interface SearchResult {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    market_cap_rank: number;
}

export default function Search() {
    const { watchlist, addToWatchlist, removeFromWatchlist } = useStocksStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (searchQuery: string) => {
        setQuery(searchQuery);
        if (searchQuery.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchQuery}`);
            if (!res.ok) throw new Error('Search failed');
            const data = await res.json();
            setResults(data.coins.slice(0, 50));
        } catch (err) {
            setError('Failed to search coins. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleWatchlist = (coin: SearchResult) => {
        if (watchlist.includes(coin.id)) {
            removeFromWatchlist(coin.id);
        } else {
            addToWatchlist(coin.id);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/50">
            <div className="p-4">
                <div className="relative">
                    <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search coins (e.g. Bitcoin, Doge)..."
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-white placeholder-white/40 focus:outline-none focus:bg-white/10"
                        autoFocus
                    />
                    {query && (
                        <button
                            onClick={() => { setQuery(''); setResults([]); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 size={24} className="animate-spin text-white/40" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-400 text-sm">{error}</div>
                ) : results.length > 0 ? (
                    <div className="space-y-1">
                        {results.map((coin) => {
                            const inWatchlist = watchlist.includes(coin.id);
                            return (
                                <div
                                    key={coin.id}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={coin.thumb} alt={coin.name} className="w-6 h-6 rounded-full" />
                                        <div>
                                            <div className="font-medium text-sm flex items-center gap-2">
                                                {coin.name}
                                                <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                                                    {coin.symbol}
                                                </span>
                                            </div>
                                            <div className="text-xs text-white/40">Rank #{coin.market_cap_rank}</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleWatchlist(coin)}
                                        className={`p-2 rounded-full transition-all ${inWatchlist
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white'
                                            }`}
                                    >
                                        {inWatchlist ? <Check size={18} /> : <Plus size={18} />}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : query.length >= 2 ? (
                    <div className="text-center py-8 text-white/40 text-sm">No coins found</div>
                ) : (
                    <div className="text-center py-12 px-6">
                        <SearchIcon size={48} className="mx-auto text-white/10 mb-4" />
                        <p className="text-white/40 text-sm">Search for any cryptocurrency to add it to your watchlist.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
