import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { MatrixRain } from '../Preloader/MatrixRain';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { soundEffects } from '../../utils/soundEffects';
import { cleanSecureInput, isValidEmail, isBotSubmission, hasSQLInjectionThreat } from '../../utils/sanitize';

/**
 * Join Modal (Access Request) Component
 * 
 * Secure Client-Facing Form:
 * - Exactly 3 clean fields as original: Name, Email, and Message.
 * - Fortified against SQL injection, XSS payloads, and automated spam bots.
 * - Submits directly to the Supabase cloud database with zero local storage.
 */

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose }) => {
  const { addApplication } = useData();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    soundEffects.playClick();

    const form = new FormData(e.currentTarget);

    // 1. Anti-Bot Honeypot Defense
    const honeypot = (form.get('_security_trap') as string) || '';
    if (isBotSubmission(honeypot)) {
      // Silently drop bot traffic
      setIsSuccess(true);
      setTimeout(onClose, 1000);
      return;
    }

    const rawName = form.get('name') as string;
    const rawEmail = form.get('email') as string;
    const rawMessage = form.get('message') as string;

    // 2. SQL Injection / Exploit Payload Detection
    if (hasSQLInjectionThreat(rawName) || hasSQLInjectionThreat(rawMessage)) {
      soundEffects.playError();
      setErrorMsg('Invalid characters detected. Input contains prohibited syntax.');
      return;
    }

    // 3. Strict Email Validation
    if (!isValidEmail(rawEmail)) {
      soundEffects.playError();
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    // 4. Input Sanitization & Clamping against XSS & Buffer Overflows
    const cleanName = cleanSecureInput(rawName, 100);
    const cleanEmail = cleanSecureInput(rawEmail, 150);
    const cleanMessage = cleanSecureInput(rawMessage, 2000);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addApplication({
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage,
      });

      soundEffects.playSuccess();
      setIsSuccess(true);
      showToast({
        title: 'TRANSMISSION VERIFIED',
        message: 'Your application has been stored in CIPHER cloud database.',
        type: 'success',
      });

      // Auto close after 2.5 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 2500);
    } catch (err: unknown) {
      soundEffects.playError();
      const message = err instanceof Error ? err.message : 'Database transmission failed. Please retry.';
      setErrorMsg(message);
      setIsSubmitting(false);
      showToast({
        title: 'TRANSMISSION FAILED',
        message: 'Could not write to Supabase database. Please retry.',
        type: 'error',
      });
    }
  };

  const handleModalClose = () => {
    if (!isSubmitting) {
      setIsSuccess(false);
      setErrorMsg(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="join-modal fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleModalClose}
        >
          <motion.div
            className="relative w-full max-w-md rounded-lg border border-[var(--matrix)]/40 bg-[#050705] p-8 overflow-hidden shadow-[0_0_50px_rgba(0,255,65,0.15)]"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Matrix Rain */}
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <MatrixRain opacity={0.15} />
            </div>

            <div className="relative z-10">
              {/* Top Close Button */}
              <button
                type="button"
                onClick={handleModalClose}
                disabled={isSubmitting}
                className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-md border border-[var(--matrix)]/40 text-[var(--matrix)] transition-colors hover:bg-[var(--matrix)]/10 disabled:opacity-40"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {isSuccess ? (
                /* Success Transmission State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#00ff41] bg-[#00ff41]/20 text-[#00ff41] shadow-[0_0_30px_#00ff41]"
                  >
                    <ShieldCheck size={44} />
                  </motion.div>
                  <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#00ff41]">
                    // DATABASE_COMMIT_VERIFIED
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#c8f7d0] text-glow">
                    TRANSMISSION SUCCESSFUL
                  </h3>
                  <p className="font-mono text-xs leading-relaxed text-[#6fae78] max-w-sm mx-auto">
                    Your operative profile has been encrypted and recorded into the CIPHER Supabase database.
                    The executive council has been notified.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="rounded-md border border-[var(--matrix)] px-6 py-2 font-mono text-xs uppercase tracking-wider text-[var(--matrix)] hover:bg-[var(--matrix)]/10"
                    >
                      [ Close Window ]
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Clean Original 3-Field Application Form */
                <>
                  {/* Header */}
                  <div className="mb-7 pr-10">
                    <div className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--matrix)]">
                      // access request
                    </div>
                    <h3 className="font-display text-3xl text-foreground text-glow">
                      Join CIPHER
                    </h3>
                    <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
                      Send us a message and we'll get back to you.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#ff5f56]/40 bg-[#ff5f56]/10 p-3 text-xs font-mono text-[#ff8e88]">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Hidden Anti-Bot Honeypot */}
                    <input
                      type="text"
                      name="_security_trap"
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      aria-hidden="true"
                    />

                    <div>
                      <label htmlFor="name" className="mb-2 block font-mono text-xs uppercase tracking-wider text-[var(--matrix)]">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        disabled={isSubmitting}
                        placeholder="Enter your name"
                        maxLength={100}
                        className="w-full rounded-md border border-[var(--matrix)]/40 bg-black/40 px-4 py-3 font-mono text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[var(--matrix)] focus:shadow-[0_0_15px_rgba(0,255,65,0.12)] disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-2 block font-mono text-xs uppercase tracking-wider text-[var(--matrix)]">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        disabled={isSubmitting}
                        placeholder="Enter your email"
                        maxLength={150}
                        className="w-full rounded-md border border-[var(--matrix)]/40 bg-black/40 px-4 py-3 font-mono text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[var(--matrix)] focus:shadow-[0_0_15px_rgba(0,255,65,0.12)] disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="mb-2 block font-mono text-xs uppercase tracking-wider text-[var(--matrix)]">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        disabled={isSubmitting}
                        rows={4}
                        placeholder="Tell us why you'd like to join..."
                        maxLength={2000}
                        className="w-full resize-none rounded-md border border-[var(--matrix)]/40 bg-black/40 px-4 py-3 font-mono text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[var(--matrix)] focus:shadow-[0_0_15px_rgba(0,255,65,0.12)] disabled:opacity-50"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={isSubmitting ? {} : { y: -4, scale: 1.02 }}
                      whileTap={isSubmitting ? {} : { y: 0, scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--matrix)] px-6 py-3 font-mono text-sm font-medium uppercase tracking-wider text-[#030503] transition-shadow hover:shadow-[0_0_25px_rgba(0,255,65,0.35)] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-[#030503]" />
                          <span>SENDING...</span>
                        </>
                      ) : (
                        <>
                          <span>Send</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
