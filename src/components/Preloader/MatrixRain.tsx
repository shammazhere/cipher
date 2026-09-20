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

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = new Array(columns).fill(1).map(() => Math.floor(Math.random() * -50));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let lastTime = 0;
    const interval = intense ? 33 : 45; // 30 FPS or 22 FPS for smooth matrix pacing

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw);

      if (currentTime - lastTime < interval) return;
      lastTime = currentTime;

      // Semi-transparent background creates the trailing fading effect
      ctx.fillStyle = 'rgba(5, 7, 5, 0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
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

    return () => {
      cancelAnimationFrame(animationFrameId);
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
