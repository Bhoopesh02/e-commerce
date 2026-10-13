'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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

  // Outer container refs
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressBarFillRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Cached layout measurements
  const maxScrollRef = useRef<number>(0);
  const viewportWidthRef = useRef<number>(0);
  const cardOffsetsRef = useRef<{ left: number; width: number }[]>([]);
  const [imageHeight, setImageHeight] = useState<number>(0);

  // Motion & Animation state
  const targetXRef = useRef<number>(0);
  const scrollXRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const autoplayDirRef = useRef<1 | -1>(1);
  const pauseAtEndRef = useRef<number | null>(null);
  const pauseAtStartRef = useRef<number | null>(null);

  // Playback & Interaction state
  const isPlayingRef = useRef<boolean>(true);
  const isHoveredRef = useRef<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const lastInteractionTimeRef = useRef<number>(performance.now());

  // Drag calculation refs
  const dragStartXRef = useRef<number>(0);
  const dragStartTargetXRef = useRef<number>(0);
  const lastPointerXRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);
  const pointerSpeedRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);
  const isDraggingProgressRef = useRef<boolean>(false);

  // Chevron UI state
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Update button visibility based on targetX
  const updateArrowButtons = useCallback((target: number) => {
    const max = maxScrollRef.current;
    setCanScrollLeft(target > 5);
    setCanScrollRight(target < max - 5);
  }, []);

  // Measure track & cards
  const updateBounds = useCallback(() => {
    if (!viewportRef.current || !trackRef.current) return;

    const viewportWidth = viewportRef.current.clientWidth;
    viewportWidthRef.current = viewportWidth;

    const trackWidth = trackRef.current.scrollWidth;
    const max = Math.max(0, trackWidth - viewportWidth);
    maxScrollRef.current = max;

    // Cache card offsets for zero-layout-thrash reads in RAF
    const offsets: { left: number; width: number }[] = [];
    cardElementsRef.current.forEach((el) => {
      if (el) {
        offsets.push({ left: el.offsetLeft, width: el.offsetWidth });
      }
    });
    cardOffsetsRef.current = offsets;

    // Measure product image height for arrow positioning
    const firstImg = trackRef.current.querySelector('img');
    if (firstImg && firstImg.clientHeight > 0) {
      setImageHeight(firstImg.clientHeight);
    }

    // Clamp current targetX within updated bounds
    targetXRef.current = Math.max(0, Math.min(max, targetXRef.current));
    updateArrowButtons(targetXRef.current);
  }, [updateArrowButtons]);

  // Handle image load
  const handleImageLoad = () => {
    updateBounds();
  };

  // Find and snap to nearest card center
  const snapToNearestCard = useCallback(() => {
    if (cardOffsetsRef.current.length === 0 || maxScrollRef.current <= 0) return;
    const currentTarget = targetXRef.current;
    const viewportWidth = viewportWidthRef.current || 600;

    let closestDist = Infinity;
    let closestTarget = currentTarget;

    cardOffsetsRef.current.forEach((offset) => {
      // Position that centers this card in viewport
      const cardCenterScroll = (offset.left + offset.width / 2) - viewportWidth / 2;
      const clamped = Math.max(0, Math.min(maxScrollRef.current, cardCenterScroll));
      const dist = Math.abs(clamped - currentTarget);
      if (dist < closestDist) {
        closestDist = dist;
        closestTarget = clamped;
      }
    });

    targetXRef.current = closestTarget;
    updateArrowButtons(closestTarget);
  }, [updateArrowButtons]);

  // Main RAF animation loop: Move track, Lerp, Position decides card look, Update progress
  useEffect(() => {
    let active = true;

    const animate = (timestamp: number) => {
      if (!active) return;

      const dt = Math.min(50, timestamp - lastTimeRef.current);
      lastTimeRef.current = timestamp;

      const maxScroll = maxScrollRef.current;
      const now = performance.now();

      // 1. Movement & Autoplay
      const isInactive = now - lastInteractionTimeRef.current >= 1500;
      const shouldAutoplay =
        isPlayingRef.current &&
        !isHoveredRef.current &&
        !isDraggingRef.current &&
        !isDraggingProgressRef.current &&
        isInactive &&
        maxScroll > 0;

      if (shouldAutoplay) {
        const speed = 42; // px per second
        if (autoplayDirRef.current === 1) {
          targetXRef.current += speed * (dt / 1000);
          if (targetXRef.current >= maxScroll) {
            targetXRef.current = maxScroll;
            if (!pauseAtEndRef.current) {
              pauseAtEndRef.current = now;
            } else if (now - pauseAtEndRef.current > 1500) {
              autoplayDirRef.current = -1;
              pauseAtEndRef.current = null;
            }
          }
        } else {
          targetXRef.current -= speed * (dt / 1000);
          if (targetXRef.current <= 0) {
            targetXRef.current = 0;
            if (!pauseAtStartRef.current) {
              pauseAtStartRef.current = now;
            } else if (now - pauseAtStartRef.current > 1500) {
              autoplayDirRef.current = 1;
              pauseAtStartRef.current = null;
            }
          }
        }
        updateArrowButtons(targetXRef.current);
      }

      // 2. Ease toward target: scrollX += (targetX - scrollX) * 0.08
      const targetX = targetXRef.current;
      let scrollX = scrollXRef.current;
      scrollX += (targetX - scrollX) * 0.08;
      scrollXRef.current = scrollX;

      // Move track: transform: translate3d(-scrollX, 0, 0)
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-scrollX.toFixed(2)}px, 0, 0)`;
      }

      // 3. Progress bar: scaleX(progress) with transform-origin: left
      if (progressBarFillRef.current && maxScroll > 0) {
        const progress = Math.max(0, Math.min(1, scrollX / maxScroll));
        progressBarFillRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      }

      // 4. Position decides the look (per card, each frame)
      // Read card centers -> map to flat transforms: scale, opacity, subtle translateY/skew
      const viewportWidth = viewportWidthRef.current || 600;
      const viewportCenterX = viewportWidth / 2;
      const offsets = cardOffsetsRef.current;
      const count = cardElementsRef.current.length;

      // Pre-compute batch styles to avoid layout thrashing
      const stylesToApply: { scale: number; opacity: number; translateY: number; skewX: number }[] = [];

      for (let i = 0; i < count; i++) {
        const cardEl = cardElementsRef.current[i];
        if (!cardEl) continue;

        const offset = offsets[i];
        const cardLeft = offset ? offset.left : cardEl.offsetLeft;
        const cardWidth = offset ? offset.width : cardEl.offsetWidth;

        // Visual center of card in viewport
        const cardCenterX = (cardLeft + cardWidth / 2) - scrollX;

        // d = (cardCenterX - viewportCenterX) / viewportWidth
        // 0 at center, about ±0.5 to ±1 near edges
        const d = (cardCenterX - viewportCenterX) / (viewportWidth * 0.5);
        const absD = Math.min(1.8, Math.abs(d));

        if (shouldReduceMotion) {
          stylesToApply.push({ scale: 1, opacity: 1, translateY: 0, skewX: 0 });
        } else {
          // Center card is largest (scale 1.0) and brightest (opacity 1.0)
          const scale = Math.max(0.85, 1 - absD * 0.15);
          const opacity = Math.max(0.55, 1 - absD * 0.4);
          const translateY = absD * 4;
          const skewX = Math.max(-1.8, Math.min(1.8, -d * 1.0));
          stylesToApply.push({ scale, opacity, translateY, skewX });
        }
      }

      // Write all styles in batch
      for (let i = 0; i < count; i++) {
        const cardEl = cardElementsRef.current[i];
        const style = stylesToApply[i];
        if (cardEl && style) {
          cardEl.style.transform = `scale(${style.scale.toFixed(3)}) translateY(${style.translateY.toFixed(1)}px) skewX(${style.skewX.toFixed(2)}deg)`;
          cardEl.style.opacity = style.opacity.toFixed(3);
        }
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      active = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [shouldReduceMotion, updateArrowButtons]);

  // Window resize observer
  useEffect(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds);
    const timer = setTimeout(updateBounds, 200);

    let ro: ResizeObserver | null = null;
    if (viewportRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateBounds());
      ro.observe(viewportRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateBounds);
      clearTimeout(timer);
      if (ro) ro.disconnect();
    };
  }, [products, isLoading, updateBounds]);

  // Navigation Arrow clicks (Previous / Next)
  const scroll = (direction: 'left' | 'right') => {
    lastInteractionTimeRef.current = performance.now();
    const maxScroll = maxScrollRef.current;
    if (maxScroll <= 0) return;

    const currentScroll = targetXRef.current;
    const viewportWidth = viewportWidthRef.current || 600;

    // Find card centers
    const cardCenters = cardOffsetsRef.current.map(
      (c) => Math.max(0, Math.min(maxScroll, (c.left + c.width / 2) - viewportWidth / 2))
    );

    if (direction === 'right') {
      const next = cardCenters.find((pos) => pos > currentScroll + 12);
      targetXRef.current = next !== undefined ? next : maxScroll;
      autoplayDirRef.current = 1;
    } else {
      const prev = [...cardCenters].reverse().find((pos) => pos < currentScroll - 12);
      targetXRef.current = prev !== undefined ? prev : 0;
      autoplayDirRef.current = -1;
    }

    updateArrowButtons(targetXRef.current);
  };

  // Drag interaction on Track
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || maxScrollRef.current <= 0) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartTargetXRef.current = targetXRef.current;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    pointerSpeedRef.current = 0;
    lastInteractionTimeRef.current = performance.now();

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 4) {
      hasMovedRef.current = true;
    }

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerTimeRef.current);
    const dx = e.clientX - lastPointerXRef.current;
    pointerSpeedRef.current = dx / dt;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;
    lastInteractionTimeRef.current = now;

    // Inverse delta for intuitive dragging
    const newTarget = dragStartTargetXRef.current - deltaX;
    targetXRef.current = Math.max(0, Math.min(maxScrollRef.current, newTarget));
    updateArrowButtons(targetXRef.current);
  };

  const handleTrackPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    lastInteractionTimeRef.current = performance.now();

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    // Add flick momentum
    const speed = pointerSpeedRef.current;
    if (Math.abs(speed) > 0.25) {
      const inertiaDelta = -speed * 150;
      targetXRef.current = Math.max(0, Math.min(maxScrollRef.current, targetXRef.current + inertiaDelta));
    }

    // Snap to nearest card
    snapToNearestCard();
  };

  // Prevent link navigation if drag took place
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      hasMovedRef.current = false;
    }
  };

  // Hover handlers
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    lastInteractionTimeRef.current = performance.now();
  };

  // Mouse wheel / Horizontal trackpad swipe
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (maxScrollRef.current <= 0) return;
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (isHorizontal || e.shiftKey) {
      e.preventDefault();
      const delta = e.shiftKey ? e.deltaY : e.deltaX;
      targetXRef.current = Math.max(0, Math.min(maxScrollRef.current, targetXRef.current + delta * 1.1));
      lastInteractionTimeRef.current = performance.now();
      updateArrowButtons(targetXRef.current);
    }
  };

  // Interactive Progress Bar Dragging & Scrubbing
  const handleProgressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || maxScrollRef.current <= 0) return;
    e.preventDefault();
    isDraggingProgressRef.current = true;
    lastInteractionTimeRef.current = performance.now();

    const updateFromPointer = (clientX: number) => {
      if (!progressBarRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      targetXRef.current = ratio * maxScrollRef.current;
      updateArrowButtons(targetXRef.current);
    };

    updateFromPointer(e.clientX);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingProgressRef.current) return;
      updateFromPointer(moveEvent.clientX);
      lastInteractionTimeRef.current = performance.now();
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      isDraggingProgressRef.current = false;
      lastInteractionTimeRef.current = performance.now();
      snapToNearestCard();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const items = products;
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.1 });

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
    <section
      ref={sectionRef}
      className="most-coveted-section"
      style={{
        padding: '80px 0',
        backgroundColor: 'var(--bg-primary)',
        overflow: 'hidden',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '48px',
          flexWrap: 'wrap',
        }}
      >
        {/* Left Column: Text & CTA (Preserved exactly) */}
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
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontFamily: 'var(--font-display, serif)',
                fontWeight: 400,
                marginBottom: '16px',
                color: 'var(--text-primary)',
              }}
            >
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
                type="button"
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
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000')}
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
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000')}
              >
                Shop now
              </Link>
            )}
          </div>
        </motion.div>

        {/* Right Column: Flat Horizontal Product Scroll */}
        <div style={{ flex: '999 1 600px', minWidth: '0', position: 'relative' }}>
          {/* Circular Left Arrow Button */}
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
              transition:
                'opacity 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
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

          {/* Circular Right Arrow Button */}
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
              transition:
                'opacity 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
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

          {/* Viewport container */}
          <div
            ref={viewportRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
            style={{
              width: '100%',
              overflow: 'hidden',
              position: 'relative',
              userSelect: 'none',
              touchAction: 'pan-y',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            {isLoading || products.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  width: 'max-content',
                  padding: '16px 0',
                }}
              >
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: 'clamp(220px, 22vw, 300px)',
                      flexShrink: 0,
                    }}
                  >
                    <ProductCardSkeleton variant="standard" aspectRatio="3 / 4" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                ref={trackRef}
                onPointerDown={handleTrackPointerDown}
                onPointerMove={handleTrackPointerMove}
                onPointerUp={handleTrackPointerUp}
                onPointerCancel={handleTrackPointerUp}
                onClickCapture={handleClickCapture}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '24px',
                  width: 'max-content',
                  willChange: 'transform',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                }}
              >
                {items.map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    ref={(el) => {
                      cardElementsRef.current[index] = el;
                    }}
                    style={{
                      width: 'clamp(220px, 22vw, 300px)',
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      willChange: 'transform, opacity',
                      transformOrigin: 'center center',
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <Link
                        href={`/product/${product.slug}`}
                        style={{
                          display: 'block',
                          width: '100%',
                          aspectRatio: '3/4',
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundColor: '#f5f5f5',
                        }}
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          onLoad={handleImageLoad}
                          draggable={false}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            pointerEvents: 'none',
                          }}
                        />
                      </Link>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                      <Link
                        href={`/product/${product.slug}`}
                        style={{
                          textDecoration: 'none',
                          color: 'inherit',
                          display: 'inline-block',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            lineHeight: 1.4,
                            display: 'block',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {product.name}
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scannable Luxury Progress Bar */}
          {!isLoading && products.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '16px',
                paddingLeft: '4px',
                paddingRight: '16px',
              }}
            >
              <div
                ref={progressBarRef}
                onPointerDown={handleProgressPointerDown}
                role="slider"
                aria-label="Horizontal scroll progress bar"
                aria-valuemin={0}
                aria-valuemax={100}
                style={{
                  flex: 1,
                  height: '3px',
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  borderRadius: '2px',
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
              >
                <div
                  ref={progressBarFillRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'var(--text-primary, #000)',
                    transformOrigin: 'left',
                    transform: 'scaleX(0)',
                    willChange: 'transform',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
