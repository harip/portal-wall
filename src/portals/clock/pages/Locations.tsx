'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Trash2, Search, Plus, X, MapPin } from 'lucide-react';
import { useClockStore } from '../store';
import { searchTimezones, getTimeInTimezone, getTimezoneOffset, formatTime } from '../utils';
import { ClockLocation } from '../types';

export default function Locations() {
  const { locations, addLocation, removeLocation, setActiveLocation, activeLocationId } = useClockStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof import('../utils').TIMEZONES>([]);
  const [showAddModal, setShowAddModal] = useState(false);
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchTimezones(query));
    } else {
      setSearchResults([]);
    }
  };

  const handleAddLocation = (result: typeof import('../utils').TIMEZONES[0]) => {
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
    
    setShowAddModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white/90">World Clocks</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Plus size={16} className="text-white" />
        </button>
      </div>

      {/* Locations as Rows */}
      <div className="space-y-3">
        {locations.map((location) => {
          const time = currentTimes[location.id];
          return (
            <div
              key={location.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                activeLocationId === location.id
                  ? 'bg-white/15 border-white/30'
                  : 'bg-white/5 border-white/10'
              }`}
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
                    onClick={() => removeLocation(location.id)}
                    className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} className="text-white/60" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Location Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowAddModal(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6 z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add Timezone</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <X size={20} className="text-white/70" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search city or country..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-3 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                autoFocus
              />
            </div>

            <div className="max-h-64 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddLocation(result)}
                      className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors flex items-center gap-3"
                    >
                      <MapPin size={16} className="text-white/60" />
                      <div>
                        <p className="text-white text-sm font-medium">{result.city}</p>
                        <p className="text-white/50 text-xs">{result.country}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <p className="text-white/50 text-sm text-center py-8">No cities found</p>
              ) : (
                <p className="text-white/40 text-xs text-center py-8">
                  Start typing to search for cities
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
