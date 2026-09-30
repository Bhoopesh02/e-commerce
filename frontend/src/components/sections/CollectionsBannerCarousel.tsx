'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

const AUTOPLAY_INTERVAL_MS = 2000;
const TRANSITION_DURATION_MS = 600;

const BANNER_DATA = [
  {
    src: '/images/banners/photo-1483985988355-763728e1935b.webp',
    alt: 'New Collections Campaign',
    heading: 'Collections',
    description: 'Explore our full collections of outerwear, Italian tailoring, cashmere knitwear, and artisanal accessories.',
    tags: ['Hand-Finished in Italy', 'Complimentary Global Shipping'],
  },
  {
    src: '/images/banners/banner-autumn-winter.webp',
    alt: 'Autumn Winter Collection',
    heading: 'The Outerwear Edit',
    description: 'Sculpted coats and hand-stitched leather, cut for the colder months and made to last for years.',
    tags: ['Italian Leather', 'Made to Order'],
  },
  {
    src: '/images/banners/banner-permanent-wardrobe.webp',
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
        marginBottom: '40px',
        height: 'calc(100vh - 76px)',
        boxShadow: '0 24px 48px -12px rgba(12, 10, 20, 0.35)',
        backgroundColor: '#0c0a14',
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
        {slides.map((slide, index) => (
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
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 1 || index === 2 || index === 0}
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center 26%',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="group-hover:scale-105"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(12, 10, 20, 0.94) 0%, rgba(12, 10, 20, 0.82) 42%, rgba(12, 10, 20, 0.42) 75%, rgba(12, 10, 20, 0.6) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(0deg, rgba(12, 10, 20, 0.7) 0%, transparent 65%)',
                }}
              />
            </div>

            <div
              className="container"
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
                style={{
                  padding: 'clamp(36px, 5vw, 60px) 0',
                  maxWidth: '740px',
                }}
              >
                {currentIndex === index ? (
                  <h1
                    style={{
                      fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 400,
                      color: '#fff8f5',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15,
                      marginBottom: '14px',
                      textShadow: '0 2px 18px rgba(0,0,0,0.5)',
                    }}
                  >
                    {slide.heading}
                  </h1>
                ) : (
                  <h2
                    style={{
                      fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 400,
                      color: '#fff8f5',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15,
                      marginBottom: '14px',
                      textShadow: '0 2px 18px rgba(0,0,0,0.5)',
                    }}
                  >
                    {slide.heading}
                  </h2>
                )}

                <p
                  style={{
                    color: 'rgba(255, 248, 245, 0.9)',
                    fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                    lineHeight: 1.65,
                    marginBottom: '22px',
                    maxWidth: '620px',
                    textShadow: '0 1px 10px rgba(0,0,0,0.6)',
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
                        padding: '5px 14px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        fontSize: '0.75rem',
                        color: '#fff8f5',
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
        ))}
      </div>

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
                backgroundColor: activeIndex === i ? '#fff8f5' : 'rgba(255, 248, 245, 0.4)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          );
        })}
      </div>
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
        height: 'calc(100vh - 76px)',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 24px 48px -12px rgba(12, 10, 20, 0.35)',
        backgroundColor: '#0c0a14',
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
        <Image
          src={banner.src}
          alt={banner.alt}
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center 26%',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="group-hover:scale-105"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(12, 10, 20, 0.94) 0%, rgba(12, 10, 20, 0.82) 42%, rgba(12, 10, 20, 0.42) 75%, rgba(12, 10, 20, 0.6) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(0deg, rgba(12, 10, 20, 0.7) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div
          style={{
            padding: 'clamp(36px, 5vw, 60px) 0',
            maxWidth: '740px',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              color: '#fff8f5',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '14px',
              textShadow: '0 2px 18px rgba(0,0,0,0.5)',
            }}
          >
            {banner.heading}
          </h1>

          <p
            style={{
              color: 'rgba(255, 248, 245, 0.9)',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
              lineHeight: 1.65,
              marginBottom: '22px',
              maxWidth: '620px',
              textShadow: '0 1px 10px rgba(0,0,0,0.6)',
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
                  padding: '5px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  fontSize: '0.75rem',
                  color: '#fff8f5',
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
