'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  // Container refs
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const overlayElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Layout measurements
  const viewportWidthRef = useRef<number>(800);
  const cardWidthRef = useRef<number>(280);
  const strideRef = useRef<number>(304);
  const totalLengthRef = useRef<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);

  // Motion & Animation state (infinite continuous offsets)
  const targetOffsetRef = useRef<number>(0);
  const currentOffsetRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Interaction state
  const isPlayingRef = useRef<boolean>(true);
  const isHoveredRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const isPointerDownRef = useRef<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastInteractionTimeRef = useRef<number>(performance.now());

  // Drag physics tracking
  const dragStartXRef = useRef<number>(0);
  const dragStartYRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);
  const lastPointerXRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);
  const pointerSpeedRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);

  // Generate seamless loop item array
  const loopItems = useMemo(() => {
    if (!products || products.length === 0) return [];
    // Ensure sufficient items around the cylinder ring (at least 12 cards)
    const repeatCount = Math.max(3, Math.ceil(14 / Math.max(1, products.length)));
    const repeated: { product: Product; key: string }[] = [];
    for (let r = 0; r < repeatCount; r++) {
      products.forEach((p, i) => {
        repeated.push({ product: p, key: `${p.id}-cyl-${r}-${i}` });
      });
    }
    return repeated;
  }, [products]);

  // Update layout bounds and card measurements
  const updateBounds = useCallback(() => {
    if (!viewportRef.current) return;

    const vpWidth = viewportRef.current.clientWidth || 800;
    viewportWidthRef.current = vpWidth;

    const firstCard = cardElementsRef.current[0];
    if (firstCard) {
      const measuredCardW = firstCard.offsetWidth || 280;
      cardWidthRef.current = measuredCardW;
      const stride = measuredCardW + 24; // 24px gap
      strideRef.current = stride;
      totalLengthRef.current = loopItems.length * stride;

      const cardH = firstCard.offsetHeight;
      if (cardH > 0) {
        setContainerHeight(cardH + 32);
      }

      const imgEl = firstCard.querySelector('img');
      if (imgEl && imgEl.clientHeight > 0) {
        setImageHeight(imgEl.clientHeight);
      }
    } else {
      strideRef.current = 304;
      totalLengthRef.current = loopItems.length * 304;
    }
  }, [loopItems.length]);

  const handleImageLoad = () => {
    updateBounds();
  };

  // Main RAF animation loop: Continuous smooth lerp + 2D/3D cylindrical projection
  useEffect(() => {
    if (loopItems.length === 0) return;

    let active = true;
    lastTimeRef.current = performance.now();

    const animate = (timestamp: number) => {
      if (!active) return;

      const dt = Math.min(50, timestamp - lastTimeRef.current);
      lastTimeRef.current = timestamp;

      const now = performance.now();
      const isInactive = now - lastInteractionTimeRef.current >= 1800;
      const shouldAutoplay =
        isPlayingRef.current &&
        !isHoveredRef.current &&
        !isDraggingRef.current &&
        isInactive;

      // 1. Continuous Autoplay rotation in circular loop
      if (shouldAutoplay) {
        const speed = 36; // px per second
        targetOffsetRef.current += speed * (dt / 1000);
      }

      // 2. Smooth Lerp
      const targetOffset = targetOffsetRef.current;
      let currentOffset = currentOffsetRef.current;
      const lerpSpeed = isDraggingRef.current ? 0.2 : 0.08;
      currentOffset += (targetOffset - currentOffset) * lerpSpeed;
      currentOffsetRef.current = currentOffset;

      // 3. Keep offset bounded to prevent floating-point drift over hours
      const L = totalLengthRef.current;
      if (L > 0) {
        if (currentOffsetRef.current > L * 10) {
          currentOffsetRef.current -= L;
          targetOffsetRef.current -= L;
        } else if (currentOffsetRef.current < -L * 10) {
          currentOffsetRef.current += L;
          targetOffsetRef.current += L;
        }
      }

      // 4. Cylindrical projection per card
      const count = loopItems.length;
      const S = strideRef.current || 304;
      const vpWidth = viewportWidthRef.current || 800;
      // Cylinder radius tuned for natural luxury curvature
      const radius = Math.max(700, vpWidth * 0.95);
      const halfL = L / 2;

      for (let i = 0; i < count; i++) {
        const cardEl = cardElementsRef.current[i];
        if (!cardEl) continue;

        // Base linear position
        const basePos = i * S;
        const rawDiff = basePos - currentOffset;

        // Modulo distance wrapped into [-L / 2, L / 2)
        let dist = ((rawDiff % L) + L) % L;
        if (dist > halfL) {
          dist -= L;
        }

        // If card is far beyond visible cylinder horizon, cull it
        const maxVisibleDist = vpWidth * 0.9 + S;
        if (Math.abs(dist) > maxVisibleDist) {
          cardEl.style.opacity = '0';
          cardEl.style.pointerEvents = 'none';
          cardEl.style.visibility = 'hidden';
          continue;
        }

        cardEl.style.visibility = 'visible';

        if (shouldReduceMotion) {
          // Flat accessible fallback for reduced motion
          cardEl.style.transform = `translate3d(calc(-50% + ${dist.toFixed(1)}px), 0, 0)`;
          cardEl.style.opacity = '1';
          cardEl.style.zIndex = '1';
          cardEl.style.pointerEvents = 'auto';
        } else {
          // 2D & 3D Cylindrical Geometry:
          // Arc angle theta:
          const theta = dist / radius;
          const sinTheta = Math.sin(theta);
          const cosTheta = Math.cos(theta);

          // Horizontal position along cylinder arc
          const cylX = radius * sinTheta;

          // Receding depth into Z space (<= 0)
          const cylZ = radius * (cosTheta - 1);

          // Tangential angle facing cylinder center
          const rotY = -theta * (180 / Math.PI) * 0.72;

          // Scale: 1.0 at center, gracefully down to ~0.84 at cylinder periphery
          const distRatio = Math.min(1.2, Math.abs(dist) / (vpWidth * 0.5));
          const scale = Math.max(0.82, 1 - distRatio * 0.16);

          // Opacity: 1.0 in center, fading smoothly as cards curve around sides
          const opacity = Math.max(
            0,
            Math.min(1, 1 - Math.max(0, (Math.abs(dist) - vpWidth * 0.28) / (vpWidth * 0.45)))
          );

          // Layer ordering: center cards are on top
          const zIndex = Math.max(1, Math.round(50 - Math.min(45, distRatio * 35)));

          // Depth shading overlay on card edges
          const dimOpacity = Math.min(0.3, distRatio * 0.28);

          cardEl.style.transform = `translate3d(calc(-50% + ${cylX.toFixed(1)}px), 0, ${cylZ.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
          cardEl.style.opacity = opacity.toFixed(3);
          cardEl.style.zIndex = String(zIndex);
          cardEl.style.pointerEvents = opacity < 0.25 ? 'none' : 'auto';

          const overlayEl = overlayElementsRef.current[i];
          if (overlayEl) {
            overlayEl.style.opacity = dimOpacity.toFixed(2);
          }
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
  }, [loopItems, shouldReduceMotion]);

  // Window resize observer
  useEffect(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds);
    const timer = setTimeout(updateBounds, 150);

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
  }, [updateBounds]);

  // Infinite Arrow clicks: Snap & move to previous or next card
  const scroll = (direction: 'left' | 'right') => {
    lastInteractionTimeRef.current = performance.now();
    const S = strideRef.current || 304;

    // Snap to nearest stride, then advance
    const currentSnapped = Math.round(targetOffsetRef.current / S) * S;
    if (direction === 'right') {
      targetOffsetRef.current = currentSnapped + S;
    } else {
      targetOffsetRef.current = currentSnapped - S;
    }
  };

  // Drag interaction with cylinder
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || loopItems.length === 0) return;
    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartOffsetRef.current = targetOffsetRef.current;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    pointerSpeedRef.current = 0;
    lastInteractionTimeRef.current = performance.now();
  };

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const deltaX = e.clientX - dragStartXRef.current;
    const deltaY = e.clientY - dragStartYRef.current;

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

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerTimeRef.current);
    const dx = e.clientX - lastPointerXRef.current;
    pointerSpeedRef.current = dx / dt;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;
    lastInteractionTimeRef.current = now;

    // Dragging left advances cylinder right; dragging right advances cylinder left
    targetOffsetRef.current = dragStartOffsetRef.current - deltaX;
  };

  const handleTrackPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    lastInteractionTimeRef.current = performance.now();

    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);

      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }

      // Apply flick inertia
      const speed = pointerSpeedRef.current;
      if (Math.abs(speed) > 0.18) {
        const inertiaDelta = -speed * 200;
        targetOffsetRef.current += inertiaDelta;
      }

      // Snap to nearest card center
      const S = strideRef.current || 304;
      targetOffsetRef.current = Math.round(targetOffsetRef.current / S) * S;

      setTimeout(() => {
        hasMovedRef.current = false;
      }, 80);
    } else {
      hasMovedRef.current = false;
    }
  };

  // Prevent link navigation if drag occurred
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
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

  // Wheel / Trackpad swipe
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (loopItems.length === 0) return;
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (isHorizontal || e.shiftKey) {
      e.preventDefault();
      const delta = e.shiftKey ? e.deltaY : e.deltaX;
      targetOffsetRef.current += delta * 1.1;
      lastInteractionTimeRef.current = performance.now();
    }
  };

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
        {/* Left Column: Heading, Subtitle & Shop Now CTA */}
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
                  backgroundColor: 'var(--color-black-tie)',
                  color: 'var(--color-diamond)',
                  padding: '12px 48px',
                  minHeight: '44px',
                  boxSizing: 'border-box',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                  width: 'max-content',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-sapphire-800)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-black-tie)')}
              >
                Shop now
              </button>
            ) : (
              <Link
                href="/shop"
                style={{
                  backgroundColor: 'var(--color-black-tie)',
                  color: 'var(--color-diamond)',
                  padding: '12px 48px',
                  minHeight: '44px',
                  boxSizing: 'border-box',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-sapphire-800)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-black-tie)')}
              >
                Shop now
              </Link>
            )}
          </div>
        </motion.div>

        {/* Right Column: Circular Cylindrical 3D/2D Loop Carousel */}
        <div style={{ flex: '999 1 600px', minWidth: '0', position: 'relative' }}>
          {/* Circular Left Arrow Button */}
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left in loop"
            style={{
              position: 'absolute',
              left: '16px',
              top: imageHeight > 0 ? `${imageHeight / 2 + 16}px` : 'clamp(150px, 15vw, 210px)',
              transform: 'translateY(-50%)',
              zIndex: 100,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: !isLoading && loopItems.length > 0 ? 'pointer' : 'default',
              color: 'var(--text-primary)',
              opacity: !isLoading && loopItems.length > 0 ? 1 : 0,
              pointerEvents: !isLoading && loopItems.length > 0 ? 'auto' : 'none',
              transition:
                'opacity 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.18)';
              e.currentTarget.style.backgroundColor = 'var(--color-diamond)';
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
            aria-label="Scroll right in loop"
            style={{
              position: 'absolute',
              right: '16px',
              top: imageHeight > 0 ? `${imageHeight / 2 + 16}px` : 'clamp(150px, 15vw, 210px)',
              transform: 'translateY(-50%)',
              zIndex: 100,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: !isLoading && loopItems.length > 0 ? 'pointer' : 'default',
              color: 'var(--text-primary)',
              opacity: !isLoading && loopItems.length > 0 ? 1 : 0,
              pointerEvents: !isLoading && loopItems.length > 0 ? 'auto' : 'none',
              transition:
                'opacity 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.18)';
              e.currentTarget.style.backgroundColor = 'var(--color-diamond)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }}
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>

          {/* Viewport container with perspective & subtle edge fade */}
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
              perspective: '1200px',
              perspectiveOrigin: '50% 50%',
              height: containerHeight > 0 ? `${containerHeight}px` : 'clamp(380px, 38vw, 490px)',
              maskImage:
                'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
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
                ref={stageRef}
                onPointerDown={handleTrackPointerDown}
                onPointerMove={handleTrackPointerMove}
                onPointerUp={handleTrackPointerUp}
                onPointerCancel={handleTrackPointerUp}
                onClickCapture={handleClickCapture}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                }}
              >
                {loopItems.map(({ product, key }, index) => (
                  <div
                    key={key}
                    ref={(el) => {
                      cardElementsRef.current[index] = el;
                    }}
                    onClick={() => {
                      if (!hasMovedRef.current) {
                        router.push(`/product/${product.slug}`);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '16px',
                      width: 'clamp(220px, 22vw, 300px)',
                      display: 'flex',
                      flexDirection: 'column',
                      transformOrigin: 'center center',
                      transformStyle: 'preserve-3d',
                      willChange: 'transform, opacity',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={(e) => {
                          if (hasMovedRef.current) {
                            e.preventDefault();
                          }
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          aspectRatio: '3/4',
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundColor: 'var(--bg-surface)',
                          cursor: 'pointer',
                        }}
                      >
                        {isSectionInView ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 35vw, 280px"
                            quality={85}
                            loading="lazy"
                            onLoad={() => {
                              if (index === 0) handleImageLoad();
                            }}
                            draggable={false}
                            style={{
                              objectFit: 'cover',
                              pointerEvents: 'none',
                              transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: 'var(--bg-surface)',
                            }}
                          />
                        )}

                        {/* Cylinder lighting & curvature depth shade */}
                        <div
                          ref={(el) => {
                            overlayElementsRef.current[index] = el;
                          }}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'var(--color-black-tie)',
                            opacity: 0,
                            pointerEvents: 'none',
                            transition: 'opacity 0.08s linear',
                          }}
                        />
                      </Link>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={(e) => {
                          if (hasMovedRef.current) {
                            e.preventDefault();
                          }
                        }}
                        style={{
                          textDecoration: 'none',
                          color: 'inherit',
                          display: 'inline-block',
                          cursor: 'pointer',
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
        </div>
      </div>
    </section>
  );
};
