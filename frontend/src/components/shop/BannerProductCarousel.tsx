'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { BannerProductCard, BannerProductCardSkeleton } from './BannerProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

export const BannerProductCarouselSkeleton: React.FC = () => {
  return (
    <div
      className="banner-product-carousel-wrapper banner-product-carousel-skeleton"
      style={{
        position: 'relative',
        width: '100%',
        marginTop: 'auto',
      }}
      aria-hidden="true"
    >
      {/* Navigation Controls Bar Skeleton */}
      <div
        className="carousel-controls-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          padding: '0 4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Skeleton width="180px" height="18px" borderRadius="4px" />
        </div>
      </div>

      {/* Horizontal Scroll Track Skeleton */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'hidden',
          paddingBottom: '8px',
          paddingLeft: '4px',
          paddingRight: '4px',
        }}
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              width: 'clamp(150px, 16vw, 190px)',
              minWidth: 'clamp(150px, 16vw, 190px)',
              flexShrink: 0,
            }}
          >
            <BannerProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

interface BannerProductCarouselProps {
  products?: Product[];
  isLoading?: boolean;
}

export const BannerProductCarousel: React.FC<BannerProductCarouselProps> = ({
  products = [],
  isLoading = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    const hasOverflow = maxScroll > 4;

    setIsScrollable(hasOverflow);
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < maxScroll - 6);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => checkScroll());
      resizeObserver.observe(el);
    }

    const timer = setTimeout(checkScroll, 200);

    return () => {
      clearTimeout(timer);
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [checkScroll, products, isLoading]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    
    const firstChild = el.firstElementChild as HTMLElement;
    if (!firstChild) return;
    
    const gap = 20; // Based on the track's inline gap style
    const scrollAmount = firstChild.offsetWidth + gap;
    
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (isLoading) {
    return <BannerProductCarouselSkeleton />;
  }

  if (!products || products.length === 0) return null;

  return (
    <div
      className="banner-product-carousel-wrapper"
      style={{
        width: '100%',
        marginTop: 'auto',
      }}
    >
      {/* Navigation Controls Bar (Desktop & Tablet) */}
      <div
        className="carousel-controls-bar"
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          padding: '0 4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255, 248, 245, 0.85)',
            }}
          >
            Featured Silhouettes ({products.length})
          </span>
        </div>

        {/* Desktop / Tablet Scroll Arrows (Ghost) */}
        {isScrollable && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              style={{
                width: '32px',
                height: '32px',
                minWidth: '32px',
                minHeight: '32px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                color: canScrollLeft ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canScrollLeft ? 'pointer' : 'default',
                transition: 'all 200ms ease',
                padding: 0,
                filter: canScrollLeft ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))' : 'none',
              }}
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              style={{
                width: '32px',
                height: '32px',
                minWidth: '32px',
                minHeight: '32px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                color: canScrollRight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canScrollRight ? 'pointer' : 'default',
                transition: 'all 200ms ease',
                padding: 0,
                filter: canScrollRight ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))' : 'none',
              }}
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile View Navigation Controls (Below Heading) */}
      {isScrollable && (
        <div
          className="mobile-carousel-arrows-container"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            marginBottom: '12px',
            paddingRight: '16px',
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleScroll('left');
            }}
            disabled={!canScrollLeft}
            aria-label="Scroll banner products left"
            className="mobile-carousel-arrow mobile-carousel-arrow-left"
            style={{
              width: '32px',
              height: '32px',
              minWidth: '32px',
              minHeight: '32px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              color: canScrollLeft ? '#FFFFFF' : 'rgba(255, 255, 255, 0.28)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollLeft ? 'pointer' : 'default',
              padding: 0,
              filter: canScrollLeft ? 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.85))' : 'none',
              transition: 'all 200ms ease',
              pointerEvents: canScrollLeft ? 'auto' : 'none',
            }}
          >
            <ChevronLeft size={22} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleScroll('right');
            }}
            disabled={!canScrollRight}
            aria-label="Scroll banner products right"
            className="mobile-carousel-arrow mobile-carousel-arrow-right"
            style={{
              width: '32px',
              height: '32px',
              minWidth: '32px',
              minHeight: '32px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              color: canScrollRight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.28)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollRight ? 'pointer' : 'default',
              padding: 0,
              filter: canScrollRight ? 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.85))' : 'none',
              transition: 'all 200ms ease',
              pointerEvents: canScrollRight ? 'auto' : 'none',
            }}
          >
            <ChevronRight size={22} strokeWidth={2.2} />
          </button>
        </div>
      )}

      {/* Horizontal Scroll Track Container */}
      <div
        className="banner-product-scroll-container"
        style={{
          position: 'relative',
          width: '100%',
        }}
      >


        {/* Horizontal Scroll Track */}
        <div
          ref={scrollRef}
          className="banner-product-scroll-track"
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            paddingBottom: '8px',
            paddingLeft: '4px',
            paddingRight: '4px',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                width: 'clamp(150px, 16vw, 190px)',
                minWidth: 'clamp(150px, 16vw, 190px)',
                flexShrink: 0,
              }}
            >
              <BannerProductCard
                product={product}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
