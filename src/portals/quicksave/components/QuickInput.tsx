'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuickSaveStore } from '../store';
import { Category, CATEGORIES } from '../types';

export default function QuickInput() {
  const { addItem } = useQuickSaveStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    addItem({
      title: title.trim(),
      category,
    });

    // Reset form
    setTitle('');
    setCategory('other');
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-b border-white/10 bg-white/5">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex gap-2 flex-1">
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="px-2 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 w-24 sm:w-auto"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value} className="bg-slate-900">
                {cat.emoji} <span className="hidden sm:inline">{cat.label}</span>
              </option>
            ))}
          </select>

          {/* Input Field */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name, title, or link..."
            className="flex-1 min-w-0 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 text-sm"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:w-auto w-full"
        >
          <Plus size={16} />
          <span>Save</span>
        </button>
      </div>
    </form>
  );
}
