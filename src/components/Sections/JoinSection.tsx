import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MatrixRain } from '../Preloader/MatrixRain';
import { MagneticButton } from '../UI/MagneticButton';
import { JoinModal } from '../Modals/JoinModal';

import { TextScramble } from '../UI/TextScramble';

/**
 * Join Section Component
 * 
 * Non-technical explanation:
 * Section 5 from the reference video:
 * - Headline "// access club" and "Join the Team" with Matrix scramble letter decryption.
 * - Monospace call-to-action text.
 * - Magnetic buttons: "Join →" (opens Access Request modal) and "Back to Top" (smooth scrolls to top).
 */

interface JoinSectionProps {
  onOpenJoin?: () => void;
}

export const JoinSection: React.FC<JoinSectionProps> = ({ onOpenJoin }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleOpen = () => {
    if (onOpenJoin) onOpenJoin();
    else setModalOpen(true);
  };

  return (
    <>
      <section id="join" className="relative overflow-hidden border-t border-[var(--border)] py-28">
        {/* Background matrix rain & subtle gradient */}
        <MatrixRain opacity={0.1} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050705] via-transparent to-[#050705]" />

        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-[var(--matrix)]">
            // access club
          </div>
          <TextScramble
            as="h2"
            text="Join the Team"
            className="font-display text-4xl leading-tight text-foreground text-glow sm:text-5xl md:text-6xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-xl font-mono text-base leading-relaxed text-muted-foreground"
          >
            Whether you want to build, lead, or simply learn — CIPHER is where CSE students
            turn curiosity into capability. Join the community and help shape what comes next.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <MagneticButton onClick={handleOpen} variant="solid">
              Join <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton href="#top" variant="outline">
              Back to Top
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* Access Request Modal */}
      <JoinModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
