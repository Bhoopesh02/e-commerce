'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Category } from '@/types';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Skeleton } from '@/components/ui/Skeleton';

export interface CategoryShowcaseProps {
  categories?: Category[];
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
}

export interface CategoryShowcaseSkeletonProps {
  title?: string;
  subtitle?: string;
}

export const CategorySkeletonTrack: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const cardWidth = isMobile ? 150 : 320;
  const cardHeight = isMobile ? 210 : 460;
  const gap = isMobile ? -17 : 32;
  const activeScale = isMobile ? 1 : 1.12;
  const inactiveScale = isMobile ? 0.666 : 0.85;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'max-content',
        }}
      >
        {[-2, -1, 0, 1, 2].map((offset) => {
          const isActive = offset === 0;
          return (
            <div
              key={offset}
              className={`category-slider-card ${isMobile && Math.abs(offset) > 1 ? 'hidden-on-mobile-skeleton' : ''}`}
              style={{
                position: 'relative',
                flexShrink: 0,
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                marginRight: offset === 2 ? '0' : `${gap}px`,
                transform: isActive ? `scale(${activeScale})` : `scale(${inactiveScale})`,
                zIndex: isActive ? 10 : 1,
                opacity: isActive ? 1 : (Math.abs(offset) === 1 ? 0.5 : 0.35),
                borderRadius: isMobile ? '12px' : 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: isActive ? '0 24px 50px rgba(0,0,0,0.2)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: isMobile ? '16px' : '32px',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              {/* Full Card Skeleton Shimmer */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <Skeleton
                  width="100%"
                  height="100%"
                  borderRadius={isMobile ? '12px' : 'var(--radius-md)'}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  }}
                />
              </div>

              {/* Scrim Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(20, 20, 20, 0.1) 0%, rgba(20, 20, 20, 0.85) 100%)',
                  zIndex: 1,
                  opacity: isActive ? 0.8 : 0.95,
                }}
              />

              {/* Bottom Content Area */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: isActive ? '8px' : '0',
                  }}
                >
                  <Skeleton
                    width={isActive ? (isMobile ? '80px' : '140px') : (isMobile ? '60px' : '100px')}
                    height={isActive ? (isMobile ? '18px' : '28px') : (isMobile ? '14px' : '20px')}
                    borderRadius="6px"
                    style={{
                      background: 'rgba(255, 255, 255, 0.22)',
                    }}
                  />

                  {isActive && (
                    <Skeleton
                      width={isMobile ? '24px' : '36px'}
                      height={isMobile ? '24px' : '36px'}
                      borderRadius="50%"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(4px)',
                      }}
                    />
                  )}
                </div>

                {isActive && !isMobile && (
                  <div style={{ marginTop: '8px' }}>
                    <Skeleton
                      width="90%"
                      height="12px"
                      borderRadius="4px"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        marginBottom: '6px',
                      }}
                    />
                    <Skeleton
                      width="60%"
                      height="12px"
                      borderRadius="4px"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav Chevrons in Skeleton State */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: isMobile ? '4px' : '5%',
          right: isMobile ? '4px' : '5%',
          transform: 'translateY(-50%)',
          display: 'flex',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <div
          style={{
            width: isMobile ? 28 : 50,
            height: isMobile ? 28 : 50,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            opacity: 0.35,
          }}
        >
          <ChevronLeft size={isMobile ? 16 : 24} />
        </div>
        <div
          style={{
            width: isMobile ? 28 : 50,
            height: isMobile ? 28 : 50,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            opacity: 0.35,
          }}
        >
          <ChevronRight size={isMobile ? 16 : 24} />
        </div>
      </div>
    </div>
  );
};

export const CategoryShowcaseSkeleton: React.FC<CategoryShowcaseSkeletonProps> = ({
  title = 'Curated Disciplines',
  subtitle = 'Discover tailored collections crafted for longevity and quiet distinction.',
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      className="category-showcase-section category-showcase-skeleton"
      aria-busy="true"
      aria-label="Loading curated categories"
      style={{
        padding: '40px 0 80px',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            {title ? (
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>{title}</h2>
            ) : (
              <Skeleton width="280px" height="38px" borderRadius="6px" />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Skeleton width="130px" height="20px" borderRadius="4px" />
            </div>
          </div>
          {subtitle ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '540px' }}>
              {subtitle}
            </p>
          ) : (
            <Skeleton width="420px" height="18px" borderRadius="4px" style={{ maxWidth: '100%' }} />
          )}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          padding: isMobile ? '20px 0' : '60px 0',
          zIndex: 2,
        }}
      >
        <CategorySkeletonTrack isMobile={isMobile} />
      </div>

      <style jsx global>{`
        @media (max-width: 767px) {
          .hidden-on-mobile-skeleton {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  categories = [],
  title = 'Curated Disciplines',
  subtitle = 'Discover tailored collections crafted for longevity and quiet distinction.',
  isLoading = false,
}) => {
  if (isLoading || !categories || categories.length === 0) {
    return <CategoryShowcaseSkeleton title={title} subtitle={subtitle} />;
  }

  const baseCount = categories.length;
  // 5x duplication to allow rapid clicking without hitting edges before transition snaps
  const carouselItems = [...categories, ...categories, ...categories, ...categories, ...categories];

  const [activeIndex, setActiveIndex] = useState(baseCount * 2);
  const [enableTransition, setEnableTransition] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-scroll logic
  useEffect(() => {
    if (isHovered) return;

    const intervalId = setInterval(() => {
      if (!enableTransition) return;
      setActiveIndex((prev) => prev + 1);
      setHasMoved(true);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [isHovered, enableTransition]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const cardWidth = isMobile ? 150 : 320;
  const cardHeight = isMobile ? 210 : 460;
  const gap = isMobile ? -17 : 32;
  const activeScale = isMobile ? 1 : 1.12;
  const inactiveScale = isMobile ? 0.666 : 0.85;

  const trackTranslateX = containerWidth > 0
    ? (containerWidth / 2) - (cardWidth / 2) - (activeIndex * (cardWidth + gap))
    : 0;

  const handleNext = () => {
    if (!enableTransition) return;
    setActiveIndex((prev) => prev + 1);
    setHasMoved(true);
  };

  const handlePrev = () => {
    if (!enableTransition) return;
    setActiveIndex((prev) => prev - 1);
    setHasMoved(true);
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // Ensure we only snap on the track's transform transition, not child elements
    if (e.target !== e.currentTarget) return;

    if (activeIndex >= baseCount * 3) {
      setEnableTransition(false);
      setActiveIndex((prev) => prev - baseCount);
    } else if (activeIndex < baseCount * 2) {
      setEnableTransition(false);
      setActiveIndex((prev) => prev + baseCount);
    }
  };

  // Turn transition back on after snapping
  useEffect(() => {
    if (!enableTransition) {
      const timeout = setTimeout(() => {
        setEnableTransition(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [enableTransition]);

  return (
    <section className="category-showcase-section" style={{ padding: '40px 0 80px', backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <ScrollReveal duration={0.6}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '48px',
            }}
          >

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>{title}</h2>
              <Link
                href="/shop"
                className="editorial-arrow-link"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--color-sapphire)',
                  letterSpacing: '0.04em',
                }}
              >
                <span className="editorial-arrow-link-text">View Full Catalog</span>
                <ArrowUpRight size={15} className="editorial-arrow-icon editorial-arrow-diagonal" />
              </Link>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '540px' }}>
              {subtitle}
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          padding: isMobile ? '20px 0' : '60px 0',
          zIndex: 2,
        }}
      >
        {containerWidth === 0 ? (
          <CategorySkeletonTrack isMobile={isMobile} />
        ) : (
          <>
            <div
              onTransitionEnd={handleTransitionEnd}
              style={{
                display: 'flex',
                alignItems: 'center',
                transform: `translateX(${trackTranslateX}px)`,
                transition: enableTransition ? 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
                willChange: 'transform',
                width: 'max-content',
              }}>
              {carouselItems.map((cat, idx) => {
                const isActive = idx === activeIndex;
                const distance = Math.abs(idx - activeIndex);
                const isVisible = hasMoved || distance <= 2;

                return (
                  <div
                    key={`${cat.id}-${idx}`}
                    onClick={() => {
                      if (isActive) {
                        router.push(`/shop?categorySlug=${cat.slug}`);
                      } else {
                        setEnableTransition(true);
                        setActiveIndex(idx);
                        setHasMoved(true);
                      }
                    }}
                    className="category-slider-card"
                    style={{
                      position: 'relative',
                      flexShrink: 0,
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`,
                      marginRight: idx === carouselItems.length - 1 ? '0' : `${gap}px`,
                      transition: enableTransition ? 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
                      transform: isActive ? `scale(${activeScale})` : `scale(${inactiveScale})`,
                      zIndex: isActive ? 10 : 1,
                      opacity: !isVisible ? 0 : (isActive ? 1 : 0.5),
                      pointerEvents: !isVisible ? 'none' : 'auto',
                      borderRadius: isMobile ? '12px' : 'var(--radius-md)',
                      overflow: 'hidden',
                      boxShadow: isActive ? '0 24px 50px rgba(0,0,0,0.2)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: isMobile ? '16px' : '32px',
                      color: '#FFF8F5',
                      backgroundColor: 'var(--bg-surface)',
                    }}
                  >
                    {/* Per-card image loading skeleton shimmer */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0,
                        opacity: imagesLoaded[cat.id] ? 0 : 1,
                        transition: 'opacity 0.4s ease',
                        pointerEvents: 'none',
                      }}
                    >
                      <Skeleton
                        width="100%"
                        height="100%"
                        borderRadius={isMobile ? '12px' : 'var(--radius-md)'}
                      />
                    </div>

                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      quality={60}
                      sizes="400px"
                      style={{
                        objectFit: 'cover',
                        opacity: imagesLoaded[cat.id] ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                      }}
                      className="category-image"
                      priority={idx >= baseCount * 2 - 1 && idx <= baseCount * 2 + 3}
                      onLoad={() => {
                        setImagesLoaded((prev) => ({ ...prev, [cat.id]: true }));
                      }}
                    />

                    <div
                      className="category-scrim"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          'linear-gradient(180deg, rgba(20, 20, 20, 0.1) 0%, rgba(20, 20, 20, 0.85) 100%)',
                        zIndex: 1,
                        transition: enableTransition ? 'opacity 0.7s ease' : 'none',
                        opacity: isActive ? 0.8 : 0.95,
                      }}
                    />

                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: isMobile ? '1rem' : '1.6rem',
                            fontFamily: 'var(--font-display)',
                            color: '#FFF8F5',
                            transition: enableTransition ? 'transform 0.7s ease' : 'none',
                            transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                          }}
                        >
                          {cat.name}
                        </h3>

                        {isActive && (
                          <Link
                            href={`/shop?categorySlug=${cat.slug}`}
                            className={isMobile ? '' : 'category-arrow-btn'}
                            aria-label={`View ${cat.name} category`}
                            style={isMobile ? {
                              width: 24,
                              height: 24,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFF',
                              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                            } : {
                              width: 36,
                              height: 36,
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor: 'rgba(255, 255, 255, 0.25)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backdropFilter: 'blur(4px)',
                              color: '#fff',
                            }}
                          >
                            <ArrowUpRight size={isMobile ? 12 : 18} />
                          </Link>
                        )}
                      </div>

                      {cat.description && (
                        <p
                          style={{
                            fontSize: isMobile ? '10px' : '0.9rem',
                            color: 'var(--color-silver)',
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            transition: enableTransition ? 'opacity 0.7s ease, transform 0.7s ease' : 'none',
                            opacity: isActive ? (isMobile ? 0 : 1) : 0,
                            transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                            marginTop: isMobile ? 0 : '8px',
                            height: isMobile ? 0 : 'auto',
                          }}
                        >
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              position: 'absolute',
              top: '50%',
              left: isMobile ? '4px' : '5%',
              right: isMobile ? '4px' : '5%',
              transform: 'translateY(-50%)',
              display: 'flex',
              justifyContent: 'space-between',
              pointerEvents: 'none',
              zIndex: 20,
            }}>
              <button
                aria-label="Previous slide"
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                style={isMobile ? {
                  pointerEvents: 'auto',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                  background: 'transparent',
                  border: 'none',
                } : {
                  pointerEvents: 'auto',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'none',
                  border: 'none',
                  opacity: 0.9,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                className={isMobile ? '' : 'slider-nav-btn'}
              >
                <ChevronLeft size={isMobile ? 16 : 24} />
              </button>

              <button
                aria-label="Next slide"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                style={isMobile ? {
                  pointerEvents: 'auto',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                  background: 'transparent',
                  border: 'none',
                } : {
                  pointerEvents: 'auto',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'none',
                  border: 'none',
                  opacity: 0.9,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                className={isMobile ? '' : 'slider-nav-btn'}
              >
                <ChevronRight size={isMobile ? 16 : 24} />
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .category-arrow-btn {
          transition: transform 600ms var(--ease-luxury), background-color 600ms var(--ease-luxury), color 600ms var(--ease-luxury);
        }
        .category-arrow-btn:hover {
          transform: translate(2px, -2px) scale(1.08);
          background-color: var(--cta-primary) !important;
          color: var(--cta-text) !important;
        }
        
        .slider-nav-btn:not(:disabled):hover {
          transform: scale(1.1);
          color: var(--cta-primary) !important;
        }

        @media (max-width: 767px) {
          .hidden-on-mobile-skeleton {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
