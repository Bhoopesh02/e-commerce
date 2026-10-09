'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, Variants } from 'framer-motion';

export interface PromoBannerProps {
  imageSrc: string;
  eyebrow: string;
  headline: string;
  quote: string;
  imageSide?: 'left' | 'right';
}

// Cubic-bezier values from --ease-editorial in variables.css: cubic-bezier(0.16, 1, 0.3, 1)
const easeEditorial = [0.16, 1, 0.3, 1] as const;
const DURATION = 0.9;
const OPACITY_DURATION = DURATION * 0.4; // 0.36s (first 40% of motion)

const leftVariants: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      x: { duration: DURATION, ease: easeEditorial },
      opacity: { duration: OPACITY_DURATION, ease: 'linear' },
    },
  },
};

const rightVariants: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      x: { duration: DURATION, ease: easeEditorial },
      opacity: { duration: OPACITY_DURATION, ease: 'linear' },
    },
  },
};

export const PromoBanner: React.FC<PromoBannerProps> = ({
  imageSrc,
  eyebrow,
  headline,
  quote,
  imageSide = 'left',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine which half is first in layout:
  // - On desktop: Left half is Image if imageSide === 'left', else Text if imageSide === 'right'.
  // - On mobile: Top block is always Image, Bottom block is always Text.
  const isImageFirst = isMobile ? true : imageSide === 'left';

  const imageBlock = (
    <motion.div
      key="promo-image"
      variants={shouldReduceMotion ? undefined : isImageFirst ? leftVariants : rightVariants}
      style={{
        position: 'relative',
        minHeight: '400px',
        width: isMobile ? '100%' : '50%',
        willChange: shouldReduceMotion ? undefined : 'transform',
      }}
      className="promo-image-block"
    >
      <Image
        src={imageSrc}
        alt={headline}
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </motion.div>
  );

  const textBlock = (
    <motion.div
      key="promo-text"
      variants={shouldReduceMotion ? undefined : isImageFirst ? rightVariants : leftVariants}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 24px',
        backgroundColor: 'var(--bg-secondary)',
        textAlign: 'center',
        width: isMobile ? '100%' : '50%',
        willChange: shouldReduceMotion ? undefined : 'transform',
      }}
      className="promo-text-block"
    >
      <div style={{ maxWidth: '400px' }}>
        <p
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
          }}
        >
          {eyebrow}
        </p>
        <h3
          style={{
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            marginBottom: '24px',
          }}
        >
          {headline}
        </h3>
        <p
          style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            lineHeight: 1.6,
          }}
        >
          {quote}
        </p>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className={`promo-banner-wrapper ${imageSide}`}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        gridColumn: '1 / -1',
        minHeight: '400px',
      }}
    >
      {isImageFirst ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </motion.div>
  );
};
