import React from 'react';
import { Search } from 'lucide-react';
import { useTrailingCursor } from '../../hooks/useTrailingCursor';

/**
 * Custom Cursor Component
 * 
 * Non-technical explanation:
 * Renders an aesthetic cybernetic pointer:
 * - A pinpoint green laser dot that moves instantaneously with the mouse.
 * - An outer illuminated circle that smoothly trails behind the pointer with fluid inertia.
 * - Expands into an illuminated inspection reticle with a search icon over buttons and links.
 */

export const CustomCursor: React.FC = () => {
  // Configured with trailSpeed: 0.16 for a smooth, noticeable fluid trailing effect
  const {
    outerWrapperRef,
    dotWrapperRef,
    trailRingRef,
    isHoveringLens,
    isVisible,
  } = useTrailingCursor({ trailSpeed: 0.16 });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 200ms ease-out',
      }}
    >
      {/* 1. Subtle Outer Echo Ring (Trails furthest behind for ethereal sci-fi effect) */}
      <div
        ref={trailRingRef}
        className="fixed left-0 top-0 will-change-transform -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`rounded-full border border-[#00ff41]/20 transition-all duration-300 ${
            isHoveringLens ? 'h-12 w-12 opacity-80' : 'h-8 w-8 opacity-40'
          }`}
        />
      </div>

      {/* 2. Main Trailing Circle (Smoothly trails behind mouse with fluid glide) */}
      <div
        ref={outerWrapperRef}
        className="fixed left-0 top-0 will-change-transform -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`flex items-center justify-center rounded-full transition-[width,height,background-color,border-color,box-shadow] duration-200 ease-out ${
            isHoveringLens
              ? 'h-10 w-10 border border-[#00ff41] bg-[#00ff41]/10 shadow-[0_0_20px_rgba(0,255,65,0.45)]'
              : 'h-6 w-6 border border-[#00ff41]/60 bg-[#00ff41]/5 shadow-[0_0_10px_rgba(0,255,65,0.2)]'
          }`}
        >
          {isHoveringLens && (
            <Search size={13} className="text-[#00ff41] animate-pulse" />
          )}
        </div>
      </div>

      {/* 3. Center Pinpoint Dot (Direct 0ms hardware alignment for click precision) */}
      <div
        ref={dotWrapperRef}
        className="fixed left-0 top-0 will-change-transform -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41] transition-opacity duration-150 ${
            isHoveringLens ? 'h-0 w-0 opacity-0' : 'h-1.5 w-1.5 opacity-100'
          }`}
        />
      </div>
    </div>
  );
};


