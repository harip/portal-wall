'use client';

import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Bell } from 'lucide-react';
import CurrentTime from './pages/CurrentTime';
import Locations from './pages/Locations';
import Reminders from './pages/Reminders';
import { useClockStore } from './store';

type TabType = 'current' | 'locations' | 'reminders';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'current', label: 'Current', icon: <Clock size={14} /> },
  { id: 'locations', label: 'Locations', icon: <MapPin size={14} /> },
  { id: 'reminders', label: 'Reminders', icon: <Bell size={14} /> },
];

export default function ClockApp() {
  const [activeTab, setActiveTab] = useState<TabType>('current');
  const { setHydrated, hydrated } = useClockStore();

  useEffect(() => {
    if (!hydrated) {
      setHydrated();
    }
  }, [hydrated, setHydrated]);

  const renderContent = () => {
    switch (activeTab) {
      case 'current':
        return <CurrentTime />;
      case 'locations':
        return <Locations />;
      case 'reminders':
        return <Reminders />;
      default:
        return <CurrentTime />;
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
