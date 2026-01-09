'use client';

import React from 'react';
import { TEST_PLAYING_NATIONS } from '../types';

export default function Teams() {
  return (
    <div className="h-full overflow-auto p-4">
      <h3 className="text-white/90 font-semibold mb-4">Test Playing Nations</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {TEST_PLAYING_NATIONS.map((team) => (
          <div
            key={team.code}
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors text-center"
          >
            <div className="text-4xl mb-2">{team.flag}</div>
            <div className="text-sm font-medium text-white/90">{team.name}</div>
            <div className="text-xs text-white/50 mt-1">{team.code}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <div className="text-xs text-blue-300">
          <strong>Note:</strong> Cricket data is provided by CricAPI. Live scores update automatically.
        </div>
      </div>
    </div>
  );
}
