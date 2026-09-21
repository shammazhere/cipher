import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { EventGalleryModal, GalleryModalData } from '../Modals/EventGalleryModal';
import { SectionHeader } from '../UI/SectionHeader';

/**
 * Events & Workshops Section Component
 * 
 * Non-technical explanation:
 * Section 4 from the reference:
 * - Highlights 2 flagship events: Lumière — The Gala and PROMPT OPS-2K26.
 * - Clicking either card opens a rich modal photo gallery with swipeable 3D stack.
 * - Below is the Activities Archive grid featuring all 17 department workshops and sessions.
 */

const FEATURED_EVENTS: GalleryModalData[] = [
  {
    slug: 'LUMIERE_GALA',
    tag: 'Branch Gala',
    title: 'Lumière — The Gala',
    dateStr: '29 October 2025 · Kalam Auditorium',
    cardDateBadge: '29 OCT 2025',
    cardSubtitle: 'CSE Branch Entry · Kalam Auditorium',
    paragraphs: [
      'The Department of Computer Science and Engineering (CSE) held its branch entry programme, “Lumière – The Gala,” on 29 October 2025 at the Kalam Auditorium. Organised by the Cipher Association, the event welcomed students into the department through a formal gathering centred on the theme “Where Glam Meets Glow.” The venue featured coordinated red, gold and black décor, floral arrangements, illuminated panels and a central Lumière backdrop.',
      'The programme gave students an opportunity to interact with peers and take part in a shared departmental event beyond academics, highlighting the role of the Cipher Association in organising student-led activities. It concluded as a formal branch entry that marked the students’ transition into the department and reinforced a sense of collective identity.',
    ],
    images: [
      '/lumiere/website_photo_1.webp',
      '/lumiere/website_photo_2.webp',
      '/lumiere/website_photo_3.webp',
      '/lumiere/website_photo_4.webp',
      '/lumiere/website_photo_5.webp',
      '/lumiere/website_photo_6.webp',
      '/lumiere/website_photo_7.webp',
      '/lumiere/website_photo_8.webp',
    ],
  },
  {
    slug: 'PROMPT_OPS',
    tag: 'Competition',
    title: 'PROMPT OPS-2K26',
    dateStr: '25 March 2026 · Prompt Engineering Competition',
    cardDateBadge: '25 MAR 2026',
    cardSubtitle: 'AgentBlazer Club × Cipher',
    paragraphs: [
      'Organized by the AgentBlazer Club and Cipher under the guidance of Ms. Nisha J Roche, Ms. Jaishma K, and HOD Dr. Melwyn D’Souza, this technical competition focused on prompt engineering and AI tools (mapped to PO4, PO5, PO8, PO11).',
      'Track 1 (1st Year) featured invitation generation, logo recreation, and image recreation rounds, with Chinmayee, Chris Royston Monteiro, and Deeksha Ravi Moger taking top honors.',
      'Track 2 (2nd Year) tested students in JSON conversion, Python code debugging, and a Gemini AI security prompt extraction challenge, with Harimurali KS, Venus Suhani D’Lima, and Venisha Snehal D’Souza securing top positions.',
    ],
    images: [
      '/promptops/website_photo_1.webp',
      '/promptops/website_photo_2.webp',
      '/promptops/website_photo_3.webp',
      '/promptops/website_photo_4.webp',
      '/promptops/website_photo_5.webp',
      '/promptops/website_photo_6.webp',
      '/promptops/website_photo_7.webp',
      '/promptops/website_photo_8.webp',
    ],
  },
];

const ARCHIVE_ACTIVITIES = [
  { title: 'Applied Machine Learning', href: 'https://sjec.ac.in/cipher/activity/applied-machine-learning' },
  { title: 'Industrial Visit', href: 'https://sjec.ac.in/cipher/activity/industrial-visit-1' },
  { title: 'LaTeX Tool', href: 'https://sjec.ac.in/cipher/activity/latex-tool' },
  { title: 'Robotic Process Automation using UiPath', href: 'https://sjec.ac.in/cipher/activity/rpa-uipath' },
  { title: 'HackTO Future 20', href: 'https://sjec.ac.in/cipher/activity/hackto-future-20' },
  { title: 'How to Win at the Sport of Programming', href: 'https://sjec.ac.in/cipher/activity/sport-of-programming' },
  { title: 'Introduction to Google Crowdsource', href: 'https://sjec.ac.in/cipher/activity/google-crowdsource' },
  { title: 'Educational Session on GitHub', href: 'https://sjec.ac.in/cipher/activity/github-session' },
  { title: 'Industrial Visit', href: 'https://sjec.ac.in/cipher/activity/industrial-visit-2' },
  { title: 'UDAAN Mock Interview', href: 'https://sjec.ac.in/cipher/activity/udaan-mock-interview' },
  { title: 'Freshers Onboarding Programme', href: 'https://sjec.ac.in/cipher/activity/freshers-onboarding' },
  { title: 'Projects Funded by KSCST', href: 'https://sjec.ac.in/cipher/activity/kscst-projects' },
  { title: 'Generative AI Tools for Research', href: 'https://sjec.ac.in/cipher/activity/genai-tools-research' },
  { title: 'Introduction to Blockchain: Solidity Workshop', href: 'https://sjec.ac.in/cipher/activity/blockchain-solidity' },
  { title: 'Star UML', href: 'https://sjec.ac.in/cipher/activity/star-uml' },
  { title: 'Generative AI: Custom Solutions using OpenAI', href: 'https://sjec.ac.in/cipher/activity/genai-custom-solutions' },
  { title: 'React.js and Node.js Workshop', href: 'https://sjec.ac.in/cipher/activity/reactjs-and-nodejs-workshop' },
];

export const EventsSection: React.FC = () => {
  const [activeModalData, setActiveModalData] = useState<GalleryModalData | null>(null);

  return (
    <section id="events" className="relative border-t border-[var(--border)] py-24">
      <div className="mx-auto max-w-6xl px-5">
        {/* Header */}
        <SectionHeader label="activities" title="Events & Workshops" />

        {/* 2 Flagship Cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {FEATURED_EVENTS.map((event, idx) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <article
                data-cursor="lens"
                role="button"
                tabIndex={0}
                onClick={() => setActiveModalData(event)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveModalData(event);
                  }
                }}
                className="group flex h-full flex-col rounded-lg border border-[var(--border)] bg-[var(--card)]/50 p-6 transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow cursor-pointer"
              >
                {/* Card Top Strip */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                    <Calendar size={13} /> {event.tag}
                  </span>
                  <span className="rounded border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {event.cardDateBadge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-2 font-display text-xl text-foreground transition-colors group-hover:text-[var(--matrix)]">
                  {event.title}
                </h3>

                {/* Body description */}
                <p className="flex-1 font-mono text-sm leading-relaxed text-muted-foreground">
                  {event.paragraphs[0]}
                </p>

                {/* Hover trigger hint */}
                <span className="mt-5 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-[var(--matrix)] opacity-0 transition-opacity group-hover:opacity-100">
                  View gallery <ArrowUpRight size={13} />
                </span>
              </article>
            </motion.div>
          ))}
        </div>

        {/* Activities Archive */}
        <div className="mt-20">
          <SectionHeader label="archive" title="Activities" />

          <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground">
            Hands-on workshops, industrial visits, and technical sessions run by the Cipher
            Association — spanning AI, blockchain, research tooling, and career prep.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ARCHIVE_ACTIVITIES.map((activity, idx) => (
              <motion.div
                key={`${activity.title}-${idx}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.05 }}
              >
                <a
                  href={activity.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="lens"
                  className="group flex h-full items-start justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)]/50 p-4 transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-[10px] leading-5 text-[var(--matrix)]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-mono text-sm leading-snug text-foreground transition-colors group-hover:text-[var(--matrix)]">
                      {activity.title}
                    </h3>
                  </div>
                  <ArrowUpRight
                    size={15}
                    className="mt-0.5 shrink-0 text-muted-foreground transition-colors group-hover:text-[var(--matrix)]"
                  />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <EventGalleryModal data={activeModalData} onClose={() => setActiveModalData(null)} />
    </section>
  );
};
