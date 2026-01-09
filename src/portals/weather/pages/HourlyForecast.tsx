'use client';

import React from 'react';
import { Cloud, CloudRain, Sun, Droplets } from 'lucide-react';
import { useWeatherStore } from '../store';

export default function HourlyForecast() {
  const { hourlyForecast, temperatureUnit } = useWeatherStore();

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun size={20} className="text-yellow-400" />;
      case 'rainy':
        return <CloudRain size={20} className="text-blue-400" />;
      case 'cloudy':
        return <Cloud size={20} className="text-gray-400" />;
      default:
        return <Cloud size={20} className="text-gray-400" />;
    }
  };

  return (
    <div className="p-6 overflow-auto h-full">
      <h3 className="text-lg font-medium text-white/90 mb-4">Hourly Forecast</h3>
      
      <div className="space-y-2">
        {hourlyForecast.map((hour, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <span className="text-white/80 font-medium w-16">{hour.time}</span>
            
            <div className="flex items-center gap-3 flex-1 justify-center">
              {getWeatherIcon(hour.condition)}
              <span className="text-white text-sm capitalize">{hour.condition}</span>
            </div>
            
            <div className="flex items-center gap-4">
              {hour.precipitation > 0 && (
                <div className="flex items-center gap-1 text-blue-400">
                  <Droplets size={14} />
                  <span className="text-xs">{hour.precipitation}%</span>
                </div>
              )}
              <span className="text-white font-semibold w-12 text-right">
                {hour.temp}°{temperatureUnit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
