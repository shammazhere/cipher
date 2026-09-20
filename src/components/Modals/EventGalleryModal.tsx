import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { EventItem } from '../../types';

/**
 * Event Gallery Modal Component
 * 
 * Non-technical explanation:
 * When a visitor clicks "VIEW GALLERY" on an event card, this full modal opens:
 * - Left side shows the comprehensive writeup/report about the event.
 * - Right side displays the photo album with left/right arrows and slide counters.
 */

interface EventGalleryModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export const EventGalleryModal: React.FC<EventGalleryModalProps> = ({ event, onClose }) => {
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!event) return null;

  const images = event.images || [];
  const total = images.length;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPhotoIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  const currentCountText = `${String(photoIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-6 lg:p-10 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          className="relative my-auto w-full max-w-5xl rounded-2xl border border-[#00ff41]/40 bg-[#080d08] p-6 sm:p-8 lg:p-10 shadow-[0_0_60px_rgba(0,0,0,0.95)]"
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Right Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-lg border border-[#123a17] bg-[#050705] text-[#6fae78] transition-all hover:border-[#00ff41] hover:text-[#00ff41]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Modal Grid: Left Report / Right Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Event Report */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#00ff41]">
                  <span>CIPHER // ACTIVITIES</span>
                </div>

                <h3 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#c8f7d0] text-glow">
                  {event.title}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-xs text-[#6fae78]">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#00ff41]" />
                    {event.fullDate || event.date}
                  </span>
                  {event.venue && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#00ff41]" />
                      {event.venue}
                    </span>
                  )}
                </div>
              </div>

              {/* Multi-paragraph detailed report */}
              <div className="space-y-4 font-mono text-xs sm:text-sm leading-relaxed text-[#c8f7d0]/85 border-t border-[#123a17] pt-6">
                {event.detailedReport.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive Photo Album Preview */}
            <div className="lg:col-span-6 flex flex-col items-center">
              {/* Photo Display Card with Neon Border */}
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border border-[#00ff41]/60 bg-[#050705] shadow-[0_0_25px_rgba(0,255,65,0.25)]">
                {/* Photo Top Badge */}
                <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between font-mono text-[11px] text-[#00ff41] bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded border border-[#123a17]">
                  <span className="uppercase tracking-wider">{event.id.replace('-', '_')}</span>
                  <span>{currentCountText}</span>
                </div>

                {/* Active Image with transition */}
                <img
                  src={images[photoIndex]}
                  alt={`${event.title} snapshot ${photoIndex + 1}`}
                  className="h-full w-full object-cover transition-opacity duration-300"
                />

                {/* Photo Bottom Caption */}
                <div className="absolute bottom-3 left-3 z-10 bg-black/70 backdrop-blur-sm px-3 py-1 rounded border border-[#123a17]">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#00ff41]">
                    {event.date}
                  </span>
                </div>
              </div>

              {/* Album Controls Below Image */}
              <div className="mt-6 flex w-full items-center justify-between px-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#123a17] bg-[#050705] text-[#6fae78] transition-colors hover:border-[#00ff41] hover:text-[#00ff41]"
                  aria-label="Previous photo"
                  data-cursor="lens"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex flex-col items-center text-center">
                  <span className="font-mono text-sm font-bold text-[#00ff41]">
                    {currentCountText}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#2c7a3a]">
                    SWIPE TO EXPLORE &rarr;
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#123a17] bg-[#050705] text-[#6fae78] transition-colors hover:border-[#00ff41] hover:text-[#00ff41]"
                  aria-label="Next photo"
                  data-cursor="lens"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Dot Indicators */}
              <div className="mt-4 flex items-center gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhotoIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === photoIndex
                        ? 'w-6 bg-[#00ff41]'
                        : 'w-1.5 bg-[#123a17] hover:bg-[#2c7a3a]'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
