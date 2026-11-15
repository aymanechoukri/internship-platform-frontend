/**
 * @file services/authService.js
 * @description Authentication API calls (login, register, logout, refresh).
 * Consumes apiClient — does not call fetch directly.
 */

import apiClient from './apiClient.js';

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function login(credentials) {
  return apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * @param {{ name: string, email: string, password: string, role: string }} data
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function register(data) {
  return apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * @returns {Promise<void>}
 */
export async function logout() {
  return apiClient('/auth/logout', { method: 'POST' });
}
