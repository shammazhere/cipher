import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
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

export const EventGalleryModal: React.FC<EventGalleryModalProps> = ({ data, event, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

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

  const handleNext = useCallback(() => {
    if (!total) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (!total) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!activeData) return;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeData, onClose, handleNext, handlePrev]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeData]);

  if (!activeData) return null;

  // Next 2 cards in line for 3D stack under the active card
  const upcoming = [(currentIndex + 1) % total, (currentIndex + 2) % total];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${activeData.title} photo archive`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Main Container */}
      <motion.div
        className="relative z-10 grid max-h-[90vh] w-full max-w-4xl gap-6 overflow-y-auto rounded-lg border border-[var(--matrix)]/40 bg-[var(--background)]/95 p-6 md:grid-cols-2 md:p-8"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          data-cursor="lens"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded border border-[var(--border)] text-muted-foreground transition-colors hover:border-[var(--matrix)] hover:text-[var(--matrix)]"
        >
          <X size={16} />
        </button>

        {/* Left Column: Event Story Narrative */}
        <div className="flex flex-col">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
            CIPHER // ACTIVITIES
          </span>
          <h3 className="mt-2 font-display text-2xl text-foreground md:text-3xl">
            {activeData.title}
          </h3>
          <span className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {activeData.dateStr}
          </span>
          <div className="mt-4 space-y-3 font-mono text-sm leading-relaxed text-muted-foreground">
            {activeData.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Photo Album Stack */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative aspect-[3/4] w-full max-w-[320px]">
            {/* Stacked Cards Underneath */}
            {upcoming
              .slice()
              .reverse()
              .map((imgIdx, idx) => {
                const depth = upcoming.length - idx;
                return (
                  <div
                    key={`stack-${imgIdx}-${depth}`}
                    className="absolute inset-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]"
                    style={{
                      transform: `translateY(${10 * depth}px) scale(${1 - 0.05 * depth})`,
                      opacity: 1 - 0.25 * depth,
                    }}
                  >
                    <img
                      src={images[imgIdx]}
                      alt=""
                      className="h-full w-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                );
              })}

            {/* Active Swipeable Front Card */}
            <SwipeCard
              key={currentIndex}
              photo={images[currentIndex]}
              position={currentIndex}
              total={total}
              slug={activeData.slug}
              dateBadge={activeData.cardDateBadge}
              title={activeData.title}
              subtitle={activeData.cardSubtitle}
              onSwiped={handleNext}
            />
          </div>

          {/* Navigation Controls & Pagination */}
          <div className="mt-5 flex w-full max-w-[320px] items-center justify-between">
            {/* Left Button */}
            <button
              type="button"
              onClick={handlePrev}
              data-cursor="lens"
              aria-label="Previous photo"
              className="flex h-9 w-9 items-center justify-center rounded border border-[var(--border)] text-muted-foreground transition-colors hover:border-[var(--matrix)] hover:text-[var(--matrix)]"
            >
              <ArrowLeft size={16} />
            </button>

            {/* Middle Dots & Info */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-mono text-xs text-[var(--matrix)]">
                {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/80">
                SWIPE TO EXPLORE &rarr;
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                {images.map((_, dotIdx) => (
                  <span
                    key={dotIdx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      dotIdx === currentIndex
                        ? 'w-4 bg-[var(--matrix)]'
                        : 'w-1 bg-[var(--border)]'
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
              className="flex h-9 w-9 items-center justify-center rounded border border-[var(--border)] text-muted-foreground transition-colors hover:border-[var(--matrix)] hover:text-[var(--matrix)]"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface SwipeCardProps {
  photo: string;
  position: number;
  total: number;
  slug: string;
  dateBadge: string;
  title: string;
  subtitle: string;
  onSwiped: () => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  photo,
  position,
  total,
  slug,
  dateBadge,
  title,
  subtitle,
  onSwiped,
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 0, 240], [-16, 0, 16]);
  const opacity = useTransform(x, [-320, -160, 0, 160, 320], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) > 80) {
      const dir = info.offset.x > 0 ? 1 : -1;
      animate(x, dir * 450, {
        type: 'spring',
        stiffness: 320,
        damping: 34,
        onComplete: onSwiped,
      });
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      data-cursor="lens"
      className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden rounded-lg border border-[var(--matrix)] bg-[var(--card)] box-glow"
    >
      {/* Top Header Strip inside Card */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-[#050705]/90 to-transparent font-mono text-[10px] uppercase text-[var(--matrix)]">
        <span>{slug}</span>
        <span>
          {String(position + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Main Image */}
      <img src={photo} alt={title} className="h-full w-full object-cover" draggable={false} />

      {/* Bottom Info Gradient */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#050705] via-[#050705]/80 to-transparent p-4">
        <span className="inline-block rounded border border-[var(--matrix)]/50 bg-[#050705]/90 px-2 py-0.5 font-mono text-[9px] uppercase text-[var(--matrix)] mb-2">
          {dateBadge}
        </span>
        <h4 className="font-display text-lg leading-tight text-foreground">{title}</h4>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </motion.div>
  );
};
