'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Trash2, Search, Plus, X, Loader2 } from 'lucide-react';
import { useClockStore } from '../store';
import { searchTimezones, getTimeInTimezone, getTimezoneOffset, formatTime, TimezoneData } from '../utils';
import { ClockLocation } from '../types';

export default function Locations() {
  const { locations, addLocation, removeLocation, setActiveLocation, activeLocationId } = useClockStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TimezoneData[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentTimes, setCurrentTimes] = useState<{ [key: string]: Date }>({});

  // Update times every second
  useEffect(() => {
    const updateTimes = () => {
      const times: { [key: string]: Date } = {};
      locations.forEach(loc => {
        times[loc.id] = getTimeInTimezone(loc.timezone);
      });
      setCurrentTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [locations]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    const results = await searchTimezones(query);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleAddLocation = (result: TimezoneData) => {
    const exists = locations.some(loc => loc.timezone === result.timezone);
    
    if (!exists) {
      const newLocation: ClockLocation = {
        id: `${Date.now()}`,
        city: result.city,
        country: result.country,
        timezone: result.timezone,
        offset: getTimezoneOffset(result.timezone),
      };
      addLocation(newLocation);
      setActiveLocation(newLocation.id);
    }
    
    // Reset search
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white/90">World Clocks</h3>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          title="Add timezone"
        >
          {showSearch ? <X size={16} className="text-white" /> : <Plus size={16} className="text-white" />}
        </button>
      </div>

      {/* Search Section - Inline like Weather Portal */}
      {showSearch && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              autoFocus
            />
            {isSearching && (
              <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 animate-spin" />
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleAddLocation(result)}
                  className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                >
                  <p className="text-white text-sm font-medium">
                    {result.city}
                  </p>
                  <p className="text-white/50 text-xs">{result.country}</p>
                </button>
              ))}
            </div>
          )}

          {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
            <p className="text-white/50 text-sm text-center py-4">
              No locations found
            </p>
          )}
        </div>
      )}

      {/* Locations as Rows */}
      <div className="space-y-3">
        {locations.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-white/20 mb-3" />
            <p className="text-white/50 text-sm">No locations added</p>
            <p className="text-white/30 text-xs mt-1">Click + to add a timezone</p>
          </div>
        ) : (
          locations.map((location) => {
            const time = currentTimes[location.id];
            return (
              <div
                key={location.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  activeLocationId === location.id
                    ? 'bg-white/15 border-white/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setActiveLocation(location.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Clock size={18} className="text-white/60" />
                  <div>
                    <p className="text-white font-medium text-sm">
                      {location.city}
                    </p>
                    <p className="text-white/50 text-xs">{location.country}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {time && (
                    <div className="text-right">
                      <p className="text-white font-semibold text-lg tabular-nums">
                        {formatTime(time)}
                      </p>
                      <p className="text-white/40 text-xs">
                        {location.timezone.split('/')[1]?.replace('_', ' ')}
                      </p>
                    </div>
                  )}

                  {locations.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLocation(location.id);
                      }}
                      className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Remove timezone"
                    >
                      <Trash2 size={14} className="text-white/60" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info Text */}
      <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10">
        <p className="text-white/40 text-xs text-center">
          Click on a location to view its time. The active location is shown in the Current tab.
        </p>
      </div>
    </div>
  );
}
