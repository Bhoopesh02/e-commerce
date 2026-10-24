'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import slide1Img from '../../../public/images/banners/home/hero-estuary.webp';
import slide2Img from '../../../public/images/banners/home/hero-dunes.webp';
import slide3Img from '../../../public/images/banners/home/hero-coast.webp';
import slide4Img from '../../../public/images/banners/home/hero-highland.webp';
import slide5Img from '../../../public/images/banners/home/hero-forest.webp';

export interface HeroSlide {
  id: string;
  img: StaticImageData;
  alt: string;
  heading: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  objectPosition: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-estuary',
    img: slide1Img,
    alt: "Fall Winter '26 Collection — Coastal Estuary",
    heading: "Fall Winter '26",
    subtitle: 'Drop 2 is now available.',
    ctaText: 'SHOP ALL NEW ARRIVALS',
    ctaLink: '/shop?categorySlug=outerwear',
    objectPosition: '55% 25%',
  },
  {
    id: 'slide-dunes',
    img: slide2Img,
    alt: 'The Dune Collection — Double-Faced Cashmere & Structural Wool',
    heading: 'The Dune Collection',
    subtitle: 'Double-faced cashmere & structural wool.',
    ctaText: 'EXPLORE OUTERWEAR',
    ctaLink: '/shop?categorySlug=outerwear',
    objectPosition: '65% 20%',
  },
  {
    id: 'slide-coast',
    img: slide3Img,
    alt: 'Atmospheric Layers — Obsidian Shearling & Cold Weather Elements',
    heading: 'Atmospheric Layers',
    subtitle: 'Engineered for climate resilience and warmth.',
    ctaText: 'DISCOVER SHEARLING',
    ctaLink: '/shop?categorySlug=outerwear',
    objectPosition: '60% 25%',
  },
  {
    id: 'slide-highland',
    img: slide4Img,
    alt: 'Highland Knitwear — Pure Un-dyed Scottish Wool & Alpaca',
    heading: 'Highland Knitwear',
    subtitle: 'Pure un-dyed Scottish wool & alpaca blends.',
    ctaText: 'SHOP KNITWEAR EDITIONS',
    ctaLink: '/shop?categorySlug=knitwear',
    objectPosition: '65% 20%',
  },
  {
    id: 'slide-forest',
    img: slide5Img,
    alt: "Modern Tailoring '26 — Fluid Silhouettes For Everyday Movement",
    heading: "Modern Tailoring '26",
    subtitle: 'Fluid silhouettes tailored for everyday movement.',
    ctaText: 'VIEW THE LOOKBOOK',
    ctaLink: '/shop?categorySlug=tailoring',
    objectPosition: '65% 25%',
  },
];

const AUTO_ROTATE_SECONDS = 5;

export const HeroSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHeroReady, setIsHeroReady] = useState(false);
  const [loadedSlides, setLoadedSlides] = useState<Record<number, boolean>>({});

  const touchStartXRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const rafIdRef = useRef<number | null>(null);

  const currentSlide = HERO_SLIDES[currentIndex];

  const handleSlideLoad = useCallback((idx: number) => {
    setLoadedSlides((prev) => ({ ...prev, [idx]: true }));
    if (idx === 0) {
      setIsHeroReady(true);
    }
  }, []);

  // Check if first slide is cached, then pre-cache the rest after initial paint
  useEffect(() => {
    const firstImg = new window.Image();
    firstImg.src = HERO_SLIDES[0].img.src;
    if (firstImg.complete) {
      setIsHeroReady(true);
      setLoadedSlides((prev) => ({ ...prev, 0: true }));
    } else {
      firstImg.onload = () => {
        setIsHeroReady(true);
        setLoadedSlides((prev) => ({ ...prev, 0: true }));
      };
    }

    const timer = setTimeout(() => {
      HERO_SLIDES.slice(1).forEach((slide, offset) => {
        const img = new window.Image();
        img.src = slide.img.src;
        img.onload = () => {
          setLoadedSlides((prev) => ({ ...prev, [offset + 1]: true }));
        };
      });
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length);
    startTimeRef.current = Date.now();
    setProgress(0);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Smooth auto-scroll loop (runs only when hero is ready and not hovered)
  useEffect(() => {
    if (!isHeroReady || isHovered) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    const durationMs = AUTO_ROTATE_SECONDS * 1000;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const curProgress = Math.min(elapsed / durationMs, 1);
      setProgress(curProgress);

      if (curProgress >= 1) {
        goToSlide(currentIndex + 1);
      } else {
        rafIdRef.current = requestAnimationFrame(tick);
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [currentIndex, isHeroReady, isHovered, goToSlide]);

  // Touch Swipe for Mobile Navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartXRef.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    else if (e.key === 'ArrowLeft') prevSlide();
  };

  return (
    <section
      className="hero-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Editorial Seasonal Banners Carousel"
      aria-roledescription="carousel"
    >
      {/* Sleek Dark Veil while initial image is loading — prevents any pop-in or flash */}
      <div
        className={`hero-initial-loader ${isHeroReady ? 'is-loaded' : ''}`}
        aria-hidden="true"
      />

      {/* Background Slides Layer */}
      <div className="hero-slides-layer" aria-hidden="true">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          const isLoaded = loadedSlides[idx];

          return (
            <div
              key={slide.id}
              className={`hero-slide-item ${isActive && isLoaded ? 'is-active' : ''}`}
            >
              <Image
                src={slide.img}
                alt={slide.alt}
                fill
                priority={idx === 0}
                loading={idx === 0 ? 'eager' : 'lazy'}
                quality={88}
                sizes="100vw"
                draggable={false}
                onLoad={() => handleSlideLoad(idx)}
                className="hero-slide-image select-none pointer-events-none"
                style={{
                  objectFit: 'cover',
                  objectPosition: slide.objectPosition,
                  opacity: isLoaded ? 1 : 0,
                  transition: 'opacity 600ms ease-in-out',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Main Content Area — revealed gracefully once initial hero is ready */}
      <div className="hero-content-wrapper">
        <AnimatePresence mode="wait">
          {isHeroReady && (
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="hero-text-block"
            >
              <h1 className="hero-title">{currentSlide.heading}</h1>
              <p className="hero-subtitle">{currentSlide.subtitle}</p>

              <div className="hero-cta-wrapper">
                <Link href={currentSlide.ctaLink} className="hero-cta-link">
                  <button
                    type="button"
                    className="hero-btn-white"
                    aria-label={`${currentSlide.ctaText} — ${currentSlide.heading}`}
                  >
                    {currentSlide.ctaText}
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Minimalist Slide Indicators (Bottom Right) */}
      {isHeroReady && (
        <div className="hero-carousel-controls" aria-label="Slide indicators">
          <div className="hero-progress-bars">
            {HERO_SLIDES.map((_, idx) => {
              const isCurrent = idx === currentIndex;
              const isPast = idx < currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`hero-progress-bar-slot ${isCurrent ? 'active' : ''}`}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div
                    className="hero-progress-bar-fill"
                    style={{
                      width: isCurrent
                        ? `${progress * 100}%`
                        : isPast
                        ? '100%'
                        : '0%',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          margin-top: var(--announcement-bar-height, 37px);
          height: calc(100vh - var(--announcement-bar-height, 37px));
          height: calc(100svh - var(--announcement-bar-height, 37px));
          min-height: 520px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          background-color: #121212;
          outline: none;
        }

        .hero-initial-loader {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background: var(--color-black-tie, #141414);
          z-index: 15;
          opacity: 1;
          pointer-events: none;
          transition: opacity 600ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-initial-loader.is-loaded {
          opacity: 0;
        }

        .hero-slides-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
        }

        .hero-slide-item {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          z-index: 0;
          pointer-events: none;
          transition: opacity 800ms cubic-bezier(0.25, 1, 0.5, 1);
          will-change: opacity;
        }

        .hero-slide-item.is-active {
          opacity: 1;
          z-index: 1;
          pointer-events: auto;
        }

        :global(.hero-slide-image) {
          width: 100% !important;
          height: 100% !important;
        }

        /* Content positioned at lower-left matching reference image */
        .hero-content-wrapper {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          width: 100%;
          padding-left: clamp(24px, 4vw, 56px);
          padding-bottom: clamp(32px, 5.5vh, 60px);
          box-sizing: border-box;
          pointer-events: none;
        }

        .hero-text-block {
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          max-width: 540px;
        }

        /* Refined, smaller & lighter SANS-SERIF header matching design system */
        .hero-title {
          font-family: var(--font-body, 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif) !important;
          font-size: clamp(1.65rem, 1.2rem + 1.8vw, 2.65rem);
          font-weight: var(--weight-regular, 400);
          line-height: 1.14;
          letter-spacing: -0.015em;
          color: var(--color-diamond, #ffffff);
          margin: 0 0 8px 0;
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.45), 0 2px 14px rgba(0, 0, 0, 0.25);
          word-break: break-word;
        }

        /* Clean, lighter subtitle */
        .hero-subtitle {
          font-family: var(--font-body, 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif) !important;
          font-size: clamp(0.8125rem, 0.76rem + 0.22vw, 0.9375rem);
          font-weight: var(--weight-regular, 400);
          line-height: 1.45;
          letter-spacing: 0.005em;
          color: var(--color-diamond, #ffffff);
          opacity: 0.92;
          margin: 0 0 18px 0;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
        }

        .hero-cta-wrapper {
          display: inline-flex;
          align-items: center;
        }

        .hero-cta-link {
          text-decoration: none;
          display: inline-block;
        }

        /* Razor sharp solid white button matching design system & reference */
        .hero-btn-white {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-diamond, #ffffff);
          color: var(--color-black-tie, #141414);
          border: none;
          border-radius: var(--radius-none, 0px);
          padding: 10px 20px;
          font-family: var(--font-body, 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif) !important;
          font-size: 0.6875rem;
          font-weight: var(--weight-semibold, 600);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          transition: background-color 180ms ease, color 180ms ease, transform 150ms ease;
        }

        .hero-btn-white:hover {
          background-color: var(--color-black-tie, #141414);
          color: var(--color-diamond, #ffffff);
        }

        .hero-btn-white:active {
          transform: translateY(0);
        }

        /* Subtle minimal progress dashes on bottom right */
        .hero-carousel-controls {
          position: absolute;
          bottom: clamp(16px, 3vh, 28px);
          right: clamp(20px, 4vw, 56px);
          z-index: 20;
          display: flex;
          align-items: center;
        }

        .hero-progress-bars {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hero-progress-bar-slot {
          position: relative;
          width: 24px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          border: none;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          transition: background-color 200ms ease;
        }

        .hero-progress-bar-slot:hover {
          background: rgba(255, 255, 255, 0.6);
        }

        .hero-progress-bar-fill {
          height: 100%;
          background: #ffffff;
          transition: width 80ms linear;
        }

        @media (max-width: 640px) {
          .hero-carousel-controls {
            right: auto;
            left: clamp(24px, 4.5vw, 64px);
            bottom: 14px;
          }

          .hero-content-wrapper {
            padding-bottom: 44px;
          }
        }
      `}</style>
    </section>
  );
};



