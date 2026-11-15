/**
 * @file utils/validators.js
 * @description Pure validation helpers for form fields and data integrity.
 */

/**
 * Check whether a string is a valid email address.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Check whether a password meets minimum security requirements.
 * @param {string} password
 * @returns {boolean}
 */
export function isStrongPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}
