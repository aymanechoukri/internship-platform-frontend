/**
 * Authentication API methods. Endpoint paths should match the backend contract.
 */
import apiClient from './apiClient.js';

export const login = (credentials) => apiClient('/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
});

export const register = (data) => apiClient('/auth/register', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const requestPasswordReset = (email) => apiClient('/auth/forgot-password', {
  method: 'POST',
  body: JSON.stringify({ email }),
});

export const logout = () => apiClient('/auth/logout', { method: 'POST' });
