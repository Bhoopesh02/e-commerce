'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

interface MostCovetedSilhouettesProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

const EASE_LUXURY = [0.22, 1, 0.36, 1] as const;

export const MostCovetedSilhouettes: React.FC<MostCovetedSilhouettesProps> = ({
  products,
  title = 'Most Coveted Silhouettes',
  subtitle = 'House Signatures',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

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

  // Use up to 8 items to ensure the track is wide enough to cover desktop screens
  const items = products.slice(0, 8);
  const itemCount = items.length || 1;
  // Duplicate 3x for a perfectly seamless infinite scroll loop (left buffer, visible set, right buffer)
  const carouselItems = [...items, ...items, ...items];

  // Calculate dynamic step scroll keyframes
  const pauseTime = 1.5; // seconds
  const moveTime = 0.8; // seconds
  const totalTimePerItem = pauseTime + moveTime;
  const totalDuration = totalTimePerItem * itemCount;

  const pausePercent = (pauseTime / totalDuration) * 100;
  const movePercent = (moveTime / totalDuration) * 100;

  const baseTranslate = -33.333333;
  const stepTranslate = -33.333333 / itemCount;

  let keyframes = '';
  for (let i = 0; i < itemCount; i++) {
    const startPause = i * (pausePercent + movePercent);
    const endPause = startPause + pausePercent;
    const translate = baseTranslate + (i * stepTranslate);
    keyframes += `
      ${startPause.toFixed(3)}%, ${endPause.toFixed(3)}% { transform: translate3d(${translate.toFixed(6)}%, 0, 0); }
    `;
  }
  keyframes += `
    100% { transform: translate3d(-66.666666%, 0, 0); }
  `;

  return (
    <section ref={sectionRef} style={{ padding: '80px 0', backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes stepScrollDynamic {
          ${keyframes}
        }
        .animate-step-scroll {
          display: flex;
          width: max-content;
          animation: stepScrollDynamic ${totalDuration}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }
        .animate-step-scroll:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-step-scroll {
            animation-play-state: paused !important;
          }
        }
      `}} />
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
        </motion.div>
      </div>

      {/* Infinite Scroll Track */}
      <div style={{ overflow: 'hidden', width: '100%', paddingBottom: '20px' }}>
        <div style={{ paddingLeft: 'calc(50vw - (clamp(280px, 28vw, 420px) / 2))' }}>
            <motion.div
              initial="hidden"
              animate={isSectionInView ? 'visible' : 'hidden'}
              variants={containerVariants}
              className="animate-step-scroll"
              style={{
                display: 'flex',
                gap: '16px',
                width: 'max-content',
                paddingRight: '16px', // matches gap, making total width exactly 3x the first set
              }}
            >
            {carouselItems.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                variants={cardVariants}
                style={{ 
                  width: 'clamp(280px, 28vw, 420px)',
                  flexShrink: 0 
                }}
              >
                <ProductCard product={product} variant="overlay" aspectRatio="3 / 4" />
              </motion.div>
            ))}
            </motion.div>
          </div>
        </div>
    </section>
  );
};

