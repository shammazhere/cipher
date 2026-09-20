import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Settings } from 'lucide-react';

/**
 * Navbar Component
 * 
 * Non-technical explanation:
 * The top navigation bar of the website.
 * Contains the CIPHER winged emblem, quick navigation links (Home, About,
 * Leadership, Events, Join), an Admin dashboard link, and the glowing Join button.
 */

interface NavbarProps {
  onOpenJoin: () => void;
  onNavigateAdmin: () => void;
  isAdminView?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenJoin,
  onNavigateAdmin,
  isAdminView = false,
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
    { name: 'HOME', href: '#top' },
    { name: 'ABOUT', href: '#about' },
    { name: 'LEADERSHIP', href: '#leadership' },
    { name: 'EVENTS', href: '#events' },
    { name: 'JOIN', href: '#join' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050705]/85 backdrop-blur-md border-b border-[#123a17] shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Left: Brand Logo & Title */}
        <a
          href="#top"
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
          data-cursor="lens"
        >
          <img
            src="/images/cipher-logo.png"
            alt="CIPHER Emblem"
            className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]"
          />
          <div className="flex flex-col">
            <span className="font-mono text-base font-bold tracking-wider text-[#00ff41] text-glow">
              CIPHER
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#6fae78]">
              SJEC · CSE
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-mono text-xs font-medium tracking-widest text-[#c8f7d0]/80 transition-colors duration-200 hover:text-[#00ff41] hover:text-glow"
              data-cursor="lens"
            >
              {link.name}
            </a>
          ))}

          {/* Admin Dashboard shortcut link */}
          <button
            type="button"
            onClick={onNavigateAdmin}
            className={`flex items-center gap-1.5 font-mono text-xs font-medium tracking-wider px-2.5 py-1 rounded transition-colors ${
              isAdminView
                ? 'text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]/40'
                : 'text-[#6fae78] hover:text-[#00ff41]'
            }`}
            data-cursor="lens"
            title="Admin Content & Positions CMS"
          >
            <Settings size={13} />
            <span>{isAdminView ? 'BACK TO SITE' : 'ADMIN'}</span>
          </button>
        </nav>

        {/* Right: Join Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenJoin}
            className="rounded border border-[#00ff41] px-5 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-[#00ff41] transition-all duration-300 hover:bg-[#00ff41] hover:text-[#030503] hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
            data-cursor="lens"
          >
            JOIN CIPHER
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden text-[#c8f7d0] hover:text-[#00ff41] p-2"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#123a17] bg-[#050705]/95 px-6 py-6 backdrop-blur-xl space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm font-medium tracking-wider text-[#c8f7d0] hover:text-[#00ff41]"
            >
              {link.name}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateAdmin();
            }}
            className="flex items-center gap-2 font-mono text-sm text-[#00ff41] w-full text-left pt-2 border-t border-[#123a17]"
          >
            <Settings size={16} />
            <span>{isAdminView ? 'VIEW PUBLIC SITE' : 'OPEN ADMIN CMS'}</span>
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
