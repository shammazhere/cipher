import React, { useState, useRef } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Plus,
  RotateCcw,
  Eye,
  Check,
  Upload,
  Download,
  Calendar,
  Users,
  Archive,
  Inbox,
  Settings as SettingsIcon,
  X,
  ExternalLink,
} from 'lucide-react';
import { EventItem, Leader, ArchiveItem, MemberApplication } from '../../types';
import { useAdminCMS } from '../../hooks/useAdminCMS';

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
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const {
    events,
    leadership,
    archive,
    siteConfig,
    applications,
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

  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const activeNotification = notification || statusNotification;

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = activeTab === 'leadership' ? 'leadership' : activeTab === 'archive' ? 'archive' : 'events';
    importJSON(file, type);
  };

  return (
    <div className="min-h-screen bg-[#050705] text-[#c8f7d0] font-mono pb-20">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-[#123a17] bg-[#080d08]/90 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-[#00ff41] animate-ping" />
            <h1 className="font-display text-xl font-bold tracking-wider text-[#00ff41] text-glow">
              CIPHER // ADMIN CMS
            </h1>
            <span className="hidden sm:inline-block rounded border border-[#123a17] bg-[#050705] px-2.5 py-0.5 text-[10px] text-[#6fae78]">
              CONTENT &amp; POSITION CONTROLLER
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Hidden file input for JSON import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />

            {/* Export JSON Button for Non-Developers */}
            <button
              type="button"
              onClick={() => exportJSON(activeTab === 'events' ? 'events' : activeTab === 'leadership' ? 'leadership' : activeTab === 'archive' ? 'archive' : 'all')}
              className="flex items-center gap-1.5 rounded border border-[#00ff41]/50 bg-[#00ff41]/10 px-3 py-1.5 text-xs text-[#00ff41] hover:bg-[#00ff41]/20 transition-colors"
              title="Download formatted JSON file ready to drop into src/data/"
            >
              <Download size={13} />
              <span>EXPORT JSON</span>
            </button>

            {/* Import JSON Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded border border-[#123a17] bg-[#080d08] px-3 py-1.5 text-xs text-[#6fae78] hover:border-[#00ff41] hover:text-[#00ff41] transition-colors"
              title="Import a JSON file from your computer"
            >
              <Upload size={13} />
              <span>IMPORT JSON</span>
            </button>

            {/* Reset to defaults */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all changes and restore original default data?')) {
                  resetToDefaults();
                  showNotification('Reset successfully to default data.');
                }
              }}
              className="flex items-center gap-1.5 rounded border border-[#ff5f56]/40 bg-[#ff5f56]/10 px-3 py-1.5 text-xs text-[#ff5f56] hover:bg-[#ff5f56]/20 transition-colors"
            >
              <RotateCcw size={13} />
              <span>RESET</span>
            </button>

            {/* Return to public site */}
            <button
              type="button"
              onClick={onBackToSite}
              className="flex items-center gap-1.5 rounded border border-[#00ff41] bg-[#00ff41] px-4 py-1.5 text-xs font-bold text-[#050705] hover:bg-[#00ff66] transition-colors"
            >
              <Eye size={13} />
              <span>PUBLIC SITE</span>
            </button>
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
                    images: ['/lumiere/website_photo_1.jpg'],
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
                    image: '/leadership/president.png',
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#c8f7d0]">
                  Archive of Past Activities
                </h2>
                <p className="text-xs text-[#6fae78] mt-1">
                  Manage the 17 numbered past activity links displayed in the 3-column grid.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const idNum = String(archive.length + 1).padStart(2, '0');
                  const newAct: ArchiveItem = {
                    id: idNum,
                    title: 'New Technical Session',
                    href: 'https://sjec.ac.in',
                  };
                  addActivity(newAct);
                  showNotification('New activity added.');
                }}
                className="flex items-center gap-1.5 rounded bg-[#00ff41] px-4 py-2 text-xs font-bold text-[#050705] hover:bg-[#00ff66]"
              >
                <Plus size={14} />
                <span>ADD RECORD</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {archive.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-[#123a17] bg-[#080d08] p-3.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-[#00ff41]">{item.id}</span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateActivity(item.id, { title: e.target.value })}
                      className="bg-transparent text-xs text-[#c8f7d0] border-b border-transparent hover:border-[#123a17] focus:border-[#00ff41] focus:outline-none w-full"
                    />
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => reorderArchive(index, index - 1)}
                      className="p-1 text-[#6fae78] hover:text-[#00ff41] disabled:opacity-20"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={index === archive.length - 1}
                      onClick={() => reorderArchive(index, index + 1)}
                      className="p-1 text-[#6fae78] hover:text-[#00ff41] disabled:opacity-20"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteActivity(item.id)}
                      className="p-1 text-[#ff5f56] hover:opacity-80 ml-1"
                    >
                      <Trash2 size={12} />
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
            <div>
              <h2 className="font-display text-2xl font-bold text-[#c8f7d0]">
                Student Membership Applications
              </h2>
              <p className="text-xs text-[#6fae78] mt-1">
                Submissions received through the secured Join Form.
              </p>
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

              {/* Photo URLs */}
              <div>
                <label className="block text-[#c8f7d0] mb-1">Gallery Image URL / Path (Primary)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingEvent.images[0] || ''}
                    onChange={(e) => {
                      const copy = [...editingEvent.images];
                      copy[0] = e.target.value;
                      setEditingEvent({ ...editingEvent, images: copy });
                    }}
                    className="w-full rounded border border-[#123a17] bg-[#050705] p-2 text-[#c8f7d0]"
                  />
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
                <label className="block text-[#c8f7d0] mb-1">Photo URL / Path</label>
                <input
                  type="text"
                  value={editingLeader.image}
                  onChange={(e) => setEditingLeader({ ...editingLeader, image: e.target.value })}
                  className="w-full rounded border border-[#123a17] bg-[#050705] p-2 text-[#c8f7d0]"
                />
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
