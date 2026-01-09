'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function ClockApp() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = format(time, 'HH');
  const minutes = format(time, 'mm');
  const seconds = format(time, 'ss');
  const date = format(time, 'EEEE, MMMM d, yyyy');
  const ampm = format(time, 'a');

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      {/* Time Display */}
      <div className="flex items-center gap-2 mb-6">
        <div className="text-center">
          <div className="text-7xl font-light text-white tabular-nums tracking-tight">
            {hours}
          </div>
        </div>
        <div className="text-7xl font-light text-white/50 animate-pulse">:</div>
        <div className="text-center">
          <div className="text-7xl font-light text-white tabular-nums tracking-tight">
            {minutes}
          </div>
        </div>
        <div className="text-center flex flex-col gap-1 ml-2">
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

      {/* Time Zone */}
      <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10">
        <p className="text-sm text-white/50 text-center">
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </p>
      </div>

      {/* Additional Info */}
      <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="text-center bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-xs text-white/50 mb-1">Week</p>
          <p className="text-lg font-semibold text-white">
            {format(time, 'I')}
          </p>
        </div>
        <div className="text-center bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-xs text-white/50 mb-1">Day of Year</p>
          <p className="text-lg font-semibold text-white">
            {Math.floor((time.getTime() - new Date(time.getFullYear(), 0, 0).getTime()) / 86400000)}
          </p>
        </div>
      </div>
    </div>
  );
}
