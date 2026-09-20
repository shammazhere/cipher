import React, { useState } from 'react';
import { Github, Linkedin, ExternalLink, Shield, CheckCircle, Award } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Leader } from '../types';
import { MatrixRain } from '../components/Preloader/MatrixRain';
import { LeaderModal } from '../components/Modals/LeaderModal';

/**
 * TeamPage Component (Page 4 of 5)
 * 
 * Non-technical explanation:
 * Dedicated standalone Team & Leadership page.
 * Displays executive board members, their portfolios, election procedures,
 * and governance rules for the student association.
 */

export const TeamPage: React.FC = () => {
  const { leadership } = useData();
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  return (
    <div className="min-h-screen pt-28 pb-24 font-mono">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 space-y-16">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#00ff41]">
            <span>// GOVERNANCE // EXECUTIVE_COUNCIL</span>
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-[#c8f7d0] text-glow">
            Leadership &amp; Governance
          </h1>
          <p className="mt-3 font-mono text-sm sm:text-base text-[#6fae78] max-w-2xl leading-relaxed">
            The elected student representatives guiding CIPHER's technical sessions, hackathons, and departmental initiatives.
          </p>
        </div>

        {/* Executive Deck */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {leadership.map((leader) => (
            <div
              key={leader.id}
              onClick={() => setSelectedLeader(leader)}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-[#123a17] bg-[#080d08] transition-all duration-300 hover:border-[#00ff41] hover:shadow-[0_0_30px_rgba(0,255,65,0.25)] hover:-translate-y-1 cursor-pointer"
              data-cursor="lens"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#050705]">
                <MatrixRain opacity={0.12} className="z-0" />
                <img
                  src={leader.image}
                  alt={leader.name}
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 h-full w-full object-cover object-top grayscale contrast-125 transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  draggable={false}
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#080d08] via-[#080d08]/50 to-transparent" />
              </div>

              <div className="relative z-20 flex flex-col p-5 bg-[#080d08]">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#00ff41]">
                  {leader.role}
                </span>
                <h3 className="mt-1 font-display text-base font-bold text-[#c8f7d0] group-hover:text-[#00ff41] transition-colors">
                  {leader.name}
                </h3>

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

        {/* Governance & Election Procedures */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[#123a17]">
          <div className="rounded-xl border border-[#123a17] bg-[#080d08] p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#00ff41]">
              <Award size={20} />
              <h3 className="font-display text-base font-bold text-[#c8f7d0]">
                Annual Elections
              </h3>
            </div>
            <p className="text-xs text-[#6fae78] leading-relaxed">
              Office bearers (President, Vice President, Secretary, and Treasurers) are democratically nominated and elected each academic year by third and final year CSE students.
            </p>
          </div>

          <div className="rounded-xl border border-[#123a17] bg-[#080d08] p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#00ff41]">
              <Shield size={20} />
              <h3 className="font-display text-base font-bold text-[#c8f7d0]">
                Faculty Oversight
              </h3>
            </div>
            <p className="text-xs text-[#6fae78] leading-relaxed">
              Every initiative is vetted by the Faculty Coordinators and HOD to ensure mapping to departmental Program Outcomes (POs) and strict budget transparency.
            </p>
          </div>

          <div className="rounded-xl border border-[#123a17] bg-[#080d08] p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#00ff41]">
              <CheckCircle size={20} />
              <h3 className="font-display text-base font-bold text-[#c8f7d0]">
                Student Inclusivity
              </h3>
            </div>
            <p className="text-xs text-[#6fae78] leading-relaxed">
              First-year and second-year juniors join domain sub-committees to shadow executives, gaining leadership readiness and peer mentorship before graduation.
            </p>
          </div>
        </div>
      </div>

      {/* Spotlight Modal */}
      <LeaderModal
        leader={selectedLeader}
        onClose={() => setSelectedLeader(null)}
      />
    </div>
  );
};
