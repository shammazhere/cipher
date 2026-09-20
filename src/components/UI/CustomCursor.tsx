import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

/**
 * Custom Cursor Component
 * 
 * Non-technical explanation:
 * Renders a high-tech glowing cyber reticle with a pinpoint center dot.
 * Engineered for high-speed responsiveness with zero mouse lag:
 * - Direct 0ms hardware tracking for the center pinpoint dot
 * - Ultra-responsive 0.70 lerp (linear interpolation) for the outer reticle ring
 * - Dedicated transform containers to prevent CSS transition lag on mouse movements
 * - Expands into an illuminated cyber inspection lens over buttons and links
 */

export const CustomCursor: React.FC = () => {
  const outerWrapperRef = useRef<HTMLDivElement | null>(null);
  const dotWrapperRef = useRef<HTMLDivElement | null>(null);
  const [isHoveringLens, setIsHoveringLens] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Only enable on desktop mouse devices (not touch screens)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    document.documentElement.classList.add('cipher-custom-cursor');

    // Start with current cursor position
    const targetPos = { x: -100, y: -100 };
    const currentPos = { x: -100, y: -100 };
    let frameId: number;
    let hasMoved = false;

    const updatePosition = () => {
      if (hasMoved) {
        // High-speed snappy lerp (0.70): glides gracefully while staying tightly locked to cursor
        currentPos.x += (targetPos.x - currentPos.x) * 0.70;
        currentPos.y += (targetPos.y - currentPos.y) * 0.70;

        if (outerWrapperRef.current) {
          outerWrapperRef.current.style.transform = `translate3d(${currentPos.x}px, ${currentPos.y}px, 0)`;
        }
        if (dotWrapperRef.current) {
          // Absolute zero-latency positioning on the pinpoint center dot
          dotWrapperRef.current.style.transform = `translate3d(${targetPos.x}px, ${targetPos.y}px, 0)`;
        }
      }

      frameId = requestAnimationFrame(updatePosition);
    };

    frameId = requestAnimationFrame(updatePosition);

    const onMouseMove = (e: MouseEvent) => {
      targetPos.x = e.clientX;
      targetPos.y = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        currentPos.x = e.clientX;
        currentPos.y = e.clientY;
      }

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="lens"]'
      );
      setIsHoveringLens(isInteractive);
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.documentElement.classList.remove('cipher-custom-cursor');
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 150ms ease-out',
      }}
    >
      {/* Outer reticle / lens positioning wrapper (strictly NO css transition on transform) */}
      <div
        ref={outerWrapperRef}
        className="fixed left-0 top-0 will-change-transform -translate-x-1/2 -translate-y-1/2"
      >
        {/* Inner visual ring (transitions size, border, color, shadow without affecting movement speed) */}
        <div
          className={`flex items-center justify-center rounded-full transition-[width,height,background-color,border-color,box-shadow] duration-150 ease-out ${
            isHoveringLens
              ? 'h-10 w-10 border border-[#00ff41] bg-[#00ff41]/10 shadow-[0_0_16px_rgba(0,255,65,0.45)]'
              : 'h-6 w-6 border border-[#00ff41]/55 bg-transparent shadow-[0_0_8px_rgba(0,255,65,0.15)]'
          }`}
        >
          {isHoveringLens && (
            <Search size={13} className="text-[#00ff41] animate-pulse" />
          )}
        </div>
      </div>

      {/* Center pinpoint dot wrapper (strictly NO css transition on transform) */}
      <div
        ref={dotWrapperRef}
        className="fixed left-0 top-0 will-change-transform -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41] transition-opacity duration-100 ${
            isHoveringLens ? 'h-0 w-0 opacity-0' : 'h-1.5 w-1.5 opacity-100'
          }`}
        />
      </div>
    </div>
  );
};

