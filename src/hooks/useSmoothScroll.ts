import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * useSmoothScroll Hook
 * 
 * Non-technical explanation:
 * Provides buttery-smooth, momentum-based inertial scrolling across the entire website.
 * Features:
 * 1. Exponential easing curve for a frictionless, luxury scrolling experience.
 * 2. Intercepts all internal link clicks (#about, #events, etc.) and glides to the target smoothly.
 * 3. Automatically locks background scroll when full-screen modals (like the photo gallery or dossier) are active.
 */

interface UseSmoothScrollOptions {
  disabled?: boolean;
  isModalOpen?: boolean;
}

export function useSmoothScroll({ disabled = false, isModalOpen = false }: UseSmoothScrollOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (disabled) return;

    // Detect if device is primary touch-based (mobile/tablet)
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

    // Initialize Lenis with tuned momentum physics
    const lenis = new Lenis({
      duration: isTouch ? 1.0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: isTouch ? 1.0 : 1.5,
      syncTouch: true,
      syncTouchLerp: 0.1,
      infinite: false,
    });

    lenisRef.current = lenis;

    // RAF Loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global smooth anchor link handler (offsets fixed navbar by 80px)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        // Skip administrative route handled by React router state
        if (href === '#admin') return;

        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl as HTMLElement, {
            offset: -80,
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [disabled]);

  // Pause or resume scrolling when modals mount or unmount
  useEffect(() => {
    if (!lenisRef.current) return;
    if (isModalOpen) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [isModalOpen]);

  return lenisRef;
}
