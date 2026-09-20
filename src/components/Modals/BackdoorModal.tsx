import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X } from 'lucide-react';

/**
 * Backdoor Modal Component (Easter Egg)
 * 
 * Non-technical explanation:
 * A fun hidden cyberpunk easter egg triggered by clicking the secret code link
 * at the bottom of the past activities section. Opens a green "ROOT ACCESS" terminal.
 */

interface BackdoorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackdoorModal: React.FC<BackdoorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg rounded-xl border border-[#00ff41] bg-[#050705] p-6 sm:p-8 font-mono shadow-[0_0_50px_rgba(0,255,65,0.4)]"
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between border-b border-[#123a17] pb-4 mb-5">
            <div className="flex items-center gap-2 text-[#00ff41]">
              <Terminal size={18} />
              <span className="text-xs uppercase tracking-widest font-bold text-glow">
                ROOT ACCESS GRANTED // ELEVATED_PRIVILEGES
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[#6fae78] hover:text-[#00ff41] transition-colors"
              aria-label="Close terminal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Terminal Message */}
          <div className="space-y-4 text-xs sm:text-sm text-[#00ff41]">
            <p className="leading-relaxed">
              &gt; You found the backdoor. Welcome to the inner circle of CIPHER.
            </p>
            <p className="text-[#6fae78] leading-relaxed">
              The real code was inside you all along. Keep building, breaking, and innovating.
            </p>
            <div className="pt-2 text-[10px] text-[#2c7a3a]">
              SESSION ID: SJEC-CSE-CIPHER-0x7F // TIMESTAMP: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Close Action */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-[#00ff41] bg-[#00ff41]/10 px-5 py-2 font-mono text-xs font-semibold text-[#00ff41] transition-all hover:bg-[#00ff41] hover:text-[#050705]"
            >
              [ CLOSE CONNECTION ]
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
