import { useEffect, useRef } from 'react';

/**
 * Custom React hook that mimics useEffect but skips the initial render and runs the provided callback on subsequent renders.
 *
 * This hook is useful for preventing side effects from running on the initial render, such as fetching data from an API or setting up a subscription.

 * @param {function} callback @returns {function} - The callback function to run on subsequent renders. A cleanup function is returned(optional)
 * @param {Array} dependencies - An array of dependencies to trigger the callback on change.
 */
const useEffectSkipInitial = (callback, dependencies) => {
  const isInitialRender = useRef(true);

  useEffect(() => {
    // checks if initial render
    if (isInitialRender.current) {
      // set the initial render value to false if initial render
      isInitialRender.current = false;
    } else {
      // invokes the callback function.
      // a cleanup function is optional.
      const cleanup = callback();
      // checks the returned value is a function and executes if it is a function.
      return () => typeof cleanup === 'function' && cleanup();
    }
  }, dependencies);
};

export default useEffectSkipInitial;
