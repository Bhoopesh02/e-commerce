'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import styles from './HeroEditorialCarousel.module.css';

export interface BannerSlide {
  id: string;
  categorySlug: string;
  romanNumeral: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  image: string;
}

export const NEW_ARRIVALS_BANNERS: BannerSlide[] = [
  {
    id: 'tailoring',
    categorySlug: 'tailoring',
    romanNumeral: 'I / IV',
    badge: '01 · Sartorial Tailoring',
    title: 'The Sartorial Vanguard',
    subtitle: 'Architectural Suiting & Sovereign Presence',
    description:
      'Architectural suiting, handcrafted Italian leather duffels, and refined knitwear designed for sovereign presence.',
    ctaText: 'Explore Silhouettes',
    image: '/images/banners/new-arrivals/new-arrivals-hero.webp',
  },
  {
    id: 'outerwear',
    categorySlug: 'outerwear',
    romanNumeral: 'II / IV',
    badge: '02 · Architectural Outerwear',
    title: 'The Monolith Overcoats',
    subtitle: 'Double-Faced Wool & Milanese Leather',
    description:
      'Architectural virgin wool trench coats, double-faced heavy overcoats, and Milanese nappa leather jackets designed for climate resilience.',
    ctaText: 'Explore Outerwear',
    image: '/images/banners/new-arrivals/new-arrivals-outerwear.jpg',
  },
  {
    id: 'eveningwear',
    categorySlug: 'eveningwear',
    romanNumeral: 'III / IV',
    badge: '03 · Nocturne Eveningwear',
    title: 'The Nocturne Silhouette',
    subtitle: 'Mulberry Silk Charmeuse & Gala Ensembles',
    description:
      'Floor-sweeping liquid silk charmeuse, bias-cut drapery, and midnight obsidian velvet tailored for after-dark distinction.',
    ctaText: 'Explore Eveningwear',
    image: '/images/banners/new-arrivals/new-arrivals-eveningwear.jpg',
  },
  {
    id: 'leather-goods',
    categorySlug: 'leather-goods',
    romanNumeral: 'IV / IV',
    badge: '04 · Florentine Leathercraft',
    title: 'The Tuscan Atelier',
    subtitle: 'Full-Grain Calfskin & Artisanal Holdalls',
    description:
      'Full-grain French box calfskin totes, structured saddle crossbodies, and weekend luggage hand-stitched with waxed cord.',
    ctaText: 'Explore Leather Goods',
    image: '/images/banners/new-arrivals/new-arrivals-leather.jpg',
  },
];

interface HeroEditorialCarouselProps {
  onSelectCategory?: (categorySlug: string) => void;
  scrollToGridTop?: () => void;
  totalProductsCount?: number;
  autoScrollSeconds?: number;
}

export const HeroEditorialCarousel: React.FC<HeroEditorialCarouselProps> = ({
  onSelectCategory,
  scrollToGridTop,
  totalProductsCount = 53,
  autoScrollSeconds = 4.5,
}) => {
  const slides = NEW_ARRIVALS_BANNERS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  const touchStartXRef = useRef<number | null>(null);
  const timerStartRef = useRef<number>(Date.now());
  const rafIdRef = useRef<number | null>(null);

  const goToSlide = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex);
    timerStartRef.current = Date.now();
    setSlideProgress(0);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % slides.length);
  }, [currentIndex, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  }, [currentIndex, goToSlide, slides.length]);

  // Smooth Auto-Scroll Countdown Loop
  useEffect(() => {
    if (isHovered || autoScrollSeconds <= 0) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      return;
    }

    timerStartRef.current = Date.now();
    const durationMs = autoScrollSeconds * 1000;

    const step = () => {
      const elapsed = Date.now() - timerStartRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      setSlideProgress(progress);

      if (progress >= 1) {
        goToSlide((currentIndex + 1) % slides.length);
      } else {
        rafIdRef.current = requestAnimationFrame(step);
      }
    };

    rafIdRef.current = requestAnimationFrame(step);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [currentIndex, isHovered, autoScrollSeconds, goToSlide, slides.length]);

  // Touch Swipe for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  const handleCtaClick = (categorySlug: string) => {
    if (onSelectCategory) {
      onSelectCategory(categorySlug);
    }
    if (scrollToGridTop) {
      scrollToGridTop();
    }
  };

  return (
    <section
      className={styles.carouselSection}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="New Arrivals Full-Width Editorial Banners"
    >

      {/* 100% Full-Width Horizontal Sliding Track */}
      <div
        className={styles.track}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide.id}
              className={`${styles.slide} ${isActive ? styles.active : ''}`}
            >
              {/* Background Image Layer (Full Width & Height) */}
              <div className={styles.imageWrapper}>
                <Image
                  src={slide.image}
                  alt={`${slide.title} — ${slide.subtitle}`}
                  fill
                  priority={index === 0}
                  quality={85}
                  sizes="100vw"
                  className={styles.bannerImage}
                />

                {/* Cinematic Scrim Gradients */}
                <div className={styles.scrimHorizontal} />
                <div className={styles.scrimVertical} />
              </div>

              {/* Editorial Content Layer (Aligned to Site Container Grid) */}
              <div className={styles.contentLayer}>
                <div className="container">
                  <div className={styles.contentWrapper}>
                    <div className={styles.badge}>
                      <span>{slide.badge}</span>
                    </div>

                    <h1 className={styles.headline}>{slide.title}</h1>

                    <p className={styles.subtitle}>{slide.subtitle}</p>

                    <p className={styles.description}>{slide.description}</p>

                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.ctaButton}
                        onClick={() => handleCtaClick(slide.categorySlug)}
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowDown size={14} />
                      </button>

                      <span className={styles.piecesCount}>
                        {totalProductsCount} pieces available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Track Progress Indicators */}
      <div className={styles.bottomIndicators}>
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`${styles.indicatorBar} ${
              idx === currentIndex ? styles.activeIndicator : ''
            }`}
            onClick={() => goToSlide(idx)}
            title={slide.title}
          >
            {idx === currentIndex && (
              <div
                className={styles.indicatorProgress}
                style={{ width: `${slideProgress * 100}%` }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
