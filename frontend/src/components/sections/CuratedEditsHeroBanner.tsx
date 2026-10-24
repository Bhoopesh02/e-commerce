'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getImageProps } from 'next/image';
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
    mobileObjectPosition: 'center 18%',
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

// Autoplay interval for curated editorial collection banner
const AUTOPLAY_INTERVAL_MS = 5000;

export const CuratedEditsHeroBanner: React.FC = () => {
  const slides = CURATED_EDIT_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Eager Background Pre-Caching: Download all 5 high-resolution WebP images in background immediately on page load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    slides.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.image;
      if (slide.mobileImage) {
        const mobImg = new window.Image();
        mobImg.src = slide.mobileImage;
      }
    });
  }, [slides]);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Autoplay timer
  useEffect(() => {
    if (isReducedMotion || isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      goToNextSlide();
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, isReducedMotion, goToNextSlide]);

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

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Curated Edits Banner Carousel"
      className={styles.heroBanner}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      {/* Container stacking crossfading slides on GPU layers */}
      <div className={styles.track}>
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          const common = {
            alt: `${slide.title} - ${slide.badge}`,
            fill: true,
            priority: true,
            loading: 'eager' as const,
            quality: 85,
            sizes: '100vw',
          };
          const {
            props: { srcSet: desktopSrcSet, ...desktopRest },
          } = getImageProps({
            ...common,
            src: slide.image,
          });
          const {
            props: { srcSet: mobileSrcSet },
          } = getImageProps({
            ...common,
            src: slide.mobileImage || slide.image,
          });

          return (
            <div
              key={slide.id}
              className={`${styles.slideContainer} ${isActive ? styles.active : ''}`}
            >
              {/* Background Editorial Image via Next.js getImageProps */}
              <div className={styles.imageWrapper}>
                <picture className={styles.pictureWrapper}>
                  {slide.mobileImage && (
                    <source
                      media="(max-width: 767px)"
                      srcSet={mobileSrcSet}
                    />
                  )}
                  <source
                    media="(min-width: 768px)"
                    srcSet={desktopSrcSet}
                  />
                  <img
                    {...desktopRest}
                    srcSet={undefined}
                    alt={`${slide.title} - ${slide.badge}`}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className={styles.bannerImage}
                    style={{
                      ...desktopRest.style,
                      ['--pos-desktop' as string]: slide.objectPosition || 'center 26%',
                      ['--pos-mobile' as string]: slide.mobileObjectPosition || 'center center',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </picture>
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
          );
        })}
      </div>

      {/* Bottom Track Indicators */}
      <div className={styles.bottomIndicators}>
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            className={`${styles.indicatorBar} ${
              idx === currentIndex ? styles.activeIndicator : ''
            }`}
            onClick={() => goToSlide(idx)}
            title={slide.title}
            aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
          />
        ))}
      </div>
    </section>
  );
};
