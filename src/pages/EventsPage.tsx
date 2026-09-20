import React, { useState, useMemo } from 'react';
import { Calendar, Search, ArrowUpRight, Filter, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';
import { EventItem } from '../types';
import { EventGalleryModal } from '../components/Modals/EventGalleryModal';

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
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="group relative flex flex-col justify-between rounded-xl border border-[#123a17] bg-[#080d08]/70 p-7 sm:p-9 transition-all duration-300 hover:border-[#00ff41] hover:bg-[#0e1613] hover:shadow-[0_0_35px_rgba(0,255,65,0.2)] cursor-pointer"
                  data-cursor="lens"
                >
                  <div>
                    {/* Header: Tag, Date, Venue */}
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[#00ff41] mb-6">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                        <Calendar size={13} />
                        {event.tag}
                      </span>
                      <span className="text-[#6fae78] border border-[#123a17] bg-[#050705] px-2.5 py-1 rounded text-[11px]">
                        {event.date}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#c8f7d0] group-hover:text-[#00ff41] transition-colors">
                      {event.title}
                    </h3>

                    {event.venue && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6fae78]">
                        <MapPin size={12} className="text-[#00ff41]" />
                        <span>{event.venue}</span>
                      </div>
                    )}

                    <p className="mt-4 font-mono text-xs sm:text-sm leading-relaxed text-[#6fae78]">
                      {event.cardSummary}
                    </p>
                  </div>

                  {/* Footer Button */}
                  <div className="mt-8 pt-5 border-t border-[#123a17] flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00ff41] flex items-center gap-1.5 transition-transform group-hover:translate-x-1">
                      VIEW GALLERY <ArrowUpRight size={15} />
                    </span>
                    <span className="font-mono text-[11px] text-[#2c7a3a]">
                      {event.galleryCount} PHOTOS
                    </span>
                  </div>
                </div>
              ))}
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
