'use client';

import React, { useEffect, useState } from 'react';
import { X, Search, Loader2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherStore } from '../store';
import { searchLocations, LocationSearchResult } from '../api';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddLocationModal({ isOpen, onClose }: AddLocationModalProps) {
  const { addLocation, setActiveLocation, savedLocations } = useWeatherStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    const results = await searchLocations(query);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleAddLocation = (result: LocationSearchResult) => {
    const newLocation = {
      id: `${result.lat}-${result.lon}`,
      city: result.name,
      country: result.country,
      state: result.state,
      lat: result.lat,
      lon: result.lon,
    };
    
    // Check if location already exists
    const exists = savedLocations.some(
      loc => loc.lat === newLocation.lat && loc.lon === newLocation.lon
    );
    
    if (!exists) {
      addLocation(newLocation);
      setActiveLocation(newLocation.id);
    }
    
    // Close modal
    onClose();
    setSearchQuery('');
    setSearchResults([]);
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add Location</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-white/70" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-10 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                autoFocus
              />
              {isSearching && (
                <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 animate-spin" />
              )}
            </div>

            {/* Search Results */}
            <div className="max-h-64 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddLocation(result)}
                      className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors flex items-center gap-3"
                    >
                      <MapPin size={16} className="text-white/60 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {result.name}
                          {result.state && `, ${result.state}`}
                        </p>
                        <p className="text-white/50 text-xs">{result.country}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery.length >= 2 && !isSearching ? (
                <p className="text-white/50 text-sm text-center py-8">
                  No locations found
                </p>
              ) : searchQuery.length === 0 ? (
                <p className="text-white/40 text-xs text-center py-8">
                  Start typing to search for cities worldwide
                </p>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
