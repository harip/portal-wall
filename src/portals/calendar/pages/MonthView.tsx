'use client';

import React, { useMemo, useState } from 'react';
import { useCalendarStore } from '../store';
import { getMonthDays, formatDate, getMonthName, getDayName } from '../utils';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { EVENT_COLORS } from '../types';

interface MonthViewProps {
  onAddEvent: (date: string) => void;
  onViewDayEvents: () => void;
}

export default function MonthView({ onAddEvent, onViewDayEvents }: MonthViewProps) {
  const { events, currentMonth, currentYear, selectedDate, goToToday, nextMonth, prevMonth, setSelectedDate } = useCalendarStore();

  const days = useMemo(() => {
    const monthDays = getMonthDays(currentYear, currentMonth);
    
    // Attach events to days
    return monthDays.map(day => {
      const dayDateStr = formatDate(day.date);
      const dayEvents = events.filter(event => event.date === dayDateStr);
      return { ...day, events: dayEvents };
    });
  }, [currentMonth, currentYear, events]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    onAddEvent(formatDate(date));
  };

  const handleDotClick = (e: React.MouseEvent, date: Date) => {
    e.stopPropagation(); // Prevent triggering day click
    setSelectedDate(date);
    onViewDayEvents();
  };

  const getColorClass = (color: string) => {
    const colorConfig = EVENT_COLORS.find(c => c.value === color);
    return colorConfig?.bg || 'bg-blue-500/20';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with navigation */}
      <div className="px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white">
            {getMonthName(currentMonth)} {currentYear}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1 text-xs rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Today
            </button>
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-auto p-3">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {[0, 1, 2, 3, 4, 5, 6].map(day => (
            <div key={day} className="text-center text-xs font-medium text-white/60 py-1">
              {getDayName(day)}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDayClick(day.date)}
              className={`
                aspect-square p-1 rounded-lg text-xs transition-all relative
                ${day.isCurrentMonth ? 'text-white' : 'text-white/30'}
                ${day.isToday ? 'bg-blue-500/30 ring-2 ring-blue-400' : 'bg-white/5 hover:bg-white/10'}
              `}
            >
              <div className="font-medium">{day.dayNumber}</div>
              
              {/* Event indicator - larger red dot */}
              {day.events.length > 0 && (
                <button
                  onClick={(e) => handleDotClick(e, day.date)}
                  className="absolute top-1 right-1 p-0.5 hover:scale-125 transition-transform"
                  aria-label="View events"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                </button>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
