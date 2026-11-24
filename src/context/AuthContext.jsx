/**
 * Authentication context with session persistence.
 * Prefer secure HttpOnly cookies for production authentication.
 */
import { createContext, useCallback, useMemo, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(undefined);
const STORAGE_KEY = 'internship-platform-session';

function readStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    const session = JSON.parse(raw);
    return {
      user: session?.user && typeof session.user === 'object' ? session.user : null,
      token: typeof session?.token === 'string' ? session.token : null,
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

  const login = useCallback((userData, authToken, rememberMe = false) => {
    if (!userData || typeof userData !== 'object') throw new Error('A valid user object is required.');
    if (typeof authToken !== 'string' || !authToken.trim()) throw new Error('A valid authentication token is required.');

    const session = JSON.stringify({ user: userData, token: authToken });
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    (rememberMe ? localStorage : sessionStorage).setItem(STORAGE_KEY, session);
    localStorage.removeItem('token');
    setUser(userData);
    setToken(authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('token');
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    isLoading,
    setIsLoading,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
  }), [user, token, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
