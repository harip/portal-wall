'use client';

import React, { useState, useEffect } from 'react';
import { CloudSun, Clock, Calendar, MapPin } from 'lucide-react';
import CurrentWeather from './pages/CurrentWeather';
import HourlyForecast from './pages/HourlyForecast';
import WeeklyForecast from './pages/WeeklyForecast';
import Locations from './pages/Locations';
import { useWeatherStore } from './store';

type TabType = 'current' | 'hourly' | 'weekly' | 'locations';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'current', label: 'Current', icon: <CloudSun size={14} /> },
  { id: 'hourly', label: 'Hourly', icon: <Clock size={14} /> },
  { id: 'weekly', label: 'Weekly', icon: <Calendar size={14} /> },
  { id: 'locations', label: 'Locations', icon: <MapPin size={14} /> },
];

export default function WeatherApp() {
  const [activeTab, setActiveTab] = useState<TabType>('current');
  const { setHydrated, hydrated } = useWeatherStore();

  useEffect(() => {
    if (!hydrated) {
      setHydrated();
    }
  }, [hydrated, setHydrated]);

  const renderContent = () => {
    switch (activeTab) {
      case 'current':
        return <CurrentWeather />;
      case 'hourly':
        return <HourlyForecast />;
      case 'weekly':
        return <WeeklyForecast />;
      case 'locations':
        return <Locations />;
      default:
        return <CurrentWeather />;
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
