import React from 'react';
import { Mail, Linkedin, Github, Instagram, ArrowUpRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { handleImageError } from '../../utils/imageFallback';

/**
 * Footer Component
 * 
 * Non-technical explanation:
 * The bottom footer showing the CIPHER branding, Department of CSE tagline,
 * clickable links to all 5 mandatory pages + component library,
 * verified social media icon links, and the 2026 copyright notice.
 */

interface FooterProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentPage, onNavigate }) => {
  const { siteConfig } = useData();

  const pages = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'events', name: 'Events' },
    { id: 'team', name: 'Team' },
    { id: 'join', name: 'Join' },
    { id: 'components', name: 'Component Library' },
    { id: 'admin', name: 'Admin CMS' },
  ];

  return (
    <footer className="relative border-t border-[#123a17] bg-[#050705] py-14 font-mono">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start justify-between">
          {/* Left Branding */}
          <div className="md:col-span-5 flex flex-col items-start text-left">
            <div className="flex items-center gap-3">
              <img
                src="/images/cipher-logo.webp"
                alt="CIPHER Emblem"
                onError={handleImageError}
                className="h-9 w-auto object-contain drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]"
              />
              <span className="font-mono text-2xl font-bold tracking-wider text-[#00ff41] text-glow">
                CIPHER
              </span>
            </div>
            <span className="mt-2 text-xs text-[#6fae78] max-w-sm leading-relaxed">
              {siteConfig.fullName}
            </span>
            <span className="mt-1 text-[11px] text-[#2c7a3a]">
              {siteConfig.college}
            </span>
          </div>

          {/* Center Navigation Links (Clickable Prototype Flow) */}
          <div className="md:col-span-4 flex flex-col space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#00ff41]">
              // DIRECTORY_LINKS
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {pages.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onNavigate?.(p.id)}
                  className={`flex items-center gap-1 text-left transition-colors ${
                    currentPage === p.id
                      ? 'text-[#00ff41] font-semibold'
                      : 'text-[#c8f7d0]/70 hover:text-[#00ff41]'
                  }`}
                  data-cursor="lens"
                >
                  <ArrowUpRight size={12} className="text-[#00ff41]/50" />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Social Circular Icons */}
          <div className="md:col-span-3 flex flex-col items-start md:items-end space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#00ff41]">
              // CONNECT
            </span>
            <div className="flex items-center gap-3">
              {siteConfig.socialLinks.email && (
                <a
                  href={`mailto:${siteConfig.socialLinks.email}`}
                  aria-label="Contact via Email"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#123a17] bg-[#080d08] text-[#6fae78] transition-all duration-200 hover:border-[#00ff41] hover:text-[#00ff41] hover:shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:-translate-y-0.5"
                  data-cursor="lens"
                >
                  <Mail size={16} />
                </a>
              )}

              {siteConfig.socialLinks.linkedin && (
                <a
                  href={siteConfig.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CIPHER on LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#123a17] bg-[#080d08] text-[#6fae78] transition-all duration-200 hover:border-[#00ff41] hover:text-[#00ff41] hover:shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:-translate-y-0.5"
                  data-cursor="lens"
                >
                  <Linkedin size={16} />
                </a>
              )}

              {siteConfig.socialLinks.github && (
                <a
                  href={siteConfig.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CIPHER on GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#123a17] bg-[#080d08] text-[#6fae78] transition-all duration-200 hover:border-[#00ff41] hover:text-[#00ff41] hover:shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:-translate-y-0.5"
                  data-cursor="lens"
                >
                  <Github size={16} />
                </a>
              )}

              {siteConfig.socialLinks.instagram && (
                <a
                  href={siteConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CIPHER on Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#123a17] bg-[#080d08] text-[#6fae78] transition-all duration-200 hover:border-[#00ff41] hover:text-[#00ff41] hover:shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:-translate-y-0.5"
                  data-cursor="lens"
                >
                  <Instagram size={16} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Terminal Line */}
        <div className="mt-12 border-t border-[#123a17] pt-6 text-center font-mono text-xs text-[#2c7a3a]">
          <span>&gt; &copy; {siteConfig.copyrightYear} CIPHER SJEC. ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </footer>
  );
};
