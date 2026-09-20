import React, { useState, useMemo } from 'react';
import { Calendar, Search, ArrowUpRight, Filter, MapPin, Image as ImageIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { EventItem } from '../types';
import { EventGalleryModal } from '../components/Modals/EventGalleryModal';
import { handleImageError } from '../utils/imageFallback';

/**
 * EventsPage Component (Page 3 of 5)
 * 
 * Non-technical explanation:
 * Dedicated standalone Events page featuring flagship events,
 * search filtering, the historical archive of 17 workshops,
 * and the interactive full photo gallery modal.
 * Completely responsive on both mobile phones and desktop computers.
 */

export const EventsPage: React.FC = () => {
  const { events, archive } = useData();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter flagship events by category tag
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesTag = filterTag === 'ALL' || ev.tag.toUpperCase().includes(filterTag);
      const matchesSearch =
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.cardSummary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    });
  }, [events, filterTag, searchQuery]);

  // Filter archive items
  const filteredArchive = useMemo(() => {
    return archive.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [archive, searchQuery]);

  return (
    <div className="min-h-screen pt-28 pb-24 font-mono">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 space-y-16">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#00ff41]">
            <span>// ACTIVITIES // CALENDAR_REGISTRY</span>
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-[#c8f7d0] text-glow">
            Events &amp; Technical Workshops
          </h1>
          <p className="mt-3 font-mono text-sm sm:text-base text-[#6fae78] max-w-2xl leading-relaxed">
            Hands-on technical bootcamps, annual galas, prompt engineering competitions, and industry visits hosted by CIPHER.
          </p>
        </div>

        {/* Filter Bar & Search Input (Mobile Optimized) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#123a17] pb-6">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#6fae78] mr-2 flex items-center gap-1">
              <Filter size={12} /> Filter:
            </span>
            {['ALL', 'GALA', 'COMPETITION', 'WORKSHOP'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setFilterTag(tag)}
                className={`rounded px-3 py-1.5 text-xs font-semibold uppercase transition-colors ${
                  filterTag === tag
                    ? 'bg-[#00ff41] text-[#050705]'
                    : 'border border-[#123a17] bg-[#080d08] text-[#6fae78] hover:text-[#00ff41]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events &amp; topics..."
              className="w-full rounded border border-[#123a17] bg-[#080d08] pl-9 pr-3.5 py-2 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-[#6fae78]" />
          </div>
        </div>

        {/* Flagship Events Showcase Grid */}
        <section className="space-y-6">
          <div className="text-xs uppercase tracking-widest text-[#00ff41]">
            // FEATURED SESSIONS ({filteredEvents.length})
          </div>

          {filteredEvents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#123a17] p-12 text-center text-[#6fae78] text-xs">
              No matching events found for your query.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredEvents.map((event) => {
                const coverImage = event.images && event.images.length > 0 ? event.images[0] : null;
                const previewThumbs = event.images ? event.images.slice(1, 4) : [];

                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-[#123a17] bg-[#080d08]/85 backdrop-blur-md transition-all duration-300 hover:border-[#00ff41] hover:bg-[#0e1613] hover:shadow-[0_0_35px_rgba(0,255,65,0.22)] cursor-pointer"
                    data-cursor="lens"
                  >
                    {/* Cyber Corner Reticles */}
                    <span className="absolute top-2 left-2 z-20 font-mono text-[10px] text-[#00ff41]/40 select-none group-hover:text-[#00ff41] transition-colors">+</span>
                    <span className="absolute top-2 right-2 z-20 font-mono text-[10px] text-[#00ff41]/40 select-none group-hover:text-[#00ff41] transition-colors">+</span>

                    {/* Cover Photo Banner */}
                    {coverImage && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#050705] border-b border-[#123a17]">
                        <img
                          src={coverImage}
                          alt={event.title}
                          loading="lazy"
                          decoding="async"
                          onError={handleImageError}
                          className="h-full w-full object-cover grayscale contrast-125 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080d08] via-transparent to-black/40 pointer-events-none" />
                        
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                          <span className="inline-flex items-center gap-1.5 rounded bg-[#050705]/85 border border-[#00ff41]/40 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#00ff41] backdrop-blur-sm">
                            <Calendar size={11} />
                            {event.tag}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded bg-[#050705]/85 border border-[#123a17] px-2.5 py-1 font-mono text-[10px] text-[#c8f7d0] backdrop-blur-sm">
                            <ImageIcon size={11} className="text-[#00ff41]" />
                            {event.galleryCount} SHOTS
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 z-10 font-mono text-[11px] text-[#00ff41] bg-[#050705]/90 border border-[#123a17] px-2.5 py-1 rounded">
                          {event.date}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                      <div>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#c8f7d0] group-hover:text-[#00ff41] transition-colors">
                          {event.title}
                        </h3>

                        {event.venue && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#6fae78]">
                            <MapPin size={12} className="text-[#00ff41]" />
                            <span>{event.venue}</span>
                          </div>
                        )}

                        <p className="mt-4 font-mono text-xs sm:text-sm leading-relaxed text-[#6fae78]">
                          {event.cardSummary}
                        </p>

                        {/* Filmstrip Previews */}
                        {previewThumbs.length > 0 && (
                          <div className="mt-5 flex items-center gap-2 pt-4 border-t border-[#123a17]">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[#2c7a3a] mr-1 hidden sm:inline">
                              ROLL:
                            </span>
                            {previewThumbs.map((thumb, idx) => (
                              <div
                                key={idx}
                                className="relative h-11 w-16 overflow-hidden rounded border border-[#123a17] bg-[#050705] transition-all group-hover:border-[#00ff41]/50"
                              >
                                <img
                                  src={thumb}
                                  alt=""
                                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                  loading="lazy"
                                  onError={handleImageError}
                                />
                              </div>
                            ))}
                            <span className="font-mono text-[10px] text-[#6fae78] ml-auto">
                              +{Number(event.galleryCount) - 4} more
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer Button */}
                      <div className="mt-6 pt-4 border-t border-[#123a17] flex items-center justify-between">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00ff41] flex items-center gap-1.5 transition-transform group-hover:translate-x-1">
                          VIEW GALLERY <ArrowUpRight size={15} />
                        </span>
                        <span className="font-mono text-[11px] text-[#2c7a3a] group-hover:text-[#6fae78] transition-colors">
                          {event.galleryCount} PHOTOS
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Complete Historical Activity Archive (3-Column Dense Grid) */}
        <section className="space-y-6 pt-10 border-t border-[#123a17]">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#00ff41]">
              // HISTORICAL ARCHIVE ({filteredArchive.length} ACTIVITIES)
            </div>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#c8f7d0]">
              Past Department Workshops &amp; Visits
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArchive.map((item) => (
              <a
                key={item.id}
                href={item.href || `https://sjec.ac.in/cipher/activity/${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-lg border border-[#123a17] bg-[#080d08]/60 p-4 transition-all duration-200 hover:border-[#00ff41] hover:bg-[#0e1613] hover:shadow-[0_0_20px_rgba(0,255,65,0.18)]"
                data-cursor="lens"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs font-semibold text-[#00ff41] opacity-75">
                    {item.id}
                  </span>
                  <span className="font-mono text-xs font-medium text-[#c8f7d0] truncate group-hover:text-[#00ff41] transition-colors">
                    {item.title}
                  </span>
                </div>
                <ArrowUpRight
                  size={15}
                  className="text-[#6fae78] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#00ff41]"
                />
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Gallery Modal */}
      <EventGalleryModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};
