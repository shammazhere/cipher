import React, { useEffect, useRef } from 'react';
import { SimplexNoise } from '../../utils/simplexNoise';
import { useInViewAnimation } from '../../hooks/useInViewAnimation';

/**
 * Topography Canvas Component
 * 
 * Non-technical explanation:
 * Renders the flowing 60 FPS topological wireframe lines seen behind the
 * CIPHER sections. It looks like a high-tech topographic radar map.
 * Optimized with useInViewAnimation to automatically pause when offscreen
 * or when the user switches tabs to conserve CPU and GPU power.
 */

interface TopographyCanvasProps {
  strokeColor?: string;
  className?: string;
  speed?: number;
  lineSpacing?: number;
}

export const TopographyCanvas: React.FC<TopographyCanvasProps> = ({
  strokeColor = 'rgba(0, 255, 65, 0.16)',
  className = '',
  speed = 0.0008,
  lineSpacing = 28,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { shouldAnimate } = useInViewAnimation(containerRef);
  const shouldAnimateRef = useRef(shouldAnimate);

  useEffect(() => {
    shouldAnimateRef.current = shouldAnimate;
  }, [shouldAnimate]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const noise = new SimplexNoise(42);
    let animationFrameId: number;
    let width = 0;
    let height = 0;

    interface GridPoint {
      x: number;
      y: number;
      waveX: number;
      waveY: number;
    }

    let grid: GridPoint[][] = [];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildGrid();
    };

    const xSpacing = 32;
    const ySpacing = lineSpacing;

    const buildGrid = () => {
      grid = [];
      const cols = Math.ceil((width + 200) / xSpacing);
      const rows = Math.ceil((height + 100) / ySpacing);
      const startX = (width - xSpacing * cols) / 2;
      const startY = (height - ySpacing * rows) / 2;

      for (let r = 0; r <= rows; r++) {
        const row: GridPoint[] = [];
        for (let c = 0; c <= cols; c++) {
          row.push({
            x: startX + c * xSpacing,
            y: startY + r * ySpacing,
            waveX: 0,
            waveY: 0,
          });
        }
        grid.push(row);
      }
    };

    const updateWaves = (time: number) => {
      const t = time * speed;
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          const pt = grid[r][c];
          // Perlin noise calculation for organic topological wave
          const n = 12 * noise.perlin2((pt.x + t * 40) * 0.0018, (pt.y + t * 25) * 0.0015);
          pt.waveX = Math.cos(n) * 22;
          pt.waveY = Math.sin(n) * 22;
        }
      }
    };

    const render = (time: number) => {
      if (!shouldAnimateRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      updateWaves(time);

      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;

      for (let r = 0; r < grid.length; r++) {
        const row = grid[r];
        if (row.length === 0) continue;

        ctx.moveTo(row[0].x + row[0].waveX, row[0].y + row[0].waveY);

        for (let c = 1; c < row.length; c++) {
          const pt = row[c];
          ctx.lineTo(pt.x + pt.waveX, pt.y + pt.waveY);
        }
      }

      ctx.stroke();
      animationFrameId = requestAnimationFrame(render);
    };

    resize();
    animationFrameId = requestAnimationFrame(render);

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [strokeColor, speed, lineSpacing]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
