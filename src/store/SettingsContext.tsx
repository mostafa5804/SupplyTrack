import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/utils';

interface Settings {
  projectName: string;
  companyName: string;
  logoUrl: string;
}

interface SettingsContextType {
  settings: Settings;
  refreshSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    projectName: 'سامانه درخواست کالا',
    companyName: 'شرکت فولاد صنعت',
    logoUrl: ''
  });

  const refreshSettings = () => {
    api.get('/settings').then(res => setSettings(res.data)).catch(console.error);
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  useEffect(() => {
    document.title = settings.projectName;
  }, [settings.projectName]);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
