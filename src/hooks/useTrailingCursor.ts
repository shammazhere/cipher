import { useEffect, useRef, useState } from 'react';

/**
 * useTrailingCursor Hook
 * 
 * Non-technical explanation:
 * Manages the physics of the custom mouse pointer.
 * - Tracks the mouse coordinates instantly for pinpoint accuracy.
 * - Smoothly glides a glowing outer circle with a fluid trailing delay behind the pointer.
 * - Detects when the user hovers over interactive elements like buttons, cards, or links.
 */

interface TrailingCursorOptions {
  /** Trailing smoothing factor. Lower value (e.g. 0.16) gives a smooth, fluid trailing circle */
  trailSpeed?: number;
}

export function useTrailingCursor({ trailSpeed = 0.16 }: TrailingCursorOptions = {}) {
  const outerWrapperRef = useRef<HTMLDivElement | null>(null);
  const dotWrapperRef = useRef<HTMLDivElement | null>(null);
  const trailRingRef = useRef<HTMLDivElement | null>(null);

  const [isHoveringLens, setIsHoveringLens] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse/trackpad), ignore touch devices
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    document.documentElement.classList.add('cipher-custom-cursor');

    // Hardware target coordinates
    const target = { x: -100, y: -100 };
    // Primary trailing circle coordinates
    const trail = { x: -100, y: -100 };
    // Secondary delayed echo ring coordinates for richer visual depth
    const echo = { x: -100, y: -100 };

    let frameId: number;
    let hasMoved = false;

    const renderLoop = () => {
      if (hasMoved) {
        // Fluid trailing interpolation: smoothly trails behind the mouse
        trail.x += (target.x - trail.x) * trailSpeed;
        trail.y += (target.y - trail.y) * trailSpeed;

        // Subtle secondary echo circle trailing slightly further behind
        echo.x += (target.x - echo.x) * (trailSpeed * 0.7);
        echo.y += (target.y - echo.y) * (trailSpeed * 0.7);

        // Update hardware transform directly (no CSS transition fighting RAF)
        if (outerWrapperRef.current) {
          outerWrapperRef.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
        }
        if (trailRingRef.current) {
          trailRingRef.current.style.transform = `translate3d(${echo.x}px, ${echo.y}px, 0)`;
        }
        if (dotWrapperRef.current) {
          // Dot leads instantly right under user's cursor
          dotWrapperRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
        }
      }

      frameId = requestAnimationFrame(renderLoop);
    };

    frameId = requestAnimationFrame(renderLoop);

    const onMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;

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
