'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, List } from 'lucide-react';
import MonthView from './pages/MonthView';
import EventList from './pages/EventList';
import AddEventModal from './components/AddEventModal';
import { useCalendarStore } from './store';
import { usePortalHeader } from '@/components/portal/PortalHeaderContext';

type TabType = 'month' | 'events';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'month', label: 'Month', icon: <CalendarIcon size={14} /> },
  { id: 'events', label: 'Events', icon: <List size={14} /> },
];

export default function CalendarApp() {
  const [activeTab, setActiveTab] = useState<TabType>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editEventId, setEditEventId] = useState<string | undefined>();
  const { setHydrated, hydrated } = useCalendarStore();
  const { setHeaderRight } = usePortalHeader();

  useEffect(() => {
    if (!hydrated) {
      setHydrated();
    }
  }, [hydrated, setHydrated]);

  // Set header tabs
  useEffect(() => {
    setHeaderRight(
      <nav className="flex items-center gap-1">
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
    );

    return () => {
      setHeaderRight(null);
    };
  }, [activeTab, setHeaderRight]);

  const handleAddEvent = (date: string) => {
    setSelectedDate(date);
    setEditEventId(undefined);
    setIsModalOpen(true);
  };

  const handleEditEvent = (eventId: string) => {
    setEditEventId(eventId);
    setIsModalOpen(true);
  };

  const handleViewDayEvents = () => {
    setActiveTab('events');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'month':
        return <MonthView onAddEvent={handleAddEvent} onViewDayEvents={handleViewDayEvents} />;
      case 'events':
        return <EventList onEditEvent={handleEditEvent} />;
      default:
        return <MonthView onAddEvent={handleAddEvent} onViewDayEvents={handleViewDayEvents} />;
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDate={selectedDate}
        editEventId={editEventId}
      />
    </div>
  );
}
