'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  API_BASE_URL,
  refreshAuthSession,
  setAuthSession,
  subscribeToAuthSession,
} from '@/utils/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = subscribeToAuthSession((session) => {
      if (!mounted) return;
      setToken(session.token);
      setUser(session.user);
    });

    // Remove tokens from the previous localStorage-based session implementation.
    localStorage.removeItem('fanhub_token');
    localStorage.removeItem('fanhub_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    refreshAuthSession()
      .catch(() => setAuthSession(null, null))
      .finally(() => {
        if (mounted) setIsAuthLoading(false);
      });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!token) return undefined;

    let delay = 12 * 60 * 1000;
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')));
      if (decoded.exp) {
        delay = Math.max(1000, decoded.exp * 1000 - Date.now() - 2 * 60 * 1000);
      }
    } catch {
      delay = 1000;
    }

    const timeout = setTimeout(() => {
      refreshAuthSession().catch(() => {});
    }, delay);

    const refreshWhenReturning = () => {
      if (document.visibilityState === 'visible') {
        try {
          const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
          const decoded = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')));
          if (decoded.exp && decoded.exp * 1000 - Date.now() > 2 * 60 * 1000) return;
        } catch {
          // A malformed or expired access token is refreshed below.
        }
        refreshAuthSession().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', refreshWhenReturning);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', refreshWhenReturning);
    };
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Login failed.');

    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionHint: data.sessionHint }),
      });
    } catch (sessionErr) {
      console.warn('Session cookie sync warning:', sessionErr);
    }

    setAuthSession(data.accessToken, data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Registration failed.');

    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionHint: data.sessionHint }),
      });
    } catch (sessionErr) {
      console.warn('Session cookie sync warning:', sessionErr);
    }

    setAuthSession(data.accessToken, data.user);
    return data;
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.warn('Could not reach the logout endpoint; clearing local session.', error);
    } finally {
      await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {});
      setAuthSession(null, null);
      router.push('/login');
    }
  };

  const updateUser = (updatedUser) => {
    setAuthSession(token, updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
