'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

interface CollectionNewArrivalsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  onExploreClick?: () => void;
}

const EASE_LUXURY = [0.22, 1, 0.36, 1] as const;

export const CollectionNewArrivals: React.FC<CollectionNewArrivalsProps> = ({
  products,
  title = 'Most Coveted Silhouettes',
  subtitle = 'House Signatures',
  onExploreClick,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isLinkHovered, setIsLinkHovered] = useState(false);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Allow up to 16 items for base loop
  const originalItems = products.slice(0, 16);
  // Ensure we have enough items for smooth infinite scrolling on ultra-wide screens
  const replicationCount = Math.max(3, Math.ceil(40 / Math.max(1, originalItems.length)));
  const items = Array(replicationCount).fill(originalItems).flat();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let lastTime = performance.now();
    const SPEED = 220; // px/s
    const PAUSE_DURATION = 1000; // 1 second

    let isPaused = false;
    let pauseTimer = 0;

    const getMetrics = () => {
      const firstCard = scrollContainer.children[0] as HTMLElement;
      if (!firstCard) return null;
      const cardWidth = firstCard.offsetWidth + 16; // card + gap
      // scrollLeft value where card 0 is centered in the viewport
      const centerBase =
        firstCard.offsetLeft + firstCard.offsetWidth / 2 - scrollContainer.clientWidth / 2;
      const totalOriginalWidth = cardWidth * originalItems.length;
      return { cardWidth, centerBase, totalOriginalWidth };
    };

    // Returns which center-snap index the scrollLeft is past
    const centerIndex = (scrollLeft: number, cardWidth: number, centerBase: number) =>
      Math.floor((scrollLeft - centerBase) / cardWidth);

    const step = (time: number) => {
      const deltaTime = Math.min(time - lastTime, 50);
      lastTime = time;

      if (!isCarouselHovered && !shouldReduceMotion) {
        const metrics = getMetrics();
        if (metrics && metrics.totalOriginalWidth > 0) {
          const { cardWidth, centerBase, totalOriginalWidth } = metrics;

          if (isPaused) {
            pauseTimer += deltaTime;
            if (pauseTimer >= PAUSE_DURATION) {
              isPaused = false;
              pauseTimer = 0;
            }
          } else {
            const prevScrollLeft = scrollContainer.scrollLeft;
            scrollContainer.scrollLeft += SPEED * (deltaTime / 1000);

            // Seamless loop — jump back when we've scrolled 2 full original lengths
            let afterLoop = scrollContainer.scrollLeft;
            if (afterLoop >= 2 * totalOriginalWidth) {
              afterLoop -= totalOriginalWidth;
              scrollContainer.scrollLeft = afterLoop;
            }

            // Detect crossing a card-center snap point (only when not wrapping)
            const idxBefore = centerIndex(prevScrollLeft, cardWidth, centerBase);
            const idxAfter = centerIndex(afterLoop, cardWidth, centerBase);
            if (idxAfter > idxBefore) {
              // Snap exactly to the center point so the card is perfectly aligned
              scrollContainer.scrollLeft = centerBase + idxAfter * cardWidth;
              isPaused = true;
              pauseTimer = 0;
            }
          }
        }
      }

      animationId = requestAnimationFrame(step);
    };

    const timeoutId = setTimeout(() => {
      lastTime = performance.now();
      animationId = requestAnimationFrame(step);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
    };
  }, [isCarouselHovered, originalItems.length, shouldReduceMotion]);

  // Trigger entrance when the section enters the viewport, strictly once per page load
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Staggered grid container entrance: ~90ms stagger per card, strictly once per page load
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.09,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  // Card entrance variant: opacity 0, scale 0.95 -> opacity 1, scale 1 over 600ms
  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.9,
      y: shouldReduceMotion ? 0 : 25,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

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
    <section ref={sectionRef} style={{ padding: '80px 0', backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isSectionInView ? 'visible' : 'hidden'}
          variants={headerVariants}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '40px',
            gap: '16px',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-sunset-600)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              {subtitle}
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>{title}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {onExploreClick ? (
              <button
                onClick={onExploreClick}
                className="editorial-arrow-link"
                onMouseEnter={() => setIsLinkHovered(true)}
                onMouseLeave={() => setIsLinkHovered(false)}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: 'inherit',
                  fontFamily: 'inherit',
                }}
              >
                <span className="editorial-arrow-link-text">Explore Complete Wardrobe</span>
                <motion.span
                  animate={shouldReduceMotion ? { x: 0 } : { x: isLinkHovered ? 4 : 0 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <ArrowRight size={15} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                </motion.span>
              </button>
            ) : (
              <Link
                href="/shop"
                className="editorial-arrow-link"
                onMouseEnter={() => setIsLinkHovered(true)}
                onMouseLeave={() => setIsLinkHovered(false)}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span className="editorial-arrow-link-text">Explore Complete Wardrobe</span>
                <motion.span
                  animate={shouldReduceMotion ? { x: 0 } : { x: isLinkHovered ? 4 : 0 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <ArrowRight size={15} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                </motion.span>
              </Link>
            )}

          </div>
        </motion.div>
      </div>

      {/* Auto Scroll Track */}
      <div 
        style={{ width: '100%', paddingBottom: '20px' }}
        onMouseEnter={() => setIsCarouselHovered(true)}
        onMouseLeave={() => setIsCarouselHovered(false)}
      >
        <motion.div
          initial="hidden"
          animate={isSectionInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: 'max(24px, calc((100vw - 1440px) / 2 + 24px))',
            paddingRight: 'max(24px, calc((100vw - 1440px) / 2 + 24px))',
          }}
        >
          {items.map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`}
              variants={cardVariants}
              style={{
                width: 'clamp(280px, 28vw, 420px)',
                flexShrink: 0,
              }}
            >
              <ProductCard product={product} variant="overlay" aspectRatio="3 / 4" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

