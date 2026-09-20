import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { AsciiCipherHero } from '../Canvas/AsciiCipherHero';
import { useData } from '../../context/DataContext';

/**
 * Hero Section Component
 * 
 * Non-technical explanation:
 * The very first section visitors see at the top of the homepage:
 * - Shows the interactive ASCII "CIPHER" banner.
 * - Displays the official CSE association title.
 * - Includes two primary buttons to either apply or explore events.
 */

interface HeroSectionProps {
  onOpenJoin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenJoin }) => {
  const { siteConfig } = useData();

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden pt-24 pb-16"
    >
      {/* Interactive ASCII CIPHER Canvas */}
      <div className="relative w-full max-w-7xl px-4 pt-4 sm:pt-8">
        <AsciiCipherHero height="38vh" />
      </div>

      {/* Main Copy & Action Buttons */}
      <div className="relative mx-auto w-full max-w-6xl px-6 lg:px-10 mt-6 md:mt-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-2xl font-bold leading-tight tracking-tight text-[#c8f7d0] text-glow sm:text-3xl md:text-4xl lg:text-5xl"
        >
          {siteConfig.fullName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl font-mono text-sm leading-relaxed text-[#6fae78] sm:text-base md:text-lg"
        >
          {siteConfig.tagline}
        </motion.p>

        {/* Dual Cyber Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
        >
          {/* Solid Green Primary CTA */}
          <button
            type="button"
            onClick={onOpenJoin}
            className="group inline-flex items-center gap-3 rounded bg-[#00ff41] px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#030503] transition-all duration-300 hover:bg-[#00ff66] hover:shadow-[0_0_25px_rgba(0,255,65,0.6)]"
            data-cursor="lens"
          >
            <span>JOIN CIPHER</span>
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Transparent Green Border Secondary CTA */}
          <a
            href="#events"
            className="inline-flex items-center gap-2.5 rounded border border-[#123a17] bg-[#080d08]/70 px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#00ff41] transition-all duration-300 hover:border-[#00ff41] hover:bg-[#00ff41]/10 hover:shadow-[0_0_20px_rgba(0,255,65,0.25)]"
            data-cursor="lens"
          >
            <Calendar size={15} />
            <span>EXPLORE EVENTS</span>
          </a>
        </motion.div>
      </div>

      {/* Decorative Terminal Status Indicator */}
      <div className="mx-auto mt-12 w-full max-w-6xl px-6 lg:px-10 flex items-center justify-between text-xs font-mono text-[#2c7a3a]">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#00ff41] animate-ping" />
          SYSTEM STATUS: ONLINE // NODE_SJEC
        </span>
        <span className="hidden sm:inline">DEPT OF CSE · EST 2026</span>
      </div>
    </section>
  );
};
