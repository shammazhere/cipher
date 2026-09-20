import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { sanitizeInput, isValidEmail, isValidUSN, truncateSafe } from '../../utils/sanitize';
import { useData } from '../../context/DataContext';

/**
 * Join Club Application Modal Component
 * 
 * Non-technical explanation:
 * The official membership application form where students apply to join CIPHER.
 * It checks input security (XSS protection), validates email & USN, gives immediate
 * confirmation, and stores the application for the admin team to review.
 */

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose }) => {
  const { addApplication } = useData();

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

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }

    if (formData.usn && !isValidUSN(formData.usn)) {
      errs.usn = 'USN format should be like 4SO22CS001.';
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

    // Sanitize all inputs to protect against code injection / XSS
    const cleanName = sanitizeInput(formData.name);
    const cleanUsn = sanitizeInput(formData.usn);
    const cleanEmail = sanitizeInput(formData.email);
    const cleanSemester = sanitizeInput(formData.semester);
    const cleanDomain = sanitizeInput(formData.domain);
    const cleanMessage = sanitizeInput(truncateSafe(formData.message, 1000));

    // Simulate network submission delay and store application
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

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      usn: '',
      email: '',
      semester: '3rd Semester',
      domain: 'Technical & Development',
      message: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
        onClick={handleResetAndClose}
      >
        <motion.div
          className="relative my-auto w-full max-w-lg rounded-2xl border border-[#00ff41]/50 bg-[#080d08] p-6 sm:p-8 shadow-[0_0_50px_rgba(0,255,65,0.3)]"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleResetAndClose}
            className="absolute top-6 right-6 z-20 flex h-9 w-9 items-center justify-center rounded-lg border border-[#123a17] bg-[#050705] text-[#6fae78] transition-colors hover:border-[#00ff41] hover:text-[#00ff41]"
            aria-label="Close form"
          >
            <X size={18} />
          </button>

          {isSuccess ? (
            /* Success confirmation screen */
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#c8f7d0] text-glow">
                Application Transmitted
              </h3>
              <p className="font-mono text-xs sm:text-sm text-[#6fae78] leading-relaxed max-w-sm mx-auto">
                Your application has been encrypted and recorded into the CIPHER registry. The executive team will reach out to you via your registered college email.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="rounded border border-[#00ff41] bg-[#00ff41] px-6 py-2.5 font-mono text-xs font-bold uppercase text-[#050705] hover:bg-[#00ff66]"
                >
                  RETURN TO PORTAL
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="space-y-4 font-mono">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#00ff41] mb-1">
                  <ShieldCheck size={14} />
                  <span>// ACCESS_REQUEST</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-[#c8f7d0] text-glow">
                  Join CIPHER
                </h3>
                <p className="text-xs text-[#6fae78] mt-1">
                  Apply for membership or domain roles for the 2026 academic term.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                  Full Name <span className="text-[#00ff41]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full rounded border border-[#123a17] bg-[#050705] px-3.5 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none"
                />
                {errors.name && (
                  <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-1">
                    <AlertCircle size={12} /> {errors.name}
                  </span>
                )}
              </div>

              {/* USN & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                    College USN
                  </label>
                  <input
                    type="text"
                    value={formData.usn}
                    onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
                    placeholder="4SO22CS..."
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-3.5 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none"
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
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-3.5 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none"
                  />
                  {errors.email && (
                    <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-1">
                      <AlertCircle size={12} /> {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Semester & Domain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-3.5 py-2.5 text-xs text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none"
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
                    Primary Domain
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-3.5 py-2.5 text-xs text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none"
                  >
                    <option value="Technical & Development">Technical &amp; Development</option>
                    <option value="Competitive Programming">Competitive Programming</option>
                    <option value="Events & Operations">Events &amp; Operations</option>
                    <option value="Design & Media">Design &amp; Media</option>
                    <option value="AI & Research">AI &amp; Research</option>
                  </select>
                </div>
              </div>

              {/* Statement of Interest / Message */}
              <div>
                <label className="block text-xs uppercase text-[#c8f7d0] mb-1">
                  Why do you want to join? <span className="text-[#00ff41]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your interests, skills, or what you hope to build..."
                  className="w-full rounded border border-[#123a17] bg-[#050705] px-3.5 py-2 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none resize-none"
                />
                {errors.message && (
                  <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-1">
                    <AlertCircle size={12} /> {errors.message}
                  </span>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded bg-[#00ff41] py-3 font-mono text-xs font-bold uppercase text-[#050705] transition-all hover:bg-[#00ff66] hover:shadow-[0_0_20px_rgba(0,255,65,0.5)] disabled:opacity-50"
                  data-cursor="lens"
                >
                  {isSubmitting ? (
                    <span>TRANSMITTING...</span>
                  ) : (
                    <>
                      <span>SUBMIT APPLICATION</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
