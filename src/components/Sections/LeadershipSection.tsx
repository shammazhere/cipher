import React, { useState } from 'react';
import { Github, Linkedin, ExternalLink } from 'lucide-react';
import { MatrixRain } from '../Preloader/MatrixRain';
import { LeaderModal } from '../Modals/LeaderModal';
import { useData } from '../../context/DataContext';
import { Leader } from '../../types';

/**
 * Leadership Section Component
 * 
 * Non-technical explanation:
 * Showcases the student executives of CIPHER (President, VP, Secretary, Treasurers).
 * Each card features a Matrix rain backdrop, headshot, verified social icons,
 * and can be clicked to open a spotlight modal with more details.
 */

export const LeadershipSection: React.FC = () => {
  const { leadership } = useData();
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  return (
    <section id="leadership" className="relative border-t border-[#123a17] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[#00ff41]">
          <span>// GOVERNANCE</span>
          <span className="text-[#2c7a3a] hidden sm:inline">&gt;&gt; EXECUTIVE_BOARD</span>
        </div>

        <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#c8f7d0] text-glow">
          Leadership Structure
        </h2>

        <p className="mt-4 font-mono text-xs sm:text-sm text-[#6fae78] max-w-xl">
          Elected student representatives leading the association under faculty mentorship from the Department of Computer Science & Engineering.
        </p>

        {/* Leadership Cards Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {leadership.map((leader) => (
            <div
              key={leader.id}
              onClick={() => setSelectedLeader(leader)}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-[#123a17] bg-[#080d08] transition-all duration-300 hover:border-[#00ff41] hover:shadow-[0_0_30px_rgba(0,255,65,0.25)] hover:-translate-y-1 cursor-pointer"
              data-cursor="lens"
            >
              {/* Image Container with Matrix Rain Overlay */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#050705]">
                {/* Matrix Rain in card background */}
                <MatrixRain opacity={0.12} className="z-0" />

                {/* Leader Cutout Photo */}
                <img
                  src={leader.image}
                  alt={leader.name}
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 h-full w-full object-cover object-top grayscale contrast-125 transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  draggable={false}
                />

                {/* Bottom gradient fade for text legibility */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#080d08] via-[#080d08]/50 to-transparent" />
              </div>

              {/* Card Bottom Meta */}
              <div className="relative z-20 flex flex-col p-5 bg-[#080d08]">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#00ff41]">
                  {leader.role}
                </span>

                <h3 className="mt-1 font-display text-base font-bold text-[#c8f7d0] group-hover:text-[#00ff41] transition-colors">
                  {leader.name}
                </h3>

                {/* Social icons */}
                <div
                  className="mt-4 flex items-center gap-3 pt-3 border-t border-[#123a17]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {leader.github && (
                    <a
                      href={leader.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${leader.name} on GitHub`}
                      className="text-[#6fae78] transition-colors hover:text-[#00ff41]"
                    >
                      <Github size={15} />
                    </a>
                  )}
                  {leader.linkedin && (
                    <a
                      href={leader.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${leader.name} on LinkedIn`}
                      className="text-[#6fae78] transition-colors hover:text-[#00ff41]"
                    >
                      <Linkedin size={15} />
                    </a>
                  )}
                  <span className="ml-auto font-mono text-[10px] text-[#2c7a3a] flex items-center gap-1 group-hover:text-[#00ff41] transition-colors">
                    BIO <ExternalLink size={10} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spotlight Modal */}
      <LeaderModal
        leader={selectedLeader}
        onClose={() => setSelectedLeader(null)}
      />
    </section>
  );
};
