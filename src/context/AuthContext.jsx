/**
 * @file context/AuthContext.jsx
 * @description Authentication context — provides the authenticated user, token,
 * login/logout actions, and loading state to the entire component tree.
 *
 * @typedef {{ user: object|null, token: string|null, isLoading: boolean, login: Function, logout: Function }} AuthContextValue
 */

import { createContext, useCallback, useMemo, useState } from 'react';

/** @type {React.Context<AuthContextValue|undefined>} */
export const AuthContext = createContext(undefined);

/**
 * Wrap the application (or a subtree) with this provider to give
 * descendant components access to authentication state.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (userData, authToken) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('token', authToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  const value = useMemo(
    () => ({ user, token, isLoading, setIsLoading, login, logout }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
