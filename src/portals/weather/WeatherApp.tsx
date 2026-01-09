'use client';

import React, { useState, useEffect } from 'react';
import { CloudSun, Clock, Calendar, MapPin, Plus } from 'lucide-react';
import CurrentWeather from './pages/CurrentWeather';
import HourlyForecast from './pages/HourlyForecast';
import WeeklyForecast from './pages/WeeklyForecast';
import Locations from './pages/Locations';
import { useWeatherStore } from './store';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { setHydrated, hydrated, savedLocations, activeLocationId, setActiveLocation } = useWeatherStore();

  useEffect(() => {
    if (!hydrated) {
      setHydrated();
    }
  }, [hydrated, setHydrated]);

  const currentIndex = savedLocations.findIndex(loc => loc.id === activeLocationId);
  const activeLocation = savedLocations[currentIndex];
  const nextLocation = savedLocations[currentIndex + 1];
  const prevLocation = savedLocations[currentIndex - 1];

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
      {/* Horizontal Scrollable Location Header */}
      <div className="relative border-b border-white/10 bg-white/5 overflow-hidden">
        <div className="flex items-center justify-center h-14 relative">
          {/* Previous Location (Left - Faded) */}
          {prevLocation && (
            <button
              onClick={() => setActiveLocation(prevLocation.id)}
              className="absolute left-0 flex items-center pl-4 pr-8 h-full"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.05), transparent)',
              }}
            >
              <span
                className="text-sm font-medium truncate max-w-[100px]"
                style={{
                  background: 'linear-gradient(to right, rgba(255,255,255,0.3), transparent)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {prevLocation.city}
              </span>
            </button>
          )}

          {/* Current Location (Center - Full) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLocationId}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="text-center px-4"
            >
              <h2 className="text-base font-semibold text-white">
                {activeLocation?.city}
                {activeLocation?.state && `, ${activeLocation.state}`}
              </h2>
              <p className="text-xs text-white/50">{activeLocation?.country}</p>
            </motion.div>
          </AnimatePresence>

          {/* Next Location (Right - Faded) */}
          {nextLocation && (
            <button
              onClick={() => setActiveLocation(nextLocation.id)}
              className="absolute right-0 flex items-center justify-end pr-4 pl-8 h-full"
              style={{
                background: 'linear-gradient(to left, rgba(255,255,255,0.05), transparent)',
              }}
            >
              <span
                className="text-sm font-medium truncate max-w-[100px] text-right"
                style={{
                  background: 'linear-gradient(to left, rgba(255,255,255,0.3), transparent)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {nextLocation.city}
              </span>
            </button>
          )}
        </div>

        {/* Location Indicator Dots */}
        {savedLocations.length > 1 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1">
            {savedLocations.map((location, index) => (
              <button
                key={location.id}
                onClick={() => setActiveLocation(location.id)}
                className={`transition-all ${
                  index === currentIndex
                    ? 'w-4 h-1 bg-white/80 rounded-full'
                    : 'w-1 h-1 bg-white/30 rounded-full hover:bg-white/50'
                }`}
                aria-label={`Go to ${location.city}`}
              />
            ))}
          </div>
        )}
      </div>

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
