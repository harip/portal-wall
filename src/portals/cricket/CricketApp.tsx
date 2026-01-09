'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Users, History } from 'lucide-react';
import LiveMatches from './pages/LiveMatches';
import PastMatches from './pages/PastMatches';
import Teams from './pages/Teams';
import { useCricketStore } from './store';

type TabType = 'live' | 'past' | 'teams';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'live', label: 'Live', icon: <Trophy size={14} /> },
  { id: 'past', label: 'Past', icon: <History size={14} /> },
  { id: 'teams', label: 'Teams', icon: <Users size={14} /> },
];

export default function CricketApp() {
  const [activeTab, setActiveTab] = useState<TabType>('live');
  const { setHydrated, hydrated } = useCricketStore();

  useEffect(() => {
    if (!hydrated) {
      setHydrated();
    }
  }, [hydrated, setHydrated]);

  const renderContent = () => {
    switch (activeTab) {
      case 'live':
        return <LiveMatches />;
      case 'past':
        return <PastMatches />;
      case 'teams':
        return <Teams />;
      default:
        return <LiveMatches />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1 px-3 py-2 border-b border-white/10 bg-white/5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white/90 hover:bg-white/10'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
