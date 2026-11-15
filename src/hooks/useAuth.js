/**
 * @file hooks/useAuth.js
 * @description Convenience hook for consuming the AuthContext.
 * Throws early if used outside of <AuthProvider>.
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * @returns {import('../context/AuthContext.jsx').AuthContextValue}
 */
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}

export default useAuth;
