import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Shield, Users, Briefcase, Sparkles, Terminal, Activity } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { CursorPhotoTrail } from './CursorPhotoTrail';

/**
 * About Section Component
 * 
 * Non-technical explanation:
 * Explains what CIPHER is, what the club does, its 4 primary focus areas
 * (Skill Building, Leadership, Events, Industry Readiness), and embeds the
 * interactive Photo Trail on the right.
 * Features an animated Cyber Metrics HUD and technology focus chips.
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

  const domainPills: Record<string, string[]> = {
    'dev': ['Full-Stack', 'APIs', 'React', 'Docker'],
    'cyber': ['Ethical Hacking', 'CTF', 'Cryptography'],
    'community': ['Workshops', 'Mentorship', 'Open Source'],
    'career': ['Interviews', 'Resumes', 'Industry Visits'],
  };

  const stats = [
    { value: '500+', label: 'Active Members', sub: 'CSE DEPARTMENT', icon: <Users size={16} /> },
    { value: '17+', label: 'Past Workshops', sub: 'HANDS-ON CODING', icon: <Terminal size={16} /> },
    { value: '04', label: 'Core Domains', sub: 'TECHNICAL PILLARS', icon: <Sparkles size={16} /> },
    { value: '100%', label: 'Student-Led', sub: 'AUTONOMOUS BODY', icon: <Activity size={16} /> },
  ];

  return (
    <section id="about" className="relative border-t border-[#123a17] py-24 md:py-32 font-mono">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 space-y-16">
        {/* Section Header */}
        <div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#00ff41]">
            <span>// ABOUT</span>
            <span className="text-[#2c7a3a] hidden sm:inline">&gt;&gt; IDENTITY &amp; DOMAINS</span>
          </div>

          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#c8f7d0] text-glow">
            Who we are
          </h2>
        </div>

        {/* 1. Cyber Department Metrics HUD */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative overflow-hidden rounded-xl border border-[#123a17] bg-[#080d08]/80 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#00ff41]/60 hover:shadow-[0_0_25px_rgba(0,255,65,0.15)] group"
            >
              <div className="absolute top-0 right-0 h-10 w-10 translate-x-3 -translate-y-3 rounded-full bg-[#00ff41]/5 blur-md group-hover:bg-[#00ff41]/15 transition-all" />
              <div className="flex items-center justify-between text-xs text-[#6fae78] mb-2">
                <span className="text-[10px] tracking-wider text-[#2c7a3a]">{stat.sub}</span>
                <span className="text-[#00ff41]">{stat.icon}</span>
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-[#00ff41] text-glow">
                {stat.value}
              </div>
              <div className="text-xs text-[#c8f7d0] mt-1 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 2. Split Layout: Left Narrative & Right Interactive Photo Trail */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left: Text & Pillars */}
          <div className="lg:col-span-6 space-y-8">
            <p className="text-sm leading-relaxed text-[#6fae78] sm:text-base">
              {siteConfig.aboutText}
            </p>

            {/* 4 Pillars Grid with Tech Chips & Progress Meters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {domains.map((domain, index) => {
                const pills = domainPills[domain.id] || ['Interactive', 'Workshops'];
                const progressPercent = index === 0 ? 92 : index === 1 ? 85 : index === 2 ? 78 : 88;

                return (
                  <div
                    key={domain.id}
                    className="group relative rounded-xl border border-[#123a17] bg-[#080d08]/85 p-5 transition-all duration-300 hover:border-[#00ff41] hover:bg-[#0c140d] hover:shadow-[0_0_25px_rgba(0,255,65,0.2)] hover:-translate-y-1"
                    data-cursor="lens"
                  >
                    {/* Corner Reticle Markers */}
                    <span className="absolute top-2 left-2 text-[8px] text-[#00ff41]/40">+</span>
                    <span className="absolute top-2 right-2 text-[8px] text-[#00ff41]/40">+</span>

                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-lg border border-[#123a17] bg-[#050705] p-2.5 transition-colors group-hover:border-[#00ff41]/60">
                        {getIcon(domain.icon)}
                      </div>
                      <span className="text-[10px] font-semibold text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/30">
                        {domain.sessions} SESSIONS
                      </span>
                    </div>

                    <h3 className="font-display text-base font-bold text-[#c8f7d0] group-hover:text-[#00ff41] transition-colors">
                      {domain.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-[#6fae78]">
                      {domain.desc}
                    </p>

                    {/* Interactive Tech Chips */}
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                      {pills.map((pill) => (
                        <span
                          key={pill}
                          className="rounded bg-[#050705] border border-[#123a17] px-2 py-0.5 text-[9px] text-[#6fae78] group-hover:border-[#00ff41]/40 group-hover:text-[#c8f7d0] transition-colors"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>

                    {/* Animated Progress Meter */}
                    <div className="mt-3 space-y-1 pt-1">
                      <div className="flex justify-between text-[9px] text-[#2c7a3a]">
                        <span>CURRICULUM ACTIVE</span>
                        <span className="text-[#00ff41]">{progressPercent}%</span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-[#050705] overflow-hidden border border-[#123a17]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#2c7a3a] to-[#00ff41] transition-all duration-500 group-hover:shadow-[0_0_8px_#00ff41]"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
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
