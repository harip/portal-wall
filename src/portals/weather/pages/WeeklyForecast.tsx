'use client';

import React from 'react';
import { Cloud, CloudRain, Sun, Droplets } from 'lucide-react';
import { useWeatherStore } from '../store';

export default function WeeklyForecast() {
  const { dailyForecast, temperatureUnit } = useWeatherStore();

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun size={24} className="text-yellow-400" />;
      case 'rainy':
        return <CloudRain size={24} className="text-blue-400" />;
      case 'cloudy':
        return <Cloud size={24} className="text-gray-400" />;
      default:
        return <Cloud size={24} className="text-gray-400" />;
    }
  };

  return (
    <div className="p-6 overflow-auto h-full">
      <h3 className="text-lg font-medium text-white/90 mb-4">7-Day Forecast</h3>
      
      <div className="space-y-3">
        {dailyForecast.map((day, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <p className="text-white font-medium">{day.day}</p>
                <p className="text-white/50 text-xs">{day.date}</p>
              </div>
              
              <div className="flex items-center gap-4">
                {getWeatherIcon(day.condition)}
                <div className="text-right">
                  <div className="flex gap-3">
                    <span className="text-white font-semibold">{day.high}°</span>
                    <span className="text-white/50">{day.low}°</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-white/60 mt-2">
              <div className="flex items-center gap-1">
                <Droplets size={12} />
                <span>{day.precipitation}%</span>
              </div>
              <span>Humidity: {day.humidity}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
