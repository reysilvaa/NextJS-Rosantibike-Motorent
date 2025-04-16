import { useEffect, useRef, useState } from 'react';

interface UseAutoScrollOptions {
  shouldScroll: boolean;
  isLoading: boolean;
  hasData: boolean;
  delay?: number;
  indicatorDuration?: number;
}

export function useAutoScroll({
  shouldScroll,
  isLoading,
  hasData,
  delay = 100,
  indicatorDuration = 3000,
}: UseAutoScrollOptions) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showResultIndicator, setShowResultIndicator] = useState(false);

  useEffect(() => {
    if (shouldScroll && !isLoading && hasData) {
      // Scroll to results after a short delay to allow for rendering
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        setShowResultIndicator(true);

        // Hide the indicator after specified duration
        setTimeout(() => {
          setShowResultIndicator(false);
        }, indicatorDuration);
      }, delay);
    }
  }, [shouldScroll, isLoading, hasData, delay, indicatorDuration]);

  return {
    resultsRef,
    showResultIndicator,
  };
}
