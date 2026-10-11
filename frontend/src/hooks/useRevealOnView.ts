'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

export interface UseRevealOnViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnMount?: boolean;
}

/**
 * Reusable hook to trigger entrance animations on intersection or mount.
 * Adds 'is-visible' class to the referenced element once when threshold is reached,
 * then unobserves (plays once, never replays on scroll).
 */
export function useRevealOnView<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  options: UseRevealOnViewOptions = {}
): boolean {
  const { threshold = 0.25, rootMargin = '0px', triggerOnMount = false } = options;
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasTriggeredRef.current) return;

    const trigger = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      el.classList.add('is-visible');
      setIsVisible(true);
    };

    if (triggerOnMount) {
      const raf = requestAnimationFrame(() => {
        trigger();
      });
      return () => cancelAnimationFrame(raf);
    }

    if (typeof IntersectionObserver === 'undefined') {
      trigger();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio >= threshold) {
            trigger();
            observer.unobserve(el);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, triggerOnMount]);

  return isVisible;
}
