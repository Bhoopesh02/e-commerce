'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { BannerProductCard } from './BannerProductCard';

interface BannerProductCarouselProps {
  products: Product[];
}

export const BannerProductCarousel: React.FC<BannerProductCarouselProps> = ({
  products,
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
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, products]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = Math.max(260, el.clientWidth * 0.7);
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <div
      className="banner-product-carousel-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        marginTop: 'auto',
      }}
    >
      {/* Navigation Controls Bar */}
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

        {/* Desktop / Tablet Scroll Arrows */}
        {isScrollable && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              style={{
                width: '38px',
                height: '38px',
                minWidth: '38px',
                minHeight: '38px',
                borderRadius: '50%',
                backgroundColor: canScrollLeft ? 'rgba(15, 12, 24, 0.75)' : 'rgba(15, 12, 24, 0.35)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: canScrollLeft ? '1px solid rgba(255, 255, 255, 0.28)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: canScrollLeft ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canScrollLeft ? 'pointer' : 'default',
                transition: 'all 200ms ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              style={{
                width: '38px',
                height: '38px',
                minWidth: '38px',
                minHeight: '38px',
                borderRadius: '50%',
                backgroundColor: canScrollRight ? 'rgba(15, 12, 24, 0.75)' : 'rgba(15, 12, 24, 0.35)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: canScrollRight ? '1px solid rgba(255, 255, 255, 0.28)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: canScrollRight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canScrollRight ? 'pointer' : 'default',
                transition: 'all 200ms ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="banner-product-scroll-track"
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          paddingBottom: '8px',
          paddingRight: '16px',
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              width: 'clamp(140px, 15vw, 180px)',
              minWidth: 'clamp(140px, 15vw, 180px)',
            }}
          >
            <BannerProductCard
              product={product}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
