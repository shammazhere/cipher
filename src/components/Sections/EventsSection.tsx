import React, { useState } from 'react';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { EventGalleryModal } from '../Modals/EventGalleryModal';
import { useData } from '../../context/DataContext';
import { EventItem } from '../../types';

/**
 * Events & Workshops Section Component
 * 
 * Non-technical explanation:
 * Displays featured flagship events (like the Lumière Gala and Prompt Ops competition).
 * Each card displays dates, descriptions, and a "VIEW GALLERY" button that launches
 * the photo album modal.
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

        <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#c8f7d0] text-glow">
          Events &amp; Workshops
        </h2>

        {/* Featured Event Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => setActiveEvent(event)}
              className="group relative flex flex-col justify-between rounded-xl border border-[#123a17] bg-[#080d08]/70 p-7 sm:p-9 transition-all duration-300 hover:border-[#00ff41] hover:bg-[#0e1613] hover:shadow-[0_0_35px_rgba(0,255,65,0.2)] cursor-pointer"
              data-cursor="lens"
            >
              <div>
                {/* Header Tag and Date */}
                <div className="flex items-center justify-between font-mono text-xs text-[#00ff41] mb-6">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                    <Calendar size={13} />
                    {event.tag}
                  </span>
                  <span className="text-[#6fae78] border border-[#123a17] bg-[#050705] px-2.5 py-1 rounded text-[11px]">
                    {event.date}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#c8f7d0] group-hover:text-[#00ff41] transition-colors">
                  {event.title}
                </h3>

                {/* Event Summary */}
                <p className="mt-4 font-mono text-xs sm:text-sm leading-relaxed text-[#6fae78]">
                  {event.cardSummary}
                </p>
              </div>

              {/* Card Footer: View Gallery Action */}
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
      </div>

      {/* Full Gallery Modal */}
      <EventGalleryModal
        event={activeEvent}
        onClose={() => setActiveEvent(null)}
      />
    </section>
  );
};
