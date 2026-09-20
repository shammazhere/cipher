import React, { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Search,
  CheckCircle2,
  AlertCircle,
  Code2,
  Shield,
  Send,
  ExternalLink,
  ChevronRight,
  Eye,
} from 'lucide-react';

/**
 * Component Library Showcase Page
 * 
 * Non-technical explanation:
 * This page fulfills the hackathon requirement for a "component library file".
 * It displays all the reusable building blocks used across the CIPHER website:
 * buttons, cards, form inputs, status tags, and navigation states.
 */

export const ComponentLibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [demoInput, setDemoInput] = useState('sample text');

  return (
    <div className="min-h-screen bg-[#050705] text-[#c8f7d0] font-mono pt-28 pb-20 px-6 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Header */}
        <div className="border-b border-[#123a17] pb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#00ff41]">
            <span>CIPHER // DESIGN SYSTEM</span>
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold text-[#c8f7d0] text-glow">
            Component Library &amp; Style Guide
          </h1>
          <p className="mt-3 font-mono text-sm text-[#6fae78] max-w-2xl leading-relaxed">
            Standardized reusable UI tokens, cybernetic buttons, card containers, form controls, and interactive states matching the CIPHER brand identity.
          </p>
        </div>

        {/* 1. BUTTONS */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-[#00ff41] flex items-center gap-2">
            <span>01. Button System</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-xl border border-[#123a17] bg-[#080d08]">
            {/* Primary CTA */}
            <div className="space-y-2">
              <span className="text-[11px] text-[#6fae78]">Primary Solid CTA</span>
              <div>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded bg-[#00ff41] px-5 py-2.5 text-xs font-bold uppercase text-[#050705] hover:bg-[#00ff66] hover:shadow-[0_0_20px_rgba(0,255,65,0.5)] transition-all"
                >
                  <span>JOIN CIPHER</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Outline Button */}
            <div className="space-y-2">
              <span className="text-[11px] text-[#6fae78]">Secondary Outline</span>
              <div>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded border border-[#123a17] bg-[#080d08] px-5 py-2.5 text-xs font-semibold uppercase text-[#00ff41] hover:border-[#00ff41] hover:bg-[#00ff41]/10 transition-all"
                >
                  <Calendar size={14} />
                  <span>EXPLORE EVENTS</span>
                </button>
              </div>
            </div>

            {/* Ghost / Action */}
            <div className="space-y-2">
              <span className="text-[11px] text-[#6fae78]">Ghost Terminal Action</span>
              <div>
                <button
                  type="button"
                  className="font-mono text-xs uppercase tracking-wider text-[#00ff41] hover:text-glow flex items-center gap-1.5"
                >
                  <span>VIEW GALLERY</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>

            {/* Disabled State */}
            <div className="space-y-2">
              <span className="text-[11px] text-[#6fae78]">Disabled State</span>
              <div>
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-2 rounded bg-[#123a17] px-5 py-2.5 text-xs font-bold uppercase text-[#6fae78] opacity-50 cursor-not-allowed"
                >
                  <span>DISABLED</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CARD CONTAINERS */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-[#00ff41]">
            02. Card Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Domain Pillar Card */}
            <div className="rounded-xl border border-[#123a17] bg-[#080d08] p-6 hover:border-[#00ff41] hover:shadow-[0_0_25px_rgba(0,255,65,0.2)] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-lg border border-[#123a17] bg-[#050705] text-[#00ff41]">
                  <Code2 size={20} />
                </div>
                <span className="text-[10px] bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] px-2 py-0.5 rounded font-bold">
                  5 SESSIONS
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-[#c8f7d0]">
                Technical Skill Building
              </h3>
              <p className="mt-2 text-xs text-[#6fae78] leading-relaxed">
                Hands-on workshops, coding sessions, and tech talks turning theory into working software.
              </p>
            </div>

            {/* Event Showcase Card */}
            <div className="rounded-xl border border-[#123a17] bg-[#080d08] p-6 hover:border-[#00ff41] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-[#00ff41] mb-3">
                  <span className="font-bold">BRANCH GALA</span>
                  <span className="text-[#6fae78]">29 OCT 2025</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#c8f7d0]">
                  Lumière — The Gala
                </h3>
                <p className="mt-2 text-xs text-[#6fae78] line-clamp-2">
                  The CSE branch entry programme at Kalam Auditorium, themed "Where Glam Meets Glow."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#123a17] flex items-center justify-between text-xs text-[#00ff41]">
                <span>VIEW GALLERY</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Past Activity Card */}
            <div className="rounded-xl border border-[#123a17] bg-[#080d08] p-5 flex items-center justify-between hover:border-[#00ff41] transition-all">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#00ff41]">01</span>
                <span className="text-xs text-[#c8f7d0] font-medium">
                  Applied Machine Learning
                </span>
              </div>
              <ExternalLink size={14} className="text-[#6fae78]" />
            </div>
          </div>
        </section>

        {/* 3. NAVIGATION STATES */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-[#00ff41]">
            03. Navigation States
          </h2>
          <div className="p-6 rounded-xl border border-[#123a17] bg-[#080d08] space-y-4">
            <span className="text-xs text-[#6fae78]">Interactive Tab / Nav Link Switcher</span>
            <div className="flex flex-wrap gap-3">
              {['Home', 'About', 'Events', 'Team', 'Join', 'Admin'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-4 py-2 rounded text-xs font-semibold transition-all ${
                    activeTab === tab.toLowerCase()
                      ? 'bg-[#00ff41] text-[#050705] shadow-[0_0_15px_rgba(0,255,65,0.4)]'
                      : 'border border-[#123a17] bg-[#050705] text-[#6fae78] hover:text-[#00ff41] hover:border-[#00ff41]/50'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. FORM FIELDS & SECURITY CONTROLS */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-[#00ff41]">
            04. Form Input Controls (Sanitized)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl border border-[#123a17] bg-[#080d08]">
            {/* Standard Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#c8f7d0] uppercase">Default Input</label>
              <input
                type="text"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                className="w-full rounded border border-[#123a17] bg-[#050705] px-3.5 py-2.5 text-xs text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none"
              />
            </div>

            {/* Validated State */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#c8f7d0] uppercase">Valid Field</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value="4SO22CS099"
                  className="w-full rounded border border-[#00ff41]/60 bg-[#050705] px-3.5 py-2.5 text-xs text-[#00ff41] focus:outline-none"
                />
                <CheckCircle2 size={14} className="absolute right-3 top-3 text-[#00ff41]" />
              </div>
            </div>

            {/* Error State */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#c8f7d0] uppercase">Invalid Field</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value="invalid-email-format"
                  className="w-full rounded border border-[#ff5f56]/60 bg-[#050705] px-3.5 py-2.5 text-xs text-[#ff5f56] focus:outline-none"
                />
                <AlertCircle size={14} className="absolute right-3 top-3 text-[#ff5f56]" />
              </div>
            </div>
          </div>
        </section>

        {/* 5. BRANDING BADGES & GLOW TOKENS */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-[#00ff41]">
            05. Badges, Indicators &amp; Glows
          </h2>
          <div className="flex flex-wrap gap-4 items-center p-6 rounded-xl border border-[#123a17] bg-[#080d08]">
            <span className="flex items-center gap-2 rounded-full border border-[#00ff41]/40 bg-[#00ff41]/10 px-3.5 py-1 text-xs text-[#00ff41]">
              <span className="h-2 w-2 rounded-full bg-[#00ff41] animate-ping" />
              SYSTEM_ONLINE
            </span>

            <span className="font-mono text-xs text-[#00ff41] text-glow">
              .text-glow: Neon Illumination
            </span>

            <span className="font-mono text-xs text-[#00ff41] text-glow-strong">
              .text-glow-strong: High Intensity
            </span>

            <span className="border border-[#123a17] bg-[#050705] px-3 py-1 rounded text-xs text-[#6fae78]">
              bg-scanlines: CRT Monitor Effect
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
