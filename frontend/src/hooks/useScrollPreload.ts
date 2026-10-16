'use client';

import { useEffect, useRef, useState, RefObject } from 'react';
import { preloadImages } from '@/lib/preloadImage';

export interface UseScrollPreloadOptions<T extends HTMLElement = HTMLElement> {
  /**
   * Distance ahead of the viewport to trigger preloading.
   * Defaults to '600px 0px' (approx. 1 to 1.5 screen heights ahead).
   */
  rootMargin?: string;
  /**
   * Intersection threshold (0 means as soon as the element or its margin touches).
   */
  threshold?: number;
  /**
   * If true, skips the intersection observer and immediately preloads on mount.
   */
  immediate?: boolean;
  /**
   * Optional external ref to attach to instead of creating an internal ref.
   */
  ref?: RefObject<T | null>;
}

/**
 * Hook to preload images in the background when the target element scrolls
 * within a lookahead margin of the viewport.
 * Disconnects observer once triggered for optimal performance and zero overhead.
 */
export function useScrollPreload<T extends HTMLElement = HTMLElement>(
  imageUrls: (string | undefined | null)[],
  options: UseScrollPreloadOptions<T> = {}
): {
  ref: RefObject<T | null>;
  hasPreloaded: boolean;
} {
  const {
    rootMargin = '600px 0px',
    threshold = 0,
    immediate = false,
    ref: externalRef,
  } = options;

  const internalRef = useRef<T | null>(null);
  const targetRef = externalRef || internalRef;
  const [hasPreloaded, setHasPreloaded] = useState(immediate);
  const hasTriggeredRef = useRef(immediate);

  useEffect(() => {
    if (hasTriggeredRef.current) return;

    const el = targetRef.current;
    if (!el) return;

    // Filter valid URLs
    const urlsToPreload = imageUrls.filter((url): url is string => Boolean(url));
    if (urlsToPreload.length === 0) return;

    const triggerPreload = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      setHasPreloaded(true);
      preloadImages(urlsToPreload);
    };

    if (immediate) {
      triggerPreload();
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Graceful fallback for non-supporting environments
      triggerPreload();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            triggerPreload();
            observer.unobserve(el);
            observer.disconnect();
            break;
          }
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, imageUrls, rootMargin, threshold, immediate]);

  return {
    ref: targetRef,
    hasPreloaded,
  };
}
