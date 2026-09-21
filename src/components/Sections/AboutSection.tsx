import React from 'react';
import { motion } from 'framer-motion';
import { CodeXml, Crown, Users, Rocket } from 'lucide-react';
import { CursorPhotoTrail } from './CursorPhotoTrail';
import { SectionHeader } from '../UI/SectionHeader';

/**
 * About Section Component
 * 
 * Non-technical explanation:
 * Matches the reference video layout:
 * 1. "Who we are" header with decrypt animation and interactive CursorPhotoTrail.
 * 2. "Our Domains" section with staggered card entry and session badges.
 */

const DOMAINS = [
  {
    icon: CodeXml,
    title: 'Technical Skill Building',
    desc: 'Hands-on workshops, coding sessions, and tech talks that turn theory into working software.',
    sessions: 5,
  },
  {
    icon: Crown,
    title: 'Leadership & Governance',
    desc: 'Annual elections for President, Secretary, and office bearers — guided by the HOD and Faculty Coordinator.',
    sessions: 3,
  },
  {
    icon: Users,
    title: 'Events & Collaboration',
    desc: 'Hackathons, seminars, and department-level competitions that bring students together.',
    sessions: 8,
  },
  {
    icon: Rocket,
    title: 'Industry Readiness',
    desc: 'Bridging classroom learning with real-world application to prepare students for the field.',
    sessions: 4,
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative border-t border-[var(--border)] py-24">
      <div className="mx-auto max-w-6xl px-5">
        {/* Section Tag & Heading with Matrix Scramble Decrypt */}
        <SectionHeader label="about" title="Who we are" />

        {/* Narrative & Photo Trail Grid */}
        <div className="mt-8 grid items-start gap-12 md:grid-cols-[1.4fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-lg leading-relaxed text-muted-foreground">
              <span className="text-[#00ff41]">CIPHER</span> is the student association of the Department of
              Computer Science &amp; Engineering. It serves as a platform for students to nurture their technical
              and interpersonal skills through innovative and collaborative activities. The association
              strives to bridge the gap between academic knowledge and practical application, fostering a
              community of aspiring professionals dedicated to excellence in computing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="-mt-20"
          >
            <div className="relative h-72 w-full overflow-hidden sm:h-80 lg:h-[26rem]">
              <CursorPhotoTrail label="CIPHER" />
            </div>
          </motion.div>
        </div>

        {/* Domains / Focus Pillars */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeader label="what we do" title="Our Domains" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="mt-12 grid gap-5 sm:grid-cols-2"
          >
            {DOMAINS.map((domain) => {
              const IconComp = domain.icon;
              return (
                <motion.div
                  key={domain.title}
                  variants={{
                    hidden: { opacity: 0, y: 26 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  <article
                    data-cursor="lens"
                    className="group h-full rounded-lg border border-[var(--border)] bg-[var(--card)]/50 p-7 transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow"
                  >
                    <div className="mb-5 inline-flex rounded-md border border-[var(--border)] bg-[#050705] p-3 text-[var(--matrix)] transition-colors group-hover:border-[var(--matrix)]">
                      <IconComp size={22} />
                    </div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-[var(--matrix)] group-hover:text-glow">
                        {domain.title}
                      </h3>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        {domain.sessions} sessions
                      </span>
                    </div>
                    <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                      {domain.desc}
                    </p>
                  </article>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
