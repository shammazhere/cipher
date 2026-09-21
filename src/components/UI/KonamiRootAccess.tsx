import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatrixRain } from '../Preloader/MatrixRain';

/**
 * Konami Code Easter Egg & ROOT ACCESS Modal
 * 
 * Non-technical explanation:
 * Listens for the famous Konami cheat code (Up, Up, Down, Down, Left, Right, Left, Right, B, A).
 * When idle for 3 seconds, shows a subtle glowing terminal prompt hint.
 * When the secret sequence is typed, it reveals the hidden ROOT ACCESS backdoor terminal!
 */

const KONAMI_KEYS = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const KonamiRootAccess: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Idle hint trigger (appears after 3s of inactivity)
  useEffect(() => {
    if (isMobile) return;

    const resetTimer = () => {
      setShowHint(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setShowHint(true), 3000);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'wheel'];
    events.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [isMobile]);

  // Key sequence listener
  useEffect(() => {
    let keyIdx = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      const key = e.key || '';
      const normalizedKey = key.length === 1 ? key.toLowerCase() : key;

      if (normalizedKey === KONAMI_KEYS[keyIdx]) {
        keyIdx++;
        if (keyIdx === KONAMI_KEYS.length) {
          setIsOpen(true);
          keyIdx = 0;
        }
      } else {
        keyIdx = normalizedKey === KONAMI_KEYS[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating 3s Inactivity Easter Egg Hint */}
      {!isMobile && (
        <AnimatePresence>
          {showHint && !isOpen && (
            <motion.div
              className="pointer-events-none fixed bottom-6 left-1/2 z-[90] -translate-x-1/2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-mono text-[11px] tracking-wide text-muted-foreground/60 select-none">
                Try this: ↑ ↑ ↓ ↓ ← → ← → b a
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Secret ROOT ACCESS Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-[#050705]/95 bg-scanlines p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            {/* Background Matrix Rain */}
            <MatrixRain opacity={0.3} intense={true} />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="relative max-w-md rounded-lg border border-[var(--matrix)] bg-[#050705]/90 p-8 text-center box-glow"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-display text-4xl sm:text-5xl text-[var(--matrix)] text-glow-strong">
                ROOT ACCESS
              </div>
              <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
                &gt; You found the backdoor. Welcome to the inner circle of{' '}
                <span className="text-[var(--matrix)] font-bold">CIPHER</span>. The real code was
                inside you all along.
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-6 font-mono text-xs uppercase tracking-widest text-[var(--matrix-dim)] transition-colors hover:text-[var(--matrix)]"
              >
                [ close connection ]
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
