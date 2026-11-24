/**
 * React state synchronized with localStorage.
 * Supports both direct values and functional state updates.
 */
import { useCallback, useState } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    const nextValue = typeof value === 'function' ? value(storedValue) : value;
    setStoredValue(nextValue);

    try {
      window.localStorage.setItem(key, JSON.stringify(nextValue));
    } catch (error) {
      console.error(`useLocalStorage: failed to persist "${key}"`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
