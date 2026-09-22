import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import { LeaderModal, LeaderData } from '../Modals/LeaderModal';
import { SectionHeader } from '../UI/SectionHeader';

/**
 * Leadership Section Component
 * 
 * Non-technical explanation:
 * Displays the CIPHER leadership council in a buttery-smooth auto-scrolling
 * horizontal loop. Features grayscale portrait cards that transition to color
 * on hover, pause smoothly during touch/scroll interaction, and open a focused
 * dossier modal on click.
 */

const LEADERS: LeaderData[] = [
  {
    role: 'President',
    name: 'Elston Herold Pereira',
    photo: '/leadership/president.webp',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    role: 'Vice President',
    name: 'Raynell Lewis',
    photo: '/leadership/vice-president.webp',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    role: 'Secretary',
    name: 'Chaitra R M',
    photo: '/leadership/secretary.webp',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    role: 'Treasurer',
    name: 'Nazmin Ziya',
    photo: '/leadership/treasurer.webp',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    role: 'Joint Treasurer',
    name: 'Jeslin Ninora',
    photo: '/leadership/joint-treasurer.webp',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
];

export const LeadershipSection: React.FC = () => {
  const [selectedLeader, setSelectedLeader] = useState<LeaderData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef<boolean>(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Repeated list for continuous seamless infinite loop
  const loopList = [...LEADERS, ...LEADERS];

  // Auto-scroll loop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animId = 0;
    const tick = () => {
      const halfWidth = el.scrollWidth / 2;
      if (!isInteracting.current) {
        el.scrollLeft += 0.5;
      }
      if (el.scrollLeft >= halfWidth) {
        el.scrollLeft -= halfWidth;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += halfWidth;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleInteraction = () => {
    isInteracting.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isInteracting.current = false;
    }, 1200);
  };

  return (
    <section id="leadership" className="relative border-t border-[var(--border)] py-24">
      <div className="mx-auto max-w-7xl px-5">
        {/* Section Tag & Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader label="governance" title="Leadership Structure" />
        </motion.div>

        {/* Carousel Container with Edge Gradient Fades */}
        <div
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          }}
          className="group relative mt-14"
        >
          <div
            ref={scrollRef}
            onWheel={handleInteraction}
            onPointerDown={handleInteraction}
            onTouchMove={handleInteraction}
            className="no-scrollbar flex w-full cursor-grab gap-5 overflow-x-auto overscroll-x-contain py-2"
          >
            {loopList.map((leader, idx) => (
              <div
                key={`${leader.role}-${idx}`}
                role="button"
                tabIndex={0}
                data-cursor="lens"
                onClick={() => setSelectedLeader(leader)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedLeader(leader);
                  }
                }}
                className="flex w-[240px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/50 text-left transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow sm:w-[280px]"
              >
                {/* Photo with Matrix/Gradient Fade */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#050705]">
                  <img
                    src={leader.photo}
                    alt={`${leader.name}, ${leader.role}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050705] via-transparent to-transparent" />
                </div>

                {/* Meta details */}
                <div className="flex flex-col items-center gap-1 px-4 py-5 text-center">
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                    {leader.role}
                  </span>
                  <h3 className="font-display text-lg leading-tight text-foreground">
                    {leader.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-3">
                    <a
                      href={leader.github || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${leader.name} on GitHub`}
                      className="text-muted-foreground transition-colors hover:text-[var(--matrix)]"
                    >
                      <Github size={20} />
                    </a>
                    <a
                      href={leader.linkedin || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${leader.name} on LinkedIn`}
                      className="text-muted-foreground transition-colors hover:text-[var(--matrix)]"
                    >
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Focused Dossier Modal on Card Click */}
      <LeaderModal leader={selectedLeader} onClose={() => setSelectedLeader(null)} />
    </section>
  );
};
