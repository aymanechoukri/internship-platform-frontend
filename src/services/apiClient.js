/**
 * Shared HTTP client. Adds the current bearer token and normalizes API errors.
 */
const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api').replace(/\/$/, '');
const SESSION_KEY = 'internship-platform-session';

function readToken() {
  try {
    const stored = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored)?.token ?? null : localStorage.getItem('token');
  } catch {
    return localStorage.getItem('token');
  }
}

async function apiClient(endpoint, options = {}) {
  const token = readToken();
  const headers = new Headers(options.headers ?? {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Cannot reach the API. Check that the backend is running and VITE_API_URL is correct.');
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.message ?? payload?.error ?? `Request failed (${response.status} ${response.statusText}).`;
    throw new Error(message);
  }

  if (response.status === 204) return null;
  if (options.responseType === "blob") return response.blob();
  const contentType = response.headers.get('content-type') ?? '';
  return contentType.includes('application/json') ? response.json() : response.text();
}

export default apiClient;
