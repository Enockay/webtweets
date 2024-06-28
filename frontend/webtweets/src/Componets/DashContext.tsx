import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Section = 'home' | 'create project' | 'projects' | 'settings' | 'badges';

interface DashboardContextType {
  currentSection: Section;
  setCurrentSection: React.Dispatch<React.SetStateAction<Section>>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<Section>('home');

  return (
    <DashboardContext.Provider value={{ currentSection, setCurrentSection }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
