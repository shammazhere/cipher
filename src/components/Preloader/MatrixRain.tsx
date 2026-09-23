import React, { useEffect, useRef } from 'react';

/**
 * Matrix Rain Canvas Component
 * 
 * Non-technical explanation:
 * Creates the iconic digital code rain effect from "The Matrix",
 * dropping green cyber characters down the screen.
 */

interface MatrixRainProps {
  opacity?: number;
  intense?: boolean;
  className?: string;
}

const MATRIX_CHARS = 'CIPHER0123456789アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンΣΦΨΩ';

export const MatrixRain: React.FC<MatrixRainProps> = ({
  opacity = 0.15,
  intense = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    const dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);

    let animationFrameId = 0;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let drops: number[] = [];

    const fontSize = isMobile ? 14 : 16;

    const setupCanvas = () => {
      if (!canvas) return;
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      const columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1).map(() => Math.floor(Math.random() * -50));
    };

    setupCanvas();

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setupCanvas, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let lastTime = 0;
    const interval = intense ? (isMobile ? 40 : 33) : (isMobile ? 60 : 45);

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw);

      if (!isVisible) return;

      if (currentTime - lastTime < interval) return;
      lastTime = currentTime;

      // Semi-transparent background creates the trailing fading effect
      ctx.fillStyle = 'rgba(5, 7, 5, 0.12)';
      ctx.fillRect(0, 0, width, height);

      const numDrops = drops.length;
      for (let i = 0; i < numDrops; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of the drop is brighter neon green/white
        if (Math.random() > 0.95) {
          ctx.fillStyle = '#d6ffdd';
        } else {
          ctx.fillStyle = '#00ff41';
        }

        ctx.fillText(char, x, y);

        // Reset drop when it reaches bottom with random delay
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [intense]);


  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    />
  );
};
