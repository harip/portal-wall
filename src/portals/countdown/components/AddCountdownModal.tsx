'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCountdownStore } from '../store';
import { COUNTDOWN_COLORS, COUNTDOWN_CATEGORIES, CountdownColor, CountdownCategory } from '../types';

interface AddCountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  editCountdownId?: string;
}

export default function AddCountdownModal({ isOpen, onClose, editCountdownId }: AddCountdownModalProps) {
  const { countdowns, addCountdown, updateCountdown } = useCountdownStore();
  
  const editCountdown = editCountdownId ? countdowns.find(c => c.id === editCountdownId) : null;
  
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [color, setColor] = useState<CountdownColor>('blue');
  const [category, setCategory] = useState<CountdownCategory>('event');

  useEffect(() => {
    if (isOpen) {
      if (editCountdown) {
        setTitle(editCountdown.title);
        setTargetDate(editCountdown.targetDate);
        setTargetTime(editCountdown.targetTime || '');
        setColor(editCountdown.color);
        setCategory(editCountdown.category);
      } else {
        setTitle('');
        setTargetDate('');
        setTargetTime('');
        setColor('blue');
        setCategory('event');
      }
    }
  }, [isOpen, editCountdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !targetDate) return;

    const countdownData = {
      title: title.trim(),
      targetDate,
      targetTime: targetTime || undefined,
      color,
      category,
    };

    if (editCountdownId) {
      updateCountdown(editCountdownId, countdownData);
    } else {
      addCountdown(countdownData);
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
            {editCountdownId ? 'Edit Countdown' : 'Add Countdown'}
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
              placeholder="e.g., Summer Vacation"
              required
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
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
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
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Category
            </label>
            <div className="grid grid-cols-5 gap-2">
              {COUNTDOWN_CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`
                    p-2 rounded-lg flex flex-col items-center gap-1 transition-all
                    ${category === cat.value 
                      ? 'bg-white/20 ring-2 ring-white/40' 
                      : 'bg-white/5 hover:bg-white/10'}
                  `}
                  title={cat.label}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="text-xs text-white/70">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {COUNTDOWN_COLORS.map(colorOption => (
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
              {editCountdownId ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
