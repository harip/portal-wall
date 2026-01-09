'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useClockStore } from '../store';
import { getTimeInTimezone } from '../utils';
import { MapPin } from 'lucide-react';

export default function CurrentTime() {
  const { locations, activeLocationId, setActiveLocation, hydrated } = useClockStore();
  const [currentTimes, setCurrentTimes] = useState<{ [key: string]: Date }>({});

  useEffect(() => {
    const updateTimes = () => {
      const times: { [key: string]: Date } = {};
      locations.forEach(loc => {
        times[loc.id] = getTimeInTimezone(loc.timezone);
      });
      setCurrentTimes(times);
    };

    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, [locations]);

  if (!hydrated || locations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
      </div>
    );
  }

  // Single location - show large clock display
  if (locations.length === 1) {
    const location = locations[0];
    const currentTime = currentTimes[location.id] || new Date();
    const hours = format(currentTime, 'HH');
    const minutes = format(currentTime, 'mm');
    const seconds = format(currentTime, 'ss');
    const ampm = format(currentTime, 'a');
    const date = format(currentTime, 'EEEE, MMMM d, yyyy');

    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        {/* Location */}
        <h3 className="text-lg font-medium text-white/90 mb-6">
          {location.city}, <span className="text-base text-white/60">{location.country}</span>
        </h3>

        {/* Time Display */}
        <div className="flex items-center gap-2 mb-6">
          <div className="text-7xl font-light text-white tabular-nums tracking-tight">
            {hours}
          </div>
          <div className="text-7xl font-light text-white/50 animate-pulse">:</div>
          <div className="text-7xl font-light text-white tabular-nums tracking-tight">
            {minutes}
          </div>
          <div className="flex flex-col gap-1 ml-2">
            <div className="text-2xl font-light text-white/40 tabular-nums tracking-tight">
              {seconds}
            </div>
            <div className="text-sm font-medium text-white/40 uppercase">
              {ampm}
            </div>
          </div>
        </div>

        {/* Date Display */}
        <div className="text-white/60 text-base font-medium mb-6">{date}</div>

        {/* Timezone */}
        <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10">
          <p className="text-sm text-white/50 text-center">
            {location.timezone}
          </p>
        </div>
      </div>
    );
  }

  // Multiple locations - show as rows
  return (
    <div className="p-4 overflow-auto h-full">
      <div className="space-y-2">
        {locations.map((location) => {
          const time = currentTimes[location.id];
          if (!time) return null;

          const isActive = activeLocationId === location.id;
          const hours = format(time, 'HH');
          const minutes = format(time, 'mm');
          const seconds = format(time, 'ss');
          const ampm = format(time, 'a');
          const date = format(time, 'EEE, MMM d, yyyy');

          return (
            <div
              key={location.id}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-white/15 border-white/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => setActiveLocation(location.id)}
            >
              {/* Location Header with Date */}
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-white/60" />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">
                    {location.city}, <span className="text-white/60">{location.country}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-white/50 text-xs">{date}</p>
                  {isActive && (
                    <div className="w-2 h-2 bg-green-400 rounded-full" title="Active" />
                  )}
                </div>
              </div>

              {/* Time Display */}
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light text-white tabular-nums">
                  {hours}
                </span>
                <span className="text-2xl font-light text-white/50">:</span>
                <span className="text-2xl font-light text-white tabular-nums">
                  {minutes}
                </span>
                <span className="text-base font-light text-white/40 tabular-nums ml-1">
                  {seconds}
                </span>
                <span className="text-xs font-medium text-white/40 uppercase ml-2">
                  {ampm}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
