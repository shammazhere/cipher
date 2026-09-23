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
const DENSE_RAMP = '#%@$8WMBKCIPHER';

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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let isMobile = false;
    let width = 0;
    let heightPx = 0;
    let charSize = 8;
    let cellStep = 10;
    let cols = 0;
    let rows = 0;
    let particles: AsciiParticle[] = [];
    let litIndices: number[] = [];
    const mouse = { col: -999, row: -999, active: false };
    let isLoopRunning = false;
    let animId = 0;
    let scrambleInterval: ReturnType<typeof setInterval> | null = null;
    let isVisible = true;

    const render = () => {
      ctx.font = `bold ${charSize + (isMobile ? 3 : 2)}px 'JetBrains Mono', monospace`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.clearRect(0, 0, width, heightPx);

      ctx.shadowColor = 'rgba(0, 255, 65, 0.45)';
      ctx.shadowBlur = isMobile ? 3 : 1;

      const len = litIndices.length;
      for (let j = 0; j < len; j++) {
        const p = particles[litIndices[j]];
        const dist = Math.min(1, Math.hypot(p.offsetX, p.offsetY) / 3);
        const r = Math.round(140 - 140 * dist);
        const g = 255;
        const b = Math.round(170 - 105 * dist);

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        const drawX = (p.col + Math.round(p.offsetX)) * cellStep;
        const drawY = (p.row + Math.round(p.offsetY)) * cellStep;
        ctx.fillText(p.char, drawX + charSize / 2, drawY);
      }
    };

    const buildGrid = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      heightPx = rect.height || (window.innerHeight * 0.4);

      isMobile = width < 768 || window.matchMedia('(pointer: coarse)').matches;
      const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 2.0) : Math.min(window.devicePixelRatio || 1, 1.5);

      charSize = isMobile ? 8.5 : 9;
      cellStep = isMobile ? 9 : 11;

      cols = Math.floor(width / cellStep);
      rows = Math.floor(heightPx / cellStep);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(heightPx * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${heightPx}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rasterize CIPHER text: on phones, utilize up to 96% width and slightly higher aspect ratio so it fills the screen boldly
      const textWidth = isMobile
        ? Math.min(0.96 * width, 460)
        : Math.min(0.86 * width, 1100);
      const textHeight = isMobile ? 0.28 * textWidth : 0.24 * textWidth;
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
        let fontSize = 0.94 * offscreen.height;
        const fontStr = (size: number) =>
          `900 ${size}px 'Arial Black', Impact, 'Helvetica Neue', Arial, sans-serif`;

        offCtx.font = fontStr(fontSize);
        while (offCtx.measureText(word).width > 0.98 * offscreen.width && fontSize > 4) {
          fontSize -= 2;
          offCtx.font = fontStr(fontSize);
        }

        // Draw thick outline stroke + fill to dilate and thicken the letters on canvas
        offCtx.lineWidth = isMobile ? Math.max(3.5, cellStep * 0.4) : Math.max(2, cellStep * 0.2);
        offCtx.strokeStyle = '#fff';
        offCtx.lineJoin = 'miter';
        offCtx.miterLimit = 2;
        offCtx.strokeText(word, offscreen.width / 2, offscreen.height / 2 + 0.02 * fontSize);
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
          litIndices = [];

          const activeRamp = isMobile ? DENSE_RAMP : ASCII_RAMP;
          const litThreshold = isMobile ? 0.28 : 0.44;

          let pIndex = 0;
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
                isLit = brightness > litThreshold;
                char = isLit
                  ? activeRamp[Math.min(activeRamp.length - 1, Math.floor(brightness * activeRamp.length))]
                  : ' ';
              }

              if (isLit) {
                litIndices.push(pIndex);
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
              pIndex++;
            }
          }
        }
      }

      render();
    };

    buildGrid();

    const loop = () => {
      let isMoving = mouse.active;
      const len = litIndices.length;

      for (let j = 0; j < len; j++) {
        const p = particles[litIndices[j]];

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
            isMoving = true;
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
        } else {
          isMoving = true;
        }
        if (Math.abs(p.offsetY) < 0.01 && Math.abs(p.velY) < 0.01) {
          p.offsetY = 0;
          p.velY = 0;
        } else {
          isMoving = true;
        }
      }

      render();

      if (isMoving && isVisible) {
        animId = requestAnimationFrame(loop);
      } else {
        isLoopRunning = false;
        animId = 0;
      }
    };

    const requestLoop = () => {
      if (!isLoopRunning && isVisible && !prefersReducedMotion) {
        isLoopRunning = true;
        animId = requestAnimationFrame(loop);
      }
    };

    const startAnimation = () => {
      if (!scrambleInterval) {
        scrambleInterval = setInterval(() => {
          const len = litIndices.length;
          const activeRamp = isMobile ? DENSE_RAMP : ASCII_RAMP;
          for (let j = 0; j < len; j++) {
            particles[litIndices[j]].char = activeRamp[Math.floor(Math.random() * activeRamp.length)];
          }
          if (!isLoopRunning) {
            render();
          }
        }, isMobile ? 160 : 90);
      }
      requestLoop();
    };

    const stopAnimation = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
      isLoopRunning = false;
      if (scrambleInterval) {
        clearInterval(scrambleInterval);
        scrambleInterval = null;
      }
    };

    if (prefersReducedMotion) {
      render();
    } else {
      startAnimation();
    }

    // Viewport IntersectionObserver to pause off-screen rendering
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!prefersReducedMotion) startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let cachedRect: DOMRect | null = null;
    const updateCachedRect = () => {
      if (container) {
        cachedRect = container.getBoundingClientRect();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!cachedRect) updateCachedRect();
      if (cachedRect) {
        mouse.col = (e.clientX - cachedRect.left) / cellStep;
        mouse.row = (e.clientY - cachedRect.top) / cellStep;
        mouse.active = true;
        requestLoop();
      }
    };

    const onPointerLeave = () => {
      mouse.active = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        if (!cachedRect) updateCachedRect();
        if (cachedRect) {
          const touch = e.touches[0];
          mouse.col = (touch.clientX - cachedRect.left) / cellStep;
          mouse.row = (touch.clientY - cachedRect.top) / cellStep;
          mouse.active = true;
          requestLoop();
        }
      }
    };

    const onTouchEnd = () => {
      mouse.active = false;
    };

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateCachedRect();
        buildGrid();
        requestLoop();
      }, 150);
    };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', updateCachedRect, { passive: true });
    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('touchstart', onTouchMove, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      stopAnimation();
      observer.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', updateCachedRect);
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
