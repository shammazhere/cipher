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
  const iconRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only mount on desktop with fine mouse pointer
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    document.documentElement.classList.add('cipher-custom-cursor');

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trailing = { x: mouse.x, y: mouse.y };
    let animId = 0;
    let isHovering = false;

    const loop = () => {
      trailing.x += (mouse.x - trailing.x) * 0.2;
      trailing.y += (mouse.y - trailing.y) * 0.2;

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

      if (containerRef.current && containerRef.current.style.opacity !== '1') {
        containerRef.current.style.opacity = '1';
      }

      const target = e.target as HTMLElement | null;
      const shouldHover = !!target?.closest('a, button, [role="button"], input, textarea, [data-cursor="lens"]');

      if (shouldHover !== isHovering) {
        isHovering = shouldHover;
        if (circleRef.current) {
          circleRef.current.style.width = isHovering ? '44px' : '28px';
          circleRef.current.style.height = isHovering ? '44px' : '28px';
          circleRef.current.style.backgroundColor = isHovering ? 'rgba(0, 255, 65, 0.08)' : 'transparent';
        }
        if (dotRef.current) {
          dotRef.current.style.opacity = isHovering ? '0' : '1';
        }
        if (iconRef.current) {
          iconRef.current.style.opacity = isHovering ? '1' : '0';
        }
      }
    };

    const onMouseLeave = () => {
      if (containerRef.current) containerRef.current.style.opacity = '0';
    };

    const onMouseEnter = () => {
      if (containerRef.current) containerRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.documentElement.classList.remove('cipher-custom-cursor');
    };
  }, []);

  // Return null on touch devices without fine pointer or small mobile screens
  if (typeof window !== 'undefined' && (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth < 768)) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] opacity-0 transition-opacity duration-200"
    >
      {/* Outer Reticle Ring with Search/Lens Icon */}
      <div
        ref={circleRef}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border border-[var(--matrix)] transition-[width,height,background-color] duration-200 ease-out will-change-transform"
        style={{
          width: 28,
          height: 28,
          backgroundColor: 'transparent',
          boxShadow: '0 0 12px -2px var(--matrix-glow)',
        }}
      >
        <Search
          ref={iconRef}
          className="text-[var(--matrix)] transition-opacity duration-200 opacity-0"
          size={18}
          strokeWidth={2.25}
        />
      </div>

      {/* Center Pinpoint Dot */}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-[var(--matrix)] opacity-1 transition-opacity duration-200 will-change-transform"
      />
    </div>
  );
};

