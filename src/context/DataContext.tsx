import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import defaultLeadership from '../data/leadership.json';
import defaultEvents from '../data/events.json';
import defaultArchive from '../data/archive.json';
import defaultDomains from '../data/domains.json';
import defaultSiteConfig from '../data/siteConfig.json';
import { Leader, EventItem, ArchiveItem, DomainItem, MemberApplication, SiteConfig } from '../types';
import { supabase } from '../lib/supabase';

/**
 * CIPHER Portal Data Context
 * 
 * Connected to Supabase Cloud Database:
 * - Applications are persisted directly to the 'applications' table in Supabase.
 * - Real-time changes are synchronized so new submissions appear instantly.
 * - CMS content (leadership, events, archive, domains, siteConfig) is synced to 'club_content'.
 * - Zero localStorage dependencies for user data.
 */

interface DataContextType {
  leadership: Leader[];
  events: EventItem[];
  archive: ArchiveItem[];
  domains: DomainItem[];
  siteConfig: SiteConfig;
  applications: MemberApplication[];
  isSupabaseConnected: boolean;
  isLoadingApplications: boolean;
  
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
  addApplication: (app: Omit<MemberApplication, 'id' | 'submittedAt'>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  refreshApplications: () => Promise<void>;

  // Reset all data back to original defaults
  resetToDefaults: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leadership, setLeadership] = useState<Leader[]>(defaultLeadership as Leader[]);
  const [events, setEvents] = useState<EventItem[]>(defaultEvents as EventItem[]);
  const [archive, setArchive] = useState<ArchiveItem[]>(defaultArchive as ArchiveItem[]);
  const [domains, setDomains] = useState<DomainItem[]>(defaultDomains as DomainItem[]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig as SiteConfig);
  const [applications, setApplications] = useState<MemberApplication[]>([]);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState<boolean>(false);

  // Helper to sync CMS collections to Supabase club_content
  const syncContentToSupabase = useCallback(async (key: string, value: unknown) => {
    try {
      await supabase.from('club_content').upsert(
        {
          key,
          value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );
    } catch (err) {
      console.warn(`[Supabase CMS Sync] Error syncing ${key}:`, err);
    }
  }, []);

  // Fetch applications from Supabase
  const refreshApplications = useCallback(async () => {
    setIsLoadingApplications(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Applications fetch notice:', error.message);
        setIsSupabaseConnected(false);
        return;
      }

      setIsSupabaseConnected(true);
      if (data) {
        setApplications(
          data.map((row) => ({
            id: row.id,
            name: row.name || 'Anonymous Operative',
            email: row.email || '',
            message: row.message || '',
            usn: row.usn || '',
            semester: row.semester || '',
            domain: row.domain || 'General',
            submittedAt: row.created_at
              ? new Date(row.created_at).toLocaleString()
              : new Date().toLocaleString(),
          }))
        );
      }
    } catch (err) {
      console.warn('[Supabase] Could not query applications:', err);
      setIsSupabaseConnected(false);
    } finally {
      setIsLoadingApplications(false);
    }
  }, []);

  // Fetch CMS content from Supabase
  const refreshCMSContent = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('club_content').select('*');
      if (!error && data && data.length > 0) {
        data.forEach((row: { key: string; value: unknown }) => {
          if (row.key === 'leadership' && Array.isArray(row.value)) setLeadership(row.value as Leader[]);
          if (row.key === 'events' && Array.isArray(row.value)) setEvents(row.value as EventItem[]);
          if (row.key === 'archive' && Array.isArray(row.value)) setArchive(row.value as ArchiveItem[]);
          if (row.key === 'domains' && Array.isArray(row.value)) setDomains(row.value as DomainItem[]);
          if (row.key === 'siteConfig' && row.value) setSiteConfig(row.value as SiteConfig);
        });
      }
    } catch (err) {
      console.warn('[Supabase] Club content sync notice:', err);
    }
  }, []);

  // Initialize data from Supabase & attach Realtime subscription
  useEffect(() => {
    refreshApplications();
    refreshCMSContent();

    // Subscribe to Postgres changes on 'applications'
    const channel = supabase
      .channel('applications-portal-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        () => {
          refreshApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshApplications, refreshCMSContent]);

  // Leadership methods
  const updateLeader = (id: string, updated: Partial<Leader>) => {
    setLeadership((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, ...updated } : l));
      syncContentToSupabase('leadership', next);
      return next;
    });
  };

  const addLeader = (leader: Leader) => {
    setLeadership((prev) => {
      const next = [...prev, leader];
      syncContentToSupabase('leadership', next);
      return next;
    });
  };

  const deleteLeader = (id: string) => {
    setLeadership((prev) => {
      const next = prev.filter((l) => l.id !== id);
      syncContentToSupabase('leadership', next);
      return next;
    });
  };

  const reorderLeadership = (startIndex: number, endIndex: number) => {
    setLeadership((prev) => {
      const list = [...prev];
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);
      syncContentToSupabase('leadership', list);
      return list;
    });
  };

  // Events methods
  const updateEvent = (id: string, updated: Partial<EventItem>) => {
    setEvents((prev) => {
      const next = prev.map((ev) => (ev.id === id ? { ...ev, ...updated } : ev));
      syncContentToSupabase('events', next);
      return next;
    });
  };

  const addEvent = (event: EventItem) => {
    setEvents((prev) => {
      const next = [...prev, event];
      syncContentToSupabase('events', next);
      return next;
    });
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => {
      const next = prev.filter((ev) => ev.id !== id);
      syncContentToSupabase('events', next);
      return next;
    });
  };

  const reorderEvents = (startIndex: number, endIndex: number) => {
    setEvents((prev) => {
      const list = [...prev];
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);
      syncContentToSupabase('events', list);
      return list;
    });
  };

  // Archive methods
  const updateActivity = (id: string, updated: Partial<ArchiveItem>) => {
    setArchive((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, ...updated } : a));
      syncContentToSupabase('archive', next);
      return next;
    });
  };

  const addActivity = (item: ArchiveItem) => {
    setArchive((prev) => {
      const next = [...prev, item];
      syncContentToSupabase('archive', next);
      return next;
    });
  };

  const deleteActivity = (id: string) => {
    setArchive((prev) => {
      const next = prev.filter((a) => a.id !== id);
      syncContentToSupabase('archive', next);
      return next;
    });
  };

  const reorderArchive = (startIndex: number, endIndex: number) => {
    setArchive((prev) => {
      const list = [...prev];
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);
      syncContentToSupabase('archive', list);
      return list;
    });
  };

  // Site config
  const updateSiteConfig = (updated: Partial<SiteConfig>) => {
    setSiteConfig((prev) => {
      const next = { ...prev, ...updated };
      syncContentToSupabase('siteConfig', next);
      return next;
    });
  };

  // Member applications: direct Supabase insert
  const addApplication = async (app: Omit<MemberApplication, 'id' | 'submittedAt'>) => {
    const tempId = 'temp_' + Date.now();
    const optimisticEntry: MemberApplication = {
      ...app,
      id: tempId,
      submittedAt: new Date().toLocaleString(),
    };

    // Optimistic UI update
    setApplications((prev) => [optimisticEntry, ...prev]);

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            name: app.name,
            email: app.email,
            message: app.message,
            usn: app.usn || '',
            semester: app.semester || '',
            domain: app.domain || '',
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setApplications((prev) =>
          prev.map((a) =>
            a.id === tempId
              ? {
                  ...a,
                  id: data.id,
                  submittedAt: new Date(data.created_at).toLocaleString(),
                }
              : a
          )
        );
      }
    } catch (err) {
      // Rollback optimistic update on failure
      setApplications((prev) => prev.filter((a) => a.id !== tempId));
      throw err;
    }
  };

  // Member applications: direct Supabase delete
  const deleteApplication = async (id: string) => {
    // Optimistic UI update
    setApplications((prev) => prev.filter((a) => a.id !== id));

    try {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) {
        console.error('[Supabase] Failed to delete application:', error);
        refreshApplications();
      }
    } catch (err) {
      console.error('[Supabase] Error deleting application:', err);
      refreshApplications();
    }
  };

  // Reset to original data
  const resetToDefaults = async () => {
    setLeadership(defaultLeadership as Leader[]);
    setEvents(defaultEvents as EventItem[]);
    setArchive(defaultArchive as ArchiveItem[]);
    setDomains(defaultDomains as DomainItem[]);
    setSiteConfig(defaultSiteConfig as SiteConfig);

    try {
      await supabase.from('club_content').delete().neq('key', '');
    } catch (e) {
      console.warn('[Supabase] Error resetting cloud content:', e);
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
        isSupabaseConnected,
        isLoadingApplications,
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
        refreshApplications,
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
