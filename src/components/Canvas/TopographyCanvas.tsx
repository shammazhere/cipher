import React, { useEffect, useRef } from 'react';

/**
 * Topography Canvas Component (WaveCanvas)
 * 
 * Non-technical explanation:
 * Renders the flowing 60 FPS topological wireframe lines seen behind the
 * CIPHER portal. Uses a vertical Perlin noise vector field to create
 * organic, undulating neon green contours running from top to bottom.
 */

interface TopographyCanvasProps {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  xGap?: number;
  yGap?: number;
  className?: string;
  style?: React.CSSProperties;
}

class Vec3 {
  x: number;
  y: number;
  z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  dot2(x: number, y: number) {
    return this.x * x + this.y * y;
  }
}

class ClassicalPerlinNoise {
  grad3: Vec3[];
  p: number[];
  perm: number[];
  gradP: Vec3[];

  constructor(seed = 0) {
    this.grad3 = [
      new Vec3(1, 1, 0), new Vec3(-1, 1, 0), new Vec3(1, -1, 0), new Vec3(-1, -1, 0),
      new Vec3(1, 0, 1), new Vec3(-1, 0, 1), new Vec3(1, 0, -1), new Vec3(-1, 0, -1),
      new Vec3(0, 1, 1), new Vec3(0, -1, 1), new Vec3(0, 1, -1), new Vec3(0, -1, -1),
    ];
    this.p = [
      151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,
      6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,
      171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,
      55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,
      188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,
      206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,
      43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,
      210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,
      115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
    ];
    this.perm = new Array(512);
    this.gradP = new Array(512);
    this.seed(seed);
  }

  seed(s: number) {
    if (s > 0 && s < 1) s *= 65536;
    s = Math.floor(s);
    if (s < 256) s |= s << 8;
    for (let i = 0; i < 256; i++) {
      const val = 1 & i ? this.p[i] ^ (255 & s) : this.p[i] ^ ((s >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = val;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[val % 12];
    }
  }

  fade(t: number) {
    return t * t * t * (t * (6 * t - 15) + 10);
  }

  lerp(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
  }

  perlin2(x: number, y: number) {
    let X = Math.floor(x);
    let Y = Math.floor(y);
    x -= X;
    y -= Y;
    X &= 255;
    Y &= 255;
    const n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
    const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
    const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);
    const u = this.fade(x);
    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
  }
}

interface WavePoint {
  x: number;
  y: number;
  wave: { x: number; y: number };
}

export const TopographyCanvas: React.FC<TopographyCanvasProps> = ({
  lineColor = 'rgba(0, 255, 65, 0.28)',
  backgroundColor = 'transparent',
  waveSpeedX = 0.0125,
  waveSpeedY = 0.005,
  waveAmpX = 32,
  waveAmpY = 16,
  xGap = 12,
  yGap = 36,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const noise = new ClassicalPerlinNoise(0.42);
    let columns: WavePoint[][] = [];
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const buildGrid = () => {
      columns = [];
      const isMobile = width < 768;
      const currentXGap = isMobile ? Math.max(xGap * 1.8, 22) : xGap;
      const currentYGap = isMobile ? Math.max(yGap * 1.25, 44) : yGap;

      const cols = Math.ceil((width + 160) / currentXGap);
      const rows = Math.ceil((height + 30) / currentYGap);
      const startX = (width - currentXGap * cols) / 2;
      const startY = (height - currentYGap * rows) / 2;

      for (let c = 0; c <= cols; c++) {
        const col: WavePoint[] = [];
        for (let r = 0; r <= rows; r++) {
          col.push({
            x: startX + currentXGap * c,
            y: startY + currentYGap * r,
            wave: { x: 0, y: 0 },
          });
        }
        columns.push(col);
      }
    };

    const updateWaves = (time: number) => {
      const numCols = columns.length;
      for (let c = 0; c < numCols; c++) {
        const col = columns[c];
        const numRows = col.length;
        for (let r = 0; r < numRows; r++) {
          const pt = col[r];
          const n =
            12 *
            noise.perlin2(
              (pt.x + time * waveSpeedX) * 0.002,
              (pt.y + time * waveSpeedY) * 0.0015
            );
          pt.wave.x = Math.cos(n) * waveAmpX;
          pt.wave.y = Math.sin(n) * waveAmpY;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      const numCols = columns.length;
      for (let c = 0; c < numCols; c++) {
        const col = columns[c];
        const numRows = col.length;
        if (numRows === 0) continue;

        let firstX = col[0].x + col[0].wave.x;
        let firstY = col[0].y + col[0].wave.y;
        ctx.moveTo(firstX, firstY);

        for (let r = 0; r < numRows; r++) {
          const pt = col[r];
          const px = pt.x + pt.wave.x;
          const py = pt.y + pt.wave.y;
          ctx.lineTo(px, py);
        }
      }

      ctx.stroke();
    };

    let animId = 0;
    let isTabActive = !document.hidden;

    resize();
    buildGrid();

    const render = (time: number) => {
      if (isTabActive) {
        updateWaves(time);
        draw();
      }
      animId = requestAnimationFrame(render);
    };

    if (prefersReducedMotion) {
      updateWaves(0);
      draw();
    } else {
      animId = requestAnimationFrame(render);
    }

    const onVisibilityChange = () => {
      isTabActive = !document.hidden;
    };

    const onResize = () => {
      resize();
      buildGrid();
    };

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [lineColor, backgroundColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, xGap, yGap]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
};
