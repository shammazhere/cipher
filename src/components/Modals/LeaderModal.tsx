import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Mail, Shield, Award, Terminal, ExternalLink } from 'lucide-react';
import { Leader } from '../../types';
import { handleImageError } from '../../utils/imageFallback';
import { soundEffects } from '../../utils/soundEffects';

/**
 * Leader Modal Component
 * 
 * Non-technical explanation:
 * Interactive executive dossier modal for CIPHER leadership council members.
 * Sized appropriately for both desktop (horizontal split) and mobile (compact scrollable card).
 * Features 60 FPS spring transitions, no facial cropping, and verified external comms channels.
 */

interface LeaderModalProps {
  leader: Leader | null;
  onClose: () => void;
}

export const LeaderModal: React.FC<LeaderModalProps> = ({ leader, onClose }) => {
  useEffect(() => {
    if (leader) {
      soundEffects.playTransition();
    }
  }, [leader]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEffects.playClick();
        onClose();
      }
    };
    if (leader) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [leader, onClose]);

  return (
    <AnimatePresence>
      {leader && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md overflow-y-auto"
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative my-auto w-full max-w-xl md:max-w-2xl lg:max-w-3xl overflow-hidden rounded-2xl border border-[#00ff41]/50 bg-[#080d08] shadow-[0_0_60px_rgba(0,255,65,0.25)] flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative scanline */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff41] to-transparent z-30" />

            {/* Corner Reticles */}
            <span className="absolute top-2 left-2 z-30 font-mono text-[9px] text-[#00ff41]/50 select-none">+</span>
            <span className="absolute bottom-2 left-2 z-30 font-mono text-[9px] text-[#00ff41]/50 select-none">+</span>
            <span className="absolute bottom-2 right-2 z-30 font-mono text-[9px] text-[#00ff41]/50 select-none">+</span>

            {/* Sticky Close button */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="absolute top-3 right-3 z-40 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-[#123a17] bg-[#050705]/90 text-[#6fae78] transition-all hover:border-[#00ff41] hover:text-[#00ff41] hover:scale-105 shadow-md"
              aria-label="Close dossier"
              data-cursor="lens"
            >
              <X size={17} />
            </button>

            {/* Left Column: Portrait Photo with framing */}
            <div className="relative w-full md:w-56 lg:w-64 shrink-0 bg-[#050705] overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-[#123a17]">
              <div className="relative w-full h-48 sm:h-56 md:h-full min-h-[220px] md:min-h-[320px]">
                <img
                  src={leader.image}
                  alt={leader.name}
                  onError={handleImageError}
                  className="h-full w-full object-cover object-top filter grayscale contrast-115 hover:grayscale-0 transition-all duration-500"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080d08] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#080d08]" />
              </div>

              {/* Verified Executive Council Tag */}
              <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded border border-[#00ff41]/40 bg-[#050705]/90 px-2.5 py-1 font-mono text-[10px] text-[#00ff41] shadow-lg">
                <Shield size={11} className="text-[#00ff41]" />
                <span className="tracking-wider uppercase font-bold">VERIFIED COUNCIL</span>
              </div>
            </div>

            {/* Right Column: Operative Dossier Information */}
            <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto font-mono space-y-5">
              <div className="space-y-3">
                {/* Header tags */}
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#00ff41]">
                  <Terminal size={12} />
                  <span>// LEADERSHIP_DOSSIER</span>
                </div>

                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00ff41] inline-block px-2 py-0.5 rounded bg-[#00ff41]/10 border border-[#00ff41]/30">
                    {leader.role}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#c8f7d0] mt-2 text-glow">
                    {leader.name}
                  </h3>
                </div>

                {/* Bio text */}
                <div className="rounded-lg border border-[#123a17] bg-[#050705]/60 p-3.5 sm:p-4 text-xs sm:text-[13px] text-[#6fae78] leading-relaxed">
                  {leader.bio || 'Coordinating technical symposiums, hackathons, and departmental initiatives under the CIPHER student executive council.'}
                </div>

                {/* Association Portfolio Metas */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6fae78]">
                  <div className="rounded border border-[#123a17] bg-[#050705] p-2">
                    <span className="text-[9px] uppercase tracking-wider text-[#2c7a3a] block">TENURE</span>
                    <span className="text-[#c8f7d0] font-semibold">2025 – 2026</span>
                  </div>
                  <div className="rounded border border-[#123a17] bg-[#050705] p-2">
                    <span className="text-[9px] uppercase tracking-wider text-[#2c7a3a] block">DEPARTMENT</span>
                    <span className="text-[#c8f7d0] font-semibold">CSE · SJEC</span>
                  </div>
                </div>
              </div>

              {/* Comms & Social Channels */}
              <div className="pt-3 border-t border-[#123a17] flex items-center flex-wrap gap-2.5">
                {leader.github && (
                  <a
                    href={leader.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded border border-[#123a17] bg-[#050705] px-3 py-1.5 text-xs text-[#6fae78] transition-all hover:border-[#00ff41] hover:text-[#00ff41] hover:bg-[#00ff41]/5"
                    data-cursor="lens"
                  >
                    <Github size={14} />
                    <span>GITHUB</span>
                  </a>
                )}
                {leader.linkedin && (
                  <a
                    href={leader.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded border border-[#123a17] bg-[#050705] px-3 py-1.5 text-xs text-[#6fae78] transition-all hover:border-[#00ff41] hover:text-[#00ff41] hover:bg-[#00ff41]/5"
                    data-cursor="lens"
                  >
                    <Linkedin size={14} />
                    <span>LINKEDIN</span>
                  </a>
                )}
                {leader.email && (
                  <a
                    href={`mailto:${leader.email}`}
                    className="flex items-center gap-1.5 rounded border border-[#123a17] bg-[#050705] px-3 py-1.5 text-xs text-[#6fae78] transition-all hover:border-[#00ff41] hover:text-[#00ff41] hover:bg-[#00ff41]/5"
                    data-cursor="lens"
                  >
                    <Mail size={14} />
                    <span>EMAIL</span>
                  </a>
                )}
                <span className="ml-auto text-[10px] text-[#2c7a3a] uppercase font-mono hidden sm:inline">
                  CIPHER-BOARD // ID:{leader.id}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
