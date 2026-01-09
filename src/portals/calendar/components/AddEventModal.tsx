'use client';

import React, { useState, useEffect } from 'react';
import { useCalendarStore } from '../store';
import { X } from 'lucide-react';
import { EVENT_COLORS, EventColor, CalendarEvent } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  editEventId?: string;
}

export default function AddEventModal({ isOpen, onClose, initialDate, editEventId }: AddEventModalProps) {
  const { events, addEvent, updateEvent } = useCalendarStore();
  
  const editEvent = editEventId ? events.find(e => e.id === editEventId) : null;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [color, setColor] = useState<EventColor>('blue');
  const [reminder, setReminder] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editEvent) {
        setTitle(editEvent.title);
        setDescription(editEvent.description || '');
        setDate(editEvent.date);
        setTime(editEvent.time || '');
        setColor(editEvent.color);
        setReminder(editEvent.reminder || false);
      } else {
        setTitle('');
        setDescription('');
        setDate(initialDate || '');
        setTime('');
        setColor('blue');
        setReminder(false);
      }
    }
  }, [isOpen, editEvent, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !date) return;

    const eventData = {
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      time: time || undefined,
      color,
      reminder,
    };

    if (editEventId) {
      updateEvent(editEventId, eventData);
    } else {
      addEvent(eventData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/95 rounded-xl border border-white/20 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            {editEventId ? 'Edit Event' : 'Add Event'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30"
              placeholder="Event title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 resize-none"
              placeholder="Event description"
              rows={2}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {EVENT_COLORS.map(colorOption => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => setColor(colorOption.value)}
                  className={`
                    w-8 h-8 rounded-lg ${colorOption.bg} 
                    ${color === colorOption.value ? 'ring-2 ring-white' : ''}
                    transition-all hover:scale-110
                  `}
                  aria-label={colorOption.label}
                />
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="reminder"
              checked={reminder}
              onChange={(e) => setReminder(e.target.checked)}
              className="w-4 h-4 rounded bg-white/5 border-white/10"
            />
            <label htmlFor="reminder" className="text-sm text-white/90">
              Set reminder
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
            >
              {editEventId ? 'Update' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
