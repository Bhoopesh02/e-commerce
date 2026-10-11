'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { smoothScrollService } from '@/services/smooth-scroll';

export interface SmoothScrollProviderProps {
  children?: ReactNode;
}

/**
 * Root component provider for momentum-style smooth inertia scrolling.
 * - Starts smooth scroll on mount and cleans up on unmount.
 * - Resets scroll position to top immediately on route changes.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    smoothScrollService.start();

    return () => {
      smoothScrollService.destroy();
    };
  }, []);

  // Reset scroll to top on route change
  useEffect(() => {
    smoothScrollService.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}

export default SmoothScrollProvider;
