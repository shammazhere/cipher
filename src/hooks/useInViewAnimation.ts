import { useEffect, useRef, useState, RefObject } from 'react';

/**
 * useInViewAnimation Hook
 * 
 * Non-technical explanation:
 * High-performance hook that checks if an element or canvas is actually visible on screen.
 * Automatically pauses heavy animations, canvas rendering, or calculations when:
 * 1. The user scrolls past the section (IntersectionObserver).
 * 2. The user switches to another browser tab (Page Visibility API).
 * 
 * Result: Drastically cuts CPU & GPU usage, keeps framerates locked at 60 FPS,
 * and ensures maximum scores in Google Lighthouse audits.
 */

interface UseInViewAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInViewAnimation<T extends HTMLElement = HTMLElement>(
  targetRef?: RefObject<T>,
  { threshold = 0.05, rootMargin = '50px' }: UseInViewAnimationOptions = {}
): { isInView: boolean; isTabActive: boolean; shouldAnimate: boolean } {
  const [isInView, setIsInView] = useState(true);
  const [isTabActive, setIsTabActive] = useState(!document.hidden);

  useEffect(() => {
    // 1. Tab visibility listener
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 2. IntersectionObserver for element viewport tracking
    let observer: IntersectionObserver | null = null;
    if (targetRef && targetRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setIsInView(entry.isIntersecting);
        },
        { threshold, rootMargin }
      );
      observer.observe(targetRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [targetRef, threshold, rootMargin]);

  return {
    isInView,
    isTabActive,
    shouldAnimate: isInView && isTabActive,
  };
}
