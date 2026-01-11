import { useState, useEffect } from 'react';
import { useCryptoStore } from './store';
import { TrendingUp, Plus } from 'lucide-react';
import Watchlist from './pages/Watchlist';
import Search from './pages/Search';

type TabType = 'watchlist' | 'search';

export default function CryptoApp() {
    const { hydrated, setHydrated } = useCryptoStore();
    const [activeTab, setActiveTab] = useState<TabType>('watchlist');

    useEffect(() => {
        if (!hydrated) {
            setHydrated();
        }
    }, [hydrated, setHydrated]);

    if (!hydrated) return null;

    return (
        <div className="flex flex-col h-full bg-slate-900/90 text-white">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-3 py-2 border-b border-white/10 bg-white/5">
                <button
                    onClick={() => setActiveTab('watchlist')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'watchlist'
                        ? 'bg-white/20 text-white'
                        : 'text-white/60 hover:text-white/90 hover:bg-white/10'
                        }`}
                >
                    <TrendingUp size={16} />
                    <span>Watchlist</span>
                </button>
                <button
                    onClick={() => setActiveTab('search')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'search'
                        ? 'bg-white/20 text-white'
                        : 'text-white/60 hover:text-white/90 hover:bg-white/10'
                        }`}
                >
                    <Plus size={16} />
                    <span>Add Coin</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'watchlist' ? <Watchlist /> : <Search />}
            </div>
        </div>
    );
}
