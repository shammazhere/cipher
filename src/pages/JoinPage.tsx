import React, { useState, useMemo } from 'react';
import {
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Terminal,
  Zap,
  Award,
  Cpu,
  Sparkles,
  ArrowRight,
  Lock,
  Radio,
  Hash
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useSecureForm } from '../hooks/useSecureForm';
import { useToast } from '../context/ToastContext';
import { soundEffects } from '../utils/soundEffects';

/**
 * JoinPage Component (Page 5 of 5)
 * 
 * Non-technical explanation:
 * Interactive hacker recruitment terminal for CIPHER membership.
 * Takes only strictly required data (Callsign, USN, Email, Domain, optional payload)
 * and is styled like an authentic cyberpunk terminal infiltration portal with live cryptographic telemetry.
 */

export const JoinPage: React.FC = () => {
  const { siteConfig, addApplication } = useData();
  const { showToast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit,
    resetForm,
  } = useSecureForm({
    onSuccess: (cleanData) => {
      addApplication(cleanData);
      soundEffects.playSuccess();
      showToast({
        title: 'TRANSMISSION VERIFIED',
        message: 'Operative profile registered into CIPHER secure database.',
        type: 'success',
      });
    },
  });

  // Simulated live cryptographic hash checksum based on current form inputs
  const liveHash = useMemo(() => {
    const raw = `${formData.name}:${formData.usn}:${formData.email}:${formData.domain}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `0x${hex}7f9b2c${hex.slice(0, 4)}e1`;
  }, [formData.name, formData.usn, formData.email, formData.domain]);

  const faqs = [
    {
      tag: 'ELIGIBILITY',
      q: 'Who is eligible to apply for CIPHER?',
      a: 'All undergraduate students actively enrolled in the Department of Computer Science & Engineering at St. Joseph Engineering College (1st through 4th year) are eligible for membership.',
    },
    {
      tag: 'PREREQUISITES',
      q: 'Is prior programming experience required?',
      a: 'No prior experience required! We prioritize curiosity, consistency, and passion. Foundational workshops run alongside advanced hackathon engineering cohorts.',
    },
    {
      tag: 'SELECTION',
      q: 'What does the induction process involve?',
      a: 'After transmitting your encrypted registration, short friendly peer interactions are conducted with domain leads to align your technical passions with club projects.',
    },
    {
      tag: 'COMMITMENT',
      q: 'What is the anticipated weekly commitment?',
      a: 'Typically 2 to 4 hours weekly, fully scheduled around your semester examination timetable, internal assessments, and academic coursework.',
    },
  ];

  const perks = [
    {
      icon: Terminal,
      title: 'Lab & Hardware Rigs',
      desc: 'Access to department high-performance clusters, GPUs, and hardware hackathon testbeds.',
    },
    {
      icon: Zap,
      title: 'Hackathon Grants',
      desc: 'Travel allowances, contest registration fees, and project prototyping budgets.',
    },
    {
      icon: Award,
      title: 'VTU Activity Credits',
      desc: 'Officially endorsed departmental certificates and VTU activity points for your academic transcript.',
    },
    {
      icon: Cpu,
      title: 'Alumni Mentorship',
      desc: 'Direct code reviews and career guidance from CIPHER alumni working at tier-one tech firms.',
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 font-mono">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 space-y-16">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#00ff41]">
            <Radio size={14} className="text-[#00ff41] animate-pulse" />
            <span>// RECRUITMENT_PORTAL // CIPHER_NODE</span>
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-[#c8f7d0] text-glow">
            Join the CIPHER Network
          </h1>
          <p className="mt-3 font-mono text-sm sm:text-base text-[#6fae78] max-w-2xl leading-relaxed">
            Transmit your candidate dossier to join the premier student computing association of St. Joseph Engineering College.
          </p>
        </div>

        {/* Member Perks & Benefits Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#00ff41]">
            <Sparkles size={14} />
            <span>MEMBER PRIVILEGES &amp; ADVANTAGES</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {perks.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div
                  key={idx}
                  className="group relative rounded-xl border border-[#123a17] bg-[#080d08]/80 p-5 transition-all duration-300 hover:border-[#00ff41] hover:bg-[#0e1613] hover:shadow-[0_0_25px_rgba(0,255,65,0.18)]"
                >
                  <span className="absolute top-2 right-2 text-[10px] font-mono text-[#2c7a3a] group-hover:text-[#00ff41]">
                    0{idx + 1}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#123a17] bg-[#00ff41]/5 text-[#00ff41] mb-3 group-hover:border-[#00ff41] transition-colors">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-display text-sm font-bold text-[#c8f7d0] group-hover:text-[#00ff41] transition-colors">
                    {perk.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#6fae78] leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recruitment Pipeline Tracker */}
        <div className="rounded-xl border border-[#123a17] bg-[#080d08]/60 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#00ff41]">
            <span className="h-2 w-2 rounded-full bg-[#00ff41] animate-ping" />
            <span className="uppercase font-bold tracking-wider">CURRENT CYCLE: 2025-26 RECRUITMENT</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6fae78]">
            <span className="rounded bg-[#00ff41]/10 border border-[#00ff41] px-2.5 py-1 text-[#00ff41] font-semibold">
              1. REGISTRATION [ACTIVE]
            </span>
            <ArrowRight size={12} className="text-[#2c7a3a]" />
            <span className="rounded bg-[#050705] border border-[#123a17] px-2.5 py-1 text-[#6fae78]">
              2. PEER INTERACTION
            </span>
            <ArrowRight size={12} className="text-[#2c7a3a]" />
            <span className="rounded bg-[#050705] border border-[#123a17] px-2.5 py-1 text-[#6fae78]">
              3. ONBOARDING &amp; PASSKEY
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Hacker Terminal Recruitment Portal */}
          <div className="lg:col-span-7 rounded-2xl border border-[#00ff41]/50 bg-[#080d08] shadow-[0_0_50px_rgba(0,255,65,0.2)] overflow-hidden">
            {/* Terminal Window Header Bar */}
            <div className="flex items-center justify-between border-b border-[#123a17] bg-[#050705] px-4 py-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]/80 border border-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]/80 border border-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]/80 border border-[#27c93f]" />
                <span className="ml-2 text-[11px] text-[#6fae78] font-mono hidden sm:inline">
                  root@cipher-node: ~ /bin/recruit_operative.sh
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-[#00ff41]">
                <Lock size={12} />
                <span>TLS_1.3 // 256-BIT</span>
              </div>
            </div>

            {isSuccess ? (
              /* Success Terminal Clearance Badge */
              <div className="p-8 sm:p-12 text-center space-y-5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41] shadow-[0_0_30px_#00ff41]">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#00ff41]">
                    // STATUS: 200 OK
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#c8f7d0] text-glow mt-1">
                    Operative Dossier Transmitted
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#6fae78] max-w-md mx-auto leading-relaxed">
                  Your registration packet has been securely logged with cryptographic checksum <code className="text-[#00ff41]">{liveHash}</code>. The executive council will notify your official college channel.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded border border-[#00ff41] bg-[#00ff41] px-6 py-2.5 text-xs font-bold uppercase text-[#050705] hover:bg-[#00ff66] transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                  >
                    TRANSMIT ANOTHER PROFILE
                  </button>
                </div>
              </div>
            ) : (
              /* Hacker Terminal Form */
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 font-mono">
                {/* Protocol Info */}
                <div className="flex items-center justify-between text-[11px] text-[#6fae78] pb-2 border-b border-[#123a17]">
                  <span className="flex items-center gap-1.5 text-[#00ff41]">
                    <Terminal size={13} />
                    <span>// INFILTRATION_REGISTER</span>
                  </span>
                  <span>FIELDS MARKED * ARE MANDATORY</span>
                </div>

                {errors.general && (
                  <div className="flex items-center gap-2 p-3 rounded border border-[#ff5f56]/40 bg-[#ff5f56]/10 text-xs text-[#ff5f56]">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* Anti-Bot Security Honeypot */}
                <input
                  type="text"
                  name="_honeypot"
                  value={formData._honeypot}
                  onChange={(e) => handleChange('_honeypot', e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden opacity-0 absolute -top-9999px -left-9999px pointer-events-none"
                />

                {/* 1. Full Name / Callsign */}
                <div className="space-y-1">
                  <label className="flex items-center justify-between text-xs text-[#c8f7d0]">
                    <span>&gt; ENTER_CALLSIGN [FULL NAME] *</span>
                    <span className="text-[10px] text-[#2c7a3a]">REQUIRED</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] transition-colors focus:border-[#00ff41] focus:outline-none focus:shadow-[0_0_12px_rgba(0,255,65,0.2)]"
                  />
                  {errors.name && (
                    <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-1">
                      <AlertCircle size={12} /> {errors.name}
                    </span>
                  )}
                </div>

                {/* 2. College USN & Semester in compact grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="flex items-center justify-between text-xs text-[#c8f7d0]">
                      <span>&gt; VERIFY_USN [COLLEGE USN] *</span>
                      <span className="text-[10px] text-[#2c7a3a]">REQUIRED</span>
                    </label>
                    <input
                      type="text"
                      value={formData.usn}
                      onChange={(e) => handleChange('usn', e.target.value.toUpperCase())}
                      placeholder="4SO22CS..."
                      className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] uppercase transition-colors focus:border-[#00ff41] focus:outline-none focus:shadow-[0_0_12px_rgba(0,255,65,0.2)]"
                    />
                    {errors.usn && (
                      <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-1">
                        <AlertCircle size={12} /> {errors.usn}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center justify-between text-xs text-[#c8f7d0]">
                      <span>&gt; ACADEMIC_STAGE [SEMESTER] *</span>
                      <span className="text-[10px] text-[#2c7a3a]">REQUIRED</span>
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) => handleChange('semester', e.target.value)}
                      className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none"
                    >
                      <option value="1st Semester">1st Semester (Junior)</option>
                      <option value="2nd Semester">2nd Semester (Junior)</option>
                      <option value="3rd Semester">3rd Semester (Sophomore)</option>
                      <option value="4th Semester">4th Semester (Sophomore)</option>
                      <option value="5th Semester">5th Semester (Senior)</option>
                      <option value="6th Semester">6th Semester (Senior)</option>
                      <option value="7th/8th Semester">7th / 8th Semester (Final Year)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Comms Link / Student Email */}
                <div className="space-y-1">
                  <label className="flex items-center justify-between text-xs text-[#c8f7d0]">
                    <span>&gt; SECURE_COMMS_CHANNEL [STUDENT EMAIL] *</span>
                    <span className="text-[10px] text-[#2c7a3a]">REQUIRED</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="student@sjec.ac.in"
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] transition-colors focus:border-[#00ff41] focus:outline-none focus:shadow-[0_0_12px_rgba(0,255,65,0.2)]"
                  />
                  {errors.email && (
                    <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-1">
                      <AlertCircle size={12} /> {errors.email}
                    </span>
                  )}
                </div>

                {/* 4. Domain Preference */}
                <div className="space-y-1">
                  <label className="flex items-center justify-between text-xs text-[#c8f7d0]">
                    <span>&gt; ASSIGN_OPERATIONAL_DOMAIN *</span>
                    <span className="text-[10px] text-[#2c7a3a]">REQUIRED</span>
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => handleChange('domain', e.target.value)}
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none"
                  >
                    <option value="Cybersecurity & CTFs">Cybersecurity &amp; CTFs (PenTesting, Cryptography, Forensics)</option>
                    <option value="Full-Stack Engineering">Full-Stack Engineering (Web, Cloud &amp; Distributed Systems)</option>
                    <option value="Machine Learning & AI">Machine Learning &amp; AI (Deep Learning, Vision, LLMs)</option>
                    <option value="Events & Tactical Operations">Events &amp; Tactical Operations (Symposiums &amp; Design)</option>
                  </select>
                </div>

                {/* 5. Optional Quick Payload / GitHub profile */}
                <div className="space-y-1">
                  <label className="flex items-center justify-between text-xs text-[#c8f7d0]">
                    <span>&gt; PAYLOAD / GITHUB_VECTOR / NOTES</span>
                    <span className="text-[10px] text-[#2c7a3a]">OPTIONAL</span>
                  </label>
                  <input
                    type="text"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="e.g. github.com/username or topics you want to build"
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] transition-colors focus:border-[#00ff41] focus:outline-none"
                  />
                  {errors.message && (
                    <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-1">
                      <AlertCircle size={12} /> {errors.message}
                    </span>
                  )}
                </div>

                {/* Live Cryptographic Telemetry Box */}
                <div className="flex items-center justify-between rounded border border-[#123a17] bg-[#050705] p-2.5 text-[11px] text-[#6fae78]">
                  <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis">
                    <Hash size={13} className="text-[#00ff41] shrink-0" />
                    <span className="text-[10px] text-[#2c7a3a] uppercase shrink-0">DIGEST:</span>
                    <code className="text-[#00ff41] truncate">{liveHash}</code>
                  </div>
                  <span className="text-[10px] uppercase text-[#00ff41] shrink-0 font-bold ml-2">READY</span>
                </div>

                {/* Terminal Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#00ff41] py-3.5 text-xs font-bold uppercase text-[#050705] hover:bg-[#00ff66] transition-all hover:shadow-[0_0_25px_rgba(0,255,65,0.45)] disabled:opacity-50"
                  data-cursor="lens"
                >
                  {isSubmitting ? (
                    <span>TRANSMITTING ENCRYPTED DOSSIER...</span>
                  ) : (
                    <>
                      <span>EXECUTE TRANSMISSION // SECURE POST</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: Interactive FAQs & Direct Contact Desk */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-xl border border-[#123a17] bg-[#080d08] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-[#00ff41]">
                <HelpCircle size={20} />
                <h3 className="font-display text-lg font-bold text-[#c8f7d0]">
                  Applicant FAQs
                </h3>
              </div>

              {/* Interactive Accordion */}
              <div className="space-y-3 pt-2">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? 'border-[#00ff41] bg-[#0e1613]'
                          : 'border-[#123a17] bg-[#050705] hover:border-[#1e5225]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="flex w-full items-center justify-between p-4 text-left font-mono text-xs text-[#c8f7d0] transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] text-[#00ff41] font-bold">
                            [{faq.tag}]
                          </span>
                          <span className="font-bold">{faq.q}</span>
                        </div>
                        <ChevronDown
                          size={15}
                          className={`text-[#6fae78] transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#00ff41]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 font-mono text-xs text-[#6fae78] leading-relaxed border-t border-[#123a17] pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department Desk Telemetry */}
            <div className="rounded-xl border border-[#123a17] bg-[#080d08] p-6 text-xs text-[#6fae78] space-y-3 font-mono">
              <span className="text-[#00ff41] uppercase tracking-wider font-bold block">
                DEPARTMENT CONTACT DESK
              </span>
              <p>St. Joseph Engineering College, Vamanjoor, Mangaluru, Karnataka 575028</p>
              <div className="pt-2 border-t border-[#123a17] text-[#c8f7d0]">
                Email: <code className="text-[#00ff41]">cipher@sjec.ac.in</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
