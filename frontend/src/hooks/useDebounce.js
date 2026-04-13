import { useState, useEffect } from 'react';

/**
 * Custom Hook: Debounce sebuah value agar tidak berubah terlalu cepat.
 * Cocok untuk pencarian server-side agar tidak spam API setiap keystroke.
 * @param {*} value - Value yang ingin di-debounce
 * @param {number} delay - Delay dalam milidetik (default: 500ms)
 * @returns {*} Debounced value
 */
export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel timer jika value berubah sebelum delay selesai
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
