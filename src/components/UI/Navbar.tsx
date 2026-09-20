import React, { useState, useEffect } from 'react';
import { Menu, X, Settings, Layers, Search } from 'lucide-react';
import { handleImageError } from '../../utils/imageFallback';

/**
 * Navbar Component
 * 
 * Non-technical explanation:
 * Top navigation bar connecting all 5 mandatory pages (Home, About, Events, Team, Join),
 * plus shortcuts to the Component Library, Command Palette, and the Admin CMS dashboard.
 */

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenJoin: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenJoin,
  onOpenCommandPalette,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', name: 'HOME' },
    { id: 'about', name: 'ABOUT' },
    { id: 'events', name: 'EVENTS' },
    { id: 'team', name: 'TEAM' },
    { id: 'join', name: 'JOIN' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050705]/90 backdrop-blur-md border-b border-[#123a17] shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Left: Brand Emblem & Home link */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02] text-left"
          data-cursor="lens"
        >
          <img
            src="/images/cipher-logo.png"
            alt="CIPHER Emblem"
            className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]"
            onError={handleImageError}
          />
          <div className="flex flex-col">
            <span className="font-mono text-base font-bold tracking-wider text-[#00ff41] text-glow">
              CIPHER
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#6fae78]">
              SJEC · CSE
            </span>
          </div>
        </button>

        {/* Center: Desktop Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                className={`font-mono text-xs font-semibold tracking-widest transition-all duration-200 py-1 ${
                  isActive
                    ? 'text-[#00ff41] text-glow border-b-2 border-[#00ff41]'
                    : 'text-[#c8f7d0]/80 hover:text-[#00ff41]'
                }`}
                data-cursor="lens"
              >
                {link.name}
              </button>
            );
          })}

          {/* Component Library link */}
          <button
            type="button"
            onClick={() => onNavigate('components')}
            className={`flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wider px-2 py-1 rounded transition-colors ${
              currentPage === 'components'
                ? 'text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]/40'
                : 'text-[#6fae78] hover:text-[#00ff41]'
            }`}
            data-cursor="lens"
            title="Component Library Showcase"
          >
            <Layers size={13} />
            <span>LIBRARY</span>
          </button>

          {/* Admin CMS link */}
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wider px-2 py-1 rounded transition-colors ${
              currentPage === 'admin'
                ? 'text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]/40'
                : 'text-[#6fae78] hover:text-[#00ff41]'
            }`}
            data-cursor="lens"
            title="Admin Content & Positions CMS"
          >
            <Settings size={13} />
            <span>ADMIN</span>
          </button>
        </nav>

        {/* Right: Search + Join CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open Command Palette (Ctrl+K)"
              className="flex items-center gap-2 rounded border border-[#123a17] bg-[#080d08] px-3 py-1.5 font-mono text-xs text-[#6fae78] transition-all duration-200 hover:border-[#00ff41]/50 hover:text-[#00ff41]"
              data-cursor="lens"
              title="Command Palette (Ctrl+K)"
            >
              <Search size={13} className="text-[#00ff41]" />
              <span className="text-[10px] text-[#2c7a3a] border border-[#123a17] px-1 rounded">⌘K</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenJoin}
            className="rounded border border-[#00ff41] px-5 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#00ff41] transition-all duration-300 hover:bg-[#00ff41] hover:text-[#030503] hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
            data-cursor="lens"
          >
            JOIN CIPHER
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden text-[#c8f7d0] hover:text-[#00ff41] p-2"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#123a17] bg-[#050705]/95 px-6 py-6 backdrop-blur-xl space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(link.id);
              }}
              className={`block w-full text-left font-mono text-sm font-medium tracking-wider ${
                currentPage === link.id ? 'text-[#00ff41] font-bold' : 'text-[#c8f7d0]'
              }`}
            >
              {link.name}
            </button>
          ))}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommandPalette();
              }}
              className="flex items-center gap-2 font-mono text-xs text-[#6fae78] w-full text-left pt-2 border-t border-[#123a17]"
            >
              <Search size={14} className="text-[#00ff41]" />
              <span>COMMAND PALETTE (CTRL+K)</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('components');
            }}
            className="flex items-center gap-2 font-mono text-xs text-[#6fae78] w-full text-left"
          >
            <Layers size={14} />
            <span>COMPONENT LIBRARY</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('admin');
            }}
            className="flex items-center gap-2 font-mono text-xs text-[#00ff41] w-full text-left"
          >
            <Settings size={14} />
            <span>ADMIN CMS DASHBOARD</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenJoin();
            }}
            className="w-full rounded border border-[#00ff41] bg-[#00ff41]/10 py-2.5 font-mono text-xs uppercase tracking-wider text-[#00ff41]"
          >
            JOIN CIPHER
          </button>
        </div>
      )}
    </header>
  );
};
