'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Calendar, MapPin, Check } from 'lucide-react';
import { useClockStore } from '../store';
import { Reminder } from '../types';
import { format } from 'date-fns';

export default function Reminders() {
  const { locations, reminders, addReminder, removeReminder, markReminderNotified } = useClockStore();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [description, setDescription] = useState('');
  const [applyToAll, setApplyToAll] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);

  // Check for reminders that should notify
  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date();
      reminders.forEach(reminder => {
        if (!reminder.notified && reminder.notify) {
          const reminderTime = new Date(reminder.dateTime);
          if (reminderTime <= now) {
            // Show notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Reminder', {
                body: `${reminder.locationName}: ${reminder.description}`,
                icon: '/clock-icon.png',
              });
            }
            markReminderNotified(reminder.id);
          }
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkReminders);
  }, [reminders, markReminderNotified]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !description.trim()) return;

    const dateTimeString = `${selectedDate}T${selectedTime}`;
    const selectedLocation = locations.find(l => l.id === selectedLocationId);
    
    if (!selectedLocation) return;

    if (applyToAll) {
      // Add reminder for all locations
      locations.forEach(location => {
        const newReminder: Reminder = {
          id: `${Date.now()}-${location.id}`,
          locationId: location.id,
          locationName: `${location.city}, ${location.country}`,
          timezone: location.timezone,
          dateTime: dateTimeString,
          description,
          notify: enableNotifications,
          notified: false,
        };
        addReminder(newReminder);
      });
    } else {
      // Add reminder for selected location only
      const newReminder: Reminder = {
        id: `${Date.now()}`,
        locationId: selectedLocation.id,
        locationName: `${selectedLocation.city}, ${selectedLocation.country}`,
        timezone: selectedLocation.timezone,
        dateTime: dateTimeString,
        description,
        notify: enableNotifications,
        notified: false,
      };
      addReminder(newReminder);
    }

    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setDescription('');
    setApplyToAll(false);
    setEnableNotifications(true);
    setShowAddForm(false);
  };

  // Group reminders by location
  const remindersByLocation = locations.map(location => ({
    location,
    reminders: reminders.filter(r => r.locationId === location.id),
  }));

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white/90">Reminders</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          {showAddForm ? <Check size={16} className="text-white" /> : <Plus size={16} className="text-white" />}
        </button>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Location Select */}
            <div>
              <label className="text-xs text-white/60 mb-1 block">Location</label>
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id} className="bg-gray-800">
                    {loc.city}, {loc.country}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-white/60 mb-1 block">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1 block">Time</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-white/60 mb-1 block">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter reminder text..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              />
            </div>

            {/* Checkboxes */}
            {locations.length > 1 && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyToAll}
                  onChange={(e) => setApplyToAll(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20"
                />
                <span className="text-sm text-white/80">
                  Add to all locations (adjusts for timezones)
                </span>
              </label>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
                className="w-4 h-4 rounded border-white/20"
              />
              <span className="text-sm text-white/80">
                Notify when time is up
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-white text-sm font-medium transition-colors"
            >
              Add Reminder
            </button>
          </form>
        </div>
      )}

      {/* Reminders List by Location */}
      <div className="space-y-4">
        {remindersByLocation.map(({ location, reminders: locReminders }) => (
          locReminders.length > 0 && (
            <div key={location.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-white/60" />
                <h4 className="text-sm font-medium text-white/90">
                  {location.city}, {location.country}
                </h4>
              </div>

              <div className="space-y-2">
                {locReminders.map(reminder => {
                  const reminderDate = new Date(reminder.dateTime);
                  const isPast = reminderDate < new Date();
                  
                  return (
                    <div
                      key={reminder.id}
                      className={`flex items-start justify-between p-3 rounded-lg ${
                        isPast ? 'bg-white/5 opacity-60' : 'bg-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <Bell size={14} className={`mt-0.5 ${reminder.notify ? 'text-blue-400' : 'text-white/40'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">{reminder.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar size={12} className="text-white/40" />
                            <p className="text-white/50 text-xs">
                              {format(reminderDate, 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                          {isPast && reminder.notified && (
                            <p className="text-green-400 text-xs mt-1">✓ Notified</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeReminder(reminder.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} className="text-white/60" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ))}

        {reminders.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-white/20 mb-3" />
            <p className="text-white/50 text-sm">No reminders yet</p>
            <p className="text-white/30 text-xs mt-1">Click + to add a reminder</p>
          </div>
        )}
      </div>
    </div>
  );
}
