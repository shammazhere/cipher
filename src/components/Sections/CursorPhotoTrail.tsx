import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useData } from '../../context/DataContext';

/**
 * Cursor Photo Trail Component
 * 
 * Non-technical explanation:
 * This component displays the giant glowing "CIPHER" title on the right of the About section.
 * Whenever the visitor moves their mouse across this area, snapshots from past CIPHER events
 * fly out and float along their cursor trail before softly fading away!
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
  const lastMousePos = useRef<{ x: number; y: number; time: number } | null>(null);

  const images = siteConfig.trailImages || [
    '/images/trail/1.jpg',
    '/images/trail/2.jpg',
    '/images/trail/3.jpg',
    '/images/trail/4.jpg',
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

    // Calculate cursor velocity
    let velocity = 0;
    if (lastMousePos.current) {
      const dt = Math.max(now - lastMousePos.current.time, 1);
      const dist = Math.hypot(x - lastMousePos.current.x, y - lastMousePos.current.y);
      velocity = dist / dt;
    }
    lastMousePos.current = { x, y, time: now };

    // Throttle spawn rate according to velocity
    const cooldown = Math.max(180 - velocity * 60, 60);
    if (now - lastSpawnTime.current < cooldown) return;
    lastSpawnTime.current = now;

    // Pick random dimensions and subtle random rotation
    const baseW = Math.min(Math.max(rect.width * 0.38, 120), 280);
    const baseH = baseW * 0.68;
    const rot = (Math.random() - 0.5) * 16;
    const duration = 2200 + Math.random() * 800;
    const randomImg = images[Math.floor(Math.random() * images.length)];

    const newPhoto: TrailPhotoItem = {
      id: photoIdCounter++,
      x: x - baseW / 2 + (Math.random() - 0.5) * 15,
      y: y - baseH / 2 + (Math.random() - 0.5) * 15,
      width: baseW,
      height: baseH,
      rotation: rot,
      duration,
      img: randomImg,
    };

    setPhotos((prev) => [...(prev.length >= 6 ? prev.slice(prev.length - 5) : prev), newPhoto]);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[380px] sm:min-h-[460px] w-full items-center justify-center overflow-hidden rounded-xl border border-[#123a17] bg-[#050705]/80 p-6 shadow-2xl"
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
          [ MOVE MOUSE TO EXPLORE ARCHIVE ]
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
      <img src={photo.img} alt="CIPHER Event Snapshot" draggable={false} loading="eager" />
    </div>
  );
};
