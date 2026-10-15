'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface NewArrivalsCarouselProps {
  products: Product[];
  loading?: boolean;
}

export const NewArrivalsCarousel: React.FC<NewArrivalsCarouselProps> = ({
  products,
  loading = false,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Smooth lerp & physics animation values
  const targetXRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const vRef = useRef<number>(0); // Smoothed velocity
  const maxScrollRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Drag interaction state
  const isPointerDownRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartYRef = useRef<number>(0);
  const dragStartTargetXRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);
  const lastPointerXRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);
  const pointerSpeedRef = useRef<number>(0);

  // UI state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Compute maximum scroll limit and track bounds
  const updateBounds = useCallback(() => {
    if (!viewportRef.current || !trackRef.current) return;
    const viewportWidth = viewportRef.current.clientWidth;
    const trackWidth = trackRef.current.scrollWidth;
    const max = Math.max(0, trackWidth - viewportWidth);
    maxScrollRef.current = max;

    // Clamp targetX to valid bounds
    if (targetXRef.current < -max) {
      targetXRef.current = -max;
    } else if (targetXRef.current > 0) {
      targetXRef.current = 0;
    }

    setCanScrollLeft(targetXRef.current < -1);
    setCanScrollRight(targetXRef.current > -max + 1);
  }, []);

  // Update targetX directly with clamping
  const setTargetX = useCallback((newTarget: number) => {
    const max = maxScrollRef.current;
    const clamped = Math.max(-max, Math.min(0, newTarget));
    targetXRef.current = clamped;

    setCanScrollLeft(clamped < -1);
    setCanScrollRight(clamped > -max + 1);
  }, []);

  // Main animation loop: LERP and velocity derivation
  useEffect(() => {
    let active = true;

    const animate = () => {
      if (!active) return;

      const targetX = targetXRef.current;
      let currentX = currentXRef.current;

      // 2. Smooth it with lerp
      // Each requestAnimationFrame, set currentX += (targetX - currentX) * 0.08
      currentX += (targetX - currentX) * 0.08;
      currentXRef.current = currentX;

      // 3. Derive velocity
      // Each frame, velocity = targetX - currentX
      const velocity = targetX - currentX;
      velocityRef.current = velocity;

      // Optionally smooth it again: v += (velocity - v) * 0.1 so the effect fades rather than snaps
      vRef.current += (velocity - vRef.current) * 0.1;
      const v = vRef.current;

      // Apply transform: translate3d(currentX, 0, 0) to the track (eased, inertial feel)
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
      }

      // Dynamic inertial card skew based on smoothed velocity
      // Clamped to a subtle, luxurious range [-4.5deg, 4.5deg]
      const skew = Math.max(-4.5, Math.min(4.5, v * 0.035));
      cardItemsRef.current.forEach((item) => {
        if (item) {
          item.style.transform = `skewX(${skew.toFixed(2)}deg)`;
        }
      });



      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      active = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [products]);

  // Handle resize and initial bounds calculation
  useEffect(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds);
    const timer = setTimeout(updateBounds, 150);
    return () => {
      window.removeEventListener('resize', updateBounds);
      clearTimeout(timer);
    };
  }, [products, loading, updateBounds]);

  // Button navigation (Previous / Next)
  const scroll = (direction: 'left' | 'right') => {
    if (!viewportRef.current || !trackRef.current) return;
    const viewportWidth = viewportRef.current.clientWidth;
    const firstItem = trackRef.current.firstElementChild as HTMLElement;
    const gap = 24;
    const itemWidth = firstItem ? firstItem.offsetWidth + gap : viewportWidth * 0.5;

    const delta = direction === 'left' ? itemWidth : -itemWidth;
    setTargetX(targetXRef.current + delta);
  };

  // Pointer / Drag interactions for track
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only primary mouse button
    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartTargetXRef.current = targetXRef.current;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    pointerSpeedRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const deltaX = e.clientX - dragStartXRef.current;
    const deltaY = e.clientY - dragStartYRef.current;

    // Only initiate drag if moved beyond threshold and primarily horizontal
    if (!isDraggingRef.current) {
      if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
        isDraggingRef.current = true;
        setIsDragging(true);
        hasMovedRef.current = true;
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
          // Ignored
        }
      } else {
        return;
      }
    }

    // Calculate instantaneous pointer drag speed for flick inertia
    const now = performance.now();
    const dt = Math.max(1, now - lastPointerTimeRef.current);
    const dx = e.clientX - lastPointerXRef.current;
    pointerSpeedRef.current = dx / dt;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;

    // Apply drag directly to targetX
    setTargetX(dragStartTargetXRef.current + deltaX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);

      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignored if capture already lost
      }

      // Add release flick inertia if released with momentum
      const speed = pointerSpeedRef.current;
      if (Math.abs(speed) > 0.25) {
        const inertiaDelta = speed * 140;
        setTargetX(targetXRef.current + inertiaDelta);
      }

      // Suppress any trailing click from drag release
      setTimeout(() => {
        hasMovedRef.current = false;
      }, 80);
    } else {
      hasMovedRef.current = false;
    }
  };

  // Prevent card navigation clicks if user dragged
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Trackpad horizontal swipe and Shift+Wheel navigation
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (maxScrollRef.current <= 0) return;

    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (isHorizontal || e.shiftKey) {
      e.preventDefault();
      const delta = e.shiftKey ? e.deltaY : e.deltaX;
      setTargetX(targetXRef.current - delta * 1.1);
    }
  };



  return (
    <section className="new-arrivals-section" style={{ padding: '60px 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ position: 'relative' }}>
        <ScrollReveal duration={0.5}>
          {/* Header Row with Title, Chevrons, and View All link */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '36px',
              gap: '16px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  margin: 0,
                }}
              >
                New Arrivals
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: canScrollLeft ? 'pointer' : 'default',
                    opacity: canScrollLeft ? 1 : 0.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    transition: 'opacity 0.2s ease',
                  }}
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={28} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: canScrollRight ? 'pointer' : 'default',
                    opacity: canScrollRight ? 1 : 0.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    transition: 'opacity 0.2s ease',
                  }}
                  aria-label="Scroll right"
                >
                  <ChevronRight size={28} strokeWidth={1.5} />
                </button>
              </div>
              <Link
                href="/new-arrivals"
                className="editorial-arrow-link"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                }}
              >
                <span className="editorial-arrow-link-text">
                  <span className="desktop-only">View All</span>
                  <span className="mobile-only">View All</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Smooth Inertial Carousel Viewport */}
          <div
            ref={viewportRef}
            className="carousel-viewport"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDragStart={(e) => e.preventDefault()}
            onWheel={handleWheel}
            onClickCapture={handleClickCapture}
            style={{
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              cursor: isDragging ? 'grabbing' : 'auto',
              userSelect: isDragging ? 'none' : 'auto',
              touchAction: 'pan-y',
            }}
          >
            {/* The Eased Hardware-Accelerated Track */}
            <div
              ref={trackRef}
              className="carousel-track"
              style={{
                display: 'flex',
                gap: '24px',
                willChange: 'transform',
                transform: 'translate3d(0, 0, 0)',
              }}
            >
              {loading || products.length === 0 ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="carousel-product-item">
                    <div
                      ref={(el) => {
                        cardItemsRef.current[idx] = el;
                      }}
                      className="carousel-product-inner"
                      style={{ willChange: 'transform' }}
                    >
                      <ProductCardSkeleton />
                    </div>
                  </div>
                ))
              ) : (
                products.map((product, idx) => (
                  <div key={product.id} className="carousel-product-item">
                    <div
                      ref={(el) => {
                        cardItemsRef.current[idx] = el;
                      }}
                      className="carousel-product-inner"
                      style={{ willChange: 'transform' }}
                    >
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>


        </ScrollReveal>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .carousel-product-item {
          flex-shrink: 0;
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
        .carousel-product-inner {
          transition: transform 0.05s linear;
        }
      `,
        }}
      />
    </section>
  );
};
