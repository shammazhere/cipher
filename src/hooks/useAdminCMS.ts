import { useState, useCallback } from 'react';
import { useData } from '../context/DataContext';

/**
 * useAdminCMS Hook
 * 
 * Non-technical explanation:
 * Provides advanced content management utilities for non-developer club leads:
 * 1. Exports current events, team members, and archive as standard downloadable JSON files
 *    so non-technical students can save backups or update the repo directly.
 * 2. Imports JSON files directly from the user's computer with schema validation.
 * 3. Manages active CMS tabs and quick search filters.
 */

export type CMSTab = 'events' | 'leadership' | 'archive' | 'applications' | 'settings';

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
   * Import JSON file and load into state
   */
  const importJSON = useCallback((file: File, type: 'events' | 'leadership' | 'archive') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed)) {
          alert('Invalid JSON: Root must be a JSON array of items.');
          return;
        }

        if (type === 'events') {
          // Re-load events
          localStorage.setItem('cipher_events', JSON.stringify(parsed));
          window.location.reload();
        } else if (type === 'leadership') {
          localStorage.setItem('cipher_leadership', JSON.stringify(parsed));
          window.location.reload();
        } else if (type === 'archive') {
          localStorage.setItem('cipher_archive', JSON.stringify(parsed));
          window.location.reload();
        }

        notify(`Imported ${parsed.length} items successfully.`);
      } catch (err) {
        alert('Error parsing JSON file. Please check file format.');
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
