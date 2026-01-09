'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PortalHeaderContextType {
  headerRight: ReactNode | null;
  setHeaderRight: (content: ReactNode | null) => void;
}

const PortalHeaderContext = createContext<PortalHeaderContextType | undefined>(undefined);

export function PortalHeaderProvider({ children }: { children: ReactNode }) {
  const [headerRight, setHeaderRight] = useState<ReactNode | null>(null);

  return (
    <PortalHeaderContext.Provider value={{ headerRight, setHeaderRight }}>
      {children}
    </PortalHeaderContext.Provider>
  );
}

export function usePortalHeader() {
  const context = useContext(PortalHeaderContext);
  if (!context) {
    throw new Error('usePortalHeader must be used within PortalHeaderProvider');
  }
  return context;
}
