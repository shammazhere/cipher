import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Shield, Users, Briefcase, GraduationCap, Compass, Target, Sparkles, Terminal, Activity } from 'lucide-react';
import { useData } from '../context/DataContext';
import { CursorPhotoTrail } from '../components/Sections/CursorPhotoTrail';

/**
 * AboutPage Component (Page 2 of 5)
 * 
 * Non-technical explanation:
 * Dedicated standalone About page describing CIPHER's origin,
 * Department of Computer Science & Engineering affiliation,
 * core mission, student focus domains, and faculty mentorship.
 * Enhanced with animated Cyber Metrics HUD and focus chips.
 */

export const AboutPage: React.FC = () => {
  const { siteConfig, domains } = useData();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code2 size={24} className="text-[#00ff41]" />;
      case 'shield':
        return <Shield size={24} className="text-[#00ff41]" />;
      case 'users':
        return <Users size={24} className="text-[#00ff41]" />;
      case 'briefcase':
      default:
        return <Briefcase size={24} className="text-[#00ff41]" />;
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
    <div className="min-h-screen pt-28 pb-24 font-mono">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 space-y-20">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#00ff41]">
            <span>// ABOUT // CIPHER_ORIGINS</span>
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-[#c8f7d0] text-glow">
            Who We Are
          </h1>
          <p className="mt-4 font-mono text-base text-[#6fae78] max-w-3xl leading-relaxed">
            The official Student Association of the Department of Computer Science &amp; Engineering at St. Joseph Engineering College (SJEC), Mangaluru.
          </p>
        </div>

        {/* Cyber Department Metrics HUD */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative overflow-hidden rounded-xl border border-[#123a17] bg-[#080d08]/85 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#00ff41]/60 hover:shadow-[0_0_25px_rgba(0,255,65,0.15)] group"
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

        {/* Narrative & Photo Trail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-sm leading-relaxed text-[#c8f7d0]/90">
            <p className="font-mono text-base text-[#00ff41]">
              "Bridging academic theory and practical engineering through peer-led innovation."
            </p>
            <p>
              {siteConfig.aboutText}
            </p>
            <p>
              Founded to empower engineering undergraduates, CIPHER organizes hands-on workshops, technical symposiums, competitive coding bootcamps, and hackathons like Build Blazer. We operate as an autonomous, student-run organization guided by experienced departmental faculty.
            </p>
          </div>

          <div className="lg:col-span-5">
            <CursorPhotoTrail />
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="relative rounded-xl border border-[#123a17] bg-[#080d08] p-8 space-y-4 hover:border-[#00ff41]/50 transition-colors">
            <span className="absolute top-3 right-3 text-[10px] text-[#00ff41]/40">[ 01 ]</span>
            <div className="flex items-center gap-3 text-[#00ff41]">
              <Target size={24} />
              <h2 className="font-display text-2xl font-bold text-[#c8f7d0]">
                Our Mission
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6fae78] leading-relaxed">
              To cultivate technical agility, leadership ethics, and collaborative development skills by providing every CSE student with mentorship, production-grade project experience, and exposure to cutting-edge technologies.
            </p>
          </div>

          <div className="relative rounded-xl border border-[#123a17] bg-[#080d08] p-8 space-y-4 hover:border-[#00ff41]/50 transition-colors">
            <span className="absolute top-3 right-3 text-[10px] text-[#00ff41]/40">[ 02 ]</span>
            <div className="flex items-center gap-3 text-[#00ff41]">
              <Compass size={24} />
              <h2 className="font-display text-2xl font-bold text-[#c8f7d0]">
                Our Vision
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6fae78] leading-relaxed">
              To be recognized as a premier student association in regional engineering education, inspiring innovators who shape industry standards and contribute meaningfully to the global open-source and computing ecosystem.
            </p>
          </div>
        </div>

        {/* The 4 Focus Domains with Tech Chips & Progress Meters */}
        <div className="space-y-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#00ff41]">
              // PILLARS //
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#c8f7d0]">
              Key Association Domains
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain, index) => {
              const pills = domainPills[domain.id] || ['Interactive', 'Workshops'];
              const progressPercent = index === 0 ? 92 : index === 1 ? 85 : index === 2 ? 78 : 88;

              return (
                <div
                  key={domain.id}
                  className="group relative rounded-xl border border-[#123a17] bg-[#080d08] p-6 space-y-4 hover:border-[#00ff41] hover:shadow-[0_0_25px_rgba(0,255,65,0.2)] hover:-translate-y-1 transition-all duration-300"
                  data-cursor="lens"
                >
                  <span className="absolute top-2 left-2 text-[8px] text-[#00ff41]/40">+</span>
                  <span className="absolute top-2 right-2 text-[8px] text-[#00ff41]/40">+</span>

                  <div className="flex items-center justify-between">
                    <div className="rounded-lg border border-[#123a17] bg-[#050705] p-3 transition-colors group-hover:border-[#00ff41]/60">
                      {getIcon(domain.icon)}
                    </div>
                    <span className="text-[10px] font-bold text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded border border-[#00ff41]/30">
                      {domain.sessions} SESSIONS
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#c8f7d0] group-hover:text-[#00ff41] transition-colors">
                    {domain.title}
                  </h3>

                  <p className="text-xs text-[#6fae78] leading-relaxed">
                    {domain.desc}
                  </p>

                  {/* Tech Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded bg-[#050705] border border-[#123a17] px-2 py-0.5 text-[9px] text-[#6fae78] group-hover:border-[#00ff41]/40 group-hover:text-[#c8f7d0] transition-colors"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>

                  {/* Progress Meter */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[9px] text-[#2c7a3a]">
                      <span>MODULES COVERED</span>
                      <span className="text-[#00ff41]">{progressPercent}%</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-[#050705] overflow-hidden border border-[#123a17]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2c7a3a] to-[#00ff41]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Advisory & Mentorship */}
        <div className="rounded-2xl border border-[#123a17] bg-[#080d08] p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 text-[#00ff41]">
            <GraduationCap size={26} />
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#c8f7d0]">
              Department Advisory Board
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6fae78] max-w-3xl leading-relaxed">
            CIPHER is mentored by distinguished faculty from the Department of Computer Science &amp; Engineering, SJEC.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="rounded-lg border border-[#123a17] bg-[#050705] p-5">
              <span className="text-[10px] font-bold text-[#00ff41] uppercase tracking-wider">Head of Department</span>
              <h4 className="font-display text-base font-bold text-[#c8f7d0] mt-1">Dr. Melwyn D'Souza</h4>
              <p className="text-[11px] text-[#6fae78] mt-1">Department of CSE, SJEC</p>
            </div>
            <div className="rounded-lg border border-[#123a17] bg-[#050705] p-5">
              <span className="text-[10px] font-bold text-[#00ff41] uppercase tracking-wider">Faculty Coordinator</span>
              <h4 className="font-display text-base font-bold text-[#c8f7d0] mt-1">Ms. Nisha J Roche</h4>
              <p className="text-[11px] text-[#6fae78] mt-1">Assistant Professor, CSE</p>
            </div>
            <div className="rounded-lg border border-[#123a17] bg-[#050705] p-5">
              <span className="text-[10px] font-bold text-[#00ff41] uppercase tracking-wider">Faculty Coordinator</span>
              <h4 className="font-display text-base font-bold text-[#c8f7d0] mt-1">Ms. Jaishma K</h4>
              <p className="text-[11px] text-[#6fae78] mt-1">Assistant Professor, CSE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
