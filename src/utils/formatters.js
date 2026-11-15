/**
 * @file utils/formatters.js
 * @description Pure formatting helpers (dates, strings, numbers).
 * No side-effects — safe to use anywhere.
 */

/**
 * Format an ISO date string to a localised display string.
 * @param {string} isoString
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string}
 */
export function formatDate(isoString, options = { year: 'numeric', month: 'short', day: 'numeric' }) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString(undefined, options);
}

/**
 * Truncate a string to a maximum length, appending an ellipsis.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength = 100) {
  if (!str || str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
}
