import { useEffect, useRef } from 'react';

/**
 * A debounce hook that delays the execution of a callback function.
 *
 * @param {Function} callback - The function to be executed.
 * @param {Number} delay - The delay in milliseconds.
 * @param {Boolean} immediate - Determines whether the callback is executed immediately on initial render.
 */
const useDebounce = (callback, delay = 300, immediate = false) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (immediate) {
      callback();
    }
  }, []);

  return (...args) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
};

export default useDebounce;
