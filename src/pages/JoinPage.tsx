import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Mail,
  MapPin,
  ChevronDown,
  Terminal,
  Zap,
  Award,
  Cpu,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useSecureForm } from '../hooks/useSecureForm';
import { useToast } from '../context/ToastContext';
import { soundEffects } from '../utils/soundEffects';

/**
 * JoinPage Component (Page 5 of 5)
 * 
 * Non-technical explanation:
 * Dedicated standalone application and contact page.
 * Powered by the useSecureForm hook for XSS protection, anti-bot honeypot filtering,
 * USN/email validation, and spam rate-limiting.
 * Features an interactive FAQ accordion, member perks matrix, and recruitment timeline.
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
        title: 'APPLICATION TRANSMITTED',
        message: 'Your candidate profile has been recorded in the CIPHER registry.',
        type: 'success',
      });
    },
  });

  const faqs = [
    {
      tag: 'ELIGIBILITY',
      q: 'Who is eligible to apply for CIPHER?',
      a: 'All undergraduate students actively enrolled in the Department of Computer Science & Engineering at St. Joseph Engineering College (1st through 4th year) are eligible for membership.',
    },
    {
      tag: 'PREREQUISITES',
      q: 'Is prior programming experience required?',
      a: 'No prior experience required! We prioritize curiosity, consistency, and passion. We run hands-on foundational tracks alongside advanced hackathon engineering cohorts.',
    },
    {
      tag: 'SELECTION',
      q: 'What does the induction process involve?',
      a: 'After transmitting your encrypted registration, short friendly peer interviews are conducted with domain leads to align your technical passions with our projects.',
    },
    {
      tag: 'COMMITMENT',
      q: 'What is the anticipated weekly commitment?',
      a: 'Typically 2 to 4 hours weekly, fully adapted around your semester examination schedule, internal assessments, and academic coursework.',
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
            <span>// ACCESS_CLUB // RECRUITMENT_PORTAL</span>
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-[#c8f7d0] text-glow">
            Join the CIPHER Community
          </h1>
          <p className="mt-3 font-mono text-sm sm:text-base text-[#6fae78] max-w-2xl leading-relaxed">
            Whether you want to build cutting-edge software, lead campus tech initiatives, or learn alongside ambitious peers, your journey begins here.
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
          {/* Left: Application Form */}
          <div className="lg:col-span-7 rounded-2xl border border-[#00ff41]/40 bg-[#080d08] p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            {isSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#c8f7d0] text-glow">
                  Application Encrypted &amp; Logged
                </h3>
                <p className="text-xs sm:text-sm text-[#6fae78] max-w-md mx-auto leading-relaxed">
                  Thank you for applying. Your registration has been securely synced with the CIPHER recruitment registry. Our executive council will reach out soon.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded border border-[#00ff41] bg-[#00ff41] px-6 py-2.5 text-xs font-bold text-[#050705] hover:bg-[#00ff66]"
                  >
                    SUBMIT ANOTHER RESPONSE
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#00ff41] border-b border-[#123a17] pb-3">
                  <ShieldCheck size={16} />
                  <span>SECURE REGISTRATION FORM</span>
                </div>

                {errors.general && (
                  <div className="flex items-center gap-2 p-3 rounded border border-[#ff5f56]/40 bg-[#ff5f56]/10 text-xs text-[#ff5f56]">
                    <AlertCircle size={14} />
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* Anti-Bot Security Honeypot (Hidden from humans, catches bots) */}
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

                <div>
                  <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                    Full Name <span className="text-[#00ff41]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none"
                  />
                  {errors.name && (
                    <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-1">
                      <AlertCircle size={12} /> {errors.name}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                      College USN <span className="text-[#00ff41]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.usn}
                      onChange={(e) => handleChange('usn', e.target.value.toUpperCase())}
                      placeholder="4SO22CS..."
                      className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none uppercase"
                    />
                    {errors.usn && (
                      <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-1">
                        <AlertCircle size={12} /> {errors.usn}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                      Current Semester <span className="text-[#00ff41]">*</span>
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

                <div>
                  <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                    Email Address <span className="text-[#00ff41]">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="student@sjec.ac.in"
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none"
                  />
                  {errors.email && (
                    <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-1">
                      <AlertCircle size={12} /> {errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                    Primary Domain Preference <span className="text-[#00ff41]">*</span>
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => handleChange('domain', e.target.value)}
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none"
                  >
                    <option value="Full-Stack Engineering">Full-Stack Engineering (Web &amp; Cloud)</option>
                    <option value="Machine Learning & Analytics">Machine Learning &amp; Data Analytics</option>
                    <option value="Cybersecurity">Cybersecurity &amp; Cryptography (CTFs &amp; Auditing)</option>
                    <option value="Events & Design Operations">Events &amp; Design Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                    Statement of Interest <span className="text-[#00ff41]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Tell us what you want to learn, your background, or what you hope to build..."
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none resize-none"
                  />
                  {errors.message && (
                    <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-1">
                      <AlertCircle size={12} /> {errors.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded bg-[#00ff41] py-3.5 text-xs font-bold uppercase text-[#050705] hover:bg-[#00ff66] transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] disabled:opacity-50"
                  data-cursor="lens"
                >
                  {isSubmitting ? (
                    <span>TRANSMITTING...</span>
                  ) : (
                    <>
                      <span>TRANSMIT APPLICATION</span>
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
                          : 'border-[#123a17] bg-[#050705]/80 hover:border-[#123a17]/80'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full flex items-center justify-between p-3.5 text-left text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2 pr-2">
                          <span className="font-mono text-[10px] text-[#00ff41] font-bold">
                            [{faq.tag}]
                          </span>
                          <span className={`font-semibold ${isOpen ? 'text-[#00ff41]' : 'text-[#c8f7d0]'}`}>
                            {faq.q}
                          </span>
                        </div>
                        <ChevronDown
                          size={15}
                          className={`text-[#00ff41] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 text-xs text-[#6fae78] leading-relaxed border-t border-[#123a17]/60 pt-2.5">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Contact Desk */}
            <div className="rounded-xl border border-[#123a17] bg-[#080d08] p-6 sm:p-8 space-y-4 text-xs">
              <h3 className="font-display text-base font-bold text-[#00ff41]">
                Department Contact Desk
              </h3>
              <div className="space-y-3 text-[#c8f7d0]/80">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#00ff41] shrink-0 mt-0.5" />
                  <span>
                    Department of CSE, Academic Block III,<br />
                    St. Joseph Engineering College, Vamanjoor, Mangaluru - 575028
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#00ff41] shrink-0" />
                  <a href={`mailto:${siteConfig.socialLinks.email}`} className="hover:text-[#00ff41] underline">
                    {siteConfig.socialLinks.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
