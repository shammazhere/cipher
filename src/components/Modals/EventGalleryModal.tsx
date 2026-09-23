import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

export interface GalleryModalData {
  slug: string;
  tag: string;
  title: string;
  dateStr: string;
  cardDateBadge: string;
  cardSubtitle: string;
  paragraphs: string[];
  images: string[];
}

interface EventGalleryModalProps {
  data?: GalleryModalData | null;
  event?: any;
  onClose: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? 80 : -80,
    opacity: direction === 0 ? 1 : 0,
    scale: direction === 0 ? 1 : 0.96,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.96,
  }),
};

export const EventGalleryModal: React.FC<EventGalleryModalProps> = ({ data, event, onClose }) => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

  // Universal pointer & touch gesture refs (works for mouse, trackpad, and touchscreen)
  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const isHorizontalGesture = useRef<boolean>(false);

  const activeData: GalleryModalData | null = data || (event ? {
    slug: event.tag ? event.tag.toUpperCase().replace(/\s+/g, '_') : 'EVENT',
    tag: event.tag || 'Activity',
    title: event.title || '',
    dateStr: `${event.fullDate || event.date} · ${event.venue || 'Kalam Auditorium'}`,
    cardDateBadge: event.date || '',
    cardSubtitle: event.venue || 'CSE Department',
    paragraphs: event.detailedReport || [event.desc || ''],
    images: event.images || [],
  } : null);

  const images = activeData?.images || [];
  const total = images.length;
  const currentIndex = ((page % total) + total) % total;

  // Preload all gallery images asynchronously for instant, lag-free transitions
  useEffect(() => {
    if (!images.length) return;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.decoding = 'async';
    });
  }, [images]);

  const paginate = useCallback((newDirection: number) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  }, []);

  const handleNext = useCallback(() => {
    if (!total) return;
    paginate(1);
  }, [total, paginate]);

  const handlePrev = useCallback(() => {
    if (!total) return;
    paginate(-1);
  }, [total, paginate]);

  // Keyboard navigation & lock body scroll
  useEffect(() => {
    if (!activeData) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeData, onClose, handleNext, handlePrev]);

  useEffect(() => {
    setPage([0, 0]);
  }, [activeData]);

  // Universal pointer & touch gesture handlers (mouse drag on laptop/desktop + touch swipe on phones)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    isDragging.current = true;
    isHorizontalGesture.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || dragStartX.current === null || dragStartY.current === null) return;
    const dx = e.clientX - dragStartX.current;
    const dy = e.clientY - dragStartY.current;

    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      isHorizontalGesture.current = true;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || dragStartX.current === null) {
      isDragging.current = false;
      return;
    }

    const dx = e.clientX - dragStartX.current;

    if (isHorizontalGesture.current || Math.abs(dx) > 35) {
      if (dx < -30) {
        handleNext();
      } else if (dx > 30) {
        handlePrev();
      }
    }

    dragStartX.current = null;
    dragStartY.current = null;
    isDragging.current = false;
    isHorizontalGesture.current = false;
  };

  const onPointerCancel = () => {
    dragStartX.current = null;
    dragStartY.current = null;
    isDragging.current = false;
    isHorizontalGesture.current = false;
  };

  if (!activeData || total === 0) return null;

  const nextImageIdx = (currentIndex + 1) % total;

  return (
    <AnimatePresence>
      {activeData && total > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeData.title} photo archive`}
          className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-black/90"
          onClick={onClose}
        >
          {/* Scrollable container: items-start on mobile prevents flex center cutoff; md:items-center on desktop */}
          <div className="flex min-h-full items-start md:items-center justify-center p-3 sm:p-6 py-6 md:py-10">
            {/* Main Modal Card */}
            <motion.div
              className="relative z-10 w-full max-w-4xl rounded-xl border border-[var(--matrix)]/40 bg-[#050705] p-4 sm:p-6 md:p-8 shadow-[0_0_50px_rgba(0,255,65,0.2)]"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                data-cursor="lens"
                className="absolute right-3 top-3 sm:right-5 sm:top-5 z-30 flex h-9 w-9 items-center justify-center rounded border border-[var(--border)] bg-[#050705]/90 text-muted-foreground transition-colors hover:border-[var(--matrix)] hover:text-[var(--matrix)] active:scale-95 shadow-md"
              >
                <X size={16} />
              </button>

              {/* Mobile Header (rendered at top for mobile screens) */}
              <div className="mb-4 pr-10 md:hidden">
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                  CIPHER // ACTIVITIES
                </span>
                <h3 className="mt-1 font-display text-xl sm:text-2xl text-foreground">
                  {activeData.title}
                </h3>
                <span className="mt-0.5 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {activeData.dateStr}
                </span>
              </div>

              {/* Responsive 2-Column Desktop / Mobile Photo-First Grid */}
              <div className="flex flex-col md:grid md:grid-cols-2 md:gap-8 items-start">
                {/* Desktop Left Column / Mobile Bottom: Narrative Text */}
                <div className="order-2 md:order-1 flex flex-col mt-6 md:mt-0">
                  {/* Desktop-only Header */}
                  <div className="hidden md:block">
                    <span className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                      CIPHER // ACTIVITIES
                    </span>
                    <h3 className="mt-2 font-display text-2xl text-foreground md:text-3xl">
                      {activeData.title}
                    </h3>
                    <span className="mt-1 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {activeData.dateStr}
                    </span>
                  </div>

                  {/* Story Paragraphs */}
                  <div className="space-y-3 font-mono text-xs sm:text-sm leading-relaxed text-muted-foreground md:mt-4">
                    {activeData.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                {/* Right Column (Desktop) / Top Section (Mobile): Interactive Photo Album */}
                <div className="order-1 md:order-2 flex flex-col items-center justify-center w-full">
                  <div
                    className="relative aspect-[3/4] w-full max-w-[300px] sm:max-w-[320px] overflow-hidden rounded-lg select-none cursor-grab active:cursor-grabbing"
                    style={{ touchAction: 'pan-y' }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerCancel}
                  >
                    {/* Background Depth Preview Underneath */}
                    <div
                      className="absolute inset-0 rounded-lg border border-[var(--border)] bg-[var(--card)] pointer-events-none"
                      style={{
                        transform: 'translateY(6px) scale(0.96)',
                        opacity: 0.5,
                      }}
                    >
                      <img
                        src={images[nextImageIdx]}
                        alt=""
                        decoding="async"
                        className="h-full w-full object-cover opacity-50"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Active Hardware-Accelerated Sliding Photo Card */}
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                      <motion.div
                        key={page}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.22 },
                          opacity: { duration: 0.16 },
                          scale: { duration: 0.22 },
                        }}
                        data-cursor="lens"
                        className="absolute inset-0 overflow-hidden rounded-lg border border-[var(--matrix)] bg-[var(--card)] shadow-[0_0_25px_rgba(0,255,65,0.2)] will-change-transform"
                      >
                        {/* Top Header Badge */}
                        <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-[#050705]/90 to-transparent font-mono text-[10px] uppercase text-[var(--matrix)] pointer-events-none">
                          <span>{activeData.slug}</span>
                          <span>
                            {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Main Image */}
                        <img
                          src={images[currentIndex]}
                          alt={activeData.title}
                          decoding="async"
                          loading="eager"
                          className="h-full w-full object-cover pointer-events-none"
                          draggable={false}
                        />

                        {/* Bottom Info Gradient */}
                        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#050705] via-[#050705]/80 to-transparent p-3.5 sm:p-4 pointer-events-none">
                          <span className="inline-block rounded border border-[var(--matrix)]/50 bg-[#050705]/90 px-2 py-0.5 font-mono text-[9px] uppercase text-[var(--matrix)] mb-1.5">
                            {activeData.cardDateBadge}
                          </span>
                          <h4 className="font-display text-base sm:text-lg leading-tight text-foreground">{activeData.title}</h4>
                          <p className="mt-0.5 font-mono text-[11px] sm:text-xs text-muted-foreground">{activeData.cardSubtitle}</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation Controls & Indicators */}
                  <div className="mt-4 flex w-full max-w-[300px] sm:max-w-[320px] items-center justify-between">
                    {/* Left Button */}
                    <button
                      type="button"
                      onClick={handlePrev}
                      data-cursor="lens"
                      aria-label="Previous photo"
                      className="flex h-9 w-9 items-center justify-center rounded border border-[var(--border)] text-muted-foreground transition-colors hover:border-[var(--matrix)] hover:text-[var(--matrix)] active:scale-90"
                    >
                      <ArrowLeft size={16} />
                    </button>

                    {/* Middle Dots & Swipe Hint */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-mono text-xs text-[var(--matrix)]">
                        {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/80">
                        DRAG OR TAP &rarr;
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {images.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            type="button"
                            onClick={() => {
                              const diff = dotIdx - currentIndex;
                              if (diff !== 0) paginate(diff);
                            }}
                            aria-label={`Go to photo ${dotIdx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-200 p-0 ${
                              dotIdx === currentIndex
                                ? 'w-4 bg-[var(--matrix)] shadow-[0_0_8px_var(--matrix)]'
                                : 'w-1.5 bg-[var(--border)] hover:bg-[var(--matrix)]/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Right Button */}
                    <button
                      type="button"
                      onClick={handleNext}
                      data-cursor="lens"
                      aria-label="Next photo"
                      className="flex h-9 w-9 items-center justify-center rounded border border-[var(--border)] text-muted-foreground transition-colors hover:border-[var(--matrix)] hover:text-[var(--matrix)] active:scale-90"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};


