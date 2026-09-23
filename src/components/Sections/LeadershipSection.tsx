import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import { LeaderModal, LeaderData } from '../Modals/LeaderModal';
import { SectionHeader } from '../UI/SectionHeader';
import { useData } from '../../context/DataContext';
import defaultLeadership from '../../data/leadership.json';

/**
 * Leadership Section Component
 * 
 * Non-technical explanation:
 * Displays the CIPHER leadership council and Core Team heads in a buttery-smooth
 * auto-scrolling horizontal loop. Features grayscale portrait cards that transition to color
 * on hover, pause smoothly during touch/scroll interaction, and open a focused
 * dossier modal on click.
 */

export const LeadershipSection: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const { leadership: contextLeadership } = useData();
  const [selectedLeader, setSelectedLeader] = useState<LeaderData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef<boolean>(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const leaders: LeaderData[] = useMemo(() => {
    const raw = (contextLeadership && contextLeadership.length > 0) ? contextLeadership : defaultLeadership;
    return raw.map((item: any) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      photo: item.image || item.photo,
      bio: item.bio,
      github: item.github,
      linkedin: item.linkedin,
      email: item.email,
    }));
  }, [contextLeadership]);

  // Repeated list for continuous seamless infinite loop
  const loopList = useMemo(() => [...leaders, ...leaders], [leaders]);

  // Auto-scroll loop with Viewport IntersectionObserver
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animId = 0;
    let isVisible = false;

    const tick = () => {
      if (isVisible) {
        const halfWidth = el.scrollWidth / 2;
        if (!isInteracting.current) {
          el.scrollLeft += 0.5;
        }
        if (el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += halfWidth;
        }
      }
      animId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeader label="leadership" title="Leadership Structure" />
          </motion.div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('leadership')}
              data-cursor="lens"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[var(--matrix)] hover:underline self-start sm:self-auto mb-2"
            >
              <span>View Full Directory &rarr;</span>
            </button>
          )}
        </div>

        {/* Carousel Container with Zero-Cost Edge Gradient Overlays */}
        <div className="group relative mt-14">
          {/* Left Edge Soft Gradient Fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-16 bg-gradient-to-r from-[#050705] to-transparent"
          />
          {/* Right Edge Soft Gradient Fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-16 bg-gradient-to-l from-[#050705] to-transparent"
          />

          <div
            ref={scrollRef}
            onWheel={handleInteraction}
            onPointerDown={handleInteraction}
            onTouchStart={handleInteraction}
            onTouchMove={handleInteraction}
            onTouchEnd={handleInteraction}
            className="no-scrollbar flex w-full cursor-grab gap-5 overflow-x-auto overscroll-x-contain py-2 select-none"
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
                      href={leader.github || ''}
                      target={leader.github ? '_blank' : undefined}
                      rel={leader.github ? 'noopener noreferrer' : undefined}
                      onClick={(e) => {
                        if (!leader.github) e.preventDefault();
                        e.stopPropagation();
                      }}
                      aria-label={`${leader.name} on GitHub`}
                      className="text-muted-foreground transition-colors hover:text-[var(--matrix)] cursor-pointer"
                    >
                      <Github size={20} />
                    </a>
                    <a
                      href={leader.linkedin || ''}
                      target={leader.linkedin ? '_blank' : undefined}
                      rel={leader.linkedin ? 'noopener noreferrer' : undefined}
                      onClick={(e) => {
                        if (!leader.linkedin) e.preventDefault();
                        e.stopPropagation();
                      }}
                      aria-label={`${leader.name} on LinkedIn`}
                      className="text-muted-foreground transition-colors hover:text-[var(--matrix)] cursor-pointer"
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
