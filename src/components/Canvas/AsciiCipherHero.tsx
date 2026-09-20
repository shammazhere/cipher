import React, { useEffect, useRef } from 'react';

/**
 * AsciiCipherHero Canvas Component
 * 
 * Non-technical explanation:
 * Renders the huge, interactive "CIPHER" banner in the Hero section.
 * The text is made out of animated cyber ASCII symbols.
 * If you move your mouse over it, the symbols react to your cursor like a forcefield!
 */

interface AsciiCipherHeroProps {
  height?: string;
  className?: string;
}

const ASCII_RAMP = ".:-+*=#%@CIPHER";

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
  height = '38vh',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let heightPx = 0;
    let charSize = 8;
    let cellStep = 10;
    let cols = 0;
    let rows = 0;
    let particles: AsciiParticle[] = [];
    const mouse = { col: -999, row: -999, active: false };
    let animId: number;

    const renderParticles = () => {
      ctx.font = `${charSize + 2}px monospace`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.clearRect(0, 0, width, heightPx);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.isLit) continue;

        const dist = Math.min(1, Math.hypot(p.offsetX, p.offsetY) / 3);
        // Dynamic green color shifting from bright matrix green to cyan/white when disturbed
        const r = Math.round(0 + 140 * dist);
        const g = Math.round(255 - 20 * dist);
        const b = Math.round(65 + 100 * dist);

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        const drawX = (p.col + Math.round(p.offsetX)) * cellStep;
        const drawY = (p.row + Math.round(p.offsetY)) * cellStep;
        ctx.fillText(p.char, drawX + charSize / 2, drawY);
      }
    };

    const buildAsciiMatrix = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      heightPx = rect.height;

      const isMobile = width < 768;
      charSize = isMobile ? 8 : 9;
      cellStep = charSize + (isMobile ? 1 : 2);

      cols = Math.floor(width / cellStep);
      rows = Math.floor(heightPx / cellStep);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(heightPx * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${heightPx}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Offscreen canvas to rasterize "CIPHER" font shape
      const textWidth = Math.min(0.85 * width, 1150);
      const textHeight = 0.25 * textWidth;
      const targetCol = Math.floor((width - textWidth) / 2 / cellStep);
      const targetRow = Math.floor((heightPx - textHeight) / 2 / cellStep);
      const textCols = Math.max(1, Math.ceil(textWidth / cellStep));
      const textRows = Math.max(1, Math.ceil(textHeight / cellStep));

      const offCanvas = document.createElement('canvas');
      offCanvas.width = Math.max(2, Math.round(textWidth));
      offCanvas.height = Math.max(2, Math.round(textHeight));
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      offCtx.fillStyle = '#000';
      offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);
      offCtx.fillStyle = '#fff';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';

      const text = 'CIPHER';
      let fontSize = 0.95 * offCanvas.height;
      const getFont = (size: number) => `bold ${size}px "JetBrains Mono", "Space Grotesk", sans-serif`;

      offCtx.font = getFont(fontSize);
      while (offCtx.measureText(text).width > 0.96 * offCanvas.width && fontSize > 4) {
        fontSize -= 2;
        offCtx.font = getFont(fontSize);
      }
      offCtx.fillText(text, offCanvas.width / 2, offCanvas.height / 2);

      // Downsample offscreen raster to grid cells
      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = textCols;
      sampleCanvas.height = textRows;
      const sampleCtx = sampleCanvas.getContext('2d');
      if (!sampleCtx) return;

      sampleCtx.drawImage(offCanvas, 0, 0, textCols, textRows);
      const { data: pixelData } = sampleCtx.getImageData(0, 0, textCols, textRows);

      particles = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let isLit = false;
          let char = ' ';

          if (
            c >= targetCol &&
            c < targetCol + textCols &&
            r >= targetRow &&
            r < targetRow + textRows
          ) {
            const index = ((r - targetRow) * textCols + (c - targetCol)) * 4;
            const brightness =
              (0.299 * pixelData[index] +
                0.587 * pixelData[index + 1] +
                0.114 * pixelData[index + 2]) /
              255;

            if (brightness > 0.45) {
              isLit = true;
              const rampIdx = Math.min(
                ASCII_RAMP.length - 1,
                Math.floor(brightness * ASCII_RAMP.length)
              );
              char = ASCII_RAMP[rampIdx];
            }
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
    };

    buildAsciiMatrix();

    // Mouse tracking for particle repulsion
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.col = x / cellStep;
      mouse.row = y / cellStep;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', buildAsciiMatrix);

    // Random symbol flicker timer
    const flickerInterval = setInterval(() => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.isLit && Math.random() < 0.05) {
          p.char = ASCII_RAMP[Math.floor(Math.random() * ASCII_RAMP.length)];
        }
      }
    }, 70);

    // Physics update loop
    const physicsLoop = () => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.isLit) continue;

        // Force from mouse cursor
        if (mouse.active) {
          const dx = p.col + p.offsetX - mouse.col;
          const dy = p.row + p.offsetY - mouse.row;
          const dist = Math.hypot(dx, dy);
          const maxDist = 9;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 18;
            p.velX += (dx / dist) * force;
            p.velY += (dy / dist) * force;
          }
        }

        // Spring force returning to resting position
        p.velX += -0.15 * p.offsetX;
        p.velY += -0.15 * p.offsetY;

        // Damping
        p.velX *= 0.82;
        p.velY *= 0.82;

        p.offsetX += p.velX;
        p.offsetY += p.velY;
      }

      renderParticles();
      animId = requestAnimationFrame(physicsLoop);
    };

    animId = requestAnimationFrame(physicsLoop);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(flickerInterval);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', buildAsciiMatrix);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`relative w-full overflow-hidden select-none cursor-crosshair ${className}`}
      style={{ height }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
};
