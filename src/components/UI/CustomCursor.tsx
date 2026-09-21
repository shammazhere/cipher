import React from 'react';
import { useTrailingCursor } from '../../hooks/useTrailingCursor';

/**
 * Custom Cursor Component
 * 
 * Non-technical explanation:
 * Pinpoint-accurate cybernetic tactical cursor:
 * - Center laser pinpoint dot ALWAYS stays visible with 0ms hardware alignment so clicks are 100% accurate.
 * - Fluid trailing circle smoothly glides behind the cursor without jitter.
 * - Outer echo ring gives an elegant, subtle sci-fi trail.
 * - On hover over interactive targets, the outer reticle expands into tactical corner brackets.
 */

export const CustomCursor: React.FC = () => {
  const {
    outerWrapperRef,
    dotWrapperRef,
    trailRingRef,
    isHoveringLens,
    isVisible,
  } = useTrailingCursor({ trailSpeed: 0.22 });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 200ms ease-out',
      }}
    >
      {/* 1. Subtle Outer Echo Ring (Trailing furthest behind for fluid depth) */}
      <div
        ref={trailRingRef}
        className="fixed left-0 top-0 will-change-transform -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`rounded-full border border-[#00ff41]/25 transition-all duration-300 ${
            isHoveringLens ? 'h-11 w-11 opacity-60' : 'h-7 w-7 opacity-30'
          }`}
        />
      </div>

      {/* 2. Main Trailing Reticle (Smoothly trails mouse with fluid glide) */}
      <div
        ref={outerWrapperRef}
        className="fixed left-0 top-0 will-change-transform -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`flex items-center justify-center rounded-full transition-all duration-200 ease-out ${
            isHoveringLens
              ? 'h-9 w-9 border border-[#00ff41] bg-[#00ff41]/10 shadow-[0_0_20px_rgba(0,255,65,0.45)]'
              : 'h-5 w-5 border border-[#00ff41]/60 bg-[#00ff41]/5 shadow-[0_0_10px_rgba(0,255,65,0.2)]'
          }`}
        >
          {isHoveringLens && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="w-1.5 h-[1px] bg-[#00ff41] absolute -left-1" />
              <span className="w-1.5 h-[1px] bg-[#00ff41] absolute -right-1" />
              <span className="h-1.5 w-[1px] bg-[#00ff41] absolute -top-1" />
              <span className="h-1.5 w-[1px] bg-[#00ff41] absolute -bottom-1" />
            </div>
          )}
        </div>
      </div>

      {/* 3. Center Pinpoint Laser Dot (ALWAYS VISIBLE for 100% click accuracy) */}
      <div
        ref={dotWrapperRef}
        className="fixed left-0 top-0 will-change-transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div
          className={`rounded-full bg-[#00ff41] shadow-[0_0_6px_#00ff41] transition-transform duration-100 ${
            isHoveringLens ? 'h-2 w-2 ring-2 ring-[#00ff41]/40 scale-110' : 'h-1.5 w-1.5'
          }`}
        />
      </div>
    </div>
  );
};
