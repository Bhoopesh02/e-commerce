'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

interface MostCovetedSilhouettesProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  onExploreClick?: () => void;
}

const EASE_LUXURY = [0.22, 1, 0.36, 1] as const;

export const MostCovetedSilhouettes: React.FC<MostCovetedSilhouettesProps> = ({
  products,
  title = 'Most Coveted Silhouettes',
  subtitle = 'House Signatures',
  onExploreClick,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isLinkHovered, setIsLinkHovered] = useState(false);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Allow up to 16 items for base loop
  const originalItems = products.slice(0, 16);
  // Ensure we have enough items for smooth infinite scrolling on ultra-wide screens
  const replicationCount = Math.max(3, Math.ceil(40 / Math.max(1, originalItems.length)));
  const items = Array(replicationCount).fill(originalItems).flat();

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let animationId: number;
    let lastTime: number | null = null;
    const SPEED = 50; // px/s (slow speed)
    const PAUSE_DURATION = 1000; // 1 second

    let isCenterPaused = false;
    let pauseTimer = 0;
    let currentX = 0;
    let lastCenteredIndex = -1;

    const step = (time: number) => {
      if (lastTime === null) {
        lastTime = time;
      }
      const deltaTime = Math.min(time - lastTime, 50);
      lastTime = time;

      if (!isCarouselHovered && !shouldReduceMotion) {
        if (isCenterPaused) {
          pauseTimer += deltaTime;
          if (pauseTimer >= PAUSE_DURATION) {
            isCenterPaused = false;
            pauseTimer = 0;
          }
        } else {
          const moveAmount = SPEED * (deltaTime / 1000);
          
          const containerRect = container.getBoundingClientRect();
          const containerCenter = containerRect.left + containerRect.width / 2;
          const cards = Array.from(track.children) as HTMLElement[];
          
          let crossedIndex = -1;
          let snapDrift = 0;

          for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const nextCardCenter = cardCenter - moveAmount;
            
            if (cardCenter >= containerCenter - 0.1 && nextCardCenter < containerCenter - 0.1) {
              const logicalIndex = i % originalItems.length;
              if (lastCenteredIndex !== logicalIndex) {
                crossedIndex = i;
                snapDrift = cardCenter - containerCenter;
                break;
              }
            }
          }

          if (crossedIndex !== -1) {
            currentX -= snapDrift;
            isCenterPaused = true;
            lastCenteredIndex = crossedIndex % originalItems.length;
            pauseTimer = ((moveAmount - snapDrift) / SPEED) * 1000;
          } else {
            currentX -= moveAmount;
          }

          const firstCard = cards[0];
          if (firstCard) {
            // Use getBoundingClientRect for sub-pixel accuracy to prevent microscopic jumps
            const cardWidth = firstCard.getBoundingClientRect().width + 16; 
            const totalOriginalWidth = cardWidth * originalItems.length;
            
            // When we've scrolled exactly one original set's width left, seamlessly snap back
            if (currentX <= -totalOriginalWidth) {
               currentX += totalOriginalWidth;
            }
          }

          track.style.transform = `translateX(${currentX}px)`;
        }
      }

      animationId = requestAnimationFrame(step);
    };

    const timeoutId = setTimeout(() => {
      lastTime = null;
      animationId = requestAnimationFrame(step);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
    };
  }, [isCarouselHovered, originalItems.length, shouldReduceMotion, replicationCount]);

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

  // Card entrance variant: opacity 0, y 35 -> opacity 1, y 0 over 500ms with --ease-luxury
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 35,
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
        ref={containerRef}
        style={{ 
          width: '100%', 
          paddingBottom: '20px',
          overflow: 'hidden',
          touchAction: 'pan-y'
        }}
        onMouseEnter={() => setIsCarouselHovered(true)}
        onMouseLeave={() => setIsCarouselHovered(false)}
      >
        <motion.div
          initial="hidden"
          animate={isSectionInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '16px',
            width: 'max-content',
            willChange: 'transform',
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

