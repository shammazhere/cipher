import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * BackToTop Component
 * 
 * Non-technical explanation:
 * A floating, reactive terminal button that appears when the user scrolls down.
 * Clicking smoothly scrolls back to the top of the viewport.
 * Meets international web standards for seamless navigation accessibility.
 */
export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle visibility based on vertical scroll offset
      if (window.scrollY > 380) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      data-cursor="lens"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 rounded border border-[#00ff41]/40 bg-[#050705]/90 px-3 py-2 font-mono text-xs font-semibold text-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.2)] backdrop-blur-md transition-all duration-300 hover:border-[#00ff41] hover:bg-[#00ff41] hover:text-[#050705] hover:shadow-[0_0_25px_rgba(0,255,65,0.5)] hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff41]"
    >
      <ChevronUp size={15} strokeWidth={2.5} />
      <span className="text-[11px] tracking-widest uppercase">TOP</span>
    </button>
  );
};
