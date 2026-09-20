import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, AlertCircle, HelpCircle, Mail, MapPin } from 'lucide-react';
import { sanitizeInput, isValidEmail, isValidUSN, truncateSafe } from '../utils/sanitize';
import { useData } from '../context/DataContext';

/**
 * JoinPage Component (Page 5 of 5)
 * 
 * Non-technical explanation:
 * Dedicated standalone application and contact page.
 * Contains the full membership registration form, club domain descriptions,
 * applicant FAQs, and official contact information for SJEC students.
 */

export const JoinPage: React.FC = () => {
  const { siteConfig, addApplication } = useData();

  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    email: '',
    semester: '3rd Semester',
    domain: 'Technical & Development',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (formData.usn && !isValidUSN(formData.usn)) {
      errs.usn = 'USN should look like 4SO22CS001.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please provide a brief statement of interest.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const cleanName = sanitizeInput(formData.name);
    const cleanUsn = sanitizeInput(formData.usn);
    const cleanEmail = sanitizeInput(formData.email);
    const cleanSemester = sanitizeInput(formData.semester);
    const cleanDomain = sanitizeInput(formData.domain);
    const cleanMessage = sanitizeInput(truncateSafe(formData.message, 1000));

    setTimeout(() => {
      addApplication({
        name: cleanName,
        usn: cleanUsn,
        email: cleanEmail,
        semester: cleanSemester,
        domain: cleanDomain,
        message: cleanMessage,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

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
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: '',
                        usn: '',
                        email: '',
                        semester: '3rd Semester',
                        domain: 'Technical & Development',
                        message: '',
                      });
                    }}
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

                <div>
                  <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                    Full Name <span className="text-[#00ff41]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jane Doe"
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
                      College USN
                    </label>
                    <input
                      type="text"
                      value={formData.usn}
                      onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                      placeholder="4SO22CS..."
                      className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none"
                    />
                    {errors.usn && (
                      <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-1">
                        <AlertCircle size={12} /> {errors.usn}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                      Email Address <span className="text-[#00ff41]">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@sjec.ac.in"
                      className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none"
                    />
                    {errors.email && (
                      <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-1">
                        <AlertCircle size={12} /> {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                      Current Semester
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none"
                    >
                      <option value="1st Semester">1st Semester</option>
                      <option value="2nd Semester">2nd Semester</option>
                      <option value="3rd Semester">3rd Semester</option>
                      <option value="4th Semester">4th Semester</option>
                      <option value="5th Semester">5th Semester</option>
                      <option value="6th Semester">6th Semester</option>
                      <option value="7th/8th Semester">7th/8th Semester</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                      Domain Interest
                    </label>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full rounded border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none"
                    >
                      <option value="Technical & Development">Technical &amp; Development</option>
                      <option value="Competitive Programming">Competitive Programming</option>
                      <option value="Events & Operations">Events &amp; Operations</option>
                      <option value="Design & Media">Design &amp; Media</option>
                      <option value="AI & Research">AI &amp; Research</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                    Statement of Interest <span className="text-[#00ff41]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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

          {/* Right: FAQs & Direct Contact */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-xl border border-[#123a17] bg-[#080d08] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-[#00ff41]">
                <HelpCircle size={20} />
                <h3 className="font-display text-lg font-bold text-[#c8f7d0]">
                  Applicant FAQs
                </h3>
              </div>

              <div className="space-y-4 text-xs text-[#6fae78] pt-2">
                <div>
                  <h4 className="font-bold text-[#c8f7d0] mb-1">Who is eligible to apply?</h4>
                  <p className="leading-relaxed">All undergraduate students enrolled in the Department of Computer Science &amp; Engineering at SJEC are welcome to apply.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#c8f7d0] mb-1">Is prior coding experience required?</h4>
                  <p className="leading-relaxed">No. We value curiosity and commitment above all. We host beginner-friendly training bootcamps alongside advanced sessions.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#c8f7d0] mb-1">What is the selection process?</h4>
                  <p className="leading-relaxed">After applying, short peer interviews are conducted by executive leads to understand your interests and place you in the right domain.</p>
                </div>
              </div>
            </div>

            {/* Direct Contact Card */}
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
