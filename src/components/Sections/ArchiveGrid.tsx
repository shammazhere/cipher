import React, { useState, useMemo } from 'react';
import { ArrowUpRight, Key } from 'lucide-react';
import { BackdoorModal } from '../Modals/BackdoorModal';
import { useData } from '../../context/DataContext';

/**
 * Archive Grid Component
 * 
 * Non-technical explanation:
 * Displays the complete numbered list of all past workshops, seminars, and visits
 * organized by CIPHER (e.g. Applied Machine Learning, Solidity, RPA, etc.).
 * Features category filtering chips and the secret backdoor link at the bottom!
 */

export const ArchiveGrid: React.FC = () => {
  const { archive } = useData();
  const [backdoorOpen, setBackdoorOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'DEV' | 'SYSTEMS' | 'CAREER'>('ALL');

  const getCategory = (title: string): string => {
    const t = title.toLowerCase();
    if (t.includes('react') || t.includes('github') || t.includes('uml') || t.includes('latex') || t.includes('programming')) {
      return 'SOFTWARE DEV';
    }
    if (t.includes('blockchain') || t.includes('solidity') || t.includes('rpa') || t.includes('machine learning') || t.includes('crowdsource') || t.includes('tools')) {
      return 'SYSTEMS & CLOUD';
    }
    if (t.includes('interview') || t.includes('visit') || t.includes('onboarding') || t.includes('funded') || t.includes('udaan')) {
      return 'INDUSTRY & CAREER';
    }
    return 'TECH WORKSHOP';
  };

  const filteredItems = useMemo(() => {
    if (filter === 'ALL') return archive;
    return archive.filter((item) => {
      const cat = getCategory(item.title);
      if (filter === 'DEV') return cat === 'SOFTWARE DEV';
      if (filter === 'SYSTEMS') return cat === 'SYSTEMS & CLOUD';
      if (filter === 'CAREER') return cat === 'INDUSTRY & CAREER';
      return true;
    });
  }, [archive, filter]);

  return (
    <section id="archive" className="relative border-t border-[#123a17] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[#00ff41]">
          <span>// ARCHIVE</span>
          <span className="text-[#2c7a3a] hidden sm:inline">&gt;&gt; PAST_ACTIVITIES</span>
        </div>

        <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#c8f7d0] text-glow">
          Activities
        </h2>

        <p className="mt-4 font-mono text-xs sm:text-sm text-[#6fae78] max-w-2xl">
          Hands-on workshops, industrial visits, and technical sessions run by the Cipher Association — spanning full-stack development, cloud systems, research tooling, and career readiness.
        </p>

        {/* Interactive Filter Chips Bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#123a17] pb-5">
          <div className="flex flex-wrap items-center gap-2">
            {([
              { id: 'ALL', label: 'All Activities' },
              { id: 'DEV', label: 'Software & Dev' },
              { id: 'SYSTEMS', label: 'Systems & Cloud' },
              { id: 'CAREER', label: 'Industry & Visits' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wider transition-all ${
                  filter === tab.id
                    ? 'border border-[#00ff41] bg-[#00ff41]/15 text-[#00ff41] shadow-[0_0_12px_rgba(0,255,65,0.25)]'
                    : 'border border-[#123a17] bg-[#080d08] text-[#6fae78] hover:border-[#00ff41]/40 hover:text-[#c8f7d0]'
                }`}
                data-cursor="lens"
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="font-mono text-[11px] text-[#2c7a3a]">
            SHOWING {filteredItems.length} OF {archive.length} ENTRIES
          </span>
        </div>

        {/* 3-Column Dense Monospace Grid with Cyber Accents */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const category = getCategory(item.title);

            return (
              <a
                key={item.id}
                href={item.href || `https://sjec.ac.in/cipher/activity/${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-[#123a17] bg-[#080d08]/85 p-4.5 transition-all duration-300 hover:border-[#00ff41] hover:bg-[#0c140d] hover:shadow-[0_0_22px_rgba(0,255,65,0.2)] hover:-translate-y-0.5"
                data-cursor="lens"
              >
                {/* Left Active Glow Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#00ff41] group-hover:shadow-[0_0_8px_#00ff41] transition-all" />

                <div className="flex items-center gap-3.5 min-w-0 pl-1">
                  <span className="font-mono text-xs font-bold text-[#00ff41] opacity-75">
                    {item.id}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-medium text-[#c8f7d0] truncate group-hover:text-[#00ff41] transition-colors">
                      {item.title}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#2c7a3a] group-hover:text-[#6fae78] transition-colors mt-0.5">
                      {category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-block rounded bg-[#050705] border border-[#123a17] px-1.5 py-0.5 text-[8px] uppercase text-[#6fae78] group-hover:border-[#00ff41]/30">
                    LOG
                  </span>
                  <ArrowUpRight
                    size={15}
                    className="text-[#6fae78] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#00ff41]"
                  />
                </div>
              </a>
            );
          })}
        </div>

        {/* Secret Backdoor Easter Egg Trigger Link */}
        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={() => setBackdoorOpen(true)}
            className="inline-flex items-center gap-2 font-mono text-xs text-[#2c7a3a] transition-colors hover:text-[#00ff41] cursor-pointer"
            data-cursor="lens"
          >
            <Key size={12} />
            <span>Try this: ! @ # &lt; &gt; - - &gt; a</span>
          </button>
        </div>
      </div>

      {/* Root Access Terminal Popup */}
      <BackdoorModal
        isOpen={backdoorOpen}
        onClose={() => setBackdoorOpen(false)}
      />
    </section>
  );
};
