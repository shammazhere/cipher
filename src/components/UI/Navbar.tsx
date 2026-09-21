import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { handleImageError } from '../../utils/imageFallback';

/**
 * Navbar Component
 * 
 * Non-technical explanation:
 * Fixed top cyber navigation header matching the reference video and live site:
 * - Prominent winged CIPHER emblem.
 * - Monospace navigation anchors (Home, About, Leadership, Events, Join) with
 *   sleek neon green underline animation on hover.
 * - Outline "Join CIPHER" button.
 * - Mobile responsive drawer.
 */

const NAV_ITEMS = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Events', href: '#events' },
  { label: 'Join', href: '#join' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-[var(--border)] bg-[#050705]/85 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* Emblem Logo */}
        <a href="#top" className="-ml-2 flex items-center md:-ml-4" aria-label="CIPHER home" data-cursor="lens">
          <img
            src="/images/cipher-logo.webp"
            alt="CIPHER"
            onError={handleImageError}
            className="h-16 w-auto md:h-20"
          />
        </a>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group relative font-mono text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-[var(--matrix)]"
                data-cursor="lens"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--matrix)] shadow-[0_0_8px_var(--matrix-glow)] transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <a
          href="#join"
          className="hidden rounded-md border border-[var(--matrix)] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[var(--matrix)] transition-colors hover:bg-[rgba(0,255,65,0.1)] md:inline-block"
          data-cursor="lens"
        >
          Join CIPHER
        </a>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          className="text-[var(--matrix)] md:hidden p-1"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--border)] bg-[#050705]/95 backdrop-blur-md md:hidden">
          <ul className="flex flex-col px-5 py-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 font-mono text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-[var(--matrix)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};
