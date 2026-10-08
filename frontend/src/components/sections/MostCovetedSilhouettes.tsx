'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCardSkeleton } from '@/components/product/ProductCard';

interface MostCovetedSilhouettesProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  onExploreClick?: () => void;
}

const EASE_LUXURY = [0.22, 1, 0.36, 1] as const;

export const MostCovetedSilhouettes: React.FC<MostCovetedSilhouettesProps> = ({
  products,
  title = 'Most Coveted Silhouettes',
  subtitle = 'House Signatures',
  isLoading = false,
  onExploreClick,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftAmount, setScrollLeftAmount] = useState(0);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const [imageHeight, setImageHeight] = useState<number>(0);

  const updateImageHeight = () => {
    if (scrollRef.current) {
      const firstImg = scrollRef.current.querySelector('img');
      if (firstImg && firstImg.clientHeight > 0) {
        setImageHeight(firstImg.clientHeight);
      }
    }
  };

  useEffect(() => {
    checkScrollability();
    updateImageHeight();
    window.addEventListener('resize', checkScrollability);
    window.addEventListener('resize', updateImageHeight);

    let ro: ResizeObserver | null = null;
    if (scrollRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        checkScrollability();
        updateImageHeight();
      });
      ro.observe(scrollRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkScrollability);
      window.removeEventListener('resize', updateImageHeight);
      if (ro) ro.disconnect();
    };
  }, [products, isLoading]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstItem = container.firstElementChild as HTMLElement;
      
      if (!firstItem) return;
      
      const gap = 16; 
      const itemWidth = firstItem.offsetWidth + gap;
      
      const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      setTimeout(checkScrollability, 350);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeftAmount(scrollRef.current?.scrollLeft || 0);
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
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeftAmount - walk;
    }
  };

  const items = products;

  // Trigger entrance when the section enters the viewport, strictly once per page load
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Staggered grid container entrance: ~90ms stagger per card, strictly once per page load
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.09,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  // Card entrance variant: opacity 0, y 35 -> opacity 1, y 0 over 500ms with --ease-luxury
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 35,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: EASE_LUXURY,
      },
    },
  };

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: EASE_LUXURY,
      },
    },
  };


  return (
    <section ref={sectionRef} className="most-coveted-section" style={{ padding: '80px 0', backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
        {/* Left Column: Text & CTA */}
        <motion.div
          initial="hidden"
          animate={isSectionInView ? 'visible' : 'hidden'}
          variants={headerVariants}
          style={{
            flex: '1 1 300px',
            minWidth: '280px',
            maxWidth: '350px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              fontFamily: 'var(--font-display, serif)',
              fontWeight: 400,
              marginBottom: '16px',
              color: 'var(--text-primary)'
            }}>
              {title}
            </h2>
            <span
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-primary)',
                display: 'block',
              }}
            >
              {subtitle}
            </span>
          </div>

          <div style={{ marginTop: '16px' }}>
            {onExploreClick ? (
              <button
                onClick={onExploreClick}
                style={{
                  backgroundColor: '#000',
                  color: '#fff',
                  padding: '16px 48px',
                  border: 'none',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                  width: 'max-content',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
              >
                Shop now
              </button>
            ) : (
              <Link
                href="/shop"
                style={{
                  backgroundColor: '#000',
                  color: '#fff',
                  padding: '16px 48px',
                  display: 'inline-block',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
              >
                Shop now
              </Link>
            )}
          </div>
        </motion.div>

        {/* Right Column: Carousel */}
        <div style={{ flex: '999 1 600px', minWidth: '0', position: 'relative' }}>
          {/* Scroll Buttons - Positioned vertically centered on the product images */}
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            style={{ 
              position: 'absolute', 
              left: '16px', 
              top: imageHeight > 0 ? `${imageHeight / 2}px` : 'clamp(133px, 13.33vw, 186.5px)', 
              transform: 'translateY(-50%)', 
              zIndex: 10,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollLeft ? 'pointer' : 'default',
              color: 'var(--text-primary)',
              opacity: canScrollLeft ? 1 : 0,
              pointerEvents: canScrollLeft ? 'auto' : 'none',
              transition: 'opacity 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (canScrollLeft) {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.18)';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }}
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            style={{ 
              position: 'absolute', 
              right: '16px', 
              top: imageHeight > 0 ? `${imageHeight / 2}px` : 'clamp(133px, 13.33vw, 186.5px)', 
              transform: 'translateY(-50%)', 
              zIndex: 10,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollRight && !isLoading && products.length > 0 ? 'pointer' : 'default',
              color: 'var(--text-primary)',
              opacity: canScrollRight && !isLoading && products.length > 0 ? 1 : 0,
              pointerEvents: canScrollRight && !isLoading && products.length > 0 ? 'auto' : 'none',
              transition: 'opacity 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (canScrollRight) {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.18)';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }}
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>

          <div 
            style={{ 
              width: '100%', 
              paddingBottom: '20px',
            }}
          >
            {isLoading || products.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  width: 'max-content',
                }}
              >
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: 'clamp(200px, 20vw, 280px)',
                      flexShrink: 0,
                      scrollSnapAlign: 'start',
                    }}
                  >
                    <ProductCardSkeleton
                      variant="standard"
                      aspectRatio="3 / 4"
                    />
                  </div>
                ))}
              </div>
            ) : (
                <motion.div
                initial="hidden"
                animate={isSectionInView ? 'visible' : 'hidden'}
                variants={containerVariants}
                ref={scrollRef}
                onScroll={checkScrollability}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  scrollSnapType: isDragging ? 'none' : 'x mandatory',
                  scrollBehavior: isDragging ? 'auto' : 'smooth',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  overscrollBehaviorX: 'contain',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  paddingRight: '20px',
                }}
                className="hide-scrollbar"
              >
                {items.map((product, index) => (
                  <motion.div
                    key={`${product.id}-${index}`}
                    variants={cardVariants}
                    style={{
                      width: 'clamp(200px, 20vw, 280px)',
                      flexShrink: 0,
                      scrollSnapAlign: 'start',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ flex: 1, position: 'relative' }}>
                      <Link href={`/product/${product.slug}`} style={{ display: 'block', width: '100%', aspectRatio: '3/4', position: 'relative', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                         <img src={product.images[0]} alt={product.name} onLoad={updateImageHeight} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Link>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                          {product.name}
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

