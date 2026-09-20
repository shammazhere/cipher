import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultLeadership from '../data/leadership.json';
import defaultEvents from '../data/events.json';
import defaultArchive from '../data/archive.json';
import defaultDomains from '../data/domains.json';
import defaultSiteConfig from '../data/siteConfig.json';
import { Leader, EventItem, ArchiveItem, DomainItem, MemberApplication, SiteConfig } from '../types';

/**
 * CIPHER Portal Data Context
 * 
 * Non-technical explanation:
 * This system loads the default data from the JSON files.
 * If an admin edits any text, adds a photo, or moves a section around,
 * those changes are saved in the browser's local memory (localStorage).
 * Anyone can click "Reset to Defaults" in the Admin panel to restore the original hackathon data.
 */

interface DataContextType {
  leadership: Leader[];
  events: EventItem[];
  archive: ArchiveItem[];
  domains: DomainItem[];
  siteConfig: SiteConfig;
  applications: MemberApplication[];
  
  // Leadership management
  updateLeader: (id: string, updated: Partial<Leader>) => void;
  addLeader: (leader: Leader) => void;
  deleteLeader: (id: string) => void;
  reorderLeadership: (startIndex: number, endIndex: number) => void;
  
  // Events management
  updateEvent: (id: string, updated: Partial<EventItem>) => void;
  addEvent: (event: EventItem) => void;
  deleteEvent: (id: string) => void;
  reorderEvents: (startIndex: number, endIndex: number) => void;
  
  // Archive management
  updateActivity: (id: string, updated: Partial<ArchiveItem>) => void;
  addActivity: (item: ArchiveItem) => void;
  deleteActivity: (id: string) => void;
  reorderArchive: (startIndex: number, endIndex: number) => void;

  // Site config management
  updateSiteConfig: (updated: Partial<SiteConfig>) => void;
  
  // Member application submissions
  addApplication: (app: Omit<MemberApplication, 'id' | 'submittedAt'>) => void;
  deleteApplication: (id: string) => void;

  // Reset all data back to original defaults
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'cipher_sjec_portal_data_v2';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage if available, or fall back to defaults
  const [leadership, setLeadership] = useState<Leader[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_leadership');
      return saved ? JSON.parse(saved) : (defaultLeadership as Leader[]);
    } catch {
      return defaultLeadership as Leader[];
    }
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_events');
      return saved ? JSON.parse(saved) : (defaultEvents as EventItem[]);
    } catch {
      return defaultEvents as EventItem[];
    }
  });

  const [archive, setArchive] = useState<ArchiveItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_archive');
      return saved ? JSON.parse(saved) : (defaultArchive as ArchiveItem[]);
    } catch {
      return defaultArchive as ArchiveItem[];
    }
  });

  const [domains, setDomains] = useState<DomainItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_domains');
      return saved ? JSON.parse(saved) : (defaultDomains as DomainItem[]);
    } catch {
      return defaultDomains as DomainItem[];
    }
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_config');
      return saved ? JSON.parse(saved) : (defaultSiteConfig as SiteConfig);
    } catch {
      return defaultSiteConfig as SiteConfig;
    }
  });

  const [applications, setApplications] = useState<MemberApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_applications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save changes to localStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_leadership', JSON.stringify(leadership));
      localStorage.setItem(STORAGE_KEY + '_events', JSON.stringify(events));
      localStorage.setItem(STORAGE_KEY + '_archive', JSON.stringify(archive));
      localStorage.setItem(STORAGE_KEY + '_domains', JSON.stringify(domains));
      localStorage.setItem(STORAGE_KEY + '_config', JSON.stringify(siteConfig));
      localStorage.setItem(STORAGE_KEY + '_applications', JSON.stringify(applications));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [leadership, events, archive, domains, siteConfig, applications]);

  // Leadership methods
  const updateLeader = (id: string, updated: Partial<Leader>) => {
    setLeadership(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l));
  };

  const addLeader = (leader: Leader) => {
    setLeadership(prev => [...prev, leader]);
  };

  const deleteLeader = (id: string) => {
    setLeadership(prev => prev.filter(l => l.id !== id));
  };

  const reorderLeadership = (startIndex: number, endIndex: number) => {
    setLeadership(prev => {
      const list = [...prev];
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);
      return list;
    });
  };

  // Events methods
  const updateEvent = (id: string, updated: Partial<EventItem>) => {
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, ...updated } : ev));
  };

  const addEvent = (event: EventItem) => {
    setEvents(prev => [...prev, event]);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  const reorderEvents = (startIndex: number, endIndex: number) => {
    setEvents(prev => {
      const list = [...prev];
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);
      return list;
    });
  };

  // Archive methods
  const updateActivity = (id: string, updated: Partial<ArchiveItem>) => {
    setArchive(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
  };

  const addActivity = (item: ArchiveItem) => {
    setArchive(prev => [...prev, item]);
  };

  const deleteActivity = (id: string) => {
    setArchive(prev => prev.filter(a => a.id !== id));
  };

  const reorderArchive = (startIndex: number, endIndex: number) => {
    setArchive(prev => {
      const list = [...prev];
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);
      return list;
    });
  };

  // Site config
  const updateSiteConfig = (updated: Partial<SiteConfig>) => {
    setSiteConfig(prev => ({ ...prev, ...updated }));
  };

  // Member applications
  const addApplication = (app: Omit<MemberApplication, 'id' | 'submittedAt'>) => {
    const newEntry: MemberApplication = {
      ...app,
      id: 'app_' + Date.now(),
      submittedAt: new Date().toLocaleString(),
    };
    setApplications(prev => [newEntry, ...prev]);
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  // Reset to original data
  const resetToDefaults = () => {
    setLeadership(defaultLeadership as Leader[]);
    setEvents(defaultEvents as EventItem[]);
    setArchive(defaultArchive as ArchiveItem[]);
    setDomains(defaultDomains as DomainItem[]);
    setSiteConfig(defaultSiteConfig as SiteConfig);
    try {
      localStorage.removeItem(STORAGE_KEY + '_leadership');
      localStorage.removeItem(STORAGE_KEY + '_events');
      localStorage.removeItem(STORAGE_KEY + '_archive');
      localStorage.removeItem(STORAGE_KEY + '_domains');
      localStorage.removeItem(STORAGE_KEY + '_config');
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
    }
  };

  return (
    <DataContext.Provider
      value={{
        leadership,
        events,
        archive,
        domains,
        siteConfig,
        applications,
        updateLeader,
        addLeader,
        deleteLeader,
        reorderLeadership,
        updateEvent,
        addEvent,
        deleteEvent,
        reorderEvents,
        updateActivity,
        addActivity,
        deleteActivity,
        reorderArchive,
        updateSiteConfig,
        addApplication,
        deleteApplication,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
