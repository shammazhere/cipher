import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Terminal, AlertTriangle, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { soundEffects } from '../../utils/soundEffects';

/**
 * Admin Authentication & Authorization Gate
 * 
 * Powered by Supabase Cloud Database & Auth:
 * - Direct authentication and new admin registration.
 * - Brute-force & injection attack defenses.
 * - Clean interface without unwanted tags or text.
 */

interface AdminAuthGateProps {
  onAuthenticated: () => void;
  onCancel: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ onAuthenticated, onCancel }) => {
  const { login, registerAdmin, lockoutTimer } = useAdminAuth();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'register') {
      if (password !== confirmPassword) {
        soundEffects.playError();
        setErrorMsg('Passwords do not match. Please verify your password confirmation.');
        return;
      }

      setIsAuthorizing(true);
      soundEffects.playClick();

      const res = await registerAdmin(username, password);
      setIsAuthorizing(false);

      if (res.success) {
        soundEffects.playSuccess();
        setSuccessMsg(res.message || 'Registration submitted! Please wait for Head Admin approval before signing in.');
        setMode('signin');
        setPassword('');
        setConfirmPassword('');
      } else {
        soundEffects.playError();
        setErrorMsg(res.error || 'Registration failed.');
      }
      return;
    }

    // Sign in mode
    setIsAuthorizing(true);
    soundEffects.playClick();

    const res = await login(username, password);
    setIsAuthorizing(false);

    if (res.success) {
      soundEffects.playSuccess();
      setIsGranted(true);
      setTimeout(() => {
        onAuthenticated();
      }, 700);
    } else {
      soundEffects.playError();
      setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
    }
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
              Authorization verified. Launching Administrative Controller...
            </p>
          </div>
        ) : (
          /* Authentication Terminal */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[#123a17] bg-[#050705] text-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                <Lock size={26} className="animate-pulse" />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-[#00ff41]">
                <Terminal size={13} />
                <span>// SECURITY_GATE</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#c8f7d0] text-glow">
                Admin Authentication
              </h2>
              <p className="text-xs text-[#6fae78] max-w-xs mx-auto">
                Authorized access for CIPHER executive council and club leads.
              </p>
            </div>

            {/* Mode Switcher: Sign In vs Register Admin */}
            <div className="flex rounded-lg border border-[#123a17] bg-[#050705] p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded py-2 transition-all ${
                  mode === 'signin'
                    ? 'bg-[#00ff41] font-bold text-[#050705] shadow-[0_0_15px_rgba(0,255,65,0.3)]'
                    : 'text-[#6fae78] hover:text-[#c8f7d0]'
                }`}
              >
                <LogIn size={13} />
                <span>SIGN IN</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded py-2 transition-all ${
                  mode === 'register'
                    ? 'bg-[#00ff41] font-bold text-[#050705] shadow-[0_0_15px_rgba(0,255,65,0.3)]'
                    : 'text-[#6fae78] hover:text-[#c8f7d0]'
                }`}
              >
                <UserPlus size={13} />
                <span>REGISTER ADMIN</span>
              </button>
            </div>

            {/* Success Message Banner */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded border border-[#00ff41]/50 bg-[#00ff41]/10 p-3 text-xs text-[#00ff41]"
              >
                <CheckCircle2 size={15} className="shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

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

            {/* Username / Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="admin_username" className="block text-xs uppercase text-[#c8f7d0]">
                {mode === 'register' ? 'Admin Username or Email' : 'Username or Email'}
              </label>
              <input
                id="admin_username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={mode === 'register' ? 'Choose username (e.g. lead_alex)' : 'Enter username or email'}
                required
                disabled={isAuthorizing || lockoutTimer > 0}
                autoFocus
                className="w-full rounded-lg border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] transition-all focus:border-[#00ff41] focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,65,0.25)] disabled:opacity-50"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="admin_password" className="block text-xs uppercase text-[#c8f7d0]">
                {mode === 'register' ? 'Create Password' : 'Password'}
              </label>

              <div className="relative">
                <input
                  id="admin_password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min 6 characters' : 'Enter password'}
                  required
                  disabled={isAuthorizing || lockoutTimer > 0}
                  className="w-full rounded-lg border border-[#123a17] bg-[#050705] px-4 py-2.5 pr-11 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] transition-all focus:border-[#00ff41] focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,65,0.25)] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6fae78] hover:text-[#00ff41] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input (Register Mode Only) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label htmlFor="admin_confirm_password" className="block text-xs uppercase text-[#c8f7d0]">
                  Confirm Password
                </label>
                <input
                  id="admin_confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  disabled={isAuthorizing}
                  className="w-full rounded-lg border border-[#123a17] bg-[#050705] px-4 py-2.5 text-xs text-[#c8f7d0] placeholder-[#2c7a3a] transition-all focus:border-[#00ff41] focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,65,0.25)] disabled:opacity-50"
                />
                <p className="text-[10px] text-[#6fae78] pt-1">* Note: New registrations require approval by the Head Administrator before login is granted.</p>
              </div>
            )}

            {/* Submit Action */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={!username.trim() || !password.trim() || isAuthorizing || lockoutTimer > 0}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#00ff41] py-3 text-xs font-bold uppercase text-[#050705] hover:bg-[#00ff66] transition-all hover:shadow-[0_0_25px_rgba(0,255,65,0.5)] disabled:opacity-40 disabled:hover:shadow-none"
              >
                {isAuthorizing ? (
                  <span>AUTHENTICATING...</span>
                ) : lockoutTimer > 0 ? (
                  <span>LOCKED ({lockoutTimer}s)</span>
                ) : mode === 'signin' ? (
                  <>
                    <span>AUTHENTICATE &amp; ENTER</span>
                    <ArrowRight size={14} />
                  </>
                ) : (
                  <>
                    <span>REGISTER NEW ADMIN</span>
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
