import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

/**
 * Custom Cursor Component
 * 
 * Non-technical explanation:
 * Replaces the boring browser arrow with a high-tech green cyber reticle.
 * When hovering over cards or buttons, it expands into an illuminated "lens"
 * inspection circle.
 */

export const CustomCursor: React.FC = () => {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [isHoveringLens, setIsHoveringLens] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop mouse devices (not touch screens)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    document.documentElement.classList.add('cipher-custom-cursor');

    const targetPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const currentPos = { x: targetPos.x, y: targetPos.y };
    let frameId: number;

    const updatePosition = () => {
      // Fast and snappy lerp (linear interpolation) keeps up with hand movement smoothly
      currentPos.x += (targetPos.x - currentPos.x) * 0.48;
      currentPos.y += (targetPos.y - currentPos.y) * 0.48;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${currentPos.x}px, ${currentPos.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        // Direct tracking on the pinpoint dot gives zero-lag precision
        dotRef.current.style.transform = `translate3d(${targetPos.x}px, ${targetPos.y}px, 0) translate(-50%, -50%)`;
      }

      frameId = requestAnimationFrame(updatePosition);
    };

    frameId = requestAnimationFrame(updatePosition);

    const onMouseMove = (e: MouseEvent) => {
      targetPos.x = e.clientX;
      targetPos.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest(
        'a, button, [role="button"], input, textarea, [data-cursor="lens"]'
      );
      setIsHoveringLens(isInteractive);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.documentElement.classList.remove('cipher-custom-cursor');
    };
  }, [isVisible]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}
    >
      {/* Outer reticle / lens */}
      <div
        ref={outerRef}
        className={`fixed left-0 top-0 flex items-center justify-center rounded-full border transition-all duration-200 ${
          isHoveringLens
            ? 'h-10 w-10 border-[#00ff41] bg-[#00ff41]/10 shadow-[0_0_15px_rgba(0,255,65,0.4)]'
            : 'h-7 w-7 border-[#00ff41]/50 bg-transparent'
        }`}
      >
        {isHoveringLens && (
          <Search size={14} className="text-[#00ff41] animate-pulse" />
        )}
      </div>

      {/* Center pinpoint dot */}
      <div
        ref={dotRef}
        className={`fixed left-0 top-0 rounded-full bg-[#00ff41] transition-opacity duration-150 ${
          isHoveringLens ? 'opacity-0' : 'h-1.5 w-1.5 opacity-100 shadow-[0_0_8px_#00ff41]'
        }`}
      />
    </div>
  );
};
