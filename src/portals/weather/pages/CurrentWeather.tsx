'use client';

import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Thermometer, AlertCircle } from 'lucide-react';
import { useWeatherStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

export default function CurrentWeather() {
  const { currentWeather, temperatureUnit, loading, error, savedLocations, activeLocationId, setActiveLocation } = useWeatherStore();

  const currentIndex = savedLocations.findIndex(loc => loc.id === activeLocationId);
  const activeLocation = savedLocations[currentIndex];
  const nextLocation = savedLocations[currentIndex + 1];
  const prevLocation = savedLocations[currentIndex - 1];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
        <p className="text-white/60 text-sm">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
        <AlertCircle size={48} className="text-red-400" />
        <div>
          <p className="text-white font-medium mb-2">Unable to fetch weather</p>
          <p className="text-white/60 text-sm">{error}</p>
          <p className="text-white/40 text-xs mt-3">
            Note: New API keys can take 10-15 minutes to activate
          </p>
        </div>
      </div>
    );
  }

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
      {/* Horizontal Scrollable Location */}
      <div className="relative flex items-center justify-center mb-4 h-12">
        {/* Previous Location (Left - Faded) */}
        {prevLocation && (
          <button
            onClick={() => setActiveLocation(prevLocation.id)}
            className="absolute left-0 flex items-center pl-2 pr-12 h-full"
          >
            <div
              className="text-base font-medium truncate max-w-[180px]"
              style={{
                background: 'linear-gradient(to right, rgba(255,255,255,0.35), transparent)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {prevLocation.city}, <span className="text-sm">{prevLocation.country}</span>
            </div>
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
            className="text-center"
          >
            <h3 className="text-lg font-medium text-white/90">
              {activeLocation?.city}, <span className="text-sm text-white/60">{activeLocation?.country}</span>
            </h3>
          </motion.div>
        </AnimatePresence>

        {/* Next Location (Right - Faded) */}
        {nextLocation && (
          <button
            onClick={() => setActiveLocation(nextLocation.id)}
            className="absolute right-0 flex items-center justify-end pr-2 pl-12 h-full"
          >
            <div
              className="text-base font-medium truncate max-w-[180px] text-right"
              style={{
                background: 'linear-gradient(to left, rgba(255,255,255,0.35), transparent)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {nextLocation.city}, <span className="text-sm">{nextLocation.country}</span>
            </div>
          </button>
        )}

        {/* Location Indicator Dots */}
        {savedLocations.length > 1 && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1">
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
