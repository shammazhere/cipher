import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Terminal, AlertCircle, Lock, Hash } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useSecureForm } from '../../hooks/useSecureForm';
import { useToast } from '../../context/ToastContext';
import { soundEffects } from '../../utils/soundEffects';

/**
 * Join Club Application Modal Component
 * 
 * Non-technical explanation:
 * Interactive hacker recruitment terminal popup for applying to CIPHER.
 * Collects required data (Callsign, USN, Comms Email, Domain, optional payload)
 * with instant client-side cryptographic checksum calculation and XSS protection.
 */

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose }) => {
  const { addApplication } = useData();
  const { showToast } = useToast();

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

  if (!isOpen) return null;

  const handleResetAndClose = () => {
    soundEffects.playClick();
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md overflow-y-auto"
        onClick={handleResetAndClose}
      >
        <motion.div
          className="relative my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#00ff41]/50 bg-[#080d08] shadow-[0_0_60px_rgba(0,255,65,0.25)] font-mono"
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.22 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Terminal Window Header Bar */}
          <div className="flex items-center justify-between border-b border-[#123a17] bg-[#050705] px-4 py-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]/80 border border-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]/80 border border-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]/80 border border-[#27c93f]" />
              <span className="ml-2 text-[11px] text-[#6fae78] font-mono">
                /bin/recruit_operative.sh
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#00ff41]">
              <Lock size={12} />
              <span>TLS_1.3 // 256-BIT</span>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={handleResetAndClose}
            className="absolute top-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded border border-[#123a17] bg-[#050705] text-[#6fae78] transition-colors hover:border-[#00ff41] hover:text-[#00ff41]"
            aria-label="Close terminal"
          >
            <X size={15} />
          </button>

          {isSuccess ? (
            /* Success confirmation screen */
            <div className="p-8 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41] shadow-[0_0_25px_#00ff41]">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#c8f7d0] text-glow">
                Transmission Verified
              </h3>
              <p className="font-mono text-xs text-[#6fae78] leading-relaxed max-w-sm mx-auto">
                Candidate packet logged with checksum <code className="text-[#00ff41]">{liveHash}</code>. The executive leads will reach out via student comms.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="rounded border border-[#00ff41] bg-[#00ff41] px-6 py-2.5 text-xs font-bold uppercase text-[#050705] hover:bg-[#00ff66] transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                >
                  RETURN TO PORTAL
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4 font-mono">
              <div className="border-b border-[#123a17] pb-2">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#00ff41]">
                  <Terminal size={12} />
                  <span>// RECRUITMENT_INFILTRATION</span>
                </div>
                <p className="text-xs text-[#6fae78] mt-0.5">
                  Enter credentials to join CIPHER technical &amp; operations teams.
                </p>
              </div>

              {errors.general && (
                <div className="flex items-center gap-2 p-2.5 rounded border border-[#ff5f56]/40 bg-[#ff5f56]/10 text-xs text-[#ff5f56]">
                  <AlertCircle size={14} />
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

              {/* Callsign / Full Name */}
              <div className="space-y-1">
                <label className="flex items-center justify-between text-xs text-[#c8f7d0]">
                  <span>&gt; ENTER_CALLSIGN [NAME] *</span>
                  <span className="text-[10px] text-[#2c7a3a]">REQUIRED</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded border border-[#123a17] bg-[#050705] px-3.5 py-2 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none focus:shadow-[0_0_12px_rgba(0,255,65,0.2)]"
                />
                {errors.name && (
                  <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-0.5">
                    <AlertCircle size={12} /> {errors.name}
                  </span>
                )}
              </div>

              {/* USN & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="flex items-center justify-between text-xs text-[#c8f7d0]">
                    <span>&gt; VERIFY_USN *</span>
                    <span className="text-[10px] text-[#2c7a3a]">REQUIRED</span>
                  </label>
                  <input
                    type="text"
                    value={formData.usn}
                    onChange={(e) => handleChange('usn', e.target.value.toUpperCase())}
                    placeholder="4SO22CS..."
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-3.5 py-2 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none uppercase focus:shadow-[0_0_12px_rgba(0,255,65,0.2)]"
                  />
                  {errors.usn && (
                    <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-0.5">
                      <AlertCircle size={12} /> {errors.usn}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="flex items-center justify-between text-xs text-[#c8f7d0]">
                    <span>&gt; COMMS_EMAIL *</span>
                    <span className="text-[10px] text-[#2c7a3a]">REQUIRED</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="student@sjec.ac.in"
                    className="w-full rounded border border-[#123a17] bg-[#050705] px-3.5 py-2 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none focus:shadow-[0_0_12px_rgba(0,255,65,0.2)]"
                  />
                  {errors.email && (
                    <span className="flex items-center gap-1 text-[11px] text-[#ff5f56] mt-0.5">
                      <AlertCircle size={12} /> {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Domain Preference */}
              <div className="space-y-1">
                <label className="flex items-center justify-between text-xs text-[#c8f7d0]">
                  <span>&gt; ASSIGN_SECTOR [DOMAIN] *</span>
                  <span className="text-[10px] text-[#2c7a3a]">REQUIRED</span>
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => handleChange('domain', e.target.value)}
                  className="w-full rounded border border-[#123a17] bg-[#050705] px-3.5 py-2 text-xs text-[#c8f7d0] focus:border-[#00ff41] focus:outline-none"
                >
                  <option value="Cybersecurity & CTFs">Cybersecurity &amp; CTFs</option>
                  <option value="Full-Stack Engineering">Full-Stack Web &amp; Cloud</option>
                  <option value="Machine Learning & AI">Machine Learning &amp; AI</option>
                  <option value="Events & Operations">Events &amp; Operations</option>
                </select>
              </div>

              {/* Optional Payload / Note */}
              <div className="space-y-1">
                <label className="flex items-center justify-between text-xs text-[#c8f7d0]">
                  <span>&gt; PAYLOAD / GITHUB_LINK</span>
                  <span className="text-[10px] text-[#2c7a3a]">OPTIONAL</span>
                </label>
                <input
                  type="text"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="github.com/... or short objective"
                  className="w-full rounded border border-[#123a17] bg-[#050705] px-3.5 py-2 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] focus:border-[#00ff41] focus:outline-none"
                />
              </div>

              {/* Live Hash Preview */}
              <div className="flex items-center justify-between rounded border border-[#123a17] bg-[#050705] p-2 text-[10px] text-[#6fae78]">
                <div className="flex items-center gap-1 overflow-hidden">
                  <Hash size={12} className="text-[#00ff41] shrink-0" />
                  <span className="text-[#2c7a3a]">CHECKSUM:</span>
                  <code className="text-[#00ff41] truncate">{liveHash}</code>
                </div>
                <span className="text-[#00ff41] font-bold">READY</span>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#00ff41] py-3 text-xs font-bold uppercase text-[#050705] hover:bg-[#00ff66] transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] disabled:opacity-50"
                data-cursor="lens"
              >
                {isSubmitting ? (
                  <span>TRANSMITTING...</span>
                ) : (
                  <>
                    <span>EXECUTE TRANSMISSION</span>
                    <Send size={13} />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
