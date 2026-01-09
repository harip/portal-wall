'use client';

import React from 'react';
import { useCalendarStore } from '../store';
import { getUpcomingEvents, formatEventDate } from '../utils';
import { Clock, Trash2, Calendar } from 'lucide-react';
import { EVENT_COLORS } from '../types';

interface EventListProps {
  onEditEvent: (eventId: string) => void;
}

export default function EventList({ onEditEvent }: EventListProps) {
  const { events, deleteEvent } = useCalendarStore();

  const upcomingEvents = getUpcomingEvents(events, 30); // Next 30 days

  const getColorClass = (color: string) => {
    const colorConfig = EVENT_COLORS.find(c => c.value === color);
    return colorConfig || EVENT_COLORS[0];
  };

  const handleDelete = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (confirm('Delete this event?')) {
      deleteEvent(eventId);
    }
  };

  if (upcomingEvents.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <Calendar size={48} className="text-white/30 mb-4" />
        <p className="text-white/60 mb-2">No upcoming events</p>
        <p className="text-white/40 text-sm">Add events from the calendar view</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <h3 className="text-sm font-semibold text-white/90 mb-3">Upcoming Events</h3>
      
      <div className="space-y-2">
        {upcomingEvents.map(event => {
          const colorConfig = getColorClass(event.color);
          
          return (
            <button
              key={event.id}
              onClick={() => onEditEvent(event.id)}
              className={`w-full ${colorConfig.bg} rounded-lg p-3 border border-white/10 hover:border-white/30 transition-all text-left group`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${colorConfig.text} mb-1`}>
                    {event.title}
                  </div>
                  
                  {event.description && (
                    <div className="text-xs text-white/60 mb-2">
                      {event.description}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <span>{formatEventDate(event)}</span>
                    {event.time && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{event.time}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => handleDelete(e, event.id)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/60 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Delete event"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
