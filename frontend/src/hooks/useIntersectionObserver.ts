import { useEffect, useRef, useCallback } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  onIntersect: () => void;
  enabled?: boolean;
}

export const useIntersectionObserver = ({
  onIntersect,
  root = null,
  rootMargin = '0px',
  threshold = 1.0,
  enabled = true
}: UseIntersectionObserverOptions) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && enabled) {
        onIntersect();
      }
    },
    [onIntersect, enabled]
  );

  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    const observer = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin,
      threshold
    });

    const currentTarget = targetRef.current;
    observer.observe(currentTarget);

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleIntersect, root, rootMargin, threshold, enabled]);

  return targetRef;
};
