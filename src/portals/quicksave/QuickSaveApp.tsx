'use client';

import React, { useState, useEffect } from 'react';
import { Film, Book, Link as LinkIcon, Tag, List } from 'lucide-react';
import QuickInput from './components/QuickInput';
import ItemList from './components/ItemList';
import { useQuickSaveStore } from './store';
import { Category } from './types';

type TabType = 'all' | Category;

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'all', label: 'All', icon: <List size={14} /> },
  { id: 'movie', label: 'Movies', icon: <Film size={14} /> },
  { id: 'book', label: 'Books', icon: <Book size={14} /> },
  { id: 'link', label: 'Links', icon: <LinkIcon size={14} /> },
  { id: 'other', label: 'Other', icon: <Tag size={14} /> },
];

export default function QuickSaveApp() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const { setHydrated, hydrated, items } = useQuickSaveStore();

  useEffect(() => {
    if (!hydrated) {
      setHydrated();
    }
  }, [hydrated, setHydrated]);

  return (
    <div className="flex flex-col h-full">
      {/* Input Section */}
      <QuickInput />

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1 px-3 py-2 border-b border-white/10 bg-white/5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white/90 hover:bg-white/10'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <ItemList 
          items={items} 
          categoryFilter={activeTab === 'all' ? 'all' : activeTab}
        />
      </div>
    </div>
  );
}
