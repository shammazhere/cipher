import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Github, Linkedin, Mail, Users } from 'lucide-react';
import { LeaderModal, LeaderData } from '../Modals/LeaderModal';
import { useData } from '../../context/DataContext';
import defaultLeadership from '../../data/leadership.json';

export const LeadershipPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { leadership: contextLeadership } = useData();
  const [selectedLeader, setSelectedLeader] = useState<LeaderData | null>(null);

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

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-5">
        {/* Top Breadcrumb */}
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
            // SECTOR_03 // LEADERSHIP
          </span>
        </div>

        {/* Hero Header */}
        <div className="border-b border-[var(--border)] pb-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-glow">
                Leadership Structure
              </h1>
              <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground sm:text-base">
                Meet the faculty mentors, elected student office bearers, and domain heads driving CIPHER activities, hackathons, and technical excellence.
              </p>
            </div>
            <div className="shrink-0 font-mono text-xs text-[var(--matrix)] rounded-lg border border-[var(--matrix)]/40 bg-[var(--card)] px-4 py-2 self-start md:self-auto">
              <span className="text-foreground font-bold">{leaders.length}</span> Council Members
            </div>
          </div>
        </div>

        {/* Leaders Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {leaders.map((leader, idx) => (
            <motion.div
              key={`${leader.role}-${leader.name}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (idx % 8) * 0.05 }}
              onClick={() => setSelectedLeader(leader)}
              role="button"
              tabIndex={0}
              data-cursor="lens"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedLeader(leader);
                }
              }}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/50 text-left transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow hover:-translate-y-1.5"
            >
              {/* Photo with Grayscale to Color Transition */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#050705]">
                <img
                  src={leader.photo}
                  alt={`${leader.name}, ${leader.role}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050705] via-transparent to-transparent" />
                
                {/* Dossier Badge Overlay */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="rounded bg-[#050705]/90 border border-[var(--matrix)]/60 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-[var(--matrix)]">
                    View Dossier &rarr;
                  </span>
                </div>
              </div>

              {/* Leader Details */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="inline-block font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                    {leader.role}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-bold text-foreground group-hover:text-[var(--matrix)] transition-colors">
                    {leader.name}
                  </h3>
                  {leader.bio && (
                    <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {leader.bio}
                    </p>
                  )}
                </div>

                {/* Social Actions */}
                <div className="mt-4 flex items-center gap-3 border-t border-[var(--border)]/60 pt-3">
                  <a
                    href={leader.github || ''}
                    target={leader.github ? '_blank' : undefined}
                    rel={leader.github ? 'noopener noreferrer' : undefined}
                    onClick={(e) => {
                      if (!leader.github) e.preventDefault();
                      e.stopPropagation();
                    }}
                    aria-label={`${leader.name} GitHub`}
                    className="text-muted-foreground transition-colors hover:text-[var(--matrix)] cursor-pointer"
                  >
                    <Github size={17} />
                  </a>
                  <a
                    href={leader.linkedin || ''}
                    target={leader.linkedin ? '_blank' : undefined}
                    rel={leader.linkedin ? 'noopener noreferrer' : undefined}
                    onClick={(e) => {
                      if (!leader.linkedin) e.preventDefault();
                      e.stopPropagation();
                    }}
                    aria-label={`${leader.name} LinkedIn`}
                    className="text-muted-foreground transition-colors hover:text-[var(--matrix)] cursor-pointer"
                  >
                    <Linkedin size={17} />
                  </a>
                  {leader.email && (
                    <a
                      href={`mailto:${leader.email}`}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Email ${leader.name}`}
                      className="text-muted-foreground transition-colors hover:text-[var(--matrix)]"
                    >
                      <Mail size={17} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join Council CTA */}
        <div className="mt-20 rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--card)] via-[#080d08] to-[var(--card)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[var(--matrix)]/40 transition-colors">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
              <Users size={14} />
              <span>Become a Student Leader</span>
            </div>
            <h3 className="mt-1 font-display text-xl sm:text-2xl text-foreground">
              Interested in Leading CIPHER Initiatives?
            </h3>
            <p className="mt-1 font-mono text-xs sm:text-sm text-muted-foreground max-w-xl">
              Apply for student executive positions, join event committees, and build leadership credentials in computing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('join')}
            data-cursor="lens"
            className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-[var(--matrix)] bg-[var(--matrix)]/10 px-5 py-3 font-mono text-xs uppercase tracking-wider text-[var(--matrix)] hover:bg-[var(--matrix)] hover:text-black transition-all duration-300 font-bold shadow-[0_0_15px_rgba(0,255,65,0.15)]"
          >
            <span>Apply to Join</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Leader Dossier Modal */}
      <LeaderModal leader={selectedLeader} onClose={() => setSelectedLeader(null)} />
    </div>
  );
};
