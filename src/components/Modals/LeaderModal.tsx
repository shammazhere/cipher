import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin } from 'lucide-react';

export interface LeaderData {
  id?: string;
  role: string;
  name: string;
  photo?: string;
  image?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  bio?: string;
  tenure?: string;
}

interface LeaderModalProps {
  leader: LeaderData | null;
  onClose: () => void;
}

export const LeaderModal: React.FC<LeaderModalProps> = ({ leader, onClose }) => {
  useEffect(() => {
    if (!leader) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [leader, onClose]);

  return (
    <AnimatePresence>
      {leader && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-xs overflow-hidden rounded-xl border border-[var(--matrix)]/40 bg-[var(--card)]"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-[var(--matrix)]/40 bg-black/40 text-[var(--matrix)] transition-colors hover:bg-[var(--matrix)]/10"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Photo in Full Color */}
            <div className="relative aspect-[3/4] w-full bg-[#050705]">
              <img
                src={leader.photo || leader.image || ''}
                alt={`${leader.name}, ${leader.role}`}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>

            {/* Info Container */}
            <div className="flex flex-col items-center gap-1 px-5 py-5 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                {leader.role}
              </span>
              <span className="font-display text-xl leading-tight text-foreground">
                {leader.name}
              </span>
              {/* Social Action Triggers */}
              <div className="mt-3 flex items-center gap-4">
                <a
                  href={leader.github || ''}
                  target={leader.github ? '_blank' : undefined}
                  rel={leader.github ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    if (!leader.github) e.preventDefault();
                  }}
                  aria-label={`${leader.name} on GitHub`}
                  className="text-muted-foreground transition-colors hover:text-[var(--matrix)] cursor-pointer"
                >
                  <Github size={22} />
                </a>
                <a
                  href={leader.linkedin || ''}
                  target={leader.linkedin ? '_blank' : undefined}
                  rel={leader.linkedin ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    if (!leader.linkedin) e.preventDefault();
                  }}
                  aria-label={`${leader.name} on LinkedIn`}
                  className="text-muted-foreground transition-colors hover:text-[var(--matrix)] cursor-pointer"
                >
                  <Linkedin size={22} />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
