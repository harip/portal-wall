'use client';

import React, { useState, useEffect } from 'react';
import { useCountdownStore } from '../store';
import { Plus, Timer, Trash2, Edit2 } from 'lucide-react';
import { calculateTimeRemaining, formatDate, sortCountdowns } from '../utils';
import { COUNTDOWN_COLORS, COUNTDOWN_CATEGORIES } from '../types';

interface CountdownListProps {
  onAddCountdown: () => void;
  onEditCountdown: (id: string) => void;
}

export default function CountdownList({ onAddCountdown, onEditCountdown }: CountdownListProps) {
  const { countdowns, deleteCountdown } = useCountdownStore();
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update every second for live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sortedCountdowns = sortCountdowns(countdowns);

  const getColorClass = (color: string) => {
    const colorConfig = COUNTDOWN_COLORS.find(c => c.value === color);
    return colorConfig || COUNTDOWN_COLORS[0];
  };

  const getCategoryEmoji = (category: string) => {
    const categoryConfig = COUNTDOWN_CATEGORIES.find(c => c.value === category);
    return categoryConfig?.emoji || '📌';
  };

  const handleDelete = (e: React.MouseEvent, countdownId: string) => {
    e.stopPropagation();
    if (confirm('Delete this countdown?')) {
      deleteCountdown(countdownId);
    }
  };

  if (countdowns.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <Timer size={48} className="text-white/30 mb-4" />
        <p className="text-white/60 mb-2">No countdowns yet</p>
        <p className="text-white/40 text-sm mb-4">Add a countdown to track important dates</p>
        <button
          onClick={onAddCountdown}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
        >
          <Plus size={16} />
          Add Countdown
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      {/* Add button - floating */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onAddCountdown}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Add countdown"
        >
          <Plus size={16} className="text-white/70" />
        </button>
      </div>

      {/* Countdowns list */}
      <div className="space-y-3">
        {sortedCountdowns.map(countdown => {
          const colorConfig = getColorClass(countdown.color);
          const timeRemaining = calculateTimeRemaining(countdown.targetDate, countdown.targetTime);
          
          return (
            <div
              key={countdown.id}
              className={`${colorConfig.bg} rounded-lg p-4 border border-white/10 group`}
            >
              {/* Header with countdown on the right */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">{getCategoryEmoji(countdown.category)}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold ${colorConfig.text}`}>
                      {countdown.title}
                    </h4>
                    <p className="text-xs text-white/50 mt-0.5">
                      {formatDate(countdown.targetDate)}
                      {countdown.targetTime && ` at ${countdown.targetTime}`}
                    </p>
                  </div>
                </div>

                {/* Countdown timer on the right - horizontal layout */}
                {!timeRemaining.isPast ? (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {timeRemaining.days > 0 && (
                      <>
                        <span className={`text-xl font-bold ${colorConfig.text}`}>
                          {timeRemaining.days}
                        </span>
                        <span className="text-xs text-white/50">d</span>
                        <span className={`text-lg ${colorConfig.text}`}>:</span>
                      </>
                    )}
                    <span className={`text-xl font-bold ${colorConfig.text}`}>
                      {timeRemaining.hours.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs text-white/50">h</span>
                    <span className={`text-lg ${colorConfig.text}`}>:</span>
                    <span className={`text-xl font-bold ${colorConfig.text}`}>
                      {timeRemaining.minutes.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs text-white/50">m</span>
                    <span className={`text-lg ${colorConfig.text}`}>:</span>
                    <span className={`text-xl font-bold ${colorConfig.text}`}>
                      {timeRemaining.seconds.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs text-white/50">s</span>
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-red-400 flex-shrink-0">
                    Past
                  </div>
                )}

                {/* Edit/Delete buttons */}
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => onEditCountdown(countdown.id)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
                    aria-label="Edit countdown"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, countdown.id)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/60 hover:text-red-400 transition-all"
                    aria-label="Delete countdown"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
