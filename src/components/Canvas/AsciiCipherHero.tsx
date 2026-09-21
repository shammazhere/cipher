import React, { useEffect, useRef } from 'react';

/**
 * AsciiCipherHero Canvas Component
 * 
 * Non-technical explanation:
 * Renders the huge interactive ASCII "CIPHER" banner from the reference video.
 * Uses font rasterization to map the word CIPHER to characters from ".:-+*=#%@CIPHER".
 * Moving the cursor over the letters creates physical elastic repulsion waves with
 * fluid spring restitution and color shift.
 */

interface AsciiCipherHeroProps {
  height?: string;
  className?: string;
}

const ASCII_RAMP = '.:-+*=#%@CIPHER';

interface AsciiParticle {
  col: number;
  row: number;
  char: string;
  isLit: boolean;
  offsetX: number;
  offsetY: number;
  velX: number;
  velY: number;
}

export const AsciiCipherHero: React.FC<AsciiCipherHeroProps> = ({
  height = '40vh',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let heightPx = 0;
    let charSize = 8;
    let cellStep = 10;
    let cols = 0;
    let rows = 0;
    let particles: AsciiParticle[] = [];
    const mouse = { col: -999, row: -999, active: false };

    const render = () => {
      ctx.font = `${charSize + 2}px monospace`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.clearRect(0, 0, width, heightPx);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.isLit) continue;

        const dist = Math.min(1, Math.hypot(p.offsetX, p.offsetY) / 3);
        const r = Math.round(140 - 140 * dist);
        const g = Math.round(255 + 0 * dist);
        const b = Math.round(170 - 105 * dist);

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        const drawX = (p.col + Math.round(p.offsetX)) * cellStep;
        const drawY = (p.row + Math.round(p.offsetY)) * cellStep;
        ctx.fillText(p.char, drawX + charSize / 2, drawY);
      }
    };

    const buildGrid = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      heightPx = rect.height;

      const isMobile = width < 768;
      charSize = isMobile ? 8 : 9;
      cellStep = charSize + (isMobile ? 1 : 2);

      cols = Math.floor(width / cellStep);
      rows = Math.floor(heightPx / cellStep);

      canvas.width = width * dpr;
      canvas.height = heightPx * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${heightPx}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rasterize CIPHER text on temporary offscreen canvas
      const textWidth = Math.min(0.82 * width, 1100);
      const textHeight = 0.24 * textWidth;
      const startCol = Math.floor((width - textWidth) / 2 / cellStep);
      const startRow = Math.floor((heightPx - textHeight) / 2 / cellStep);
      const sampleCols = Math.max(1, Math.ceil(textWidth / cellStep));
      const sampleRows = Math.max(1, Math.ceil(textHeight / cellStep));

      const offscreen = document.createElement('canvas');
      offscreen.width = Math.max(2, Math.round(textWidth));
      offscreen.height = Math.max(2, Math.round(textHeight));
      const offCtx = offscreen.getContext('2d');

      if (offCtx) {
        offCtx.fillStyle = '#000';
        offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
        offCtx.fillStyle = '#fff';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';

        const word = 'CIPHER';
        let fontSize = 0.92 * offscreen.height;
        const fontStr = (size: number) =>
          `bold ${size}px 'Arial Black','Helvetica Neue',Arial,sans-serif`;

        offCtx.font = fontStr(fontSize);
        while (offCtx.measureText(word).width > 0.96 * offscreen.width && fontSize > 4) {
          fontSize -= 2;
          offCtx.font = fontStr(fontSize);
        }

        offCtx.fillText(word, offscreen.width / 2, offscreen.height / 2 + 0.02 * fontSize);

        const scaled = document.createElement('canvas');
        scaled.width = sampleCols;
        scaled.height = sampleRows;
        const scaledCtx = scaled.getContext('2d');
        if (scaledCtx) {
          scaledCtx.fillStyle = '#000';
          scaledCtx.fillRect(0, 0, sampleCols, sampleRows);
          scaledCtx.drawImage(offscreen, 0, 0, sampleCols, sampleRows);

          const { data } = scaledCtx.getImageData(0, 0, sampleCols, sampleRows);
          particles = [];

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              let isLit = false;
              let char = ' ';

              if (
                c >= startCol &&
                c < startCol + sampleCols &&
                r >= startRow &&
                r < startRow + sampleRows
              ) {
                const idx = ((r - startRow) * sampleCols + (c - startCol)) * 4;
                const brightness = (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;
                isLit = brightness > 0.5;
                char = isLit
                  ? ASCII_RAMP[Math.min(ASCII_RAMP.length - 1, Math.floor(brightness * ASCII_RAMP.length))]
                  : ' ';
              }

              particles.push({
                col: c,
                row: r,
                char,
                isLit,
                offsetX: 0,
                offsetY: 0,
                velX: 0,
                velY: 0,
              });
            }
          }
        }
      }

      render();
    };

    buildGrid();

    if (prefersReducedMotion) {
      const onResize = () => buildGrid();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    // Scramble lit characters every 50ms
    const scrambleInterval = setInterval(() => {
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].isLit) {
          particles[i].char = ASCII_RAMP[Math.floor(Math.random() * ASCII_RAMP.length)];
        }
      }
    }, 50);

    let animId = 0;
    const loop = () => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.isLit) continue;

        if (mouse.active) {
          const dx = p.col + p.offsetX - mouse.col;
          const dy = p.row + p.offsetY - mouse.row;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 10 && dist > 0) {
            const force = 1 - dist / 10;
            const impulse = force ** 2 * 42;
            p.velX += (dx / dist) * impulse;
            p.velY += (dy / dist) * impulse;
            p.velX += (Math.random() - 0.5) * 5.5 * force;
            p.velY += (Math.random() - 0.5) * 5.5 * force;
          }
        }

        p.velX += -0.025 * p.offsetX;
        p.velY += -0.025 * p.offsetY;
        p.velX *= 0.5;
        p.velY *= 0.5;
        p.offsetX += p.velX;
        p.offsetY += p.velY;

        if (Math.abs(p.offsetX) < 0.01 && Math.abs(p.velX) < 0.01) {
          p.offsetX = 0;
          p.velX = 0;
        }
        if (Math.abs(p.offsetY) < 0.01 && Math.abs(p.velY) < 0.01) {
          p.offsetY = 0;
          p.velY = 0;
        }
      }

      render();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.col = (e.clientX - rect.left) / cellStep;
      mouse.row = (e.clientY - rect.top) / cellStep;
      mouse.active = true;
    };

    const onPointerLeave = () => {
      mouse.active = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        mouse.col = (touch.clientX - rect.left) / cellStep;
        mouse.row = (touch.clientY - rect.top) / cellStep;
        mouse.active = true;
      }
    };

    const onTouchEnd = () => {
      mouse.active = false;
    };

    const onResize = () => {
      buildGrid();
    };

    window.addEventListener('resize', onResize);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('touchstart', onTouchMove, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      clearInterval(scrambleInterval);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('touchstart', onTouchMove);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`cl-root relative w-full overflow-hidden bg-transparent font-mono cursor-crosshair select-none ${className}`}
      style={{ height, touchAction: 'pan-y' }}
    >
      <canvas ref={canvasRef} className="cl-canvas absolute inset-0 block w-full h-full" />
    </div>
  );
};
