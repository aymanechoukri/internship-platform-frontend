/**
 * @file services/apiClient.js
 * @description Base API client configuration.
 * Centralises the base URL, default headers, and response/error handling.
 * All service modules should use this client — not raw fetch directly.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

/**
 * Wrapper around the native fetch API with consistent base URL,
 * JSON headers, and error normalisation.
 *
 * @param {string} endpoint - Path relative to BASE_URL (e.g. '/auth/login')
 * @param {RequestInit} [options] - Standard fetch options
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} On non-2xx HTTP responses
 */
async function apiClient(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message ?? 'An unexpected error occurred.');
  }

  return response.json();
}

export default apiClient;
