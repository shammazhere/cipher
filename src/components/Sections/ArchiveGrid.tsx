import React, { useState } from 'react';
import { ArrowUpRight, Key } from 'lucide-react';
import { BackdoorModal } from '../Modals/BackdoorModal';
import { useData } from '../../context/DataContext';

/**
 * Archive Grid Component
 * 
 * Non-technical explanation:
 * Displays the complete numbered list of all past workshops, seminars, and visits
 * organized by CIPHER (e.g. Applied Machine Learning, Solidity, RPA, etc.).
 * Also contains the secret backdoor link at the bottom!
 */

export const ArchiveGrid: React.FC = () => {
  const { archive } = useData();
  const [backdoorOpen, setBackdoorOpen] = useState(false);

  return (
    <section id="archive" className="relative border-t border-[#123a17] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[#00ff41]">
          <span>// ARCHIVE</span>
          <span className="text-[#2c7a3a] hidden sm:inline">&gt;&gt; PAST_RECORDS</span>
        </div>

        <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#c8f7d0] text-glow">
          Activities
        </h2>

        <p className="mt-4 font-mono text-xs sm:text-sm text-[#6fae78] max-w-2xl">
          Hands-on workshops, industrial visits, and technical sessions run by the Cipher Association — spanning AI, blockchain, research tooling, and career prep.
        </p>

        {/* 3-Column Dense Monospace Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {archive.map((item) => (
            <a
              key={item.id}
              href={item.href || `https://sjec.ac.in/cipher/activity/${item.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border border-[#123a17] bg-[#080d08]/60 p-4.5 transition-all duration-200 hover:border-[#00ff41] hover:bg-[#0e1613] hover:shadow-[0_0_20px_rgba(0,255,65,0.18)]"
              data-cursor="lens"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="font-mono text-xs font-semibold text-[#00ff41] opacity-75">
                  {item.id}
                </span>
                <span className="font-mono text-xs font-medium text-[#c8f7d0] truncate group-hover:text-[#00ff41] transition-colors">
                  {item.title}
                </span>
              </div>
              <ArrowUpRight
                size={15}
                className="text-[#6fae78] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#00ff41]"
              />
            </a>
          ))}
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
