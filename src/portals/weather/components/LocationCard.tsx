'use client';

import React, { useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Gauge, Sunrise, Thermometer, AlertCircle, CloudSun, Clock, Calendar } from 'lucide-react';
import { SavedLocation } from '../types';
import { useWeatherStore } from '../store';
import CurrentWeather from '../pages/CurrentWeather';
import HourlyForecast from '../pages/HourlyForecast';
import WeeklyForecast from '../pages/WeeklyForecast';

interface LocationCardProps {
  location: SavedLocation;
}

type ViewType = 'current' | 'hourly' | 'weekly';

export default function LocationCard({ location }: LocationCardProps) {
  const [activeView, setActiveView] = useState<ViewType>('current');

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden h-[500px] flex flex-col">
      {/* Location Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-white/5">
        <h2 className="text-lg font-semibold text-white text-center">
          {location.city}{location.state && `, ${location.state}`}
        </h2>
        <p className="text-xs text-white/60 text-center">{location.country}</p>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
        <button
          onClick={() => setActiveView('current')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeView === 'current'
              ? 'bg-white/20 text-white'
              : 'text-white/60 hover:text-white/90 hover:bg-white/10'
          }`}
        >
          <CloudSun size={14} />
          <span>Now</span>
        </button>
        <button
          onClick={() => setActiveView('hourly')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeView === 'hourly'
              ? 'bg-white/20 text-white'
              : 'text-white/60 hover:text-white/90 hover:bg-white/10'
          }`}
        >
          <Clock size={14} />
          <span>Hourly</span>
        </button>
        <button
          onClick={() => setActiveView('weekly')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeView === 'weekly'
              ? 'bg-white/20 text-white'
              : 'text-white/60 hover:text-white/90 hover:bg-white/10'
          }`}
        >
          <Calendar size={14} />
          <span>Week</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'current' && <CurrentWeather />}
        {activeView === 'hourly' && <HourlyForecast />}
        {activeView === 'weekly' && <WeeklyForecast />}
      </div>
    </div>
  );
}
