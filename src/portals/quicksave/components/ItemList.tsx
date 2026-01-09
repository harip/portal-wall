'use client';

import React, { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useQuickSaveStore } from '../store';
import { QuickSaveItem, Category, CATEGORIES } from '../types';

interface ItemListProps {
  items: QuickSaveItem[];
  categoryFilter?: Category | 'all';
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });
  return `${dateStr} ${timeStr}`;
}

function getCategoryConfig(category: Category) {
  return CATEGORIES.find(c => c.value === category) || CATEGORIES[3];
}

export default function ItemList({ items, categoryFilter = 'all' }: ItemListProps) {
  const { updateItem, deleteItem } = useQuickSaveStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<Category>('other');

  // Filter items by category
  const filteredItems = categoryFilter === 'all' 
    ? items 
    : items.filter(item => item.category === categoryFilter);

  // Sort by createdAt descending (newest first)
  const sortedItems = [...filteredItems].sort((a, b) => b.createdAt - a.createdAt);

  const handleEdit = (item: QuickSaveItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditCategory(item.category);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      updateItem(id, {
        title: editTitle.trim(),
        category: editCategory,
      });
    }
    setEditingId(null);
    setEditTitle('');
    setEditCategory('other');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditCategory('other');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this item?')) {
      deleteItem(id);
    }
  };

  if (sortedItems.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <p className="text-white/60 mb-2">No items yet</p>
        <p className="text-white/40 text-sm">
          {categoryFilter === 'all' 
            ? 'Add items using the input above' 
            : `No ${categoryFilter} items yet`}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="space-y-3">
        {sortedItems.map(item => {
          const categoryConfig = getCategoryConfig(item.category);
          const isEditing = editingId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white/5 rounded-lg p-4 border border-white/10 group hover:bg-white/10 transition-colors"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as Category)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value} className="bg-slate-900">
                          {cat.emoji} {cat.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(item.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleCancelEdit}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
                      aria-label="Cancel"
                    >
                      <X size={14} />
                    </button>
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="p-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 transition-all"
                      aria-label="Save"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xl flex-shrink-0">{categoryConfig.emoji}</span>
                    <h4 className="text-sm font-semibold text-white truncate">
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-xs text-white/50 whitespace-nowrap">
                      {formatTimestamp(item.createdAt)}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
                        aria-label="Edit item"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/60 hover:text-red-400 transition-all"
                        aria-label="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
