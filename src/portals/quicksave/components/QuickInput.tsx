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
    <form onSubmit={handleSubmit} className="p-4 border-b border-white/10 bg-white/5">
      <div className="flex gap-2">
        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="px-3 py-2 pr-8 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value} className="bg-slate-900">
              {cat.emoji} {cat.label}
            </option>
          ))}
        </select>

        {/* Input Field */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter movie name, book title, or link..."
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 text-sm"
          autoFocus
        />

        {/* Save Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Save
        </button>
      </div>
    </form>
  );
}
