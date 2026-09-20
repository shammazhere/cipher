import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Mail } from 'lucide-react';
import { Leader } from '../../types';
import { handleImageError } from '../../utils/imageFallback';

/**
 * Leader Modal Component
 * 
 * Non-technical explanation:
 * When someone clicks on an executive team member's card, this window pops up
 * showing their full photo, leadership bio, role, and social links.
 */

interface LeaderModalProps {
  leader: Leader | null;
  onClose: () => void;
}

export const LeaderModal: React.FC<LeaderModalProps> = ({ leader, onClose }) => {
  if (!leader) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg overflow-hidden rounded-xl border border-[#00ff41]/50 bg-[#080d08] shadow-[0_0_50px_rgba(0,0,0,0.9)]"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg border border-[#123a17] bg-[#050705]/80 text-[#6fae78] transition-colors hover:border-[#00ff41] hover:text-[#00ff41]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Photo & Gradient Header */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#050705]">
            <img
              src={leader.image}
              alt={leader.name}
              className="h-full w-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-500"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080d08] via-[#080d08]/40 to-transparent" />
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 space-y-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#00ff41] font-semibold">
                {leader.role}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#c8f7d0] mt-1 text-glow">
                {leader.name}
              </h3>
            </div>

            {leader.bio && (
              <p className="font-mono text-sm leading-relaxed text-[#6fae78]">
                {leader.bio}
              </p>
            )}

            {/* Social & Contact Links */}
            <div className="flex items-center gap-4 pt-4 border-t border-[#123a17]">
              {leader.github && (
                <a
                  href={leader.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-xs text-[#6fae78] hover:text-[#00ff41] transition-colors"
                >
                  <Github size={16} />
                  <span>GITHUB</span>
                </a>
              )}
              {leader.linkedin && (
                <a
                  href={leader.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-xs text-[#6fae78] hover:text-[#00ff41] transition-colors"
                >
                  <Linkedin size={16} />
                  <span>LINKEDIN</span>
                </a>
              )}
              {leader.email && (
                <a
                  href={`mailto:${leader.email}`}
                  className="flex items-center gap-2 font-mono text-xs text-[#6fae78] hover:text-[#00ff41] transition-colors"
                >
                  <Mail size={16} />
                  <span>EMAIL</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
