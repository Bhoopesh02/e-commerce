'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CuratedEditsHeroBanner.module.css';

export interface CuratedEditSlide {
  id: string;
  categorySlug: string;
  number: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  image: string;
  mobileImage?: string;
  objectPosition?: string;
  mobileObjectPosition?: string;
}

export const CURATED_EDIT_SLIDES: CuratedEditSlide[] = [
  {
    id: 'heritage',
    categorySlug: 'outerwear',
    number: '01',
    badge: 'Archival Heritage',
    title: 'The warm-up',
    subtitle: "It's time to invest in luxe layers",
    description: 'Double-faced virgin wool trench coats, Spanish shearling aviators, and archival silhouettes.',
    ctaText: 'Shop the edit',
    image: '/images/banners/all-collections/curated-warmup.webp',
    mobileImage: '/images/banners/all-collections/curated-warmup-mobile.webp',
    objectPosition: 'center 26%',
    mobileObjectPosition: 'center 20%',
  },
  {
    id: 'sartorial',
    categorySlug: 'tailoring',
    number: '02',
    badge: 'Savile Row Cut',
    title: 'The Sartorial Cut',
    subtitle: 'Deconstructed suiting & floating canvas tailoring',
    description: 'Deconstructed wool suiting, razor-sharp peak lapels, and floating canvas bespoke tailoring.',
    ctaText: 'Shop the edit',
    image: '/images/banners/all-collections/curated-sartorial.webp',
    mobileImage: '/images/banners/all-collections/curated-sartorial-mobile.webp',
    objectPosition: 'center 18%',
    mobileObjectPosition: 'center 16%',
  },
  {
    id: 'cashmere',
    categorySlug: 'knitwear',
    number: '03',
    badge: 'Pure Cashmere',
    title: 'Cashmere Essentials',
    subtitle: 'Ultra-fine Grade-A Mongolian fleece',
    description: 'Ultra-fine 15.2-micron Grade-A Mongolian cashmere, brushed mohair, and seamless ribbed jumpers.',
    ctaText: 'Shop the edit',
    image: '/images/banners/all-collections/curated-cashmere.webp',
    mobileImage: '/images/banners/all-collections/curated-cashmere-mobile.webp',
    objectPosition: 'center 20%',
    mobileObjectPosition: 'center 18%',
  },
  {
    id: 'evening',
    categorySlug: 'eveningwear',
    number: '04',
    badge: 'Nocturne Gala',
    title: 'The Evening Edit',
    subtitle: 'Liquid silk charmeuse & floor-grazing silhouettes',
    description: 'Liquid 30-momme mulberry silk charmeuse, floor-grazing puddle trains, and draped formal gala gowns.',
    ctaText: 'Shop the edit',
    image: '/images/banners/all-collections/curated-evening.webp',
    mobileImage: '/images/banners/all-collections/curated-evening-mobile.webp',
    objectPosition: 'center 32%',
    mobileObjectPosition: 'center 24%',
  },
  {
    id: 'monochrome',
    categorySlug: 'leather-goods',
    number: '05',
    badge: 'Atelier Leather',
    title: 'Monochrome Atelier',
    subtitle: 'Pebbled leather weekenders & sculpted calfskin',
    description: 'Pebbled leather weekenders, obsidian calfskin folios, and structured saddle silhouettes.',
    ctaText: 'Shop the edit',
    image: '/images/banners/all-collections/curated-leather.webp',
    mobileImage: '/images/banners/all-collections/curated-leather-mobile.webp',
    objectPosition: 'center 32%',
    mobileObjectPosition: 'center 24%',
  },
];

// 1 second per slide auto-scroll with 600ms smooth gliding transition
const AUTOPLAY_INTERVAL_MS = 2000;
const TRANSITION_DURATION_MS = 600;

export const CuratedEditsHeroBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Cloned slides for seamless infinite loop: [last, ...slides, first]
  const slides = [
    CURATED_EDIT_SLIDES[CURATED_EDIT_SLIDES.length - 1],
    ...CURATED_EDIT_SLIDES,
    CURATED_EDIT_SLIDES[0],
  ];

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const goToNextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const goToPrevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex >= slides.length - 1) {
      setCurrentIndex(1);
    } else if (currentIndex <= 0) {
      setCurrentIndex(slides.length - 2);
    }
  };

  // Autoplay timer: auto-scrolls per second
  useEffect(() => {
    if (isReducedMotion || isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (!isTransitioning) {
      timerRef.current = setTimeout(() => {
        goToNextSlide();
      }, AUTOPLAY_INTERVAL_MS);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, isReducedMotion, isTransitioning, goToNextSlide]);

  // Pause when document is hidden/backgrounded
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      goToNextSlide();
    } else if (e.key === 'ArrowLeft') {
      goToPrevSlide();
    }
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartXRef.current - touchEndX;

    if (deltaX > 45) {
      goToNextSlide();
    } else if (deltaX < -45) {
      goToPrevSlide();
    }
    touchStartXRef.current = null;
  };

  const offset = -(currentIndex * 100);

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Curated Edits Banner Carousel"
      className={styles.heroBanner}
      style={{
        position: 'relative',
        width: '100%',
        marginTop: 'var(--announcement-bar-height, 37px)',
        minHeight: 'calc(100dvh - var(--announcement-bar-height, 37px))',
        height: 'calc(100dvh - var(--announcement-bar-height, 37px))',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      <div
        className={styles.track}
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `translate3d(${offset}%, 0, 0)`,
          transition: isTransitioning
            ? `transform ${TRANSITION_DURATION_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
            : 'none',
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className={styles.slideContainer}
            aria-hidden={index !== currentIndex}
          >
            {/* Background Editorial Image */}
            <div className={styles.imageWrapper}>
              {/* Desktop Landscape Crop */}
              <div className={styles.desktopImageWrapper}>
                <Image
                  src={slide.image}
                  alt={`${slide.title} - ${slide.badge}`}
                  fill
                  priority={index <= 2}
                  quality={90}
                  sizes="(max-width: 767px) 1px, 100vw"
                  className={styles.bannerImage}
                  style={{ objectPosition: slide.objectPosition || 'center 26%' }}
                />
              </div>

              {/* Mobile Portrait Crop with zero quality loss */}
              <div className={styles.mobileImageWrapper}>
                <Image
                  src={slide.mobileImage || slide.image}
                  alt={`${slide.title} - ${slide.badge}`}
                  fill
                  priority={index <= 2}
                  quality={90}
                  sizes="(max-width: 767px) 100vw, 1px"
                  className={styles.bannerImageMobile}
                  style={{ objectPosition: slide.mobileObjectPosition || 'center center' }}
                />
              </div>
            </div>

            {/* Atmosphere Scrim Overlays */}
            <div className={styles.scrim} />
            <div className={styles.scrimBottom} />

            {/* Bottom-Left Content Stack */}
            <div className={styles.contentWrapper}>
              <div className={styles.kicker}>
                <span>CURATED EDIT {slide.number}</span>
                <span className={styles.kickerDot} />
                <span>{slide.badge}</span>
              </div>

              <h1 className={styles.headline}>
                {slide.title}
              </h1>

              <p className={styles.subtitle}>
                {slide.subtitle}
              </p>

              <div>
                <Link
                  href={`/shop?categorySlug=${slide.categorySlug}`}
                  className={styles.ctaButton}
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
