'use client';

import React, { useState, useEffect } from 'react';
import CountdownList from './pages/CountdownList';
import AddCountdownModal from './components/AddCountdownModal';
import { useCountdownStore } from './store';

export default function CountdownApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCountdownId, setEditCountdownId] = useState<string | undefined>();
  const { setHydrated, hydrated } = useCountdownStore();

  useEffect(() => {
    if (!hydrated) {
      setHydrated();
    }
  }, [hydrated, setHydrated]);

  const handleAddCountdown = () => {
    setEditCountdownId(undefined);
    setIsModalOpen(true);
  };

  const handleEditCountdown = (countdownId: string) => {
    setEditCountdownId(countdownId);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full relative">

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <CountdownList 
          onAddCountdown={handleAddCountdown}
          onEditCountdown={handleEditCountdown}
        />
      </div>

      {/* Add Countdown Modal */}
      <AddCountdownModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editCountdownId={editCountdownId}
      />
    </div>
  );
}
