import React, { useState } from 'react';
import { Calendar, ArrowUpRight, MapPin, Image as ImageIcon, Sparkles } from 'lucide-react';
import { EventGalleryModal } from '../Modals/EventGalleryModal';
import { useData } from '../../context/DataContext';
import { EventItem } from '../../types';
import { handleImageError } from '../../utils/imageFallback';

/**
 * Events & Workshops Section Component
 * 
 * Non-technical explanation:
 * Displays featured flagship events (like the Lumière Gala and Prompt Ops competition).
 * Each card features a high-definition photo banner with hover zoom, filmstrip preview,
 * venue chips, and an interactive "VIEW GALLERY" trigger for the full album.
 */

export const EventsSection: React.FC = () => {
  const { events } = useData();
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);

  return (
    <section id="events" className="relative border-t border-[#123a17] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[#00ff41]">
          <span>// ACTIVITIES</span>
          <span className="text-[#2c7a3a] hidden sm:inline">&gt;&gt; FLAGSHIP_SESSIONS</span>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#c8f7d0] text-glow">
              Events &amp; Workshops
            </h2>
            <p className="mt-3 font-mono text-xs sm:text-sm text-[#6fae78] max-w-2xl leading-relaxed">
              From flagship branch galas to statewide AI prompt battles — explore visual archives and technical debriefs from CIPHER events.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-[#00ff41] bg-[#00ff41]/5 border border-[#123a17] px-3.5 py-1.5 rounded-full">
            <Sparkles size={13} className="animate-pulse" />
            <span>INTERACTIVE ARCHIVE // CLICK CARD TO EXPAND</span>
          </div>
        </div>

        {/* Featured Event Cards Grid with Rich Media */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event) => {
            const coverImage = event.images && event.images.length > 0 ? event.images[0] : null;
            const previewThumbs = event.images ? event.images.slice(1, 4) : [];

            return (
              <div
                key={event.id}
                onClick={() => setActiveEvent(event)}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#123a17] bg-[#080d08]/85 backdrop-blur-md transition-all duration-300 hover:border-[#00ff41] hover:bg-[#0e1613] hover:shadow-[0_0_40px_rgba(0,255,65,0.22)] cursor-pointer"
                data-cursor="lens"
              >
                {/* Cyber Corner Reticles */}
                <span className="absolute top-2 left-2 z-20 font-mono text-[10px] text-[#00ff41]/40 select-none group-hover:text-[#00ff41] transition-colors">+</span>
                <span className="absolute top-2 right-2 z-20 font-mono text-[10px] text-[#00ff41]/40 select-none group-hover:text-[#00ff41] transition-colors">+</span>

                {/* Hero Media Preview Banner */}
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
                    {/* Dark gradient & scanline overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080d08] via-transparent to-black/40 pointer-events-none" />
                    
                    {/* Top Status & Tag Badges */}
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

                    {/* Date Pill at bottom-left of photo */}
                    <div className="absolute bottom-3 left-3 z-10 font-mono text-[11px] text-[#00ff41] bg-[#050705]/90 border border-[#123a17] px-2.5 py-1 rounded">
                      {event.date}
                    </div>
                  </div>
                )}

                {/* Card Content Body */}
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    {/* Title */}
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#c8f7d0] group-hover:text-[#00ff41] transition-colors">
                      {event.title}
                    </h3>

                    {/* Venue & Metadata */}
                    {event.venue && (
                      <div className="mt-2.5 flex items-center gap-1.5 font-mono text-xs text-[#6fae78]">
                        <MapPin size={13} className="text-[#00ff41] shrink-0" />
                        <span>{event.venue}</span>
                      </div>
                    )}

                    {/* Summary */}
                    <p className="mt-4 font-mono text-xs sm:text-sm leading-relaxed text-[#6fae78]">
                      {event.cardSummary}
                    </p>

                    {/* Mini Photo Filmstrip Previews */}
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

                  {/* Card Footer: View Gallery Trigger */}
                  <div className="mt-6 pt-4 border-t border-[#123a17] flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00ff41] flex items-center gap-1.5 transition-transform group-hover:translate-x-1">
                      LAUNCH GALLERY <ArrowUpRight size={15} />
                    </span>
                    <span className="font-mono text-[11px] text-[#6fae78] group-hover:text-[#c8f7d0] transition-colors">
                      CLICK TO INSPECT
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Gallery Modal */}
      <EventGalleryModal
        event={activeEvent}
        onClose={() => setActiveEvent(null)}
      />
    </section>
  );
};

