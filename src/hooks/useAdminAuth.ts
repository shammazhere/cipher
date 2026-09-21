import { useState, useEffect, useCallback } from 'react';

/**
 * useAdminAuth Hook
 * 
 * Non-technical explanation:
 * Guards the administrative CMS with a secure cyberpunk login gate:
 * - Checks whether the user is already authenticated via sessionStorage.
 * - Validates administrative passkeys with brute-force defense (lockout after 3 fails).
 * - Synchronizes authentication state across all components and browser tabs.
 * - Provides a clear logout mechanism.
 */

const MASTER_KEYS = ['cipher@sjec2026', 'cipher2026', 'admin2026'];
const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;
export const AUTH_STORAGE_KEY = 'cipher_admin_authenticated';
export const AUTH_CHANGE_EVENT = 'cipher_admin_auth_sync';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchronize authentication state across components & storage changes
  useEffect(() => {
    const handleSync = () => {
      try {
        setIsAuthenticated(sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true');
      } catch {
        setIsAuthenticated(false);
      }
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Lockout countdown timer effect
  useEffect(() => {
    if (lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          setErrorMsg(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const refreshAuth = useCallback(() => {
    try {
      const auth = sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
      setIsAuthenticated(auth);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
      }
      return auth;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  const login = useCallback((passkey: string): boolean => {
    if (lockoutTimer > 0) {
      setErrorMsg(`Access locked. Retry in ${lockoutTimer}s.`);
      return false;
    }

    const cleanKey = passkey.trim();

    if (MASTER_KEYS.includes(cleanKey)) {
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      } catch {
        // Fallback if private browsing blocks storage
      }
      setIsAuthenticated(true);
      setErrorMsg(null);
      setFailedAttempts(0);
      return true;
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setLockoutTimer(LOCKOUT_SECONDS);
        setErrorMsg(`Too many invalid attempts. Security lockout active (${LOCKOUT_SECONDS}s).`);
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        setErrorMsg(`Invalid passkey. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`);
      }
      return false;
    }
  }, [lockoutTimer, failedAttempts]);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
    }
  }, []);

  return {
    isAuthenticated,
    setIsAuthenticated,
    refreshAuth,
    failedAttempts,
    lockoutTimer,
    errorMsg,
    login,
    logout,
  };
}
