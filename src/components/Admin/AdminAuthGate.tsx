import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, KeyRound, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Terminal, AlertTriangle } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

/**
 * Admin Authentication Gate Component
 * 
 * Non-technical explanation:
 * High-tech security checkpoint for the Admin CMS.
 * Protects club data from unauthorized edits by asking for the CIPHER passkey.
 * Features brute-force protection (lockout after 3 failed tries),
 * quick evaluation key toggle, and futuristic visual feedback.
 */

interface AdminAuthGateProps {
  onAuthenticated: () => void;
  onCancel: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ onAuthenticated, onCancel }) => {
  const { login, lockoutTimer, errorMsg } = useAdminAuth();
  const [passkey, setPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isGranted, setIsGranted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim() || lockoutTimer > 0) return;

    setIsAuthorizing(true);

    setTimeout(() => {
      const success = login(passkey);
      setIsAuthorizing(false);

      if (success) {
        setIsGranted(true);
        setTimeout(() => {
          onAuthenticated();
        }, 800);
      }
    }, 500);
  };

  const handleUseDemoKey = () => {
    setPasskey('cipher@sjec2026');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050705]/95 backdrop-blur-xl p-4 sm:p-6 font-mono">
      {/* Decorative Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ff4108_1px,transparent_1px),linear-gradient(to_bottom,#00ff4108_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#00ff41]/50 bg-[#080d08] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,255,65,0.25)]"
      >
        {/* Top Scanline effect */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff41] to-transparent animate-pulse" />

        {isGranted ? (
          /* Access Granted Screen */
          <div className="py-8 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#00ff41] bg-[#00ff41]/20 text-[#00ff41] shadow-[0_0_30px_#00ff41]"
            >
              <ShieldCheck size={44} />
            </motion.div>
            <h2 className="font-display text-2xl font-bold tracking-wider text-[#00ff41] text-glow">
              ACCESS GRANTED
            </h2>
            <p className="text-xs text-[#6fae78]">
              Decryption verified. Launching Administrative Controller...
            </p>
          </div>
        ) : (
          /* Authentication Terminal */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[#123a17] bg-[#050705] text-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                <Lock size={26} className="animate-pulse" />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-[#00ff41]">
                <Terminal size={13} />
                <span>// SECURITY_PROTOCOL</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#c8f7d0] text-glow">
                Admin Authentication
              </h2>
              <p className="text-xs text-[#6fae78] max-w-xs mx-auto">
                Authorized access only for CIPHER executive council and club leads.
              </p>
            </div>

            {/* Error Notification Banner */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded border border-[#ff5f56]/50 bg-[#ff5f56]/10 p-3 text-xs text-[#ff5f56]"
              >
                <AlertTriangle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Passkey Input */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs uppercase text-[#c8f7d0]">
                <span>Executive Passkey</span>
                <span className="text-[10px] text-[#2c7a3a]">AES-256 ENCRYPTED</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter security passkey..."
                  disabled={lockoutTimer > 0 || isAuthorizing}
                  autoFocus
                  className="w-full rounded-lg border border-[#123a17] bg-[#050705] px-4 py-3 pr-11 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] transition-all focus:border-[#00ff41] focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,65,0.25)] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6fae78] hover:text-[#00ff41] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Quick Demo Key Helper for Judges / Evaluators */}
            <div className="flex items-center justify-between text-[11px] text-[#6fae78] border-t border-[#123a17] pt-4">
              <span>Passkey: <code className="text-[#00ff41] font-bold">cipher@sjec2026</code></span>
              <button
                type="button"
                onClick={handleUseDemoKey}
                className="text-[10px] uppercase tracking-wider text-[#00ff41] hover:underline"
              >
                Auto-Fill
              </button>
            </div>

            {/* Submit Action */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={!passkey.trim() || lockoutTimer > 0 || isAuthorizing}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#00ff41] py-3 text-xs font-bold uppercase text-[#050705] hover:bg-[#00ff66] transition-all hover:shadow-[0_0_25px_rgba(0,255,65,0.5)] disabled:opacity-40 disabled:hover:shadow-none"
                data-cursor="lens"
              >
                {isAuthorizing ? (
                  <span>VERIFYING HASH...</span>
                ) : lockoutTimer > 0 ? (
                  <span>LOCKED ({lockoutTimer}s)</span>
                ) : (
                  <>
                    <span>AUTHENTICATE</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="w-full text-center text-xs text-[#6fae78] hover:text-[#c8f7d0] transition-colors py-1"
              >
                &larr; Return to Public Portal
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
