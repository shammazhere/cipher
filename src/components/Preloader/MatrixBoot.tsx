import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatrixRain } from './MatrixRain';

/**
 * MatrixBoot Preloader Component
 * 
 * Non-technical explanation:
 * This component runs the cyberpunk intro when someone visits the site:
 * 1. Simulates connection & loading terminal lines.
 * 2. Unscrambles and decrypts the large glowing CIPHER logo.
 * 3. Lets the user click "[ SKIP > ]" or press Enter/Space/Escape at any time.
 */

interface MatrixBootProps {
  onComplete: () => void;
}

const TERMINAL_LOGS = [
  "> establishing connection...",
  "> authenticating access...",
  "> decrypting CIPHER_v1.0...",
  "__PROGRESS__",
  "> access granted"
];

const TARGET_WORD = "CIPHER";
const SCRAMBLE_GLYPHS = "#$%&@!?<>[]{}=+*/01ΣΦΨΩ";

export const MatrixBoot: React.FC<MatrixBootProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'boot' | 'decrypt' | 'done'>('boot');
  const hasFinished = useRef(false);

  // Complete preloader and notify parent
  const handleDone = useCallback(() => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    setPhase('done');
    try {
      sessionStorage.setItem('cipher_boot_seen', 'true');
    } catch {
      // ignore storage errors
    }
    setTimeout(onComplete, 600);
  }, [onComplete]);

  // Advance step (or skip)
  const handleSkipOrAdvance = useCallback(() => {
    if (phase === 'boot') {
      setPhase('decrypt');
    } else {
      handleDone();
    }
  }, [phase, handleDone]);

  // Keyboard and scroll listeners for instant skip
  useEffect(() => {
    if (phase === 'done') return;

    const handleKey = (e: KeyboardEvent) => {
      if (['Enter', ' ', 'Escape'].includes(e.key)) {
        handleSkipOrAdvance();
      }
    };

    const handleWheel = () => {
      handleSkipOrAdvance();
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [phase, handleSkipOrAdvance]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#050705] bg-scanlines cursor-pointer"
          onClick={handleSkipOrAdvance}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Matrix Rain Canvas Background */}
          <MatrixRain opacity={0.22} intense={true} />

          {/* Center Stage: Boot Terminal or Logo Decryption */}
          <div className="relative z-10 w-full max-w-4xl px-6">
            {phase === 'boot' ? (
              <BootTerminal onReady={() => setPhase('decrypt')} />
            ) : (
              <CipherDecrypt onResolved={handleDone} />
            )}
          </div>

          {/* Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDone();
            }}
            className="absolute bottom-8 right-8 z-20 font-mono text-xs uppercase tracking-widest text-[#2c7a3a] transition-all duration-200 hover:text-[#00ff41] hover:scale-105 border border-[#123a17] bg-[#050705]/80 px-4 py-2 rounded"
          >
            [ SKIP &gt; ]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Stage 1: Terminal text typewriter with progress bar
const BootTerminal: React.FC<{ onReady: () => void }> = ({ onReady }) => {
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentTyped, setCurrentTyped] = useState<string>('');
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const finishedRef = useRef(false);

  // Simulated loading bar counter
  useEffect(() => {
    let frameId: number;
    let target = 25;
    const startTime = performance.now();

    const updateTarget = (val: number) => {
      target = Math.max(target, val);
    };

    if (document.readyState === 'complete') {
      updateTarget(100);
    } else {
      window.addEventListener('load', () => updateTarget(100), { once: true });
    }

    const step = () => {
      if (performance.now() - startTime > 1800) target = 100;
      setProgressPercent((prev) => {
        const next = prev + (target - prev) * 0.08 + 0.5;
        return Math.min(next, 100);
      });
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const progressBarText = useMemo(() => {
    const rounded = Math.round(progressPercent);
    const bars = Math.round((rounded / 100) * 10);
    const filled = '='.repeat(bars);
    const empty = ' '.repeat(10 - bars);
    return `> loading modules... [${filled}${empty}] ${rounded}%`;
  }, [progressPercent]);

  // Line typewriter logic
  useEffect(() => {
    if (currentLineIndex >= TERMINAL_LOGS.length) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        const timer = setTimeout(onReady, 450);
        return () => clearTimeout(timer);
      }
      return;
    }

    const targetLine = TERMINAL_LOGS[currentLineIndex];

    if (targetLine === '__PROGRESS__') {
      if (progressPercent < 99.5) {
        setCurrentTyped(progressBarText);
        return;
      } else {
        setCompletedLines((prev) => [...prev, progressBarText]);
        setCurrentTyped('');
        setCurrentLineIndex((prev) => prev + 1);
        return;
      }
    }

    let charPos = 0;
    setCurrentTyped('');
    const interval = setInterval(() => {
      charPos++;
      setCurrentTyped(targetLine.slice(0, charPos));
      if (charPos >= targetLine.length) {
        clearInterval(interval);
        setTimeout(() => {
          setCompletedLines((prev) => [...prev, targetLine]);
          setCurrentTyped('');
          setCurrentLineIndex((prev) => prev + 1);
        }, 60);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [currentLineIndex, progressPercent >= 99.5, onReady]);

  // Keep progress bar updated while on that line
  useEffect(() => {
    if (TERMINAL_LOGS[currentLineIndex] === '__PROGRESS__' && progressPercent < 99.5) {
      setCurrentTyped(progressBarText);
    }
  }, [progressBarText, currentLineIndex, progressPercent]);

  return (
    <div className="font-mono text-sm leading-relaxed text-[#00ff41] sm:text-base md:text-lg max-w-xl mx-auto space-y-2">
      {completedLines.map((line, idx) => (
        <div
          key={idx}
          className={line === '> access granted' ? 'text-glow font-bold text-[#00ff66]' : ''}
        >
          {line}
        </div>
      ))}
      {currentLineIndex < TERMINAL_LOGS.length && (
        <div>
          <span>{currentTyped}</span>
          <span className="cursor-blink ml-1">█</span>
        </div>
      )}
    </div>
  );
};

// Stage 2: Scramble Decryption of CIPHER logo
const CipherDecrypt: React.FC<{ onResolved: () => void }> = ({ onResolved }) => {
  const [letters, setLetters] = useState<string[]>(() => TARGET_WORD.split('').map(() => '#'));
  const solvedRef = useRef<boolean[]>(new Array(TARGET_WORD.length).fill(false));
  const startTimeRef = useRef(performance.now());
  const mousePos = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    let animId: number;
    let lastTick = 0;

    const onPointerMove = (e: PointerEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY, active: true };
    };

    window.addEventListener('pointermove', onPointerMove);

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const lettersToSolve = Math.floor(elapsed / 250);

      // Solve letters progressively
      for (let i = 0; i < TARGET_WORD.length; i++) {
        if (i < lettersToSolve) {
          solvedRef.current[i] = true;
        }
      }

      if (now - lastTick > 50) {
        lastTick = now;
        setLetters(() =>
          TARGET_WORD.split('').map((char, idx) => {
            if (solvedRef.current[idx]) {
              return char;
            }
            return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
          })
        );
      }

      if (lettersToSolve >= TARGET_WORD.length + 1) {
        setLetters(TARGET_WORD.split(''));
        window.removeEventListener('pointermove', onPointerMove);
        setTimeout(onResolved, 400);
        return;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [onResolved]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center select-none"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0, y: -60 }}
      transition={{ duration: 0.4 }}
    >
      <div className="font-mono text-[clamp(3.5rem,14vw,11rem)] font-bold tracking-widest text-[#00ff41] text-glow-strong flex justify-center">
        {letters.map((char, index) => (
          <span key={index} className="inline-block w-[0.8em] text-center">
            {char}
          </span>
        ))}
      </div>
      <div className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-[#6fae78]">
        [ DECRYPTING SECURITY PROTOCOL ]
      </div>
    </motion.div>
  );
};
