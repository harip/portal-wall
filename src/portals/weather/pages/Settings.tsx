'use client';

import React from 'react';
import { Thermometer } from 'lucide-react';
import { useWeatherStore } from '../store';

export default function Settings() {
  const { temperatureUnit, toggleTemperatureUnit } = useWeatherStore();

  return (
    <div className="p-6 overflow-auto h-full">
      <h3 className="text-lg font-medium text-white/90 mb-4">Settings</h3>
      
      <div className="space-y-4">
        {/* Temperature Unit */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Thermometer size={18} className="text-white/60" />
              <div>
                <p className="text-white font-medium text-sm">Temperature Unit</p>
                <p className="text-white/50 text-xs">Choose Fahrenheit or Celsius</p>
              </div>
            </div>
            
            <button
              onClick={toggleTemperatureUnit}
              className="relative w-16 h-8 bg-white/10 rounded-full transition-colors hover:bg-white/20"
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform flex items-center justify-center text-xs font-bold ${
                  temperatureUnit === 'C' ? 'translate-x-8' : ''
                }`}
              >
                {temperatureUnit}
              </div>
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-xs mb-2">About</p>
          <p className="text-white/80 text-sm mb-1">Weather Portal v1.0</p>
          <p className="text-white/50 text-xs">
            Get real-time weather updates, forecasts, and manage multiple locations.
          </p>
        </div>

        {/* Data Source Info */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-xs mb-2">Data Source</p>
          <p className="text-white/50 text-xs">
            Currently using mock data. Connect to a weather API for real-time updates.
          </p>
        </div>
      </div>
    </div>
  );
}
