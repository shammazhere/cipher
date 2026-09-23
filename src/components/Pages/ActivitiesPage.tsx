import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import defaultArchive from '../../data/archive.json';

interface ActivityItem {
  id?: string;
  title: string;
  href?: string;
}

const getActivityCategory = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes('machine learning') || t.includes('ai') || t.includes('openai')) return 'AI & ML';
  if (t.includes('blockchain') || t.includes('solidity')) return 'Blockchain';
  if (t.includes('react') || t.includes('node') || t.includes('github') || t.includes('web')) return 'Web & Dev';
  if (t.includes('industrial visit')) return 'Industrial Visits';
  if (t.includes('interview') || t.includes('freshers') || t.includes('career') || t.includes('udaan')) return 'Career & Community';
  return 'Tools & Research';
};

export const ActivitiesPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { archive } = useData();

  const activities: ActivityItem[] = useMemo(() => {
    return (archive && archive.length > 0) ? archive : defaultArchive;
  }, [archive]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-5">
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
            // SECTOR_05 // ACTIVITIES_ARCHIVE
          </span>
        </div>

        {/* Hero Header */}
        <div className="border-b border-[var(--border)] pb-8 pt-4">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--matrix)] mb-2">
            <BookOpen size={14} />
            <span>Department Repository</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-glow">
                Activities &amp; Workshops
              </h1>
              <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground sm:text-base">
                Hands-on workshops, industrial visits, and technical sessions run by the Cipher Association — spanning AI, blockchain, research tooling, and career prep.
              </p>
            </div>
            <div className="shrink-0 font-mono text-xs text-[var(--matrix)] rounded-lg border border-[var(--matrix)]/40 bg-[var(--card)] px-4 py-2 self-start md:self-auto">
              <span className="text-foreground font-bold">{activities.length}</span> Verified Sessions
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity, idx) => {
              const category = getActivityCategory(activity.title);
              const hasLink = Boolean(activity.href && activity.href.trim().length > 0);

              const linkHref = hasLink ? activity.href : 'https://sjec.ac.in/cipher';

              return (
                <motion.div
                  key={`${activity.id || activity.title}-${idx}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: (idx % 6) * 0.04 }}
                >
                  <a
                    href={linkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="lens"
                    className="group flex h-full flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card)]/60 p-5 transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow hover:-translate-y-1"
                  >
                    <div>
                      {/* Card Header Strip */}
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-mono text-xs text-[var(--matrix)] font-bold">
                          SESSION // {String(activity.id || idx + 1).padStart(2, '0')}
                        </span>
                        <span className="rounded border border-[var(--border)] bg-[#050705] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                          {category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-[var(--matrix)]">
                        {activity.title}
                      </h3>
                    </div>

                    {/* Footer Strip */}
                    <div className="mt-5 flex items-center justify-between border-t border-[var(--border)]/60 pt-3 text-xs font-mono text-muted-foreground">
                      <span className="text-[11px] text-muted-foreground/70">
                        {hasLink ? 'Verified Document' : 'Department Archive'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[var(--matrix)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                        <ExternalLink size={13} />
                      </span>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Cross-Link Banner to Events Page */}
        <div className="mt-20 rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--card)] via-[#080d08] to-[var(--card)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[var(--matrix)]/40 transition-colors">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
              <Sparkles size={14} />
              <span>Flagship Experiences</span>
            </div>
            <h3 className="mt-1 font-display text-xl sm:text-2xl text-foreground">
              Explore Major Annual Events &amp; Competitions
            </h3>
            <p className="mt-1 font-mono text-xs sm:text-sm text-muted-foreground max-w-xl">
              Discover Lumière — The Gala, PROMPT OPS-2K26, and upcoming major departmental hackathons.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('events')}
            data-cursor="lens"
            className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-[var(--matrix)] bg-[var(--matrix)]/10 px-5 py-3 font-mono text-xs uppercase tracking-wider text-[var(--matrix)] hover:bg-[var(--matrix)] hover:text-black transition-all duration-300 font-bold shadow-[0_0_15px_rgba(0,255,65,0.15)]"
          >
            <span>View Events</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
