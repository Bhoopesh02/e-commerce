'use client';

import { useEffect } from 'react';

let lockCount = 0;
let originalHtmlOverflow = '';
let originalBodyOverflow = '';

/**
 * Locks background scrolling (both <html> and <body>) when active.
 * Uses reference counting so nested or concurrent modals/drawers don't conflict.
 */
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked || typeof document === 'undefined') return;

    if (lockCount === 0) {
      originalHtmlOverflow = document.documentElement.style.overflow;
      originalBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
    lockCount++;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
      }
    };
  }, [isLocked]);
};
