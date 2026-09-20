import React from 'react';
import { Mail, Linkedin, Github, Instagram } from 'lucide-react';
import { useData } from '../../context/DataContext';

/**
 * Footer Component
 * 
 * Non-technical explanation:
 * The bottom footer showing the CIPHER branding, Department of CSE tagline,
 * verified social media icon links, and the 2026 copyright notice.
 */

export const Footer: React.FC = () => {
  const { siteConfig } = useData();

  return (
    <footer className="relative border-t border-[#123a17] bg-[#050705] py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Branding */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-mono text-2xl font-bold tracking-wider text-[#00ff41] text-glow">
              CIPHER
            </span>
            <span className="mt-1 font-mono text-xs text-[#6fae78]">
              {siteConfig.fullName}
            </span>
            <span className="font-mono text-[11px] text-[#2c7a3a]">
              {siteConfig.college}
            </span>
          </div>

          {/* Right Social Circular Icons */}
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

        {/* Bottom Copyright Terminal Line */}
        <div className="mt-10 border-t border-[#123a17] pt-6 text-center font-mono text-xs text-[#2c7a3a]">
          <span>&gt; &copy; {siteConfig.copyrightYear} CIPHER SJEC. ALL RIGHTS RESERVED.</span>
        </div>
      </div>
    </footer>
  );
};
