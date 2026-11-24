/**
 * @file context/AuthContext.jsx
 * @description Shared authentication state with persisted user session metadata.
 *
 * The access token is still stored in localStorage for this frontend prototype.
 * Production authentication should preferably use secure, HttpOnly cookies.
 */

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext(undefined);

const STORAGE_KEY = 'internship-platform-session';

function readStoredSession() {
  try {
    const rawSession = localStorage.getItem(STORAGE_KEY);
    if (!rawSession) return { user: null, token: null };

    const session = JSON.parse(rawSession);
    if (!session || typeof session !== 'object') {
      return { user: null, token: null };
    }

    return {
      user: session.user && typeof session.user === 'object' ? session.user : null,
      token: typeof session.token === 'string' ? session.token : null,
    };
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [initialSession] = useState(readStoredSession);
  const [user, setUser] = useState(initialSession.user);
  const [token, setToken] = useState(initialSession.token);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((userData, authToken) => {
    if (!userData || typeof userData !== 'object') {
      throw new Error('A valid user object is required.');
    }
    if (typeof authToken !== 'string' || !authToken.trim()) {
      throw new Error('A valid authentication token is required.');
    }

    const session = { user: userData, token: authToken };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    localStorage.removeItem('token');
    setUser(userData);
    setToken(authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('token');
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      setIsLoading,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
