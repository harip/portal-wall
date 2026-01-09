'use client';

import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Thermometer } from 'lucide-react';
import { useWeatherStore } from '../store';

export default function CurrentWeather() {
  const { currentWeather, temperatureUnit } = useWeatherStore();

  if (!currentWeather) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
      </div>
    );
  }

  const getWeatherIcon = () => {
    const condition = currentWeather.condition.toLowerCase();
    if (condition.includes('sunny') || condition.includes('clear')) {
      return <Sun size={64} className="text-yellow-400" />;
    } else if (condition.includes('rain')) {
      return <CloudRain size={64} className="text-blue-400" />;
    } else {
      return <Cloud size={64} className="text-gray-400" />;
    }
  };

  return (
    <div className="p-6 overflow-auto h-full">
      {/* Location */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-white/90">{currentWeather.location}</h3>
        <p className="text-xs text-white/50">Today</p>
      </div>

      {/* Current Temperature */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-2">
          {getWeatherIcon()}
          <div className="text-6xl font-light text-white">{currentWeather.temp}°{temperatureUnit}</div>
        </div>
        <p className="text-white/70 text-sm mb-1">{currentWeather.condition}</p>
        <p className="text-white/50 text-xs">
          Feels like {currentWeather.feelsLike}° • H:{currentWeather.high}° L:{currentWeather.low}°
        </p>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Wind size={16} className="text-white/60" />
            <span className="text-xs text-white/60">Wind</span>
          </div>
          <p className="text-lg font-medium text-white">{currentWeather.windSpeed} mph</p>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Droplets size={16} className="text-white/60" />
            <span className="text-xs text-white/60">Humidity</span>
          </div>
          <p className="text-lg font-medium text-white">{currentWeather.humidity}%</p>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={16} className="text-white/60" />
            <span className="text-xs text-white/60">Visibility</span>
          </div>
          <p className="text-lg font-medium text-white">{currentWeather.visibility} mi</p>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Gauge size={16} className="text-white/60" />
            <span className="text-xs text-white/60">Pressure</span>
          </div>
          <p className="text-lg font-medium text-white">{currentWeather.pressure} in</p>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer size={16} className="text-white/60" />
            <span className="text-xs text-white/60">UV Index</span>
          </div>
          <p className="text-lg font-medium text-white">{currentWeather.uvIndex}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Sunrise size={16} className="text-white/60" />
            <span className="text-xs text-white/60">Sunrise</span>
          </div>
          <p className="text-sm font-medium text-white">{currentWeather.sunrise}</p>
        </div>
      </div>
    </div>
  );
}
