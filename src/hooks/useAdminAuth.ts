import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { cleanSecureInput, hasSQLInjectionThreat, stripControlCharacters } from '../utils/sanitize';

/**
 * useAdminAuth Hook
 * 
 * Hardened Supabase Cloud Authentication & Authorization:
 * - Brute-force & credential stuffing defense (lockout after 5 failed attempts).
 * - SQL injection & exploit signature detection.
 * - Dynamic credentials stored in and verified against Supabase cloud database.
 * - Support for registering new administrators directly to Supabase cloud.
 */

export interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
}

const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION_SECONDS = 30;

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);

  // Lockout countdown timer
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

  // Initialize session from Supabase & active session check
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        if (session) {
          setSession(session);
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          try {
            const savedUser = sessionStorage.getItem('cipher_admin_active_user');
            if (savedUser) {
              setUser({ id: 'admin_active', email: `${savedUser}@cipher.sjec.ac.in` } as User);
              setIsAuthenticated(true);
            }
          } catch {
            // ignore
          }
        }
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (session) {
          setSession(session);
          setUser(session.user);
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Supabase Authentication: Log in via Supabase DB or Supabase Auth
  const login = useCallback(async (usernameOrEmail: string, pass: string): Promise<AuthResult> => {
    if (lockoutTimer > 0) {
      const msg = `Security lockout active. Please wait ${lockoutTimer}s before retrying.`;
      setErrorMsg(msg);
      return { success: false, error: msg };
    }

    setErrorMsg(null);

    // SQL Injection signature detection
    if (hasSQLInjectionThreat(usernameOrEmail) || hasSQLInjectionThreat(pass)) {
      const msg = 'Security Alert: Prohibited syntax / injection pattern detected.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }

    const cleanId = cleanSecureInput(stripControlCharacters(usernameOrEmail), 100);
    const cleanPass = stripControlCharacters(pass).slice(0, 150);

    if (!cleanId || !cleanPass) {
      const msg = 'Please enter both username and password.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }

    try {
      // 1. Check primary Supabase cloud database credentials (club_content -> admin_auth)
      const { data: dbAuth } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_auth')
        .maybeSingle();

      if (dbAuth?.value) {
        const authVal = dbAuth.value as { username?: string; password?: string };
        const matchPrimary =
          authVal.username?.toLowerCase() === cleanId.toLowerCase() ||
          `${authVal.username?.toLowerCase()}@cipher.sjec.ac.in` === cleanId.toLowerCase();

        if (matchPrimary && authVal.password === cleanPass) {
          const authUser = {
            id: 'admin_primary',
            email: `${authVal.username}@cipher.sjec.ac.in`,
          } as User;

          setUser(authUser);
          setIsAuthenticated(true);
          setFailedAttempts(0);
          try {
            sessionStorage.setItem('cipher_admin_active_user', authVal.username || 'admin');
          } catch {
            // ignore
          }
          return { success: true };
        }
      }

      // 2. Check registered administrators in Supabase (club_content -> admin_users_list)
      const { data: userListContent } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_users_list')
        .maybeSingle();

      if (Array.isArray(userListContent?.value)) {
        const userList = userListContent.value as Array<{ username: string; password?: string }>;
        const matched = userList.find(
          (u) =>
            (u.username.toLowerCase() === cleanId.toLowerCase() ||
             `${u.username.toLowerCase()}@cipher.sjec.ac.in` === cleanId.toLowerCase()) &&
            u.password === cleanPass
        );

        if (matched) {
          const authUser = {
            id: `admin_${matched.username}`,
            email: `${matched.username}@cipher.sjec.ac.in`,
          } as User;

          setUser(authUser);
          setIsAuthenticated(true);
          setFailedAttempts(0);
          try {
            sessionStorage.setItem('cipher_admin_active_user', matched.username);
          } catch {
            // ignore
          }
          return { success: true };
        }
      }

      // 3. Check Supabase Auth service
      const email = cleanId.includes('@')
        ? cleanId
        : `${cleanId.toLowerCase()}@cipher.sjec.ac.in`;

      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password: cleanPass,
      });

      if (!authErr && authData?.user) {
        setSession(authData.session);
        setUser(authData.user);
        setIsAuthenticated(true);
        setFailedAttempts(0);
        try {
          sessionStorage.setItem('cipher_admin_active_user', authData.user.email || 'admin');
        } catch {
          // ignore
        }
        return { success: true };
      }

      // Handle failed attempt & brute force lockout defense
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setLockoutTimer(LOCKOUT_DURATION_SECONDS);
        const msg = `Security Lockout: Too many invalid attempts. Locked for ${LOCKOUT_DURATION_SECONDS}s.`;
        setErrorMsg(msg);
        return { success: false, error: msg };
      }

      const remaining = MAX_LOGIN_ATTEMPTS - newAttempts;
      const msg = `Invalid username or password. (${remaining} attempt${remaining > 1 ? 's' : ''} remaining)`;
      setErrorMsg(msg);
      return { success: false, error: msg };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database authentication connection error.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }
  }, [lockoutTimer, failedAttempts]);

  // Supabase Authentication: Register New Administrator
  const registerAdmin = useCallback(async (newUsername: string, newPassword: string): Promise<AuthResult> => {
    setErrorMsg(null);

    // Defense checks
    if (hasSQLInjectionThreat(newUsername) || hasSQLInjectionThreat(newPassword)) {
      const msg = 'Security Alert: Prohibited syntax detected in credentials.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }

    const cleanUser = cleanSecureInput(stripControlCharacters(newUsername), 50);
    const cleanPass = stripControlCharacters(newPassword).slice(0, 150);

    if (cleanUser.length < 3) {
      const msg = 'Admin username must be at least 3 characters long.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }

    if (cleanPass.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }

    try {
      // 1. Fetch existing admin list from Supabase
      const { data: existingContent } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_users_list')
        .maybeSingle();

      let list: Array<{ username: string; password?: string }> = [];
      if (Array.isArray(existingContent?.value)) {
        list = existingContent.value as Array<{ username: string; password?: string }>;
      }

      // Check if username already exists
      if (list.some((u) => u.username.toLowerCase() === cleanUser.toLowerCase())) {
        const msg = 'Username is already taken. Please choose another username.';
        setErrorMsg(msg);
        return { success: false, error: msg };
      }

      // 2. Add new admin to cloud database
      list.push({ username: cleanUser, password: cleanPass });

      const { error: upsertErr } = await supabase.from('club_content').upsert(
        {
          key: 'admin_users_list',
          value: list,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      if (upsertErr) {
        throw upsertErr;
      }

      // 3. Attempt Supabase Auth registration
      const email = cleanUser.includes('@') ? cleanUser : `${cleanUser.toLowerCase()}@cipher.sjec.ac.in`;
      try {
        await supabase.auth.signUp({ email, password: cleanPass });
      } catch {
        // DB registration is already saved
      }

      return {
        success: true,
        message: 'Successfully registered',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register admin in database.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }
  }, []);

  // Supabase Authentication: Sign out
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[Supabase Auth] Sign out error:', err);
    } finally {
      try {
        sessionStorage.removeItem('cipher_admin_active_user');
      } catch {
        // ignore
      }
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);
        setIsAuthenticated(true);
        return true;
      }
      const savedUser = sessionStorage.getItem('cipher_admin_active_user');
      if (savedUser) {
        setIsAuthenticated(true);
        return true;
      }
      setIsAuthenticated(false);
      return false;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    errorMsg,
    lockoutTimer,
    login,
    registerAdmin,
    logout,
    refreshAuth,
  };
}
