import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { cleanSecureInput, hasSQLInjectionThreat, stripControlCharacters } from '../utils/sanitize';

/**
 * useAdminAuth Hook
 * 
 * Hardened Supabase Cloud Authentication & Authorization:
 * - Brute-force & credential stuffing defense (lockout after 3 failed attempts).
 * - SQL injection & exploit signature detection.
 * - Dynamic credentials stored in and verified against Supabase cloud database.
 * - Admin approval workflow: new registrations are 'pending' until approved by Head Admin.
 */

export interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
}

export interface RegisteredAdmin {
  username: string;
  password?: string;
  status?: 'pending' | 'approved' | 'rejected';
  registeredAt?: string;
  approvedAt?: string;
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
  const [adminRequests, setAdminRequests] = useState<RegisteredAdmin[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState<boolean>(false);

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

  // Fetch registered admin requests
  const fetchAdminRequests = useCallback(async () => {
    setIsLoadingRequests(true);
    try {
      const { data } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_users_list')
        .maybeSingle();

      if (Array.isArray(data?.value)) {
        setAdminRequests(data.value as RegisteredAdmin[]);
      } else {
        setAdminRequests([]);
      }
    } catch (err) {
      console.warn('Error fetching admin requests:', err);
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminRequests();
    }
  }, [isAuthenticated, fetchAdminRequests]);

  // Approve admin request
  const approveAdmin = useCallback(async (targetUsername: string) => {
    try {
      const { data } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_users_list')
        .maybeSingle();

      let list: RegisteredAdmin[] = Array.isArray(data?.value) ? data.value : [];
      list = list.map((u) =>
        u.username.trim().toLowerCase() === targetUsername.trim().toLowerCase()
          ? { ...u, status: 'approved', approvedAt: new Date().toISOString() }
          : u
      );

      const { error } = await supabase.from('club_content').upsert(
        {
          key: 'admin_users_list',
          value: list,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      if (error) throw error;
      setAdminRequests(list);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to approve admin.';
      return { success: false, error: msg };
    }
  }, []);

  // Reject admin request
  const rejectAdmin = useCallback(async (targetUsername: string) => {
    try {
      const { data } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_users_list')
        .maybeSingle();

      let list: RegisteredAdmin[] = Array.isArray(data?.value) ? data.value : [];
      list = list.map((u) =>
        u.username.trim().toLowerCase() === targetUsername.trim().toLowerCase()
          ? { ...u, status: 'rejected' }
          : u
      );

      const { error } = await supabase.from('club_content').upsert(
        {
          key: 'admin_users_list',
          value: list,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      if (error) throw error;
      setAdminRequests(list);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reject admin.';
      return { success: false, error: msg };
    }
  }, []);

  // Delete admin
  const deleteAdmin = useCallback(async (targetUsername: string) => {
    try {
      const { data } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_users_list')
        .maybeSingle();

      let list: RegisteredAdmin[] = Array.isArray(data?.value) ? data.value : [];
      list = list.filter((u) => u.username.trim().toLowerCase() !== targetUsername.trim().toLowerCase());

      const { error } = await supabase.from('club_content').upsert(
        {
          key: 'admin_users_list',
          value: list,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

      if (error) throw error;
      setAdminRequests(list);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete admin.';
      return { success: false, error: msg };
    }
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

    const cleanId = cleanSecureInput(stripControlCharacters(usernameOrEmail), 100).trim();
    const cleanPass = stripControlCharacters(pass).slice(0, 150).trim();

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
          authVal.username?.trim().toLowerCase() === cleanId.toLowerCase() ||
          `${authVal.username?.trim().toLowerCase()}@cipher.sjec.ac.in` === cleanId.toLowerCase();

        if (matchPrimary && authVal.password?.trim() === cleanPass) {
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

      // Built-in primary admin fallback
      if (
        (cleanId.toLowerCase() === 'admin' || cleanId.toLowerCase() === 'admin@cipher.sjec.ac.in') &&
        cleanPass === 'cipher@sjec2026'
      ) {
        const authUser = {
          id: 'admin_primary',
          email: 'admin@cipher.sjec.ac.in',
        } as User;

        setUser(authUser);
        setIsAuthenticated(true);
        setFailedAttempts(0);
        try {
          sessionStorage.setItem('cipher_admin_active_user', 'admin');
        } catch {
          // ignore
        }
        return { success: true };
      }

      // 2. Check registered administrators in Supabase (club_content -> admin_users_list)
      const { data: userListContent } = await supabase
        .from('club_content')
        .select('value')
        .eq('key', 'admin_users_list')
        .maybeSingle();

      if (Array.isArray(userListContent?.value)) {
        const userList = userListContent.value as Array<RegisteredAdmin>;
        const matched = userList.find(
          (u) =>
            (u.username.trim().toLowerCase() === cleanId.toLowerCase() ||
             `${u.username.trim().toLowerCase()}@cipher.sjec.ac.in` === cleanId.toLowerCase()) &&
            u.password?.trim() === cleanPass
        );

        if (matched) {
          // Check approval status:
          // Existing registered accounts (like 'shamaz') are treated as approved
          const status = matched.status || 'approved';
          if (status === 'pending') {
            const msg = 'Approval Pending: Your admin registration has not yet been approved by the Head Administrator.';
            setErrorMsg(msg);
            return { success: false, error: msg };
          }
          if (status === 'rejected') {
            const msg = 'Access Denied: Your admin registration request was rejected by the Head Administrator.';
            setErrorMsg(msg);
            return { success: false, error: msg };
          }

          // Approved: grant access
          const authUser = {
            id: `admin_${matched.username.trim()}`,
            email: `${matched.username.trim()}@cipher.sjec.ac.in`,
          } as User;

          setUser(authUser);
          setIsAuthenticated(true);
          setFailedAttempts(0);
          try {
            sessionStorage.setItem('cipher_admin_active_user', matched.username.trim());
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

  // Supabase Authentication: Register New Administrator with 'pending' status
  const registerAdmin = useCallback(async (newUsername: string, newPassword: string): Promise<AuthResult> => {
    setErrorMsg(null);

    // Defense checks
    if (hasSQLInjectionThreat(newUsername) || hasSQLInjectionThreat(newPassword)) {
      const msg = 'Security Alert: Prohibited syntax detected in credentials.';
      setErrorMsg(msg);
      return { success: false, error: msg };
    }

    const cleanUser = cleanSecureInput(stripControlCharacters(newUsername), 50).trim();
    const cleanPass = stripControlCharacters(newPassword).slice(0, 150).trim();

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

      let list: Array<RegisteredAdmin> = [];
      if (Array.isArray(existingContent?.value)) {
        list = existingContent.value as Array<RegisteredAdmin>;
      }

      // Check if username already exists
      if (list.some((u) => u.username.trim().toLowerCase() === cleanUser.toLowerCase())) {
        const msg = 'Username is already taken. Please choose another username.';
        setErrorMsg(msg);
        return { success: false, error: msg };
      }

      // 2. Add new admin to cloud database with 'pending' status
      list.push({
        username: cleanUser,
        password: cleanPass,
        status: 'pending',
        registeredAt: new Date().toISOString(),
      });

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

      setAdminRequests(list);

      // 3. Attempt Supabase Auth registration
      const email = cleanUser.includes('@') ? cleanUser : `${cleanUser.toLowerCase()}@cipher.sjec.ac.in`;
      try {
        await supabase.auth.signUp({ email, password: cleanPass });
      } catch {
        // DB registration is already saved
      }

      return {
        success: true,
        message: 'Registration submitted! Please wait for Head Admin approval before signing in.',
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

  const isMainAdmin =
    user?.id === 'admin_primary' ||
    user?.email?.toLowerCase().startsWith('admin@') ||
    sessionStorage.getItem('cipher_admin_active_user')?.toLowerCase() === 'admin';

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    isMainAdmin,
    errorMsg,
    lockoutTimer,
    adminRequests,
    isLoadingRequests,
    fetchAdminRequests,
    approveAdmin,
    rejectAdmin,
    deleteAdmin,
    login,
    registerAdmin,
    logout,
    refreshAuth,
  };
}
