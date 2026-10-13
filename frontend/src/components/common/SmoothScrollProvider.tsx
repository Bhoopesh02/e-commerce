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

  // Handle route changes and cross-page hash navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (hash && hash !== '#') {
      const timer = setTimeout(() => {
        try {
          const el = document.querySelector(hash);
          if (el) {
            const navOffset = window.innerWidth <= 767 ? -64 : -76;
            smoothScrollService.scrollTo(el as HTMLElement, { offset: navOffset });
            return;
          }
        } catch {
          // ignore invalid query selector
        }
      }, 120);
      return () => clearTimeout(timer);
    } else {
      smoothScrollService.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  // Intercept on-page hash links for smooth Lenis scrolling
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      const isHomepage = window.location.pathname === '/';
      let hash = '';
      if (href.startsWith('#')) {
        hash = href;
      } else if (isHomepage && href.startsWith('/#')) {
        hash = href.slice(1);
      }

      if (hash && hash !== '#') {
        try {
          const el = document.querySelector(hash);
          if (el) {
            e.preventDefault();
            window.history.pushState(null, '', hash);
            const navOffset = window.innerWidth <= 767 ? -64 : -76;
            smoothScrollService.scrollTo(el as HTMLElement, { offset: navOffset });
          }
        } catch {
          // fallback to default navigation
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return <>{children}</>;
}

export default SmoothScrollProvider;
