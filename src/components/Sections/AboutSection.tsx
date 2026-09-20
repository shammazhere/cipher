import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Shield, Users, Briefcase } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { CursorPhotoTrail } from './CursorPhotoTrail';

/**
 * About Section Component
 * 
 * Non-technical explanation:
 * Explains what CIPHER is, what the club does, its 4 primary focus areas
 * (Skill Building, Leadership, Events, Industry Readiness), and embeds the
 * interactive Photo Trail on the right.
 */

export const AboutSection: React.FC = () => {
  const { siteConfig, domains } = useData();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code2 size={22} className="text-[#00ff41]" />;
      case 'shield':
        return <Shield size={22} className="text-[#00ff41]" />;
      case 'users':
        return <Users size={22} className="text-[#00ff41]" />;
      case 'briefcase':
      default:
        return <Briefcase size={22} className="text-[#00ff41]" />;
    }
  };

  return (
    <section id="about" className="relative border-t border-[#123a17] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[#00ff41]">
          <span>// ABOUT</span>
          <span className="text-[#2c7a3a] hidden sm:inline">^Ω# #+&gt;_ &lt;*&#123;</span>
        </div>

        <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#c8f7d0] text-glow">
          Who we are
        </h2>

        {/* Split Layout: Left Description & Right Photo Trail */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left: Text & Pillars */}
          <div className="lg:col-span-6 space-y-8">
            <p className="font-mono text-sm leading-relaxed text-[#6fae78] sm:text-base">
              {siteConfig.aboutText}
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className="group rounded-lg border border-[#123a17] bg-[#080d08]/70 p-5 transition-all duration-300 hover:border-[#00ff41] hover:bg-[#0e1613] hover:shadow-[0_0_20px_rgba(0,255,65,0.15)]"
                  data-cursor="lens"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="rounded-md border border-[#123a17] bg-[#050705] p-2.5">
                      {getIcon(domain.icon)}
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/30">
                      {domain.sessions} SESSIONS
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-[#c8f7d0] group-hover:text-[#00ff41] transition-colors">
                    {domain.title}
                  </h3>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-[#6fae78]">
                    {domain.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Cursor Photo Trail */}
          <div className="lg:col-span-6">
            <CursorPhotoTrail />
          </div>
        </div>
      </div>
    </section>
  );
};
