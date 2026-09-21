import { useEffect, useRef, useState } from 'react';

/**
 * useTrailingCursor Hook
 * 
 * Non-technical explanation:
 * Manages the physics and hardware coordinates of the custom cybernetic pointer:
 * - 0ms instant hardware tracking for the center pinpoint dot (100% accurate clicks).
 * - Butter-smooth fluid trailing interpolation (lerp) for the outer reticle and echo ring.
 * - Auto-detects interactive hover elements without hiding the pointer.
 */

interface TrailingCursorOptions {
  /** Trailing smoothing factor (0.22 gives a fluid, responsive glide) */
  trailSpeed?: number;
}

export function useTrailingCursor({ trailSpeed = 0.22 }: TrailingCursorOptions = {}) {
  const outerWrapperRef = useRef<HTMLDivElement | null>(null);
  const dotWrapperRef = useRef<HTMLDivElement | null>(null);
  const trailRingRef = useRef<HTMLDivElement | null>(null);

  const [isHoveringLens, setIsHoveringLens] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse/trackpad), ignore touch screens
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    document.documentElement.classList.add('cipher-custom-cursor');

    // Hardware target coordinates (latest mouse position)
    const target = { x: -100, y: -100 };
    // Primary trailing reticle coordinates
    const trail = { x: -100, y: -100 };
    // Secondary delayed echo ring coordinates
    const echo = { x: -100, y: -100 };

    let frameId: number;
    let hasMoved = false;

    const renderLoop = () => {
      if (hasMoved) {
        // High-precision lerp for fluid trailing motion
        trail.x += (target.x - trail.x) * trailSpeed;
        trail.y += (target.y - trail.y) * trailSpeed;

        // Secondary ring trails fluidly behind the primary trail
        echo.x += (trail.x - echo.x) * (trailSpeed * 0.72);
        echo.y += (trail.y - echo.y) * (trailSpeed * 0.72);

        if (outerWrapperRef.current) {
          outerWrapperRef.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
        }
        if (trailRingRef.current) {
          trailRingRef.current.style.transform = `translate3d(${echo.x}px, ${echo.y}px, 0)`;
        }
      }

      frameId = requestAnimationFrame(renderLoop);
    };

    frameId = requestAnimationFrame(renderLoop);

    const onMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;

      // Update hardware dot instantaneously on mousemove for 0ms click latency
      if (dotWrapperRef.current) {
        dotWrapperRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      if (!hasMoved) {
        hasMoved = true;
        trail.x = e.clientX;
        trail.y = e.clientY;
        echo.x = e.clientX;
        echo.y = e.clientY;
      }

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      const targetEl = e.target as HTMLElement | null;
      const isInteractive = !!targetEl?.closest(
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
  }, [trailSpeed]);

  return {
    outerWrapperRef,
    dotWrapperRef,
    trailRingRef,
    isHoveringLens,
    isVisible,
  };
}
