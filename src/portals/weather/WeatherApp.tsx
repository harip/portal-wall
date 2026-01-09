'use client';

import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  location: string;
  high: number;
  low: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
}

export default function WeatherApp() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with real weather API
    setTimeout(() => {
      setWeather({
        temp: 72,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        visibility: 10,
        location: 'San Francisco, CA',
        high: 75,
        low: 62,
        forecast: [
          { day: 'Mon', high: 75, low: 62, condition: 'sunny' },
          { day: 'Tue', high: 73, low: 61, condition: 'cloudy' },
          { day: 'Wed', high: 70, low: 59, condition: 'rainy' },
          { day: 'Thu', high: 72, low: 60, condition: 'sunny' },
          { day: 'Fri', high: 74, low: 63, condition: 'cloudy' },
        ],
      });
      setLoading(false);
    }, 800);
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="p-6 h-full overflow-auto">
      {/* Location */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-white/90">{weather.location}</h3>
      </div>

      {/* Current Temperature */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-2">
          <Cloud size={48} className="text-white/70" />
          <div className="text-6xl font-light text-white">{weather.temp}°</div>
        </div>
        <p className="text-white/70 text-sm">{weather.condition}</p>
        <p className="text-white/50 text-xs mt-1">
          H:{weather.high}° L:{weather.low}°
        </p>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Wind size={16} className="text-white/60" />
            <span className="text-xs text-white/60">Wind</span>
          </div>
          <p className="text-lg font-medium text-white">{weather.windSpeed} mph</p>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Droplets size={16} className="text-white/60" />
            <span className="text-xs text-white/60">Humidity</span>
          </div>
          <p className="text-lg font-medium text-white">{weather.humidity}%</p>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/10 col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={16} className="text-white/60" />
            <span className="text-xs text-white/60">Visibility</span>
          </div>
          <p className="text-lg font-medium text-white">{weather.visibility} mi</p>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div>
        <h4 className="text-xs font-medium text-white/60 mb-3 uppercase tracking-wide">
          5-Day Forecast
        </h4>
        <div className="space-y-2">
          {weather.forecast.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/10"
            >
              <span className="text-sm text-white/80 w-12">{day.day}</span>
              <div className="flex-1 flex justify-center">
                {getWeatherIcon(day.condition)}
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-white font-medium">{day.high}°</span>
                <span className="text-white/50">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
