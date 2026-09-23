import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowUpRight, ArrowLeft, Sparkles } from 'lucide-react';
import { EventGalleryModal, GalleryModalData } from '../Modals/EventGalleryModal';
import { useData } from '../../context/DataContext';
import { EventItem } from '../../types';

const DEFAULT_FEATURED_EVENTS: GalleryModalData[] = [
  {
    slug: 'LUMIERE_GALA',
    tag: 'Branch Gala',
    title: 'Lumière — The Gala',
    dateStr: '29 October 2025 · Kalam Auditorium',
    cardDateBadge: '29 OCT 2025',
    cardSubtitle: 'CSE Branch Entry · Kalam Auditorium',
    paragraphs: [
      'The Department of Computer Science and Engineering (CSE) held its branch entry programme, “Lumière – The Gala,” on 29 October 2025 at the Kalam Auditorium. Organised by the Cipher Association, the event welcomed students into the department through a formal gathering centred on the theme “Where Glam Meets Glow.” The venue featured coordinated red, gold and black décor, floral arrangements, illuminated panels and a central Lumière backdrop.',
      'The programme gave students an opportunity to interact with peers and take part in a shared departmental event beyond academics, highlighting the role of the Cipher Association in organising student-led activities. It concluded as a formal branch entry that marked the students’ transition into the department and reinforced a sense of collective identity.',
    ],
    images: [
      '/lumiere/website_photo_1.webp',
      '/lumiere/website_photo_2.webp',
      '/lumiere/website_photo_3.webp',
      '/lumiere/website_photo_4.webp',
      '/lumiere/website_photo_5.webp',
      '/lumiere/website_photo_6.webp',
      '/lumiere/website_photo_7.webp',
      '/lumiere/website_photo_8.webp',
    ],
  },
  {
    slug: 'PROMPT_OPS',
    tag: 'Competition',
    title: 'PROMPT OPS-2K26',
    dateStr: '25 March 2026 · Prompt Engineering Competition',
    cardDateBadge: '25 MAR 2026',
    cardSubtitle: 'AgentBlazer Club × Cipher',
    paragraphs: [
      'Organized by the AgentBlazer Club and Cipher under the guidance of Ms. Nisha J Roche, Ms. Jaishma K, and HOD Dr. Melwyn D’Souza, this technical competition focused on prompt engineering and AI tools (mapped to PO4, PO5, PO8, PO11).',
      'Track 1 (1st Year) featured invitation generation, logo recreation, and image recreation rounds, with Chinmayee, Chris Royston Monteiro, and Deeksha Ravi Moger taking top honors.',
      'Track 2 (2nd Year) tested students in JSON conversion, Python code debugging, and a Gemini AI security prompt extraction challenge, with Harimurali KS, Venus Suhani D’Lima, and Venisha Snehal D’Souza securing top positions.',
    ],
    images: [
      '/promptops/website_photo_1.webp',
      '/promptops/website_photo_2.webp',
      '/promptops/website_photo_3.webp',
      '/promptops/website_photo_4.webp',
      '/promptops/website_photo_5.webp',
      '/promptops/website_photo_6.webp',
      '/promptops/website_photo_7.webp',
      '/promptops/website_photo_8.webp',
    ],
  },
];

const formatEventToGalleryData = (event: EventItem): GalleryModalData => ({
  slug: event.id || (event.tag ? event.tag.toUpperCase().replace(/\s+/g, '_') : 'EVENT'),
  tag: event.tag || 'EVENT',
  title: event.title,
  dateStr: `${event.fullDate || event.date || 'UPCOMING'} · ${event.venue || 'Kalam Auditorium'}`,
  cardDateBadge: event.date || 'UPCOMING',
  cardSubtitle: event.subtitle || event.venue || 'CIPHER Department',
  paragraphs: (event.detailedReport && event.detailedReport.length > 0)
    ? event.detailedReport
    : [event.cardSummary || 'Technical event and workshop organized by CIPHER.'],
  images: event.images && event.images.length > 0 ? event.images : ['/lumiere/website_photo_1.webp'],
});

const EventCardItem: React.FC<{
  event: GalleryModalData;
  onOpenGallery: (event: GalleryModalData) => void;
}> = ({ event, onOpenGallery }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerDownPos = React.useRef<{ x: number; y: number } | null>(null);

  const handleCardClick = () => {
    if (isFlipped) return;
    setIsFlipped(true);

    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);

    flipTimerRef.current = setTimeout(() => {
      onOpenGallery(event);
      setTimeout(() => {
        setIsFlipped(false);
      }, 150);
    }, 200);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerDownPos.current) return;
    const dx = Math.abs(e.clientX - pointerDownPos.current.x);
    const dy = Math.abs(e.clientY - pointerDownPos.current.y);
    pointerDownPos.current = null;

    // If movement was more than 10px, the user was scrolling/swiping — don't trigger flip
    if (dx > 10 || dy > 10) return;

    handleCardClick();
  };

  return (
    <div
      className="flip-card-container h-full min-h-[360px] sm:min-h-[380px] w-full cursor-pointer select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      role="button"
      tabIndex={0}
      data-cursor="lens"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div
        className="flip-card-inner h-full w-full rounded-xl"
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT FACE */}
        <article className="flip-card-face flip-card-front flex h-full flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card)]/90 p-6 text-left transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow hover:scale-[1.01]">
          <div>
            {/* Card Top Strip */}
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                <Calendar size={13} /> {event.tag}
              </span>
              <span className="rounded border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {event.cardDateBadge}
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-1.5 font-display text-xl sm:text-2xl text-foreground transition-colors group-hover:text-[var(--matrix)]">
              {event.title}
            </h3>
            <p className="mb-3 font-mono text-xs text-[var(--matrix)]/90">
              {event.cardSubtitle}
            </p>

            {/* Body description */}
            <p className="font-mono text-sm leading-relaxed text-muted-foreground">
              {event.paragraphs[0]}
            </p>
          </div>

          {/* Bottom strip */}
          <div className="mt-6 flex items-center justify-between border-t border-[var(--border)]/60 pt-3 text-xs font-mono text-muted-foreground">
            <span className="text-muted-foreground/60">{event.images.length} Media Assets</span>
            <span className="inline-flex items-center gap-1 text-[var(--matrix)] font-medium">
              <span>View Gallery</span>
              <ArrowUpRight size={14} />
            </span>
          </div>
        </article>

        {/* BACK FACE (Cyber Hologram Back during 3D Flip) */}
        <div className="flip-card-face flip-card-back flex h-full flex-col items-center justify-center rounded-xl border border-[var(--matrix)] bg-[#050705] p-6 text-center shadow-[0_0_30px_rgba(0,255,65,0.2)]">
          <div className="relative flex flex-col items-center justify-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--matrix)]/60 bg-[var(--matrix)]/10 text-[var(--matrix)] shadow-[0_0_20px_rgba(0,255,65,0.35)] animate-pulse">
              <span className="font-mono text-lg font-bold">CPH</span>
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--matrix)] text-glow">
              LAUNCHING VAULT...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EventsPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [activeModalData, setActiveModalData] = useState<GalleryModalData | null>(null);
  const { events } = useData();

  const allEvents: GalleryModalData[] = useMemo(() => {
    return (events && events.length > 0)
      ? events.map(formatEventToGalleryData)
      : DEFAULT_FEATURED_EVENTS;
  }, [events]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-5">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            data-cursor="lens"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-[var(--matrix)]"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span>&larr; Back to CIPHER Portal</span>
          </button>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--matrix)] text-glow">
            // SECTOR_04 // EVENTS
          </span>
        </div>

        {/* Hero Header */}
        <div className="border-b border-[var(--border)] pb-8 pt-4">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--matrix)] mb-2">
            <Sparkles size={14} />
            <span>Flagship Gatherings & Competitions</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-glow">
            Events &amp; Workshops
          </h1>
          <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground sm:text-base">
            Annual branch entry galas, hackathons, and technical competitions organized by the CIPHER Association at SJEC. Click any card to launch its full photo archive and detailed briefing.
          </p>
        </div>

        {/* Events Grid */}
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allEvents.map((event, idx) => (
              <motion.div
                key={`${event.slug || event.title}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <EventCardItem
                  event={event}
                  onOpenGallery={(ev) => setActiveModalData(ev)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cross-Link Banner to Activities Page */}
        <div className="mt-20 rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--card)] via-[#080d08] to-[var(--card)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[var(--matrix)]/40 transition-colors">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
              // ARCHIVE EXPLORER
            </span>
            <h3 className="mt-1 font-display text-xl sm:text-2xl text-foreground">
              Looking for Department Workshops &amp; Sessions?
            </h3>
            <p className="mt-1 font-mono text-xs sm:text-sm text-muted-foreground max-w-xl">
              Explore our 17+ technical symposiums, hands-on coding labs, and industrial visits in the dedicated Activities archive.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('activities')}
            data-cursor="lens"
            className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-[var(--matrix)] bg-[var(--matrix)]/10 px-5 py-3 font-mono text-xs uppercase tracking-wider text-[var(--matrix)] hover:bg-[var(--matrix)] hover:text-black transition-all duration-300 font-bold shadow-[0_0_15px_rgba(0,255,65,0.15)]"
          >
            <span>Browse Activities</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Gallery Modal */}
      <EventGalleryModal data={activeModalData} onClose={() => setActiveModalData(null)} />
    </div>
  );
};
