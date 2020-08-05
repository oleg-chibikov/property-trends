import { useEffect, useRef } from 'react';

/**
 * Hook that returns the last used value.
 */

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default usePrevious;
