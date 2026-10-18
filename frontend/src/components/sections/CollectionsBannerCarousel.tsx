'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image, { getImageProps } from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AUTOPLAY_INTERVAL_MS = 2000;
const TRANSITION_DURATION_MS = 600;

interface BannerSlideItem {
  src: string;
  mobileSrc?: string;
  objectPosition?: string;
  mobileObjectPosition?: string;
  alt: string;
  heading: string;
  description: string;
  tags: string[];
}

const BANNER_DATA: BannerSlideItem[] = [
  {
    src: '/images/banners/photo-1483985988355-763728e1935b.webp',
    mobileSrc: '/images/banners/photo-1483985988355-763728e1935b.webp',
    mobileObjectPosition: 'center 26%',
    alt: 'New Collections Campaign',
    heading: 'Collections',
    description: 'Explore our full collections of outerwear, Italian tailoring, cashmere knitwear, and artisanal accessories.',
    tags: ['Hand-Finished in Italy', 'Complimentary Global Shipping'],
  },
  {
    src: '/images/banners/new-arrivals/new-arrivals-hero.webp',
    mobileSrc: '/images/banners/new-arrivals/new-arrivals-hero-mobile.webp',
    mobileObjectPosition: 'right 5% center',
    alt: 'Autumn Winter Collection',
    heading: 'The Outerwear Edit',
    description: 'Sculpted coats and hand-stitched leather, cut for the colder months and made to last for years.',
    tags: ['Italian Leather', 'Made to Order'],
  },
  {
    src: '/images/banners/banner-permanent-wardrobe.webp',
    mobileSrc: '/images/banners/banner-permanent-wardrobe.webp',
    mobileObjectPosition: 'center center',
    alt: 'Permanent Wardrobe',
    heading: 'Cashmere, Refined',
    description: 'Featherlight knitwear in the softest Mongolian cashmere, finished by hand in small batches.',
    tags: ['Pure Cashmere', 'Limited Runs'],
  },
];

export function CollectionsBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cloned slides: [last, 0, 1, 2, first]
  const slides = [
    BANNER_DATA[BANNER_DATA.length - 1],
    ...BANNER_DATA,
    BANNER_DATA[0],
  ];

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

  useEffect(() => {
    if (isReducedMotion) return;
    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        goToNextSlide();
      }, AUTOPLAY_INTERVAL_MS);
    };

    if (!isTransitioning) {
      startTimer();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, isTransitioning, isReducedMotion, goToNextSlide]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex >= slides.length - 1) {
      setCurrentIndex(1);
    } else if (currentIndex <= 0) {
      setCurrentIndex(slides.length - 2);
    }
  };

  if (isReducedMotion) {
    return <StaticBanner banner={BANNER_DATA[0]} />;
  }

  const offset = -(currentIndex * 100);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'pan-y pinch-zoom',
        marginBottom: '40px',
        marginTop: 'var(--announcement-bar-height, 37px)',
        width: '100%',
        boxShadow: '0 24px 48px -12px rgba(12, 10, 20, 0.35)',
        backgroundColor: 'var(--color-black-tie)',
      }}
      className="group hero-master-banner"
    >
      <div
        onTransitionEnd={handleTransitionEnd}
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          transform: `translate3d(${offset}%, 0, 0)`,
          transition: isTransitioning
            ? `transform ${TRANSITION_DURATION_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
            : 'none',
          willChange: 'transform',
        }}
      >
        {slides.map((slide, index) => {
          const common = {
            alt: slide.alt,
            fill: true,
            priority: index === 0,
            quality: 80,
            sizes: '100vw',
          };
          const {
            props: { srcSet: desktopSrcSet, ...desktopRest },
          } = getImageProps({
            ...common,
            src: slide.src,
          });
          const {
            props: { srcSet: mobileSrcSet },
          } = getImageProps({
            ...common,
            src: slide.mobileSrc || slide.src,
          });

          return (
            <div
              key={index}
              aria-hidden={currentIndex !== index}
              style={{
                position: 'relative',
                flex: '0 0 100%',
                height: '100%',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                }}
              >
                {/* Responsive Art Direction via Next.js getImageProps */}
                <picture style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                  {slide.mobileSrc && (
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
                    srcSet={desktopSrcSet}
                    alt={slide.alt}
                    style={{
                      ...desktopRest.style,
                      ['--pos-desktop' as string]: slide.objectPosition || 'center 26%',
                      ['--pos-mobile' as string]: slide.mobileObjectPosition || 'right 5% center',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="group-hover:scale-105 collections-banner-img"
                  />
                </picture>

                {/* Scrim Gradients */}
                <div className="collections-scrim-horizontal" />
                <div className="collections-scrim-vertical" />
              </div>

            <div
              className="container collections-banner-container"
              style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                className="collections-banner-content"
                style={{
                  padding: 'clamp(36px, 5vw, 60px) 0',
                  maxWidth: '740px',
                }}
              >
                {currentIndex === index ? (
                  <h1
                    style={{
                      fontSize: 'clamp(1.9rem, 1.1rem + 2vw, 4rem)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 400,
                      color: 'var(--bg-subtle)',
                      letterSpacing: 'clamp(-0.01em, 0.01vw, 0)',
                      lineHeight: 1.15,
                      marginBottom: '14px',
                      textShadow: '0 2px 18px rgba(16, 33, 39, 0.5)',
                    }}
                  >
                    {slide.heading}
                  </h1>
                ) : (
                  <h2
                    style={{
                      fontSize: 'clamp(1.9rem, 1.1rem + 2vw, 4rem)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 400,
                      color: 'var(--bg-subtle)',
                      letterSpacing: 'clamp(-0.01em, 0.01vw, 0)',
                      lineHeight: 1.15,
                      marginBottom: '14px',
                      textShadow: '0 2px 18px rgba(16, 33, 39, 0.5)',
                    }}
                  >
                    {slide.heading}
                  </h2>
                )}

                <p
                  style={{
                    color: 'rgba(245, 248, 248, 0.9)',
                    fontSize: 'clamp(0.85rem, 0.65rem + 0.3vw, 1.1rem)',
                    lineHeight: 1.65,
                    marginBottom: '22px',
                    maxWidth: '620px',
                    textShadow: '0 1px 10px rgba(16, 33, 39, 0.6)',
                  }}
                >
                  {slide.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  {slide.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: 'clamp(4px, 0.3vw, 6px) clamp(10px, 0.8vw, 14px)',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.22)',
                        border: '1px solid rgba(255, 255, 255, 0.28)',
                        fontSize: 'clamp(0.68rem, 0.56rem + 0.15vw, 0.78rem)',
                        color: 'var(--bg-subtle)',
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Floating Arrow Controls with micro-animations */}
      <button
        type="button"
        onClick={goToPrevSlide}
        aria-label="Previous Collection Banner"
        className="carousel-nav-arrow prev desktop-only"
        style={{
          position: 'absolute',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <ChevronLeft size={22} strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={goToNextSlide}
        aria-label="Next Collection Banner"
        className="carousel-nav-arrow next desktop-only"
        style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <ChevronRight size={22} strokeWidth={1.5} />
      </button>

      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          zIndex: 10,
        }}
      >
        {BANNER_DATA.map((_, i) => {
          let activeIndex = currentIndex - 1;
          if (activeIndex < 0) activeIndex = BANNER_DATA.length - 1;
          if (activeIndex >= BANNER_DATA.length) activeIndex = 0;
          return (
            <button
              key={i}
              onClick={() => {
                if (isTransitioning) return;
                setIsTransitioning(true);
                setCurrentIndex(i + 1);
              }}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: activeIndex === i ? '24px' : '8px',
                height: '4px',
                borderRadius: '4px',
                backgroundColor: activeIndex === i ? 'var(--bg-subtle)' : 'rgba(245, 248, 248, 0.4)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          );
        })}
      </div>

      {/* Responsive layout styles for mobile crop and right-side subject focus */}
      <style jsx global>{`
        .collections-desktop-banner-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        .collections-mobile-banner-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: none;
        }
        .collections-scrim-horizontal {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(12, 10, 20, 0.85) 0%,
            rgba(12, 10, 20, 0.65) 42%,
            rgba(12, 10, 20, 0.25) 75%,
            rgba(12, 10, 20, 0.4) 100%
          );
          pointer-events: none;
        }
        .collections-scrim-vertical {
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(12, 10, 20, 0.7) 0%, transparent 65%);
          pointer-events: none;
        }
        .hero-master-banner {
          height: 100vh;
          height: 100svh;
          min-height: 100vh;
          min-height: 100svh;
          width: 100%;
        }
        .collections-banner-img {
          object-position: var(--pos-desktop, center 26%);
        }
        @media (max-width: 767px) {
          .collections-banner-img {
            object-position: var(--pos-mobile, right 5% center) !important;
          }
          .hero-master-banner {
            height: 100vh !important;
            height: 100svh !important;
            min-height: 100vh !important;
            min-height: 100svh !important;
            margin-bottom: 24px !important;
          }
          .collections-desktop-banner-wrapper {
            display: none !important;
          }
          .collections-mobile-banner-wrapper {
            display: block !important;
          }
          .collections-scrim-horizontal {
            background: linear-gradient(
              90deg,
              rgba(6, 10, 15, 0.94) 0%,
              rgba(6, 10, 15, 0.84) 42%,
              rgba(6, 10, 15, 0.28) 72%,
              rgba(6, 10, 15, 0.02) 100%
            ) !important;
          }
          .collections-scrim-vertical {
            background: linear-gradient(
              0deg,
              rgba(6, 10, 15, 0.8) 0%,
              transparent 40%,
              rgba(6, 10, 15, 0.3) 100%
            ) !important;
          }
          .collections-banner-container {
            align-items: center !important;
            padding-top: var(--navbar-height, 64px) !important;
          }
          .collections-banner-content {
            max-width: min(310px, 68vw) !important;
            padding: 24px 0 !important;
          }
          .collections-banner-content h1,
          .collections-banner-content h2 {
            font-size: clamp(1.75rem, 6.5vw, 2.35rem) !important;
            line-height: 1.15 !important;
            margin-bottom: 12px !important;
          }
          .collections-banner-content p {
            font-size: 0.82rem !important;
            line-height: 1.45 !important;
            margin-bottom: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

function StaticBanner({ banner }: { banner: typeof BANNER_DATA[0] }) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '40px',
        height: '100svh',
        minHeight: '100svh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 24px 48px -12px rgba(12, 10, 20, 0.35)',
        backgroundColor: 'var(--color-black-tie)',
      }}
      className="group hero-master-banner"
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      >
        {(() => {
          const common = {
            alt: banner.alt,
            fill: true,
            priority: true,
            quality: 80,
            sizes: '100vw',
          };
          const {
            props: { srcSet: desktopSrcSet, ...desktopRest },
          } = getImageProps({
            ...common,
            src: banner.src,
          });
          const {
            props: { srcSet: mobileSrcSet },
          } = getImageProps({
            ...common,
            src: banner.mobileSrc || banner.src,
          });

          return (
            <picture style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              {banner.mobileSrc && (
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
                srcSet={desktopSrcSet}
                alt={banner.alt}
                style={{
                  ...desktopRest.style,
                  ['--pos-desktop' as string]: banner.objectPosition || 'center 26%',
                  ['--pos-mobile' as string]: banner.mobileObjectPosition || 'right 5% center',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="group-hover:scale-105 collections-banner-img"
              />
            </picture>
          );
        })()}
        <div className="collections-scrim-horizontal" />
        <div className="collections-scrim-vertical" />
      </div>

      <div className="container collections-banner-container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div
          className="collections-banner-content"
          style={{
            padding: 'clamp(36px, 5vw, 60px) 0',
            maxWidth: '740px',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(1.9rem, 1.1rem + 2vw, 4rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              color: 'var(--bg-subtle)',
              letterSpacing: 'clamp(-0.01em, 0.01vw, 0)',
              lineHeight: 1.15,
              marginBottom: '14px',
              textShadow: '0 2px 18px rgba(16, 33, 39, 0.5)',
            }}
          >
            {banner.heading}
          </h1>

          <p
            style={{
              color: 'rgba(245, 248, 248, 0.9)',
              fontSize: 'clamp(0.85rem, 0.65rem + 0.3vw, 1.1rem)',
              lineHeight: 1.65,
              marginBottom: '22px',
              maxWidth: '620px',
              textShadow: '0 1px 10px rgba(16, 33, 39, 0.6)',
            }}
          >
            {banner.description}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {banner.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: 'clamp(4px, 0.3vw, 6px) clamp(10px, 0.8vw, 14px)',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  fontSize: 'clamp(0.68rem, 0.56rem + 0.15vw, 0.78rem)',
                  color: 'var(--bg-subtle)',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
