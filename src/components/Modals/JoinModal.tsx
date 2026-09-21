import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { MatrixRain } from '../Preloader/MatrixRain';

/**
 * Join Modal (Access Request) Component
 * 
 * Non-technical explanation:
 * Access request popup matching the reference design:
 * - Matrix digital rain background backdrop.
 * - Monospace input fields for Name, Email, and Message.
 * - Submits via standard mailto protocol to cipher@cse.edu.
 */

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get('name') as string;
    const email = form.get('email') as string;
    const message = form.get('message') as string;

    const subject = encodeURIComponent(`CIPHER Access Request - ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\n\nEmail: ${email}\n\nMessage:\n${message}\n`
    );

    window.location.href = `mailto:cipher@cse.edu?subject=${subject}&body=${body}`;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="join-modal fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md rounded-lg border border-[var(--matrix)]/40 bg-[#050705] p-8 overflow-hidden"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Matrix Rain */}
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <MatrixRain opacity={0.15} />
            </div>

            <div className="relative z-10">
              {/* Top Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-md border border-[var(--matrix)]/40 text-[var(--matrix)] transition-colors hover:bg-[var(--matrix)]/10"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="mb-7 pr-10">
                <div className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--matrix)]">
                  // access request
                </div>
                <h3 className="font-display text-3xl text-foreground text-glow">
                  Join CIPHER
                </h3>
                <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
                  Send us a message and we'll get back to you.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block font-mono text-xs uppercase tracking-wider text-[var(--matrix)]">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-md border border-[var(--matrix)]/40 bg-black/40 px-4 py-3 font-mono text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[var(--matrix)] focus:shadow-[0_0_15px_rgba(0,255,65,0.12)]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block font-mono text-xs uppercase tracking-wider text-[var(--matrix)]">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-md border border-[var(--matrix)]/40 bg-black/40 px-4 py-3 font-mono text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[var(--matrix)] focus:shadow-[0_0_15px_rgba(0,255,65,0.12)]"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block font-mono text-xs uppercase tracking-wider text-[var(--matrix)]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us why you'd like to join..."
                    className="w-full resize-none rounded-md border border-[var(--matrix)]/40 bg-black/40 px-4 py-3 font-mono text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[var(--matrix)] focus:shadow-[0_0_15px_rgba(0,255,65,0.12)]"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--matrix)] px-6 py-3 font-mono text-sm font-medium uppercase tracking-wider text-[#030503] transition-shadow hover:shadow-[0_0_25px_rgba(0,255,65,0.35)]"
                >
                  Send <ArrowRight size={16} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
