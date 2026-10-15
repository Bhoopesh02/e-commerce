'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Product } from '@/types';

interface ExpandingCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

const AUTOPLAY_DURATION_MS = 6000;
const TRANSITION_DURATION_MS = 1400;
const MOBILE_TOUCH_RESUME_MS = 8000;

export const ExpandingCarousel: React.FC<ExpandingCarouselProps> = ({
  products,
  title = 'Signature Icons',
  subtitle = 'Touch to Reveal Silhouette Architecture',
}) => {
  const router = useRouter();
  // Prioritize signature icons order
  const signatureOrder = [
    'Quilted Silk Down Parka',
    'Sculpted Double-Breasted Blazer',
    'Silk Charmeuse Draped Evening Gown',
    'Mongolian Cashmere Ribbed Turtleneck',
    'Atelier Sculptural Leather Tote',
  ];

  const signatureMatches = signatureOrder
    .map((name) => products.find((p) => p.name === name || p.name.includes(name)))
    .filter(Boolean) as Product[];

  const items =
    signatureMatches.length >= 4
      ? signatureMatches
      : products.filter((p) => !p.name.toLowerCase().includes('italian leather jacket')).slice(0, 5);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [hasEnteredView, setHasEnteredView] = useState<boolean>(false);
  const [isTouchPaused, setIsTouchPaused] = useState<boolean>(false);
  const [isTabHidden, setIsTabHidden] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageLoad = useCallback((productId: string) => {
    setLoadedImages((prev) => (prev[productId] ? prev : { ...prev, [productId]: true }));
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchResumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverIntentRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(AUTOPLAY_DURATION_MS);

  // Measure and compute --full-w (desktop) and --full-h (mobile)
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const isMobile = window.innerWidth <= 767;
      const count = items.length;

      if (isMobile) {
        const collapsedHeight = 76;
        const gap = 6;
        const totalCollapsed = (count - 1) * collapsedHeight;
        const totalGaps = (count - 1) * gap;
        const fullH = Math.max(clientHeight - totalCollapsed - totalGaps, 200);
        containerRef.current.style.setProperty('--full-h', `${fullH}px`);
      } else {
        const gap = 6;
        const totalGaps = (count - 1) * gap;
        const availWidth = clientWidth - totalGaps;
        const activeRatio = 5.5;
        const totalRatio = activeRatio + (count - 1) * 1;
        const fullW = Math.round((availWidth / totalRatio) * activeRatio);
        containerRef.current.style.setProperty('--full-w', `${fullW}px`);
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [items.length]);

  // Viewport intersection observer
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasEnteredView(true);
        }
      },
      { threshold: 0.05, rootMargin: '200px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Document visibility change listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // prefers-reduced-motion detection
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Activate a specific panel
  const handleActivate = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      if (hoverIntentRef.current) clearTimeout(hoverIntentRef.current);

      setActiveIndex(index);
      remainingTimeRef.current = AUTOPLAY_DURATION_MS;
      startTimeRef.current = Date.now();

      setIsTransitioning(true);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, TRANSITION_DURATION_MS);
    },
    [activeIndex]
  );

  // Hover activation with hover intent to prevent edge jitter oscillations
  const handleMouseEnter = (index: number) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      if (index === activeIndex) {
        if (hoverIntentRef.current) clearTimeout(hoverIntentRef.current);
        return;
      }
      if (hoverIntentRef.current) clearTimeout(hoverIntentRef.current);
      hoverIntentRef.current = setTimeout(() => {
        handleActivate(index);
      }, 60);
    }
  };

  const handleMouseLeaveCard = () => {
    if (hoverIntentRef.current) {
      clearTimeout(hoverIntentRef.current);
    }
  };

  // Card click / tap
  const handleCardClick = (index: number) => {
    if (index === activeIndex) {
      // The active card functions as the "View Garment" button
      router.push(`/product/${items[index].slug}`);
      return;
    }

    handleActivate(index);

    // On mobile touch, pause autoplay for 8s
    if (typeof window !== 'undefined' && window.innerWidth <= 767) {
      setIsTouchPaused(true);
      if (touchResumeTimeoutRef.current) clearTimeout(touchResumeTimeoutRef.current);
      touchResumeTimeoutRef.current = setTimeout(() => {
        setIsTouchPaused(false);
      }, MOBILE_TOUCH_RESUME_MS);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (index === activeIndex) {
        router.push(`/product/${items[index].slug}`);
      } else {
        handleActivate(index);
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % items.length;
      handleActivate(nextIndex);
      const panels = containerRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
      panels?.[nextIndex]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + items.length) % items.length;
      handleActivate(prevIndex);
      const panels = containerRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
      panels?.[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleActivate(0);
      const panels = containerRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
      panels?.[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      handleActivate(items.length - 1);
      const panels = containerRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
      panels?.[items.length - 1]?.focus();
    }
  };

  const isPaused =
    isHovered || isFocused || !isInView || isTouchPaused || isTabHidden || prefersReducedMotion;

  // Autoplay management
  useEffect(() => {
    if (prefersReducedMotion) return;

    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      return;
    }

    startTimeRef.current = Date.now();
    const duration = remainingTimeRef.current > 0 ? remainingTimeRef.current : AUTOPLAY_DURATION_MS;

    timerRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
      remainingTimeRef.current = AUTOPLAY_DURATION_MS;
      setIsTransitioning(true);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, TRANSITION_DURATION_MS);
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, isPaused, prefersReducedMotion, items.length]);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="expanding-carousel-section"
      style={{
        padding: '48px 0 40px',
        backgroundColor: 'var(--bg-primary)',
        width: '100%',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Header */}
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '36px',
        }}
      >
        {/* Insignia */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
          }}
        >
          <Image
            src="/images/icons/signature-icons-emblem.webp"
            alt="Atelier Tailoring & Architecture Insignia"
            width={72}
            height={40}
            style={{
              width: 'auto',
              height: '38px',
              objectFit: 'contain',
              opacity: 0.9,
            }}
            className="signature-icons-emblem"
          />
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '12px' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {subtitle}
        </p>
      </div>

      {/* Cinematic Full-Width Accordion Stage */}
      <div className="expanding-carousel-fullwidth-wrapper">
        <div
          ref={containerRef}
          role="tablist"
          aria-label={title}
          className={`expanding-carousel-container ${isMounted ? 'is-mounted' : ''} ${isTransitioning ? 'is-animating' : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {items.map((product, index) => {
            const isActive = activeIndex === index;
            const isLoaded = !!loadedImages[product.id];
            const indexFormatted = String(index + 1).padStart(3, '0');
            const primaryMaterial = product.materials?.[0] || '100% MULBERRY SILK';
            const primaryDetail = product.details?.[0] || 'HAND-TAILORED ATELIER PIECE';

            return (
              <div
                key={product.id}
                role="tab"
                tabIndex={0}
                aria-selected={isActive}
                aria-expanded={isActive}
                aria-label={isActive ? `View ${product.name} garment` : `Select ${product.name}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeaveCard}
                onClick={() => handleCardClick(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`carousel-panel ${isActive ? 'panel-active' : 'panel-inactive'}`}
              >
                {/* Luxury Shimmer Skeleton until image completes loading */}
                {!isLoaded && (
                  <div className="carousel-panel-skeleton" aria-hidden="true">
                    <div className="carousel-skeleton-shimmer" />
                  </div>
                )}

                {/* Background Image: only open panel renders before section enters viewport */}
                {(isActive || hasEnteredView) && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    quality={85}
                    sizes="(max-width: 767px) 100vw, (max-width: 1200px) 60vw, 800px"
                    onLoad={() => handleImageLoad(product.id)}
                    onError={() => handleImageLoad(product.id)}
                    className={`carousel-panel-img ${isLoaded ? 'is-loaded' : 'is-loading'}`}
                  />
                )}

                {/* Cinematic Vignette & Scrim Gradient */}
                <div className="carousel-vignette-scrim" />

                {/* Autoplay Progress Line along bottom edge of active card */}
                {isActive && (
                  <div
                    key={`progress-${activeIndex}`}
                    className={`carousel-progress-line ${isPaused ? 'paused' : ''}`}
                  />
                )}

                {/* Collapsed Panel Strip Elements: Vertical Title + Index Number */}
                <div className="carousel-collapsed-strip">
                  <span className="collapsed-vertical-title">
                    {product.name}
                  </span>
                  <span className="collapsed-index-number">
                    {indexFormatted}
                  </span>
                </div>

                {/* Mobile Collapsed Row Header (Visible only on mobile collapsed state) */}
                <div className="carousel-mobile-collapsed-row">
                  <div className="mobile-collapsed-text">
                    <span className="mobile-collapsed-eyebrow">
                      {product.subtitle || 'ATELIER MASTERPIECE'}
                    </span>
                    <h4 className="mobile-collapsed-title">
                      {product.name}
                    </h4>
                  </div>
                  <span className="mobile-collapsed-index">
                    {indexFormatted}
                  </span>
                </div>

                {/* Active Panel: Centered Title & Subtitle */}
                <div className="cinematic-center-content">
                  <span className="cinematic-eyebrow">
                    {product.subtitle || 'ATELIER SIGNATURE ARCHITECTURE'}
                  </span>

                  <h3 className="cinematic-title">
                    {product.name}
                  </h3>
                </div>

                {/* Active Panel: Cinematic Bottom Credits / Editorial Metadata Row */}
                <div className="cinematic-bottom-credits">
                  <div className="credit-line-primary">
                    <span className="credit-tag">ATELIER</span> FLORENCE, ITALY
                    <span className="credit-bullet">·</span>
                    <span className="credit-tag">MATERIAL</span> {primaryMaterial}
                    <span className="credit-bullet">·</span>
                    <span className="credit-tag">CRAFT</span> HAND-FINISHED BESPOKE
                  </div>
                  <div className="credit-line-secondary">
                    EDITION: ARCHIVAL RUN / ORIGIN: TUSCANY / DETAILS: {primaryDetail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cinematic Editorial Styling */}
      <style jsx>{`
        :global([data-theme="dark"]) .signature-icons-emblem {
          filter: brightness(0) invert(0.96) drop-shadow(0 2px 6px var(--color-golden-100)) !important;
        }

        .expanding-carousel-fullwidth-wrapper {
          width: 100%;
          padding: 0 16px;
          box-sizing: border-box;
        }

        .expanding-carousel-container {
          --full-w: 680px;
          --full-h: 400px;
          display: flex;
          height: clamp(620px, 80vh, 760px);
          gap: 6px;
          width: 100%;
          overflow: hidden;
          background: #08070b;
        }

        /* Panels: Clean crisp borders with subtle radius */
        .carousel-panel {
          flex: 1 1 0px;
          min-width: 0;
          height: 100%;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          border-radius: 4px;
          outline: none;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
          transition: flex 1.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .carousel-panel:focus-visible {
          box-shadow: 0 0 0 2px var(--brand-accent) !important;
        }

        /* Dominant active panel proportion */
        .carousel-panel.panel-active {
          flex: 5.5 1 0px;
          cursor: pointer;
        }

        .is-animating .carousel-panel {
          will-change: flex;
        }

        .is-animating :global(.carousel-panel-img) {
          will-change: transform, filter;
        }

        /* Skeleton placeholder with luxury shimmer */
        .carousel-panel-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #141219 0%, #1c1824 50%, #141219 100%);
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
        }

        .carousel-skeleton-shimmer {
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(201, 169, 110, 0.08) 50%,
            transparent 100%
          );
          animation: carouselSkeletonShimmer 2s infinite ease-in-out;
        }

        @keyframes carouselSkeletonShimmer {
          100% {
            transform: translateX(100%);
          }
        }

        .expanding-carousel-container:not(.is-mounted) :global(.carousel-panel-img) {
          transition: none !important;
        }

        /* Image: Fixed dimension to eliminate squashing/stretching */
        :global(.carousel-panel-img) {
          position: absolute !important;
          object-fit: cover !important;
          pointer-events: none;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          opacity: 0;
          transition: opacity 0.5s ease-out;
        }

        :global(.carousel-panel-img.is-loaded) {
          opacity: 1 !important;
        }

        @media (min-width: 768px) {
          :global(.carousel-panel-img) {
            height: 100% !important;
            width: var(--full-w, 680px) !important;
            max-width: none !important;
            left: 50% !important;
            right: auto !important;
            top: 0 !important;
            bottom: auto !important;
            filter: grayscale(0.5) brightness(0.65) contrast(1.1);
            transform: translateX(-50%) scale(1.08) !important;
            transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease, opacity 0.5s ease !important;
          }

          .panel-active :global(.carousel-panel-img) {
            filter: grayscale(0) brightness(1) contrast(1) !important;
            transform: translateX(-50%) scale(1) !important;
          }
        }

        /* Vignette and Scrim Gradient */
        .carousel-vignette-scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background: linear-gradient(180deg, rgba(8, 7, 11, 0.25) 0%, rgba(8, 7, 11, 0.45) 50%, rgba(8, 7, 11, 0.85) 100%);
          transition: background 1.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .panel-active .carousel-vignette-scrim {
          background: radial-gradient(circle at center, rgba(8, 7, 11, 0.15) 0%, rgba(8, 7, 11, 0.6) 80%, rgba(8, 7, 11, 0.88) 100%);
        }

        /* Autoplay Progress Line */
        .carousel-progress-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--brand-accent, #c9a96e);
          transform-origin: left;
          z-index: 10;
          pointer-events: none;
          animation: progressFill 6s linear forwards;
        }

        .carousel-progress-line.paused {
          animation-play-state: paused !important;
        }

        @keyframes progressFill {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        /* =========================================================
           COLLAPSED STRIP: Vertical Rotated Title + Index Number
           ========================================================= */
        .carousel-collapsed-strip {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 24px;
          pointer-events: none;
          opacity: 1;
          transition: opacity 0.3s ease 0.2s;
        }

        .panel-active .carousel-collapsed-strip {
          opacity: 0;
          transition: opacity 0.15s ease 0s;
        }

        .collapsed-vertical-title {
          position: absolute;
          bottom: 74px;
          left: 50%;
          transform: translateX(-50%) rotate(180deg);
          writing-mode: vertical-rl;
          text-transform: uppercase;
          font-family: var(--font-body, sans-serif);
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.75);
          white-space: nowrap;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        }

        .collapsed-index-number {
          font-family: var(--font-mono, monospace);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.85);
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
        }

        .carousel-mobile-collapsed-row {
          display: none;
        }

        /* =========================================================
           ACTIVE CENTERED CONTENT: Eyebrow + Large Title + Button
           ========================================================= */
        .cinematic-center-content {
          position: absolute;
          inset: 0;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 40px 60px;
          box-sizing: border-box;
          opacity: 0;
          pointer-events: none;
          transform: translateY(16px);
          transition: opacity 0.25s ease 0s, transform 0.25s ease 0s;
        }

        .panel-active .cinematic-center-content {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.32s,
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.32s;
        }

        .cinematic-eyebrow {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--brand-accent, #c9a96e);
          margin-bottom: 14px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
        }

        .cinematic-title {
          font-family: var(--font-display, 'Playfair Display', serif);
          font-size: clamp(2.2rem, 4.2vw, 4.2rem);
          font-weight: 400;
          color: #ffffff;
          line-height: 1.12;
          margin: 0;
          text-shadow: 0 4px 30px rgba(0, 0, 0, 0.85);
          max-width: 820px;
        }

        /* =========================================================
           ACTIVE BOTTOM CREDITS: Editorial Metadata Line
           ========================================================= */
        .cinematic-bottom-credits {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 5px;
          padding: 0 24px;
          box-sizing: border-box;
          opacity: 0;
          pointer-events: none;
          transform: translateY(10px);
          transition: opacity 0.2s ease 0s, transform 0.2s ease 0s;
        }

        .panel-active .cinematic-bottom-credits {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.45s,
                      transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.45s;
        }

        .credit-line-primary {
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.72);
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
        }

        .credit-tag {
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
        }

        .credit-bullet {
          margin: 0 10px;
          color: var(--brand-accent, #c9a96e);
          opacity: 0.8;
        }

        .credit-line-secondary {
          font-family: var(--font-mono, monospace);
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .carousel-panel,
          :global(.carousel-panel-img),
          .carousel-progress-line,
          .cinematic-center-content,
          .cinematic-bottom-credits,
          .carousel-collapsed-strip {
            transition-duration: 0.2s !important;
            transition-delay: 0s !important;
            animation: none !important;
            transform: none !important;
          }
        }

        /* =========================================================
           MOBILE SPECIFICATION (max-width: 767px)
           ========================================================= */
        @media (max-width: 767px) {
          .expanding-carousel-fullwidth-wrapper {
            padding: 0 8px;
          }

          .expanding-carousel-container {
            flex-direction: column !important;
            height: clamp(540px, 80svh, 720px) !important;
            gap: 6px !important;
          }

          .carousel-panel {
            flex: 0 0 76px !important;
            min-height: 76px !important;
            height: 76px !important;
            transition: flex 1.4s cubic-bezier(0.25, 1, 0.5, 1), height 1.4s cubic-bezier(0.25, 1, 0.5, 1) !important;
          }

          .carousel-panel.panel-active {
            flex: 1 1 76px !important;
            height: auto !important;
          }

          .carousel-collapsed-strip {
            display: none !important;
          }

          /* Mobile image placement */
          :global(.carousel-panel-img) {
            width: 100% !important;
            height: var(--full-h, 350px) !important;
            max-height: none !important;
            left: 0 !important;
            right: 0 !important;
            top: 50% !important;
            bottom: auto !important;
            filter: grayscale(0.5) brightness(0.65);
            transform: translateY(-50%) scale(1.08) !important;
            transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease, opacity 0.5s ease !important;
          }

          .panel-active :global(.carousel-panel-img) {
            filter: grayscale(0) brightness(1) !important;
            transform: translateY(-50%) scale(1) !important;
          }

          /* Collapsed horizontal row slice (76px) */
          .carousel-mobile-collapsed-row {
            display: flex;
            position: absolute;
            inset: 0;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            z-index: 2;
            opacity: 1;
            pointer-events: none;
            transition: opacity 0.25s ease 0.3s;
          }

          .panel-active .carousel-mobile-collapsed-row {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease 0s;
          }

          .mobile-collapsed-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
            max-width: calc(100% - 40px);
            overflow: hidden;
          }

          .mobile-collapsed-eyebrow {
            font-size: 0.65rem;
            font-weight: 600;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--brand-accent, #c9a96e);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .mobile-collapsed-title {
            font-size: 0.95rem;
            font-family: var(--font-display, serif);
            color: #ffffff;
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .mobile-collapsed-index {
            font-family: var(--font-mono, monospace);
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            color: rgba(255, 255, 255, 0.85);
          }

          /* Active Centered Content Mobile adjustments */
          .cinematic-center-content {
            padding: 24px 20px 48px;
          }

          .cinematic-eyebrow {
            font-size: 0.68rem;
            margin-bottom: 8px;
          }

          .cinematic-title {
            font-size: 1.75rem;
            margin-bottom: 0;
          }

          .cinematic-bottom-credits {
            bottom: 12px;
            padding: 0 16px;
          }

          .credit-line-primary {
            font-size: 0.58rem;
            letter-spacing: 0.1em;
          }

          .credit-line-secondary {
            display: none;
          }
        }
      `}</style>
    </motion.section>
  );
};
