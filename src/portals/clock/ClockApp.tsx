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

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      {/* Time Display */}
      <div className="flex items-center gap-2 mb-4">
        <div className="text-center">
          <div className="text-6xl font-light text-white tabular-nums tracking-tight">
            {hours}
          </div>
        </div>
        <div className="text-6xl font-light text-white/50 animate-pulse">:</div>
        <div className="text-center">
          <div className="text-6xl font-light text-white tabular-nums tracking-tight">
            {minutes}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-light text-white/40 tabular-nums tracking-tight self-start mt-2">
            {seconds}
          </div>
        </div>
      </div>

      {/* Date Display */}
      <div className="text-white/60 text-sm font-medium">{date}</div>

      {/* Time Zone */}
      <div className="mt-4 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs text-white/50">
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </p>
      </div>
    </div>
  );
}
