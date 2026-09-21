import React from 'react';
import { Mail, Linkedin, Github, Instagram } from 'lucide-react';

/**
 * Footer Component
 * 
 * Non-technical explanation:
 * Bottom footer matching the reference design:
 * - Left: Glowing CIPHER heading and Department CSE tagline.
 * - Right: Circular glowing social icon links (Mail, LinkedIn, GitHub, Instagram).
 * - Bottom: Monospace copyright attribution line.
 */

const SOCIAL_LINKS = [
  {
    label: 'Email',
    href: 'mailto:cipher@sjec.ac.in',
    icon: Mail,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/ciphersjec',
    icon: Linkedin,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/ciphersjec',
    icon: Github,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ciphersjec?stkn=MmRlZjNzMW1tNjZ2',
    icon: Instagram,
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[#050705] py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-5 md:flex-row">
        {/* Left Branding */}
        <div className="text-center md:text-left">
          <div className="font-display text-2xl text-[var(--matrix)] text-glow">
            CIPHER
          </div>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            Student Association · Computer Science &amp; Engineering
          </p>
        </div>

        {/* Right Circular Social Links */}
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.label === 'Email' ? undefined : '_blank'}
                rel={link.label === 'Email' ? undefined : 'noopener noreferrer'}
                aria-label={link.label}
                data-cursor="lens"
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-[var(--matrix)] hover:bg-[var(--matrix)]/10 hover:text-[var(--matrix)] hover:shadow-[0_0_20px_rgba(0,255,65,0.25)]"
              >
                <Icon
                  size={21}
                  strokeWidth={1.7}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </a>
            );
          })}
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="mx-auto mt-8 max-w-6xl px-5">
        <div className="border-t border-[var(--border)] pt-6 text-center font-mono text-xs text-[var(--matrix-dim)]">
          <span>&gt; &copy; {new Date().getFullYear()} CIPHER SJEC.</span>
        </div>
      </div>
    </footer>
  );
};
