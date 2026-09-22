import React, { useState, useRef } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Plus,
  Eye,
  Check,
  Calendar,
  Users,
  Archive,
  Inbox,
  Settings as SettingsIcon,
  X,
  ExternalLink,
  LogOut,
  RefreshCw,
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
} from 'lucide-react';
import { EventItem, Leader, ArchiveItem, MemberApplication } from '../../types';
import { useAdminCMS } from '../../hooks/useAdminCMS';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { handleImageError } from '../../utils/imageFallback';

/**
 * Admin Dashboard & Content Management System (CMS)
 * 
 * Non-technical explanation:
 * This interface lets association leads and organizers update photos, change descriptions,
 * reorder the display order (positions) of cards on the homepage, inspect applications
 * submitted through the "Join CIPHER" form, and export/import pure JSON files.
 */

interface AdminDashboardProps {
  onBackToSite: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite, onLogout }) => {
  const {
    events,
    leadership,
    archive,
    siteConfig,
    applications,
    isSupabaseConnected,
    isLoadingApplications,
    refreshApplications,
    updateEvent,
    addEvent,
    deleteEvent,
    reorderEvents,
    updateLeader,
    addLeader,
    deleteLeader,
    reorderLeadership,
    updateActivity,
    addActivity,
    deleteActivity,
    reorderArchive,
    updateSiteConfig,
    deleteApplication,
    resetToDefaults,
    activeTab,
    setActiveTab,
    statusNotification,
    exportJSON,
    importJSON,
  } = useAdminCMS();

  const {
    user,
    isMainAdmin,
    adminRequests,
    fetchAdminRequests,
    approveAdmin,
    rejectAdmin,
    deleteAdmin,
    isLoadingRequests,
  } = useAdminAuth();

  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [editingActivity, setEditingActivity] = useState<ArchiveItem | null>(null);
  const [isNewActivity, setIsNewActivity] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLeaderPhotoUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      showNotification('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) return;

      // Downscale to max 600x600 for optimal fast rendering and Supabase JSON storage
      const img = new Image();
      img.onload = () => {
        const maxDim = 600;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedUrl = canvas.toDataURL('image/webp', 0.85);
          setEditingLeader((prev) => (prev ? { ...prev, image: optimizedUrl } : null));
          showNotification('Photo uploaded and preview updated.');
        } else {
          setEditingLeader((prev) => (prev ? { ...prev, image: rawDataUrl } : null));
          showNotification('Photo uploaded.');
        }
      };

      img.onerror = () => {
        setEditingLeader((prev) => (prev ? { ...prev, image: rawDataUrl } : null));
        showNotification('Photo uploaded.');
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  };

  const handleEventPhotoUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      showNotification('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) return;

      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedUrl = canvas.toDataURL('image/webp', 0.85);
          setEditingEvent((prev) => {
            if (!prev) return null;
            const copy = [...(prev.images || [])];
            copy[0] = optimizedUrl;
            return { ...prev, images: copy };
          });
          showNotification('Event image uploaded and optimized.');
        } else {
          setEditingEvent((prev) => {
            if (!prev) return null;
            const copy = [...(prev.images || [])];
            copy[0] = rawDataUrl;
            return { ...prev, images: copy };
          });
          showNotification('Event image uploaded.');
        }
      };

      img.onerror = () => {
        setEditingEvent((prev) => {
          if (!prev) return null;
          const copy = [...(prev.images || [])];
          copy[0] = rawDataUrl;
          return { ...prev, images: copy };
        });
        showNotification('Event image uploaded.');
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  };

  const activeNotification = notification || statusNotification;
  const pendingCount = adminRequests.filter((r) => r.status === 'pending').length;


  return (
    <div className="min-h-screen bg-[#050705] text-[#c8f7d0] font-mono pb-20">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-[#123a17] bg-[#080d08]/90 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-xl font-bold tracking-wider text-[#00ff41] text-glow">
              CIPHER // ADMIN CMS
            </h1>
            <span className="hidden sm:inline-block rounded border border-[#123a17] bg-[#050705] px-2.5 py-0.5 text-[10px] text-[#6fae78]">
              CONTENT &amp; POSITION CONTROLLER
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Return to public site */}
            <button
              type="button"
              onClick={onBackToSite}
              className="flex items-center gap-1.5 rounded border border-[#00ff41] bg-[#00ff41] px-4 py-1.5 text-xs font-bold text-[#050705] hover:bg-[#00ff66] transition-colors"
            >
              <Eye size={13} />
              <span>PUBLIC SITE</span>
            </button>

            {/* Authenticated Admin Identity */}
            {user?.email && (
              <div className="hidden md:flex items-center gap-1.5 rounded border border-[#123a17] bg-[#050705] px-2.5 py-1 text-[11px] font-mono text-[#6fae78]">
                <span className="text-[#c8f7d0]">{user.email}</span>
              </div>
            )}

            {/* Logout button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded border border-[#123a17] bg-[#080d08] px-3 py-1.5 text-xs text-[#6fae78] hover:border-[#ff5f56] hover:text-[#ff5f56] transition-colors"
                title="Log out of the Admin panel"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
            )}
          </div>
        </div>

        {/* CMS Tabs */}
        <div className="mx-auto max-w-7xl mt-4 flex overflow-x-auto gap-2 border-t border-[#123a17] pt-3">
          <TabButton
            active={activeTab === 'events'}
            onClick={() => setActiveTab('events')}
            icon={<Calendar size={14} />}
            label={`Events (${events.length})`}
          />
          <TabButton
            active={activeTab === 'leadership'}
            onClick={() => setActiveTab('leadership')}
            icon={<Users size={14} />}
            label={`Leadership (${leadership.length})`}
          />
          <TabButton
            active={activeTab === 'archive'}
            onClick={() => setActiveTab('archive')}
            icon={<Archive size={14} />}
            label={`Past Activities (${archive.length})`}
          />
          <TabButton
            active={activeTab === 'applications'}
            onClick={() => setActiveTab('applications')}
            icon={<Inbox size={14} />}
            label={`Applications (${applications.length})`}
          />
          <TabButton
            active={activeTab === 'approvals'}
            onClick={() => setActiveTab('approvals')}
            icon={<UserCheck size={14} />}
            label={`Admin Approvals ${pendingCount > 0 ? `(${pendingCount} Pending)` : `(${adminRequests.length})`}`}
          />
          <TabButton
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            icon={<SettingsIcon size={14} />}
            label="Site Settings &amp; Trail"
          />
        </div>
      </header>

      {/* Floating Status Notification */}
      {activeNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded border border-[#00ff41] bg-[#080d08] px-4 py-3 text-xs text-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.4)]">
          <Check size={16} />
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Main CMS Container */}
      <main className="mx-auto max-w-7xl px-6 pt-8">
        {/* ======================= TAB: EVENTS ======================= */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#c8f7d0]">
                  Events &amp; Workshops Management
                </h2>
                <p className="text-xs text-[#6fae78] mt-1">
                  Reorder positions using the Up / Down controls to change which event appears first.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newEv: EventItem = {
                    id: 'event-' + Date.now(),
                    tag: 'NEW WORKSHOP',
                    date: 'UPCOMING',
                    title: 'New Technical Session',
                    cardSummary: 'Brief summary of the upcoming event session.',
                    detailedReport: ['Full detailed report of the workshop.'],
                    galleryCount: '01',
                    images: ['/lumiere/website_photo_1.webp'],
                  };
                  addEvent(newEv);
                  setEditingEvent(newEv);
                  showNotification('New event added.');
                }}
                className="flex items-center gap-1.5 rounded bg-[#00ff41] px-4 py-2 text-xs font-bold text-[#050705] hover:bg-[#00ff66]"
              >
                <Plus size={14} />
                <span>ADD EVENT</span>
              </button>
            </div>

            {/* List of Events */}
            <div className="grid grid-cols-1 gap-4">
              {events.map((ev, index) => (
                <div
                  key={ev.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border border-[#123a17] bg-[#080d08] p-5 hover:border-[#00ff41]/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded border border-[#123a17] bg-[#050705]">
                      <img
                        src={ev.images[0] || '/placeholder.svg'}
                        alt={ev.title}
                        className="h-full w-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-[#00ff41]">
                        <span className="font-bold">{ev.tag}</span>
                        <span>·</span>
                        <span className="text-[#6fae78]">{ev.date}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#c8f7d0] mt-0.5">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-[#6fae78] line-clamp-1 max-w-xl mt-1">
                        {ev.cardSummary}
                      </p>
                    </div>
                  </div>

                  {/* Position reordering & actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {/* Move Up button */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        reorderEvents(index, index - 1);
                        showNotification(`Moved "${ev.title}" up`);
                      }}
                      className="p-2 rounded border border-[#123a17] bg-[#050705] text-[#6fae78] hover:text-[#00ff41] hover:border-[#00ff41] disabled:opacity-30"
                      title="Move Up in order"
                    >
                      <ArrowUp size={14} />
                    </button>

                    {/* Move Down button */}
                    <button
                      type="button"
                      disabled={index === events.length - 1}
                      onClick={() => {
                        reorderEvents(index, index + 1);
                        showNotification(`Moved "${ev.title}" down`);
                      }}
                      className="p-2 rounded border border-[#123a17] bg-[#050705] text-[#6fae78] hover:text-[#00ff41] hover:border-[#00ff41] disabled:opacity-30"
                      title="Move Down in order"
                    >
                      <ArrowDown size={14} />
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => setEditingEvent(ev)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded border border-[#00ff41]/40 bg-[#00ff41]/10 text-xs text-[#00ff41] hover:bg-[#00ff41]/20"
                    >
                      <Edit2 size={13} />
                      <span>EDIT</span>
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete "${ev.title}"?`)) {
                          deleteEvent(ev.id);
                          showNotification('Event deleted.');
                        }
                      }}
                      className="p-2 rounded border border-[#ff5f56]/30 bg-[#ff5f56]/10 text-[#ff5f56] hover:bg-[#ff5f56]/20"
                      title="Delete Event"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB: LEADERSHIP ======================= */}
        {activeTab === 'leadership' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#c8f7d0]">
                  Leadership Team Management
                </h2>
                <p className="text-xs text-[#6fae78] mt-1">
                  Adjust positions using Up / Down buttons, upload headshots, and edit titles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newLead: Leader = {
                    id: 'lead-' + Date.now(),
                    name: 'New Executive Member',
                    role: 'EXECUTIVE MEMBER',
                    image: '/leadership/president.webp',
                    bio: 'Executive team member dedicated to CIPHER operations.',
                    github: 'https://github.com',
                    linkedin: 'https://linkedin.com',
                  };
                  addLeader(newLead);
                  setEditingLeader(newLead);
                  showNotification('New leader added.');
                }}
                className="flex items-center gap-1.5 rounded bg-[#00ff41] px-4 py-2 text-xs font-bold text-[#050705] hover:bg-[#00ff66]"
              >
                <Plus size={14} />
                <span>ADD LEADER</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {leadership.map((leader, index) => (
                <div
                  key={leader.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border border-[#123a17] bg-[#080d08] p-5 hover:border-[#00ff41]/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[#00ff41]/40 bg-[#050705]">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="h-full w-full object-cover object-top grayscale"
                        onError={handleImageError}
                      />
                    </div>
                    <div>
                      <span className="font-mono text-[11px] font-bold text-[#00ff41]">
                        {leader.role}
                      </span>
                      <h3 className="font-display text-lg font-bold text-[#c8f7d0]">
                        {leader.name}
                      </h3>
                      <p className="text-xs text-[#6fae78] line-clamp-1 max-w-md">
                        {leader.bio || 'No bio provided'}
                      </p>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        reorderLeadership(index, index - 1);
                        showNotification(`Moved "${leader.name}" up`);
                      }}
                      className="p-2 rounded border border-[#123a17] bg-[#050705] text-[#6fae78] hover:text-[#00ff41] hover:border-[#00ff41] disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>

                    <button
                      type="button"
                      disabled={index === leadership.length - 1}
                      onClick={() => {
                        reorderLeadership(index, index + 1);
                        showNotification(`Moved "${leader.name}" down`);
                      }}
                      className="p-2 rounded border border-[#123a17] bg-[#050705] text-[#6fae78] hover:text-[#00ff41] hover:border-[#00ff41] disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingLeader(leader)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded border border-[#00ff41]/40 bg-[#00ff41]/10 text-xs text-[#00ff41] hover:bg-[#00ff41]/20"
                    >
                      <Edit2 size={13} />
                      <span>EDIT</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete ${leader.name}?`)) {
                          deleteLeader(leader.id);
                          showNotification('Leader deleted.');
                        }
                      }}
                      className="p-2 rounded border border-[#ff5f56]/30 bg-[#ff5f56]/10 text-[#ff5f56] hover:bg-[#ff5f56]/20"
                      title="Delete Leader"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB: ARCHIVE ======================= */}
        {activeTab === 'archive' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#c8f7d0]">
                  Archive of Past Activities
                </h2>
                <p className="text-xs text-[#6fae78] mt-1">
                  Manage department workshops, industry visits, and past technical records with proof URLs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const idNum = String(archive.length + 1).padStart(2, '0');
                  setEditingActivity({
                    id: idNum,
                    title: '',
                    href: 'https://sjec.ac.in',
                  });
                  setIsNewActivity(true);
                }}
                className="flex items-center gap-1.5 rounded bg-[#00ff41] px-4 py-2 text-xs font-bold text-[#050705] hover:bg-[#00ff66] transition-colors shadow-[0_0_15px_rgba(0,255,65,0.25)]"
              >
                <Plus size={14} />
                <span>ADD RECORD</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {archive.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-[#123a17] bg-[#080d08] p-3.5 hover:border-[#00ff41]/40 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xs font-bold text-[#00ff41] shrink-0 font-mono">{item.id}</span>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="text-xs font-semibold text-[#c8f7d0] truncate">{item.title}</div>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#6fae78] hover:text-[#00ff41] transition-colors truncate max-w-full font-mono"
                          title={item.href}
                        >
                          <ExternalLink size={11} className="shrink-0" />
                          <span className="truncate">{item.href.replace(/^https?:\/\//, '')}</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-[#ff5f56]/60 font-mono">No proof link</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingActivity(item);
                        setIsNewActivity(false);
                      }}
                      className="p-1.5 text-[#6fae78] hover:text-[#00ff41] hover:bg-[#123a17]/50 rounded transition-colors"
                      title="Edit Activity & Proof URL"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => reorderArchive(index, index - 1)}
                      className="p-1.5 text-[#6fae78] hover:text-[#00ff41] disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={index === archive.length - 1}
                      onClick={() => reorderArchive(index, index + 1)}
                      className="p-1.5 text-[#6fae78] hover:text-[#00ff41] disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete activity "${item.title}"?`)) {
                          deleteActivity(item.id);
                          showNotification('Activity deleted.');
                        }
                      }}
                      className="p-1.5 text-[#ff5f56] hover:opacity-80 ml-0.5"
                      title="Delete Activity"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB: APPLICATIONS ======================= */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#c8f7d0]">
                  Student Membership Applications
                </h2>
                <p className="text-xs text-[#6fae78] mt-1">
                  Live submissions synced directly with Supabase cloud database.
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await refreshApplications();
                  showNotification('Applications refreshed from Supabase.');
                }}
                disabled={isLoadingApplications}
                className="flex items-center gap-1.5 rounded-lg border border-[#00ff41]/40 bg-[#00ff41]/10 px-3 py-1.5 font-mono text-xs text-[#00ff41] hover:bg-[#00ff41]/20 transition-all disabled:opacity-50"
              >
                <RefreshCw size={13} className={isLoadingApplications ? 'animate-spin' : ''} />
                <span>REFRESH DB</span>
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#123a17] p-12 text-center text-[#6fae78] text-xs">
                No applications received yet. Submit one using the "JOIN CIPHER" button on the site to see it here!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-xl border border-[#123a17] bg-[#080d08] p-6 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-base text-[#c8f7d0]">{app.name}</span>
                        <div className="flex items-center gap-3 text-xs text-[#6fae78] mt-0.5">
                          {app.usn && <span>USN: {app.usn}</span>}
                          <span>·</span>
                          <span>{app.email}</span>
                          <span>·</span>
                          <span className="text-[#00ff41]">{app.semester}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#2c7a3a]">{app.submittedAt}</span>
                        <button
                          type="button"
                          onClick={() => {
                            deleteApplication(app.id);
                            showNotification('Application dismissed.');
                          }}
                          className="p-1.5 rounded text-[#ff5f56] hover:bg-[#ff5f56]/10"
                          title="Delete application"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="rounded border border-[#123a17] bg-[#050705] p-3 text-xs">
                      <div className="text-[#00ff41] font-semibold mb-1">
                        Domain Interest: {app.domain}
                      </div>
                      <p className="text-[#c8f7d0]/90 leading-relaxed whitespace-pre-wrap">
                        {app.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB: ADMIN APPROVALS ======================= */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#c8f7d0] flex items-center gap-2">
                  <UserCheck className="text-[#00ff41]" />
                  <span>Admin Registration Approvals</span>
                </h2>
                <p className="text-xs text-[#6fae78] mt-1">
                  Newly registered admin accounts require approval from the Head Administrator before login is granted.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  fetchAdminRequests();
                  showNotification('Refreshed admin requests list.');
                }}
                disabled={isLoadingRequests}
                className="flex items-center gap-1.5 rounded border border-[#123a17] bg-[#050705] px-3 py-1.5 text-xs text-[#c8f7d0] hover:border-[#00ff41] transition-colors"
              >
                <RefreshCw size={13} className={isLoadingRequests ? 'animate-spin' : ''} />
                <span>Refresh Requests</span>
              </button>
            </div>

            {adminRequests.length === 0 ? (
              <div className="rounded-xl border border-[#123a17] bg-[#080d08] p-12 text-center text-xs text-[#6fae78] space-y-2">
                <Clock size={28} className="mx-auto text-[#00ff41] opacity-60" />
                <div className="font-bold text-sm text-[#c8f7d0]">No Admin Registration Requests</div>
                <div>When candidates register via the "REGISTER ADMIN" tab, their requests will appear here for review.</div>
              </div>
            ) : (
              <div className="grid gap-4">
                {adminRequests.map((req) => (
                  <div
                    key={req.username}
                    className="rounded-xl border border-[#123a17] bg-[#080d08] p-5 transition-all hover:border-[#00ff41]/50 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-base text-[#c8f7d0]">{req.username}</span>
                          <span className="text-xs text-[#6fae78] font-mono">({req.username}@cipher.sjec.ac.in)</span>
                          
                          {/* Status Badge */}
                          {(req.status === 'pending' || !req.status) && (
                            <span className="flex items-center gap-1 rounded bg-[#ffd600]/20 border border-[#ffd600]/40 px-2 py-0.5 text-[11px] font-bold text-[#ffd600]">
                              <Clock size={11} />
                              <span>PENDING APPROVAL</span>
                            </span>
                          )}
                          {req.status === 'approved' && (
                            <span className="flex items-center gap-1 rounded bg-[#00ff41]/20 border border-[#00ff41]/40 px-2 py-0.5 text-[11px] font-bold text-[#00ff41]">
                              <CheckCircle size={11} />
                              <span>APPROVED</span>
                            </span>
                          )}
                          {req.status === 'rejected' && (
                            <span className="flex items-center gap-1 rounded bg-[#ff5f56]/20 border border-[#ff5f56]/40 px-2 py-0.5 text-[11px] font-bold text-[#ff5f56]">
                              <XCircle size={11} />
                              <span>REJECTED</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#6fae78]">
                          {req.registeredAt && `Registered: ${new Date(req.registeredAt).toLocaleString()}`}
                          {req.approvedAt && ` • Approved: ${new Date(req.approvedAt).toLocaleString()}`}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {req.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={async () => {
                              const res = await approveAdmin(req.username);
                              if (res.success) {
                                showNotification(`Approved admin access for "${req.username}".`);
                              } else {
                                showNotification(`Failed to approve: ${res.error}`);
                              }
                            }}
                            className="flex items-center gap-1.5 rounded bg-[#00ff41] px-3 py-1.5 text-xs font-bold text-[#050705] hover:bg-[#00ff66] transition-colors"
                          >
                            <CheckCircle size={13} />
                            <span>Approve</span>
                          </button>
                        )}

                        {req.status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={async () => {
                              const res = await rejectAdmin(req.username);
                              if (res.success) {
                                showNotification(`Rejected admin access for "${req.username}".`);
                              } else {
                                showNotification(`Failed to reject: ${res.error}`);
                              }
                            }}
                            className="flex items-center gap-1.5 rounded border border-[#ff5f56]/60 px-3 py-1.5 text-xs text-[#ff5f56] hover:bg-[#ff5f56]/10 transition-colors"
                          >
                            <XCircle size={13} />
                            <span>Reject</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm(`Completely delete admin account "${req.username}"?`)) {
                              await deleteAdmin(req.username);
                              showNotification(`Deleted admin account "${req.username}".`);
                            }
                          }}
                          className="rounded border border-[#123a17] p-1.5 text-[#6fae78] hover:text-[#ff5f56] hover:border-[#ff5f56]/60 transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB: SETTINGS ======================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#c8f7d0]">
                Site Branding &amp; Photo Trail
              </h2>
              <p className="text-xs text-[#6fae78] mt-1">
                Customize association headlines, contact email, and trail image paths.
              </p>
            </div>

            <div className="space-y-4 rounded-xl border border-[#123a17] bg-[#080d08] p-6 text-xs">
              <div>
                <label className="block text-[#00ff41] mb-1 font-semibold">Association Full Name</label>
                <input
                  type="text"
                  value={siteConfig.fullName}
                  onChange={(e) => updateSiteConfig({ fullName: e.target.value })}
                  className="w-full rounded border border-[#123a17] bg-[#050705] p-2.5 text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#00ff41] mb-1 font-semibold">Hero Tagline</label>
                <textarea
                  rows={2}
                  value={siteConfig.tagline}
                  onChange={(e) => updateSiteConfig({ tagline: e.target.value })}
                  className="w-full rounded border border-[#123a17] bg-[#050705] p-2.5 text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[#00ff41] mb-1 font-semibold">About Section Copy</label>
                <textarea
                  rows={4}
                  value={siteConfig.aboutText}
                  onChange={(e) => updateSiteConfig({ aboutText: e.target.value })}
                  className="w-full rounded border border-[#123a17] bg-[#050705] p-2.5 text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[#00ff41] mb-1 font-semibold">Official Contact Email</label>
                <input
                  type="email"
                  value={siteConfig.socialLinks.email}
                  onChange={(e) =>
                    updateSiteConfig({
                      socialLinks: { ...siteConfig.socialLinks, email: e.target.value },
                    })
                  }
                  className="w-full rounded border border-[#123a17] bg-[#050705] p-2.5 text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================= EVENT EDIT MODAL ======================= */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="my-auto w-full max-w-2xl rounded-xl border border-[#00ff41]/60 bg-[#080d08] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#123a17] pb-3">
              <h3 className="font-display text-lg font-bold text-[#00ff41]">
                Edit Event: {editingEvent.title}
              </h3>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="text-[#6fae78] hover:text-[#00ff41]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#c8f7d0] mb-1">Title</label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full rounded border border-[#123a17] bg-[#050705] p-2 text-[#c8f7d0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#c8f7d0] mb-1">Tag (e.g. BRANCH GALA)</label>
                  <input
                    type="text"
                    value={editingEvent.tag}
                    onChange={(e) => setEditingEvent({ ...editingEvent, tag: e.target.value })}
                    className="w-full rounded border border-[#123a17] bg-[#050705] p-2 text-[#c8f7d0]"
                  />
                </div>
                <div>
                  <label className="block text-[#c8f7d0] mb-1">Date</label>
                  <input
                    type="text"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full rounded border border-[#123a17] bg-[#050705] p-2 text-[#c8f7d0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#c8f7d0] mb-1">Card Summary</label>
                <textarea
                  rows={2}
                  value={editingEvent.cardSummary}
                  onChange={(e) => setEditingEvent({ ...editingEvent, cardSummary: e.target.value })}
                  className="w-full rounded border border-[#123a17] bg-[#050705] p-2 text-[#c8f7d0] resize-none"
                />
              </div>

              <div>
                <label className="block text-[#c8f7d0] mb-1">Full Detailed Report (Paragraph 1)</label>
                <textarea
                  rows={3}
                  value={editingEvent.detailedReport[0] || ''}
                  onChange={(e) => {
                    const copy = [...editingEvent.detailedReport];
                    copy[0] = e.target.value;
                    setEditingEvent({ ...editingEvent, detailedReport: copy });
                  }}
                  className="w-full rounded border border-[#123a17] bg-[#050705] p-2 text-[#c8f7d0] resize-none"
                />
              </div>

              {/* Event Photo Upload */}
              <div>
                <label className="block text-[#c8f7d0] mb-1 font-semibold">Event Photo</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleEventPhotoUpload(file);
                  }}
                  className="flex items-center justify-between gap-4 rounded border border-[#123a17] bg-[#050705] p-3 transition-colors hover:border-[#00ff41]/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 rounded bg-[#00ff41] px-3.5 py-1.5 text-xs font-bold text-[#050705] hover:bg-[#00ff66] transition-colors shadow-[0_0_10px_rgba(0,255,65,0.2)]">
                        <Upload size={13} />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleEventPhotoUpload(file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      {editingEvent.images && editingEvent.images[0] && (
                        <span className="text-[11px] text-[#00ff41] font-mono">
                          ✓ Photo attached
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6fae78]">
                      Click to choose an image from your computer (PNG, JPG, WebP)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#123a17]">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 text-xs border border-[#123a17] rounded text-[#6fae78] hover:text-[#c8f7d0]"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  updateEvent(editingEvent.id, editingEvent);
                  setEditingEvent(null);
                  showNotification('Event saved successfully.');
                }}
                className="px-5 py-2 text-xs bg-[#00ff41] text-[#050705] font-bold rounded hover:bg-[#00ff66]"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= ACTIVITY EDIT / ADD MODAL ======================= */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#00ff41]/60 bg-[#080d08] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#123a17] pb-3">
              <h3 className="font-display text-lg font-bold text-[#00ff41]">
                {isNewActivity ? 'Add Past Activity Record' : `Edit Activity Record (${editingActivity.id})`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingActivity(null)}
                className="text-[#6fae78] hover:text-[#00ff41]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#c8f7d0] mb-1 font-semibold">Activity Title / Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Workshop on Generative AI & LLMs"
                  value={editingActivity.title}
                  onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                  className="w-full rounded border border-[#123a17] bg-[#050705] p-2.5 text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#c8f7d0] mb-1 font-semibold">Activity Proof URL *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://sjec.ac.in/... or Google Drive report / certificate link"
                    value={editingActivity.href || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, href: e.target.value })}
                    className="w-full rounded border border-[#123a17] bg-[#050705] p-2.5 text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none font-mono text-[11px]"
                  />
                  {editingActivity.href && (
                    <a
                      href={editingActivity.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded border border-[#123a17] bg-[#050705] px-3 py-2 text-xs text-[#00ff41] hover:border-[#00ff41] shrink-0"
                      title="Test URL"
                    >
                      <ExternalLink size={13} />
                      <span>Test</span>
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-[#6fae78] mt-1">
                  Enter the verification link, college event writeup URL, Google Drive report, or certificate proof.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#123a17]">
              <button
                type="button"
                onClick={() => setEditingActivity(null)}
                className="px-4 py-2 text-xs border border-[#123a17] rounded text-[#6fae78] hover:text-[#c8f7d0]"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingActivity.title.trim()) {
                    showNotification('Please enter an activity title.');
                    return;
                  }
                  if (!editingActivity.href?.trim()) {
                    showNotification('Please enter the activity proof URL.');
                    return;
                  }
                  if (isNewActivity) {
                    addActivity(editingActivity);
                    showNotification(`Activity "${editingActivity.title}" added successfully.`);
                  } else {
                    updateActivity(editingActivity.id, editingActivity);
                    showNotification(`Activity "${editingActivity.title}" updated.`);
                  }
                  setEditingActivity(null);
                }}
                className="px-5 py-2 text-xs bg-[#00ff41] text-[#050705] font-bold rounded hover:bg-[#00ff66]"
              >
                {isNewActivity ? 'ADD RECORD' : 'SAVE CHANGES'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= LEADER EDIT MODAL ======================= */}
      {editingLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#00ff41]/60 bg-[#080d08] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#123a17] pb-3">
              <h3 className="font-display text-lg font-bold text-[#00ff41]">
                Edit Leader: {editingLeader.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingLeader(null)}
                className="text-[#6fae78] hover:text-[#00ff41]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#c8f7d0] mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingLeader.name}
                  onChange={(e) => setEditingLeader({ ...editingLeader, name: e.target.value })}
                  className="w-full rounded border border-[#123a17] bg-[#050705] p-2 text-[#c8f7d0]"
                />
              </div>

              <div>
                <label className="block text-[#c8f7d0] mb-1">Role Title (e.g. PRESIDENT)</label>
                <input
                  type="text"
                  value={editingLeader.role}
                  onChange={(e) => setEditingLeader({ ...editingLeader, role: e.target.value })}
                  className="w-full rounded border border-[#123a17] bg-[#050705] p-2 text-[#c8f7d0]"
                />
              </div>

              <div>
                <label className="block text-[#c8f7d0] mb-1 font-semibold">Photo</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleLeaderPhotoUpload(file);
                  }}
                  className="flex items-center justify-between gap-4 rounded border border-[#123a17] bg-[#050705] p-3 transition-colors hover:border-[#00ff41]/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 rounded bg-[#00ff41] px-3.5 py-1.5 text-xs font-bold text-[#050705] hover:bg-[#00ff66] transition-colors shadow-[0_0_10px_rgba(0,255,65,0.2)]">
                        <Upload size={13} />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleLeaderPhotoUpload(file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      {editingLeader.image && (editingLeader.image.startsWith('data:image') || editingLeader.image !== '/leadership/president.webp') && (
                        <span className="text-[11px] text-[#00ff41] font-mono">
                          ✓ Photo attached
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6fae78]">
                      Click to choose an image from your computer (PNG, JPG, WebP)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[#c8f7d0] mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editingLeader.bio || ''}
                  onChange={(e) => setEditingLeader({ ...editingLeader, bio: e.target.value })}
                  className="w-full rounded border border-[#123a17] bg-[#050705] p-2 text-[#c8f7d0] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#123a17]">
              <button
                type="button"
                onClick={() => setEditingLeader(null)}
                className="px-4 py-2 text-xs border border-[#123a17] rounded text-[#6fae78] hover:text-[#c8f7d0]"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  updateLeader(editingLeader.id, editingLeader);
                  setEditingLeader(null);
                  showNotification('Leader profile updated.');
                }}
                className="px-5 py-2 text-xs bg-[#00ff41] text-[#050705] font-bold rounded hover:bg-[#00ff66]"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for tab button
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 rounded px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
      active
        ? 'bg-[#00ff41] text-[#050705]'
        : 'text-[#6fae78] hover:text-[#c8f7d0] hover:bg-[#0e1613]'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
