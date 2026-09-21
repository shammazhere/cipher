import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

/**
 * Cursor Photo Trail Component
 * 
 * Non-technical explanation:
 * The interactive media showcase from the About section:
 * - Displays a floating 3D glitching "CIPHER" headline.
 * - When moving the cursor around this zone, photographic snapshots dynamically
 *   spawn, rotate slightly, and pop onto the screen, fading away smoothly.
 * - Cursor velocity dynamically boosts the 3D glow of the CIPHER label.
 */

const DEFAULT_TRAIL_IMAGES = [
  '/images/trail/1.webp',
  '/images/trail/2.webp',
  '/images/trail/3.webp',
  '/images/trail/4.webp',
  '/images/trail/5.webp',
  '/images/trail/6.webp',
  '/images/trail/7.webp',
  '/images/trail/8.webp',
];

interface PhotoItem {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  duration: number;
  img: string;
}

let photoCounter = 0;

const boostRatio = (speed: number) => Math.min(speed / 3.2, 1);

const TrailPhoto = memo(function TrailPhoto({
  photo,
  onDone,
}: {
  photo: PhotoItem;
  onDone: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(photo.id), photo.duration);
    return () => clearTimeout(timer);
  }, [photo.id, photo.duration, onDone]);

  return (
    <div
      className="cpt-photo"
      style={
        {
          left: photo.x,
          top: photo.y,
          width: photo.width,
          height: photo.height,
          '--cpt-rot': `${photo.rotation}deg`,
          '--cpt-duration': `${photo.duration}ms`,
        } as React.CSSProperties
      }
    >
      <img src={photo.img} alt="" draggable={false} loading="eager" />
    </div>
  );
});

interface CursorPhotoTrailProps {
  images?: string[];
  label?: string;
  className?: string;
}

export const CursorPhotoTrail: React.FC<CursorPhotoTrailProps> = ({
  images = DEFAULT_TRAIL_IMAGES,
  label = 'CIPHER',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactiveLabelRef = useRef<HTMLSpanElement>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isInView, setIsInView] = useState<boolean>(false);

  const prevMouse = useRef<{ x: number; y: number; t: number } | null>(null);
  const lastSpawnTime = useRef<number>(0);
  const isRafQueued = useRef<boolean>(false);
  const latestMouse = useRef<{ x: number; y: number } | null>(null);
  const isTracking = useRef<boolean>(false);

  const handlePhotoDone = useCallback((id: number) => {
    setPhotos((prev) => (prev.length ? prev.filter((p) => p.id !== id) : prev));
  }, []);

  const spawnPhoto = useCallback(
    (clientX: number, clientY: number, speed: number = 0.5) => {
      const el = containerRef.current;
      if (!el || !images.length) return;
      const rect = el.getBoundingClientRect();
      const boost = boostRatio(speed);
      reactiveLabelRef.current?.style.setProperty('--cpt-boost', boost.toFixed(3));

      const cardWidth = Math.min(Math.max(rect.width * (0.32 + 0.2 * boost), 90), 420);
      const cardHeight = 0.68 * cardWidth;
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      const newPhoto: PhotoItem = {
        id: photoCounter++,
        x: localX - cardWidth / 2 + (Math.random() - 0.5) * 10,
        y: localY - cardHeight / 2 + (Math.random() - 0.5) * 10,
        width: cardWidth,
        height: cardHeight,
        rotation: (Math.random() - 0.5) * (5 + 7 * boost),
        duration: 2200 + 800 * Math.random(),
        img: images[Math.floor(Math.random() * images.length)],
      };

      setPhotos((prevList) => [
        ...(prevList.length >= 6 ? prevList.slice(prevList.length - 5) : prevList),
        newPhoto,
      ]);
    },
    [images]
  );

  // Intersection Observer to enable/disable when in viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mouse & Touch trail physics
  useEffect(() => {
    const el = containerRef.current;
    if (
      !el ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !images.length ||
      !isInView
    ) {
      return;
    }

    const processFrame = () => {
      isRafQueued.current = false;
      const m = latestMouse.current;
      if (!m) return;

      const rect = el.getBoundingClientRect();
      if (!(m.x >= rect.left && m.x <= rect.right && m.y >= rect.top && m.y <= rect.bottom)) {
        isTracking.current = false;
        prevMouse.current = null;
        reactiveLabelRef.current?.style.setProperty('--cpt-boost', '0');
        return;
      }

      const now = performance.now();
      const prev = isTracking.current ? prevMouse.current : null;
      isTracking.current = true;

      let speed = 0;
      if (prev) {
        const dt = Math.max(now - prev.t, 1);
        speed = Math.hypot(m.x - prev.x, m.y - prev.y) / dt;
      }

      prevMouse.current = { x: m.x, y: m.y, t: now };
      const boost = boostRatio(speed);
      reactiveLabelRef.current?.style.setProperty('--cpt-boost', boost.toFixed(3));

      if (speed < 0.05) return;

      const spawnCooldown = 240 - 180 * boost;
      if (now - lastSpawnTime.current < spawnCooldown) return;
      lastSpawnTime.current = now;

      spawnPhoto(m.x, m.y, speed);
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      latestMouse.current = { x: clientX, y: clientY };
      if (!isRafQueued.current) {
        isRafQueued.current = true;
        requestAnimationFrame(processFrame);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const rect = el.getBoundingClientRect();
        if (
          t.clientX >= rect.left &&
          t.clientX <= rect.right &&
          t.clientY >= rect.top &&
          t.clientY <= rect.bottom
        ) {
          spawnPhoto(t.clientX, t.clientY, 0.7);
          lastSpawnTime.current = performance.now();
        }
      }
    };

    // Ambient automatic photo popping on mobile/touch so users see the photos without having to guess
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    let ambientTimer: ReturnType<typeof setInterval> | null = null;
    if (isTouchDevice) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 + (Math.random() - 0.5) * (rect.width * 0.4);
      const cy = rect.top + rect.height / 2 + (Math.random() - 0.5) * (rect.height * 0.3);
      spawnPhoto(cx, cy, 0.4);

      ambientTimer = setInterval(() => {
        const r = el.getBoundingClientRect();
        const rx = r.left + r.width / 2 + (Math.random() - 0.5) * (r.width * 0.5);
        const ry = r.top + r.height / 2 + (Math.random() - 0.5) * (r.height * 0.4);
        spawnPhoto(rx, ry, 0.35);
      }, 2500);
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);
      if (ambientTimer) clearInterval(ambientTimer);
    };
  }, [images, isInView, spawnPhoto]);

  return (
    <div
      ref={containerRef}
      className={`cpt-zone cursor-pointer select-none ${className}`}
      style={{ touchAction: 'pan-y' }}
      onClick={(e) => {
        spawnPhoto(e.clientX, e.clientY, 0.8);
      }}
    >
      {/* Spawning trailing photo cards */}
      {photos.map((p) => (
        <TrailPhoto key={p.id} photo={p} onDone={handlePhotoDone} />
      ))}

      {/* Centered Floating 3D "CIPHER" Label with shimmer sweep */}
      {label && (
        <div aria-hidden="true" className="cpt-label-wrap">
          <div className={`cpt-label-entrance ${isInView ? 'cpt-label-in' : ''}`}>
            <div className="cpt-label-float">
              <span ref={reactiveLabelRef} className="cpt-label-reactive">
                <span data-text={label} className="cpt-label">
                  {label}
                  <span aria-hidden="true" className="cpt-label-shimmer">
                    {label}
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
