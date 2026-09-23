import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatrixRain } from './MatrixRain';

/**
 * MatrixBoot Preloader Component
 * 
 * Non-technical explanation:
 * Exactly replicates the reference intro experience:
 * 1. Boot Terminal: Typing sequence with live module progress bar and Matrix rain.
 * 2. Decrypt Phase: Giant glowing gothic Matrix font CIPHER logo with interactive pointer
 *    proximity unscramble and seamless upward exit transition into the main page.
 */

interface MatrixBootProps {
  onComplete: () => void;
}

const TERMINAL_LOGS = [
  '> establishing connection...',
  '> authenticating access...',
  '> decrypting CIPHER_v1.0...',
  '__PROGRESS__',
  '> access granted',
];

const TARGET_WORD = 'CIPHER';
const SCRAMBLE_CHARS = '#$%&@!?<>[]{}=+*/01ΣΦΨΩ';

export const MatrixBoot: React.FC<MatrixBootProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'boot' | 'decrypt' | 'done'>('boot');
  const hasFinished = useRef(false);

  const handleDone = useCallback(() => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    setPhase('done');
    try {
      sessionStorage.setItem('cipher_boot_seen', 'true');
    } catch {
      // ignore
    }
    setTimeout(onComplete, 650);
  }, [onComplete]);

  const handleAdvanceOrSkip = useCallback(() => {
    if (phase === 'boot') {
      setPhase('decrypt');
    } else {
      handleDone();
    }
  }, [phase, handleDone]);

  useEffect(() => {
    if (phase === 'done') return;

    const onWheel = () => handleAdvanceOrSkip();
    const onKeyDown = (e: KeyboardEvent) => {
      if (['Enter', ' ', 'Escape'].includes(e.key)) {
        handleAdvanceOrSkip();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [phase, handleAdvanceOrSkip]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] overflow-hidden bg-[#050705] bg-scanlines cursor-pointer"
          onClick={handleAdvanceOrSkip}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Matrix Rain Canvas Background */}
          <MatrixRain opacity={0.18} intense={true} />

          {/* Center Stage Content */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            {phase === 'boot' ? (
              <BootTerminal onReady={() => setPhase('decrypt')} />
            ) : (
              <CipherDecrypt onResolved={handleDone} />
            )}
          </div>

          {/* Bottom Right Skip Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAdvanceOrSkip();
            }}
            className="absolute bottom-6 right-6 z-10 font-mono text-xs uppercase tracking-widest text-[var(--matrix-dim)] transition-colors hover:text-[var(--matrix)]"
          >
            [ skip &gt; ]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface BootTerminalProps {
  onReady: () => void;
}

const BootTerminal: React.FC<BootTerminalProps> = ({ onReady }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState<string>('');
  const [lineIndex, setLineIndex] = useState<number>(0);
  const [progressVal, setProgressVal] = useState<number>(0);
  const readyCalledRef = useRef<boolean>(false);

  // Smooth progress tracking
  useEffect(() => {
    let target = 15;
    let animId = 0;
    const start = performance.now();

    const bump = (val: number) => {
      target = Math.max(target, val);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => bump(70));
    }
    if (document.readyState === 'complete') {
      bump(100);
    } else {
      window.addEventListener('load', () => bump(100), { once: true });
    }

    const tick = () => {
      if (performance.now() - start > 3000) target = 100;
      setProgressVal((prev) => Math.min(prev + (target - prev) * 0.06 + 0.4, 100));
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const progressBarString = useMemo(() => {
    const rounded = Math.round(progressVal);
    const filled = Math.round((rounded / 100) * 10);
    const bar = '='.repeat(filled) + ' '.repeat(10 - filled);
    return `> loading modules... [${bar}] ${rounded}%`;
  }, [progressVal]);

  // Terminal Line Typing Sequence
  useEffect(() => {
    if (lineIndex >= TERMINAL_LOGS.length) return;
    const targetLine = TERMINAL_LOGS[lineIndex];

    if (targetLine === '__PROGRESS__') {
      if (progressVal < 99.5) {
        setCurrentText(progressBarString);
        return;
      } else {
        setLines((prev) => [...prev, progressBarString]);
        setCurrentText('');
        setLineIndex((prev) => prev + 1);
        return;
      }
    }

    let charPos = 0;
    setCurrentText('');
    const interval = setInterval(() => {
      charPos++;
      setCurrentText(targetLine.slice(0, charPos));
      if (charPos >= targetLine.length) {
        clearInterval(interval);
        setTimeout(() => {
          setLines((prev) => [...prev, targetLine]);
          setCurrentText('');
          setLineIndex((prev) => prev + 1);
        }, 50);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [lineIndex, progressVal >= 99.5]);

  useEffect(() => {
    if (TERMINAL_LOGS[lineIndex] === '__PROGRESS__' && progressVal < 99.5) {
      setCurrentText(progressBarString);
    }
  }, [progressBarString, lineIndex, progressVal]);

  useEffect(() => {
    if (lineIndex >= TERMINAL_LOGS.length && !readyCalledRef.current) {
      readyCalledRef.current = true;
      const timeout = setTimeout(onReady, 500);
      return () => clearTimeout(timeout);
    }
  }, [lineIndex, onReady]);

  return (
    <div className="w-full max-w-xl font-mono text-sm leading-relaxed text-[var(--matrix)] sm:text-base">
      {lines.map((l, idx) => (
        <div key={idx} className={l === '> access granted' ? 'text-glow text-[var(--matrix)]' : ''}>
          {l}
        </div>
      ))}
      {lineIndex < TERMINAL_LOGS.length && (
        <div>
          <span>{currentText}</span>
          <span className="cursor-blink">█</span>
        </div>
      )}
    </div>
  );
};

interface CipherDecryptProps {
  onResolved: () => void;
}

const CipherDecrypt: React.FC<CipherDecryptProps> = ({ onResolved }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [letters, setLetters] = useState<string[]>(() =>
    TARGET_WORD.split('').map(() => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)])
  );
  const solvedRef = useRef<boolean[]>(TARGET_WORD.split('').map(() => false));
  const pointerPos = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLetters(TARGET_WORD.split(''));
      const t = setTimeout(onResolved, 600);
      return () => clearTimeout(t);
    }

    let animId = 0;
    let lastScramble = 0;
    const startTime = performance.now();

    let cachedLetterCenters: { x: number; y: number }[] = [];
    let cachedContainerRect: DOMRect | null = null;

    const updateCachedPositions = () => {
      if (containerRef.current) {
        cachedContainerRect = containerRef.current.getBoundingClientRect();
      }
      cachedLetterCenters = letterRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    updateCachedPositions();

    const onPointerMove = (e: PointerEvent) => {
      pointerPos.current = { x: e.clientX, y: e.clientY, active: true };
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', updateCachedPositions, { passive: true });

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const lettersToSolve = Math.floor(elapsed / 220);

      for (let i = 0; i < TARGET_WORD.length; i++) {
        if (i < lettersToSolve) {
          solvedRef.current[i] = true;
        }
      }

      let curX = pointerPos.current.x;
      let curY = pointerPos.current.y;

      if (!pointerPos.current.active && cachedContainerRect) {
        const swing = (Math.sin(elapsed / 500) + 1) / 2;
        curX = cachedContainerRect.left + swing * cachedContainerRect.width;
        curY = cachedContainerRect.top + cachedContainerRect.height / 2;
      }

      if (now - lastScramble > 45) {
        lastScramble = now;
        setLetters(
          TARGET_WORD.split('').map((char, idx) => {
            if (solvedRef.current[idx]) return char;
            const center = cachedLetterCenters[idx];
            if (center && Math.hypot(center.x - curX, center.y - curY) < 80) {
              return char;
            }
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
        );
      }

      if (lettersToSolve >= TARGET_WORD.length + 1) {
        setLetters(TARGET_WORD.split(''));
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('resize', updateCachedPositions);
        setTimeout(onResolved, 450);
        return;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', updateCachedPositions);
    };
  }, [onResolved]);

  return (
    <motion.div
      className="relative flex w-full flex-col items-center justify-center select-none text-center"
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0, y: -60 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
    >
      <div
        ref={containerRef}
        className="font-matrix flex select-none text-[clamp(3.5rem,18vw,14rem)] leading-none tracking-tight text-[var(--matrix)] text-glow-strong justify-center"
      >
        {letters.map((char, idx) => (
          <span
            key={idx}
            ref={(el) => {
              letterRefs.current[idx] = el;
            }}
            className="inline-block w-[0.72em] text-center transition-transform duration-75"
            aria-hidden="true"
          >
            {char}
          </span>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-5 font-mono text-xs uppercase tracking-[0.3em] text-[#6fae78] sm:text-sm text-glow"
      >
        [ DECRYPTING SECURITY PROTOCOL ]
      </motion.div>
    </motion.div>
  );
};
