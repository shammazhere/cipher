import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AsciiCipherHero } from '../Canvas/AsciiCipherHero';
import { MagneticButton } from '../UI/MagneticButton';

/**
 * Hero Section Component
 * 
 * Non-technical explanation:
 * Top landing section matching the reference video:
 * - Full-width interactive ASCII CIPHER banner with spring physics.
 * - Bold Lexend title: "Student Association of Computer Science & Engineering".
 * - Monospace subtitle statement.
 * - Dual magnetic buttons: "Join CIPHER →" (solid green) and "Explore Events" (outline green).
 */

interface HeroSectionProps {
  onOpenJoin?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenJoin }) => {
  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center overflow-hidden">
      {/* Interactive ASCII CIPHER Banner */}
      <div className="relative w-full pt-24 sm:pt-28">
        <AsciiCipherHero height="40vh" />
      </div>

      {/* Hero Headline & Action Links */}
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-xl leading-[1.05] tracking-tight text-foreground text-glow sm:text-2xl md:text-3xl"
        >
          Student Association of Computer Science &amp; Engineering
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl font-mono text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Bridging academic knowledge and practical application — a community of aspiring professionals in computing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <MagneticButton href="#join" variant="solid">
            Join CIPHER <ArrowRight size={16} />
          </MagneticButton>
          <MagneticButton href="#events" variant="outline">
            Explore Events
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};
