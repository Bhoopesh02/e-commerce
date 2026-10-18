'use client';

import { useState, useEffect, useLayoutEffect, RefObject } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface DropdownPositionStyle {
  left?: number | string;
  right?: number | string;
  width?: string;
  maxWidth?: string;
}

/**
 * Hook to dynamically calculate a dropdown's horizontal position so that
 * it never clips off the left or right edges of the viewport on mobile or desktop.
 *
 * @param triggerRef Ref to the container or button triggering the dropdown
 * @param isOpen Whether the dropdown is currently visible
 * @param targetWidth Desired width of the dropdown in px (default 300)
 * @param padding Safe viewport edge margin in px (default 12)
 */
export function useDropdownPosition(
  triggerRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  targetWidth: number = 300,
  padding: number = 12
): DropdownPositionStyle {
  const [style, setStyle] = useState<DropdownPositionStyle>({
    left: 0,
    right: 'auto',
    width: `${targetWidth}px`,
    maxWidth: `calc(100vw - ${padding * 2}px)`,
  });

  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const el = triggerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const maxAvailableWidth = Math.max(0, viewportWidth - padding * 2);
      const effectiveWidth = Math.min(targetWidth, maxAvailableWidth);

      // Default left offset is 0 (align with left of trigger)
      let leftOffset = 0;

      // If opening at left: 0 would clip past the right edge of viewport:
      if (rect.left + effectiveWidth > viewportWidth - padding) {
        leftOffset = viewportWidth - padding - rect.left - effectiveWidth;
      }

      // If shifting left pushes the left edge past the left edge of viewport:
      if (rect.left + leftOffset < padding) {
        leftOffset = padding - rect.left;
      }

      setStyle({
        left: `${Math.round(leftOffset)}px`,
        right: 'auto',
        width: `${effectiveWidth}px`,
        maxWidth: `calc(100vw - ${padding * 2}px)`,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, triggerRef, targetWidth, padding]);

  return style;
}
