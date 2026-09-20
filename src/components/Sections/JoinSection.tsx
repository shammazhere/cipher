import React from 'react';
import { ArrowRight, ArrowUp } from 'lucide-react';
import { MatrixRain } from '../Preloader/MatrixRain';
import { useData } from '../../context/DataContext';

/**
 * Join Section Component
 * 
 * Non-technical explanation:
 * The bottom call-to-action section inviting students to join the team,
 * launch the membership form, or scroll smoothly back up to the top.
 */

interface JoinSectionProps {
  onOpenJoin: () => void;
}

export const JoinSection: React.FC<JoinSectionProps> = ({ onOpenJoin }) => {
  const { siteConfig } = useData();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="join" className="relative overflow-hidden border-t border-[#123a17] py-28 md:py-36">
      {/* Background Matrix rain & gradient */}
      <MatrixRain opacity={0.1} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050705] via-transparent to-[#050705]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center z-10">
        <div className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-[#00ff41]">
          // ACCESS CLUB
        </div>

        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#c8f7d0] text-glow">
          Join the Team
        </h2>

        <p className="mx-auto mt-6 max-w-xl font-mono text-sm sm:text-base leading-relaxed text-[#6fae78]">
          {siteConfig.joinSubtitle}
        </p>

        {/* Action buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onOpenJoin}
            className="group flex w-full sm:w-auto items-center justify-center gap-2.5 rounded bg-[#00ff41] px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#050705] transition-all hover:bg-[#00ff66] hover:shadow-[0_0_25px_rgba(0,255,65,0.6)]"
            data-cursor="lens"
          >
            <span>JOIN</span>
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={handleScrollTop}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded border border-[#123a17] bg-[#080d08]/70 px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#c8f7d0] transition-all hover:border-[#00ff41] hover:text-[#00ff41]"
            data-cursor="lens"
          >
            <ArrowUp size={14} />
            <span>BACK TO TOP</span>
          </button>
        </div>
      </div>
    </section>
  );
};
