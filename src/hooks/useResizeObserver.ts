import { useEffect, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

/**
 * Hook that returns the current dimensions of a HTML element.
 * Doesn't play well with SVG.
 */

const useResizeObserver = (ref: any) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

export default useResizeObserver;
