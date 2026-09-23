import React, { useState, useEffect, useRef } from 'react';

/**
 * TextScramble Component
 * 
 * Non-technical explanation:
 * Matches the reference video/site heading animation:
 * When the heading scrolls into view, it flashes cyber Matrix glyphs
 * (!<>-_/[]{}—=+*^?#________ΣΦΨΩ01) that progressively resolve into the target text
 * from left to right.
 */

const SCRAMBLE_GLYPHS = "!<>-_\\/[]{}—=+*^?#________ΣΦΨΩ01";

interface TextScrambleProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  speed?: number;
  triggerOnView?: boolean;
  delay?: number;
}

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  as: Tag = 'span',
  className = '',
  speed = 28,
  triggerOnView = true,
  delay = 0,
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [triggered, setTriggered] = useState<boolean>(false);
  const containerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<number>(0);
  const timerRef = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(text);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    if (!triggerOnView) {
      setTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text, triggerOnView]);

  useEffect(() => {
    if (!triggered) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(text);
      return;
    }

    let isCancelled = false;
    let animId = 0;
    const totalFrames = text.length + 10;
    progressRef.current = 0;
    let lastStepTime = 0;

    const startTimeout = window.setTimeout(() => {
      const step = (time: number) => {
        if (isCancelled) return;

        if (time - lastStepTime >= speed) {
          lastStepTime = time;
          const currentProg = progressRef.current;
          let scrambled = '';

          for (let i = 0; i < text.length; i++) {
            if (i < currentProg - 8) {
              scrambled += text[i];
            } else if (text[i] === ' ') {
              scrambled += ' ';
            } else {
              scrambled += SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
            }
          }

          setDisplayText(scrambled);
          progressRef.current += 1;

          if (progressRef.current > totalFrames) {
            setDisplayText(text);
            return;
          }
        }

        animId = requestAnimationFrame(step);
      };

      animId = requestAnimationFrame(step);
    }, delay);

    return () => {
      isCancelled = true;
      clearTimeout(startTimeout);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [triggered, text, speed, delay]);


  const Component = Tag as any;

  return (
    <Component ref={containerRef} className={className} aria-label={text}>
      <span aria-hidden="true">{displayText}</span>
    </Component>
  );
};
