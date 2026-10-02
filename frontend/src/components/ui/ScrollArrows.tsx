'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

export function useHorizontalScroll(scrollRef: React.RefObject<HTMLElement | null>) {
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [isScrollable, setIsScrollable] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Use a small epsilon to account for fractional pixel rounding errors
      setCanScrollLeft(Math.ceil(scrollLeft) > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
      setIsScrollable(scrollWidth > clientWidth);
    }
  }, [scrollRef]);

  React.useEffect(() => {
    checkScroll();
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', checkScroll, { passive: true });
      const resizeObserver = new ResizeObserver(() => checkScroll());
      resizeObserver.observe(element);
      return () => {
        element.removeEventListener('scroll', checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, [scrollRef, checkScroll]);

  const scrollLeft = React.useCallback((prefersReducedMotion: boolean = false) => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.firstElementChild as HTMLElement;
      // Get the gap from the parent's gap property if possible, fallback to 16px
      const rawGap = window.getComputedStyle(scrollRef.current).gap;
      const parsedGap = parseInt(rawGap, 10);
      const gap = isNaN(parsedGap) ? 16 : parsedGap;
      const scrollAmount = firstChild ? firstChild.offsetWidth + gap : scrollRef.current.clientWidth;
      
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [scrollRef]);

  const scrollRight = React.useCallback((prefersReducedMotion: boolean = false) => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.firstElementChild as HTMLElement;
      const rawGap = window.getComputedStyle(scrollRef.current).gap;
      const parsedGap = parseInt(rawGap, 10);
      const gap = isNaN(parsedGap) ? 16 : parsedGap;
      const scrollAmount = firstChild ? firstChild.offsetWidth + gap : scrollRef.current.clientWidth;
      
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [scrollRef]);

  return { canScrollLeft, canScrollRight, isScrollable, scrollLeft, scrollRight };
}

interface ScrollArrowsProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  isScrollable: boolean;
  onScrollLeft: (prefersReducedMotion: boolean) => void;
  onScrollRight: (prefersReducedMotion: boolean) => void;
}

export const ScrollArrows: React.FC<ScrollArrowsProps> = ({
  canScrollLeft,
  canScrollRight,
  isScrollable,
  onScrollLeft,
  onScrollRight,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (!isScrollable) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        type="button"
        aria-label="Scroll left"
        disabled={!canScrollLeft}
        onClick={() => onScrollLeft(!!shouldReduceMotion)}
        className="scroll-arrow-btn"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        disabled={!canScrollRight}
        onClick={() => onScrollRight(!!shouldReduceMotion)}
        className="scroll-arrow-btn"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>

      <style jsx>{`
        .scroll-arrow-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: transparent;
          border: 1px solid var(--color-black-tie);
          color: var(--color-black-tie);
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }

        @media (min-width: 768px) {
          .scroll-arrow-btn {
            width: 44px;
            height: 44px;
          }
        }

        .scroll-arrow-btn:hover:not(:disabled) {
          background-color: rgba(69, 25, 82, 0.08); /* Light sapphire tint */
          border-color: var(--color-sapphire); /* Accent color */
          color: var(--color-sapphire);
        }

        .scroll-arrow-btn:focus-visible {
          box-shadow: 0 0 0 2px var(--bg-primary), 0 0 0 4px var(--color-sapphire);
        }

        .scroll-arrow-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};
