'use client';

import React, { useState } from 'react';
import { MapPin, Star, Trash2, Plus, Search } from 'lucide-react';
import { useWeatherStore } from '../store';

export default function Locations() {
  const { savedLocations, activeLocationId, setActiveLocation, removeLocation, addLocation } = useWeatherStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('');

  const handleAddLocation = () => {
    if (newCity.trim() && newCountry.trim()) {
      addLocation({
        id: Date.now().toString(),
        city: newCity,
        country: newCountry,
        isFavorite: false,
      });
      setNewCity('');
      setNewCountry('');
      setShowAddForm(false);
    }
  };

  const filteredLocations = savedLocations.filter(loc =>
    loc.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white/90">Locations</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Plus size={16} className="text-white" />
        </button>
      </div>

      {/* Add Location Form */}
      {showAddForm && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
          <input
            type="text"
            placeholder="City name"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <input
            type="text"
            placeholder="Country"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <button
            onClick={handleAddLocation}
            className="w-full bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-white text-sm font-medium transition-colors"
          >
            Add Location
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>

      {/* Locations List */}
      <div className="space-y-2">
        {filteredLocations.map((location) => (
          <div
            key={location.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
              activeLocationId === location.id
                ? 'bg-white/15 border-white/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            onClick={() => setActiveLocation(location.id)}
          >
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-white/60" />
              <div>
                <p className="text-white font-medium text-sm">{location.city}</p>
                <p className="text-white/50 text-xs">{location.country}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {location.isFavorite && (
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
              )}
              {savedLocations.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLocation(location.id);
                  }}
                  className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 size={14} className="text-white/60" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
