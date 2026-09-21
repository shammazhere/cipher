import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { handleImageError } from '../../utils/imageFallback';

/**
 * Cursor Photo Trail Component
 * 
 * Non-technical explanation:
 * Interactive gallery canvas on the About section.
 * As the user glides their mouse across "CIPHER", event snapshots emerge smoothly
 * along the cursor's path with velocity-aware pacing and soft fading.
 */

interface TrailPhotoItem {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  duration: number;
  img: string;
}

let photoIdCounter = 0;

export const CursorPhotoTrail: React.FC = () => {
  const { siteConfig } = useData();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [photos, setPhotos] = useState<TrailPhotoItem[]>([]);
  const lastSpawnTime = useRef(0);
  const lastSpawnPos = useRef<{ x: number; y: number } | null>(null);

  const images = siteConfig.trailImages || [
    '/images/trail/1.webp',
    '/images/trail/2.webp',
    '/images/trail/3.webp',
    '/images/trail/4.webp',
  ];

  // Remove photo once animation completes
  const removePhoto = useCallback((id: number) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();

    // Ensure user has moved at least 32px from the last spawn to create a true path trail
    if (lastSpawnPos.current) {
      const dist = Math.hypot(x - lastSpawnPos.current.x, y - lastSpawnPos.current.y);
      if (dist < 32) return;
    }

    // Cooldown throttle
    if (now - lastSpawnTime.current < 90) return;

    lastSpawnTime.current = now;
    lastSpawnPos.current = { x, y };

    // Sizing and trajectory calculation
    const baseW = Math.min(Math.max(rect.width * 0.32, 130), 240);
    const baseH = baseW * 0.68;
    const rot = (Math.random() - 0.5) * 12;
    const duration = 1900 + Math.random() * 500;
    const randomImg = images[Math.floor(Math.random() * images.length)];

    const newPhoto: TrailPhotoItem = {
      id: photoIdCounter++,
      x: x - baseW / 2,
      y: y - baseH / 2,
      width: baseW,
      height: baseH,
      rotation: rot,
      duration,
      img: randomImg,
    };

    // Keep max 5 active trail items for performance and clarity
    setPhotos((prev) => [...(prev.length >= 5 ? prev.slice(prev.length - 4) : prev), newPhoto]);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[380px] sm:min-h-[460px] w-full items-center justify-center overflow-hidden rounded-xl border border-[#123a17] bg-[#050705]/80 p-6 shadow-2xl select-none"
      data-cursor="lens"
    >
      {/* Floating spawned photos */}
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onDone={removePhoto} />
      ))}

      {/* Center Giant Glowing CIPHER Headline */}
      <div className="pointer-events-none relative z-20 flex flex-col items-center justify-center select-none text-center">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.4em] text-[#00ff41] mb-2 opacity-80">
          COMMUNITY // GALLERY
        </span>
        <span className="font-mono text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-[#00ff41] text-glow-strong">
          CIPHER
        </span>
        <span className="mt-3 font-mono text-[11px] uppercase tracking-widest text-[#6fae78] opacity-70">
          [ GLIDE MOUSE TO REVEAL EVENT TRAIL ]
        </span>
      </div>

      {/* Decorative corner target reticles */}
      <div className="pointer-events-none absolute top-3 left-3 h-3 w-3 border-t border-l border-[#00ff41]/60" />
      <div className="pointer-events-none absolute top-3 right-3 h-3 w-3 border-t border-r border-[#00ff41]/60" />
      <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[#00ff41]/60" />
      <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#00ff41]/60" />
    </div>
  );
};

// Individual floating trail photo with cleanup timer
const PhotoCard: React.FC<{
  photo: TrailPhotoItem;
  onDone: (id: number) => void;
}> = ({ photo, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDone(photo.id), photo.duration);
    return () => clearTimeout(timer);
  }, [photo.id, photo.duration, onDone]);

  return (
    <div
      className="cpt-photo"
      style={{
        left: photo.x,
        top: photo.y,
        width: photo.width,
        height: photo.height,
        // @ts-expect-error CSS variable custom property
        '--cpt-rot': `${photo.rotation}deg`,
        '--cpt-duration': `${photo.duration}ms`,
      }}
    >
      <img src={photo.img} alt="CIPHER Event Snapshot" draggable={false} loading="eager" onError={handleImageError} />
    </div>
  );
};
