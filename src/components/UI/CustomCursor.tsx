import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

/**
 * Custom Cursor Component
 * 
 * Non-technical explanation:
 * Custom cybernetic pointer matching the reference video:
 * - Fluid trailing circle with smooth 0.18 lerp interpolation.
 * - Center laser dot at exact hardware coordinates for 100% click precision.
 * - On hover over clickable links, buttons, and interactive cards, the outer ring
 *   smoothly expands to 44px with a cyber magnifying glass search icon, and the center dot fades out.
 */

export const CustomCursor: React.FC = () => {
  const circleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setIsActive(true);
    document.documentElement.classList.add('cipher-custom-cursor');

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trailing = { x: mouse.x, y: mouse.y };
    let animId = 0;

    const loop = () => {
      trailing.x += (mouse.x - trailing.x) * 0.18;
      trailing.y += (mouse.y - trailing.y) * 0.18;

      if (circleRef.current) {
        circleRef.current.style.transform = `translate3d(${trailing.x}px, ${trailing.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!isVisible) setIsVisible(true);
      const target = e.target as HTMLElement | null;
      setIsHovering(
        !!target?.closest('a, button, [role="button"], input, textarea, [data-cursor="lens"]')
      );
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.documentElement.classList.remove('cipher-custom-cursor');
    };
  }, [isVisible]);

  if (!isActive) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 200ms ease' }}
    >
      {/* Outer Reticle Ring with Search/Lens Icon */}
      <div
        ref={circleRef}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border border-[var(--matrix)] transition-[width,height,background-color] duration-200 ease-out"
        style={{
          width: isHovering ? 44 : 28,
          height: isHovering ? 44 : 28,
          backgroundColor: isHovering ? 'rgba(0, 255, 65, 0.08)' : 'transparent',
          boxShadow: '0 0 12px -2px var(--matrix-glow)',
        }}
      >
        <Search
          className="text-[var(--matrix)] transition-opacity duration-200"
          style={{ opacity: isHovering ? 1 : 0 }}
          size={18}
          strokeWidth={2.25}
        />
      </div>

      {/* Center Pinpoint Dot */}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-[var(--matrix)]"
        style={{ opacity: isHovering ? 0 : 1, transition: 'opacity 200ms ease' }}
      />
    </div>
  );
};
