import React, { useState } from 'react';
import {
  Github,
  Linkedin,
  ExternalLink,
  Shield,
  CheckCircle,
  Award,
  GraduationCap,
  Sparkles,
  BookOpen,
  Terminal,
  Activity
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Leader } from '../types';
import { MatrixRain } from '../components/Preloader/MatrixRain';
import { LeaderModal } from '../components/Modals/LeaderModal';
import { handleImageError } from '../utils/imageFallback';

/**
 * TeamPage Component (Page 4 of 5)
 * 
 * Non-technical explanation:
 * Dedicated standalone Team & Leadership page.
 * Displays executive board members, their portfolios, faculty advisory council,
 * and governance rules for the student association.
 */

export const TeamPage: React.FC = () => {
  const { leadership } = useData();
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  const facultyAdvisors = [
    {
      name: "Dr. Melwyn D'Souza",
      role: 'Head of Department (CSE)',
      designation: 'Professor & HOD · Ph.D',
      focus: 'Academic Direction, Research & Accreditation',
      tag: 'DEPARTMENT HEAD',
    },
    {
      name: 'Ms. Nisha J Roche',
      role: 'Faculty Coordinator',
      designation: 'Assistant Professor · M.Tech',
      focus: 'AgentBlazer Club Mentorship & PO Alignment',
      tag: 'FACULTY MENTOR',
    },
    {
      name: 'Ms. Jaishma K',
      role: 'Faculty Coordinator',
      designation: 'Assistant Professor · M.Tech',
      focus: 'Student Hackathons & Technical Operations',
      tag: 'FACULTY MENTOR',
    },
  ];

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
            The elected student representatives and esteemed faculty guiding CIPHER's technical sessions, hackathons, and departmental initiatives.
          </p>
        </div>

        {/* Executive Deck */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#123a17] pb-3">
            <span className="text-xs uppercase tracking-widest text-[#00ff41]">
              // STUDENT EXECUTIVE BOARD (2025-26)
            </span>
            <span className="text-[11px] text-[#6fae78] flex items-center gap-1.5">
              <Activity size={12} className="text-[#00ff41]" />
              5 ELECTED OFFICERS
            </span>
          </div>

          {/* Continuous Infinite Right-to-Left Loop Marquee */}
          <div className="relative w-full overflow-hidden py-4 -mx-6 sm:-mx-10 px-6 sm:px-10">
            {/* Edge Vignette Fades */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-20 bg-gradient-to-r from-[#050705] via-[#050705]/80 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-20 bg-gradient-to-l from-[#050705] via-[#050705]/80 to-transparent" />

            <div className="animate-marquee-rtl flex items-stretch gap-6 px-4">
              {[...leadership, ...leadership, ...leadership, ...leadership].map((leader, index) => (
                <div
                  key={`${leader.id}-team-loop-${index}`}
                  onClick={() => setSelectedLeader(leader)}
                  className="group relative flex w-[260px] sm:w-[280px] md:w-[300px] shrink-0 flex-col overflow-hidden rounded-xl border border-[#123a17] bg-[#080d08] transition-all duration-300 hover:border-[#00ff41] hover:shadow-[0_0_30px_rgba(0,255,65,0.3)] hover:-translate-y-1 cursor-pointer select-none"
                  data-cursor="lens"
                >
                  {/* Cyber Reticles */}
                  <span className="absolute top-2 left-2 z-20 font-mono text-[9px] text-[#00ff41]/40 select-none group-hover:text-[#00ff41] transition-colors">+</span>
                  <span className="absolute top-2 right-2 z-20 font-mono text-[9px] text-[#00ff41]/40 select-none group-hover:text-[#00ff41] transition-colors">+</span>

                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#050705]">
                    <MatrixRain opacity={0.12} className="z-0" />
                    <img
                      src={leader.image}
                      alt={leader.name}
                      loading="lazy"
                      decoding="async"
                      onError={handleImageError}
                      className="relative z-10 h-full w-full object-cover object-top grayscale contrast-125 transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
                      draggable={false}
                    />
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#080d08] via-[#080d08]/50 to-transparent" />
                  </div>

                  <div className="relative z-20 flex flex-col p-5 bg-[#080d08] flex-1 justify-between">
                    <div>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#00ff41]">
                        {leader.role}
                      </span>
                      <h3 className="mt-1 font-display text-base font-bold text-[#c8f7d0] group-hover:text-[#00ff41] transition-colors">
                        {leader.name}
                      </h3>
                    </div>

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
                      <button
                        type="button"
                        onClick={() => setSelectedLeader(leader)}
                        className="ml-auto font-mono text-[10px] text-[#2c7a3a] flex items-center gap-1 group-hover:text-[#00ff41] transition-colors"
                      >
                        DOSSIER <ExternalLink size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Academic Advisory Council & Faculty Mentors */}
        <section className="space-y-6 pt-10 border-t border-[#123a17]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#00ff41]">
              <GraduationCap size={15} />
              <span>FACULTY MENTORSHIP &amp; ADVISORY COUNCIL</span>
            </div>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#c8f7d0]">
              Department Faculty Mentorship
            </h2>
            <p className="mt-2 font-mono text-xs sm:text-sm text-[#6fae78] max-w-2xl leading-relaxed">
              Academic leadership ensuring every workshop, competition, and student initiative aligns with NAAC A+ and NBA educational standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {facultyAdvisors.map((advisor, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl border border-[#123a17] bg-[#080d08]/85 p-6 transition-all duration-300 hover:border-[#00ff41] hover:bg-[#0e1613] hover:shadow-[0_0_30px_rgba(0,255,65,0.18)]"
              >
                <div className="flex items-center justify-between font-mono text-[10px] mb-3">
                  <span className="rounded bg-[#00ff41]/10 border border-[#00ff41]/40 px-2 py-0.5 text-[#00ff41] font-bold uppercase tracking-wider">
                    {advisor.tag}
                  </span>
                  <span className="text-[#2c7a3a]">SJEC // CSE</span>
                </div>

                <h3 className="font-display text-xl font-bold text-[#c8f7d0] group-hover:text-[#00ff41] transition-colors">
                  {advisor.name}
                </h3>
                <div className="mt-1 font-mono text-xs text-[#00ff41]">
                  {advisor.role}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-[#6fae78]">
                  {advisor.designation}
                </div>

                <div className="mt-4 pt-3 border-t border-[#123a17] font-mono text-xs text-[#6fae78] leading-relaxed flex items-start gap-2">
                  <BookOpen size={13} className="text-[#00ff41] shrink-0 mt-0.5" />
                  <span>{advisor.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Governance Matrix & Electoral Charter */}
        <section className="space-y-6 pt-10 border-t border-[#123a17]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#00ff41]">
                // CONSTITUTIONAL FRAMEWORK
              </div>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#c8f7d0]">
                Governance &amp; Electoral Charter
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#00ff41] border border-[#123a17] px-3 py-1 rounded bg-[#080d08]">
              <Sparkles size={12} />
              <span>VTU STATUTE 14.B COMPLIANT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group rounded-xl border border-[#123a17] bg-[#080d08] p-6 space-y-4 hover:border-[#00ff41] transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#00ff41]">
                  <Award size={20} />
                  <h3 className="font-display text-base font-bold text-[#c8f7d0]">
                    Annual Elections
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded">
                  TURNOUT 94.2%
                </span>
              </div>
              <p className="text-xs text-[#6fae78] leading-relaxed">
                Office bearers (President, Vice President, Secretary, and Treasurers) are democratically nominated and elected each academic year by third and final year CSE students.
              </p>
              <div className="pt-2 border-t border-[#123a17] font-mono text-[11px] text-[#2c7a3a]">
                // PROTOCOL: SECRET_BALLOT_V2
              </div>
            </div>

            <div className="group rounded-xl border border-[#123a17] bg-[#080d08] p-6 space-y-4 hover:border-[#00ff41] transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#00ff41]">
                  <Shield size={20} />
                  <h3 className="font-display text-base font-bold text-[#c8f7d0]">
                    Faculty Oversight
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded">
                  AUDIT: 100%
                </span>
              </div>
              <p className="text-xs text-[#6fae78] leading-relaxed">
                Every initiative is vetted by the Faculty Coordinators and HOD to ensure mapping to departmental Program Outcomes (POs) and strict budget transparency.
              </p>
              <div className="pt-2 border-t border-[#123a17] font-mono text-[11px] text-[#2c7a3a]">
                // PO4 · PO5 · PO8 · PO11 MAPPED
              </div>
            </div>

            <div className="group rounded-xl border border-[#123a17] bg-[#080d08] p-6 space-y-4 hover:border-[#00ff41] transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#00ff41]">
                  <CheckCircle size={20} />
                  <h3 className="font-display text-base font-bold text-[#c8f7d0]">
                    Student Inclusivity
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded">
                  42 JUNIORS
                </span>
              </div>
              <p className="text-xs text-[#6fae78] leading-relaxed">
                First-year and second-year juniors join domain sub-committees to shadow executives, gaining leadership readiness and peer mentorship before graduation.
              </p>
              <div className="pt-2 border-t border-[#123a17] font-mono text-[11px] text-[#2c7a3a]">
                // 3:1 MENTOR-MENTEE COHORT
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Spotlight Modal */}
      <LeaderModal
        leader={selectedLeader}
        onClose={() => setSelectedLeader(null)}
      />
    </div>
  );
};

