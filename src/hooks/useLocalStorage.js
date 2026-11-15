/**
 * @file hooks/useLocalStorage.js
 * @description Syncs a piece of state with localStorage.
 * Useful for persisting tokens, user preferences, etc.
 *
 * @template T
 * @param {string} key - The localStorage key
 * @param {T} initialValue - Fallback value when nothing is stored
 * @returns {[T, (value: T) => void]}
 */

import { useState } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`useLocalStorage: failed to set "${key}"`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
