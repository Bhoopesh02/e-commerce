import React, { useRef, useState, useEffect } from 'react';
import { Product } from '@/types';
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NewArrivalsCarouselProps {
  products: Product[];
  loading?: boolean;
}

export const NewArrivalsCarousel: React.FC<NewArrivalsCarouselProps> = ({
  products,
  loading = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [products, loading]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      // update scrollability after animation
      setTimeout(checkScrollability, 350);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    checkScrollability();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5; // smoother drag
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <section className="new-arrivals-section" style={{ padding: '60px 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ position: 'relative' }}>
        <ScrollReveal duration={0.5}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '40px',
              gap: '16px',
            }}
          >
            <div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                New Arrivals
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: canScrollLeft ? 'pointer' : 'default',
                    opacity: canScrollLeft ? 1 : 0.2,
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={28} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: canScrollRight ? 'pointer' : 'default',
                    opacity: canScrollRight ? 1 : 0.2,
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                  aria-label="Scroll right"
                >
                  <ChevronRight size={28} strokeWidth={1.5} />
                </button>
              </div>
              <Link
                href="/shop?tag=new-arrival"
                className="editorial-arrow-link"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px'
                }}
              >
                <span className="editorial-arrow-link-text">
                  <span className="desktop-only">View All</span>
                  <span className="mobile-only">View All</span>
                </span>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <div style={{ position: 'relative', width: '100%' }}>

          <div
            ref={scrollContainerRef}
            onScroll={checkScrollability}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{
              display: 'flex',
              overflowX: 'auto',
              scrollBehavior: isDragging ? 'auto' : 'smooth',
              gap: '24px',
              paddingBottom: '20px',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE and Edge
              cursor: isDragging ? 'grabbing' : 'grab',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: isDragging ? 'none' : 'x mandatory'
            }}
            className="hide-scrollbar"
          >
            {loading || products.length === 0 ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="carousel-product-item">
                  <ProductCardSkeleton />
                </div>
              ))
            ) : (
              products.map((product, idx) => (
                <div key={product.id} className="carousel-product-item">
                  <ScrollReveal delay={idx * 0.08} duration={0.5}>
                    <ProductCard product={product} priority={true} />
                  </ScrollReveal>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .carousel-product-item {
          flex-shrink: 0;
          scroll-snap-align: start;
          width: calc(50% - 12px); /* 2 items on mobile */
        }
        @media (min-width: 640px) {
          .carousel-product-item {
            width: calc(33.333% - 16px); /* 3 items on tablet */
          }
        }
        @media (min-width: 1024px) {
          .carousel-product-item {
            width: calc(25% - 18px); /* 4 items on desktop */
          }
        }
      `}} />
    </section>
  );
};
