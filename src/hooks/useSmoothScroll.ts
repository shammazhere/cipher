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

    // Detect touch / coarse pointer devices (phones & tablets)
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

    let lenis: Lenis | null = null;
    let rafId: number = 0;

    // Only initialize Lenis on desktop/fine-pointer devices with silky frictionless momentum
    if (!isTouch) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => 1 - Math.pow(1 - t, 3.5),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.25,
        touchMultiplier: 1.8,
        syncTouch: false,
        infinite: false,
      });

      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    // Global smooth anchor link handler for both mobile (native) and desktop (Lenis)
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
          if (lenis) {
            lenis.scrollTo(targetEl as HTMLElement, {
              offset: -80,
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          } else {
            const elRect = targetEl.getBoundingClientRect();
            const topOffset = elRect.top + window.scrollY - 80;
            window.scrollTo({
              top: topOffset,
              behavior: 'smooth',
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, [disabled]);

  // Pause or resume scrolling when modals mount or unmount
  useEffect(() => {
    if (lenisRef.current && !disabled) {
      if (isModalOpen) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [isModalOpen, disabled]);

  return lenisRef;
}


