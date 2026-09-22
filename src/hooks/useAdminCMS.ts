import { useState, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { supabase } from '../lib/supabase';

/**
 * useAdminCMS Hook
 * 
 * Connected to Supabase Cloud Database:
 * 1. Exports current events, team members, and archive as standard downloadable JSON files.
 * 2. Imports JSON files directly into Supabase cloud database with zero localStorage.
 * 3. Manages active CMS tabs and quick search filters.
 */

export type CMSTab = 'events' | 'leadership' | 'archive' | 'applications' | 'settings' | 'approvals';

export function useAdminCMS() {
  const data = useData();
  const [activeTab, setActiveTab] = useState<CMSTab>('events');
  const [cmsSearch, setCmsSearch] = useState('');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3000);
  }, []);

  /**
   * Export JSON files for club leads to easily update the repository
   */
  const exportJSON = useCallback((type: 'events' | 'leadership' | 'archive' | 'all') => {
    let payload: unknown;
    let filename: string;

    if (type === 'events') {
      payload = data.events;
      filename = 'events.json';
    } else if (type === 'leadership') {
      payload = data.leadership;
      filename = 'leadership.json';
    } else if (type === 'archive') {
      payload = data.archive;
      filename = 'archive.json';
    } else {
      payload = {
        events: data.events,
        leadership: data.leadership,
        archive: data.archive,
        siteConfig: data.siteConfig,
        exportedAt: new Date().toISOString(),
      };
      filename = 'cipher_complete_backup.json';
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    notify(`Downloaded ${filename} successfully.`);
  }, [data, notify]);

  /**
   * Import JSON file and upload directly to Supabase
   */
  const importJSON = useCallback((file: File, type: 'events' | 'leadership' | 'archive') => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed)) {
          alert('Invalid JSON: Root must be a JSON array of items.');
          return;
        }

        // Upload directly to Supabase cloud database
        const { error } = await supabase.from('club_content').upsert(
          {
            key: type,
            value: parsed,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

        if (error) {
          throw error;
        }

        notify(`Imported ${parsed.length} items directly to Supabase successfully.`);
        window.location.reload();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error importing JSON to Supabase.';
        alert(msg);
      }
    };
    reader.readAsText(file);
  }, [notify]);

  return {
    ...data,
    activeTab,
    setActiveTab,
    cmsSearch,
    setCmsSearch,
    statusNotification,
    exportJSON,
    importJSON,
  };
}
