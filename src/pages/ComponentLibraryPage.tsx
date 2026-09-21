import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Image as ImageIcon,
  ExternalLink,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  Download,
  Terminal,
  Award,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { handleImageError } from '../utils/imageFallback';
import { soundEffects } from '../utils/soundEffects';

/**
 * Event Intelligence & Media Library Vault
 * 
 * Non-technical explanation:
 * Comprehensive multimedia vault housing all CIPHER events, high-resolution photographic
 * galleries, full technical symposium reports, and historical departmental activity archives.
 * Includes category filtering, real-time keyword search, and an interactive full-screen photo lightbox.
 */

type CategoryFilter = 'all' | 'galas' | 'competitions' | 'archive';

export const ComponentLibraryPage: React.FC = () => {
  const { events, archive } = useData();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lightbox State
  const [lightboxData, setLightboxData] = useState<{
    eventTitle: string;
    images: string[];
    currentIndex: number;
  } | null>(null);

  // Keyboard navigation for photo lightbox
  useEffect(() => {
    if (!lightboxData) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEffects.playClick();
        setLightboxData(null);
      } else if (e.key === 'ArrowRight') {
        soundEffects.playClick();
        setLightboxData((prev) =>
          prev
            ? { ...prev, currentIndex: (prev.currentIndex + 1) % prev.images.length }
            : null
        );
      } else if (e.key === 'ArrowLeft') {
        soundEffects.playClick();
        setLightboxData((prev) =>
          prev
            ? {
                ...prev,
                currentIndex:
                  (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
              }
            : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxData]);

  const openLightbox = (eventTitle: string, images: string[], index: number) => {
    soundEffects.playTransition();
    setLightboxData({
      eventTitle,
      images,
      currentIndex: index,
    });
  };

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesSearch =
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.cardSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ev.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      if (!matchesSearch) return false;

      if (activeFilter === 'galas') return ev.tag.toUpperCase().includes('GALA');
      if (activeFilter === 'competitions') return ev.tag.toUpperCase().includes('COMPETITION');
      if (activeFilter === 'archive') return false; // Show in archive section below
      return true;
    });
  }, [events, searchQuery, activeFilter]);

  // Filtered past activity archives
  const filteredArchive = useMemo(() => {
    if (activeFilter === 'galas' || activeFilter === 'competitions') return [];
    return archive.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [archive, searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-[#050705] text-[#c8f7d0] font-mono pt-28 pb-24 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header Bar */}
        <div className="border-b border-[#123a17] pb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#00ff41]">
            <Layers size={14} />
            <span>CIPHER // MEDIA &amp; INTELLIGENCE VAULT</span>
          </div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-[#c8f7d0] text-glow">
            Event Dossiers &amp; Image Library
          </h1>
          <p className="mt-3 font-mono text-xs sm:text-sm text-[#6fae78] max-w-3xl leading-relaxed">
            Exhaustive archive of technical symposiums, hackathons, and departmental initiatives. Explore high-resolution event captures, competition outcomes, and chronological gallery dossiers.
          </p>
        </div>

        {/* Filter & Search HUD */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl border border-[#123a17] bg-[#080d08]">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveFilter('all');
              }}
              className={`rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-[#00ff41] text-[#050705] font-bold shadow-[0_0_15px_rgba(0,255,65,0.4)]'
                  : 'bg-[#050705] text-[#6fae78] hover:text-[#00ff41] border border-[#123a17]'
              }`}
            >
              ALL DOSSIERS ({events.length + (activeFilter === 'all' ? archive.length : 0)})
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveFilter('galas');
              }}
              className={`rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                activeFilter === 'galas'
                  ? 'bg-[#00ff41] text-[#050705] font-bold shadow-[0_0_15px_rgba(0,255,65,0.4)]'
                  : 'bg-[#050705] text-[#6fae78] hover:text-[#00ff41] border border-[#123a17]'
              }`}
            >
              FLAGSHIP GALAS
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveFilter('competitions');
              }}
              className={`rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                activeFilter === 'competitions'
                  ? 'bg-[#00ff41] text-[#050705] font-bold shadow-[0_0_15px_rgba(0,255,65,0.4)]'
                  : 'bg-[#050705] text-[#6fae78] hover:text-[#00ff41] border border-[#123a17]'
              }`}
            >
              AI &amp; COMPETITIONS
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveFilter('archive');
              }}
              className={`rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                activeFilter === 'archive'
                  ? 'bg-[#00ff41] text-[#050705] font-bold shadow-[0_0_15px_rgba(0,255,65,0.4)]'
                  : 'bg-[#050705] text-[#6fae78] hover:text-[#00ff41] border border-[#123a17]'
              }`}
            >
              WORKSHOPS &amp; SESSIONS ({archive.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2c7a3a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event dossiers..."
              className="w-full rounded border border-[#123a17] bg-[#050705] pl-9 pr-4 py-2 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6fae78] hover:text-[#00ff41]"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ===================== PRIMARY EVENT DOSSIERS ===================== */}
        {filteredEvents.length > 0 && (
          <div className="space-y-12">
            {filteredEvents.map((event) => (
              <article
                key={event.id}
                className="rounded-2xl border border-[#123a17] bg-[#080d08] p-6 sm:p-8 space-y-6 shadow-xl transition-all duration-300 hover:border-[#00ff41]/50"
              >
                {/* Event Header Metas */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#123a17] pb-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded bg-[#00ff41]/10 border border-[#00ff41]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#00ff41]">
                        {event.tag}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#6fae78]">
                        <Calendar size={13} className="text-[#00ff41]" />
                        {event.date}
                      </span>
                      {event.venue && (
                        <span className="flex items-center gap-1 text-xs text-[#6fae78]">
                          <MapPin size={13} className="text-[#00ff41]" />
                          {event.venue}
                        </span>
                      )}
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#c8f7d0] text-glow">
                      {event.title}
                    </h2>
                    <p className="text-xs text-[#00ff41] font-mono">
                      {event.subtitle}
                    </p>
                  </div>

                  <div className="text-xs font-mono text-[#6fae78] shrink-0">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-[#00ff41]" />
                      <span>{event.images.length} HIGH-RES CAPTURES</span>
                    </span>
                  </div>
                </div>

                {/* Event Summary & Report Paragraphs */}
                <div className="space-y-3 text-xs sm:text-[13px] text-[#6fae78] leading-relaxed max-w-4xl">
                  <p className="text-[#c8f7d0] font-medium leading-relaxed">
                    {event.cardSummary}
                  </p>
                  {event.detailedReport.map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-[#6fae78]">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* 8-Photo High-Resolution Gallery Grid */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs text-[#00ff41]">
                    <span className="uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Terminal size={13} />
                      <span>// PHOTO_ARCHIVE // CLICK TO INSPECT</span>
                    </span>
                    <span className="text-[11px] text-[#2c7a3a]">WEBP ENCODED · RETINA CAPTURE</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                    {event.images.map((imgSrc, imgIdx) => (
                      <div
                        key={imgIdx}
                        onClick={() => openLightbox(event.title, event.images, imgIdx)}
                        className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-[#123a17] bg-[#050705] cursor-pointer transition-all duration-300 hover:border-[#00ff41] hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:scale-[1.02]"
                        data-cursor="lens"
                      >
                        <img
                          src={imgSrc}
                          alt={`${event.title} photograph ${imgIdx + 1}`}
                          loading="lazy"
                          decoding="async"
                          onError={handleImageError}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080d08]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                          <span className="text-[10px] text-[#00ff41] font-bold">
                            #{imgIdx + 1}
                          </span>
                          <Maximize2 size={13} className="text-[#00ff41]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ===================== HISTORICAL ACTIVITIES & WORKSHOPS ARCHIVE ===================== */}
        {filteredArchive.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-[#123a17]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#00ff41] font-bold block">
                  // DEPARTMENT_REPOSITORY
                </span>
                <h2 className="font-display text-2xl font-bold text-[#c8f7d0] mt-1">
                  Technical Sessions, Workshops &amp; Industrial Visits
                </h2>
              </div>
              <span className="text-xs text-[#6fae78] font-mono">
                {filteredArchive.length} RECORDED SESSIONS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArchive.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-[#123a17] bg-[#080d08] p-4 flex items-center justify-between gap-3 transition-all duration-200 hover:border-[#00ff41] hover:bg-[#0e1613] hover:shadow-[0_0_15px_rgba(0,255,65,0.15)]"
                  data-cursor="lens"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="font-mono text-xs font-bold text-[#00ff41]/80 shrink-0">
                      [{item.id}]
                    </span>
                    <h3 className="font-mono text-xs text-[#c8f7d0] group-hover:text-[#00ff41] transition-colors truncate">
                      {item.title}
                    </h3>
                  </div>
                  <ExternalLink
                    size={14}
                    className="text-[#6fae78] group-hover:text-[#00ff41] shrink-0 transition-colors"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Empty Search Fallback */}
        {filteredEvents.length === 0 && filteredArchive.length === 0 && (
          <div className="p-16 text-center rounded-xl border border-[#123a17] bg-[#080d08] space-y-3 font-mono">
            <span className="text-xs text-[#ff5f56] uppercase tracking-widest block">
              // NO_MATCHING_DOSSIERS
            </span>
            <p className="text-sm text-[#6fae78]">
              No events matched the keyword "{searchQuery}". Clear query to view all records.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-2 rounded border border-[#00ff41] bg-[#00ff41]/10 px-4 py-1.5 text-xs text-[#00ff41] hover:bg-[#00ff41]/20"
            >
              RESTORE ALL RECORDS
            </button>
          </div>
        )}
      </div>

      {/* ===================== FULLSCREEN PHOTO LIGHTBOX ===================== */}
      {lightboxData && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-xl select-none"
          onClick={() => {
            soundEffects.playClick();
            setLightboxData(null);
          }}
        >
          {/* Top Bar */}
          <div
            className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 font-mono text-xs text-[#c8f7d0]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="text-[#00ff41] font-bold">{lightboxData.eventTitle}</span>
              <span className="text-[#6fae78]">
                [{lightboxData.currentIndex + 1} / {lightboxData.images.length}]
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={lightboxData.images[lightboxData.currentIndex]}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded border border-[#123a17] bg-[#050705] px-3 py-1 text-xs text-[#6fae78] hover:border-[#00ff41] hover:text-[#00ff41] transition-colors"
                title="Download full resolution photo"
              >
                <Download size={13} />
                <span className="hidden sm:inline">ORIGINAL</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setLightboxData(null);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#123a17] bg-[#050705] text-[#6fae78] hover:border-[#00ff41] hover:text-[#00ff41] transition-colors"
                aria-label="Close Lightbox"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEffects.playClick();
              setLightboxData((prev) =>
                prev
                  ? {
                      ...prev,
                      currentIndex:
                        (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
                    }
                  : null
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[#123a17] bg-[#080d08]/80 text-[#6fae78] hover:border-[#00ff41] hover:text-[#00ff41] transition-all hover:scale-105"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Main Photo Display */}
          <div
            className="relative max-h-[80vh] max-w-5xl overflow-hidden rounded-xl border border-[#123a17] bg-[#050705] shadow-[0_0_60px_rgba(0,0,0,0.9)]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxData.images[lightboxData.currentIndex]}
              alt={`${lightboxData.eventTitle} capture`}
              onError={handleImageError}
              className="max-h-[80vh] w-auto max-w-full object-contain"
            />
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEffects.playClick();
              setLightboxData((prev) =>
                prev
                  ? {
                      ...prev,
                      currentIndex:
                        (prev.currentIndex + 1) % prev.images.length,
                    }
                  : null
              );
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[#123a17] bg-[#080d08]/80 text-[#6fae78] hover:border-[#00ff41] hover:text-[#00ff41] transition-all hover:scale-105"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
};
