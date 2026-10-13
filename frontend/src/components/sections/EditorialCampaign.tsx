'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export interface EditorialCampaignProps {
  watermarkText?: string;
  leftText?: string;
  rightText?: string;
  ctaText?: string;
  ctaLink?: string;
  leftImage?: string;
  centerImage?: string;
  rightImage?: string;
  leftAlt?: string;
  centerAlt?: string;
  rightAlt?: string;
  lookTitle?: string;
  lookSubtitle?: string;
}

export const EditorialCampaign: React.FC<EditorialCampaignProps> = ({
  watermarkText = 'SILHOUETTE',
  leftText = 'Performance-driven tailoring—drafted by master artisans in Northern Italy, engineered for effortless drape and winter endurance.',
  rightText = 'Stay warm, stay refined. Double-faced cashmere and virgin wool blend thermal insulation with fluid flexibility in the toughest conditions.',
  ctaText = 'Explore Overcoats',
  ctaLink = '/shop?categorySlug=outerwear',
  leftImage = '/images/banners/editorial/editorial-left.jpg',
  centerImage = '/images/banners/editorial/editorial-center.jpg',
  rightImage = '/images/banners/editorial/editorial-cuff-detail.jpg',
  leftAlt = 'Cropped Suede Harrington Bomber Jacket',
  centerAlt = 'Belted Cashmere Wrap Overcoat Florence Salon',
  rightAlt = 'Italian leather cuff and gloved tailoring detail',
  lookTitle = 'Look 04 · Florence Salon',
  lookSubtitle = 'Belted Cashmere Wrap Overcoat',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeMobileCard, setActiveMobileCard] = useState<number>(1); // 0: left, 1: center, 2: right

  // Subtle parallax effect on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const yCenter = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [25, -25]);
  const yLeft = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-15, 15]);
  const yRight = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [35, -15]);

  return (
    <section
      ref={sectionRef}
      className="editorial-banner-section"
      style={{
        position: 'relative',
        backgroundColor: '#EAE8E3',
        color: 'var(--color-black-tie, #141414)',
        padding: '90px 24px 100px',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .editorial-banner-section {
          background: radial-gradient(circle at 50% 30%, #F5F4F0 0%, #E9E7E1 100%);
        }

        /* Giant Watermark Background Typography */
        .editorial-watermark-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          max-width: 1500px;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        .editorial-watermark-text {
          font-family: var(--font-display, 'Playfair Display', Georgia, serif);
          font-size: clamp(6.5rem, 16vw, 15rem);
          font-weight: 300;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(20, 20, 20, 0.12);
          text-stroke: 1.5px rgba(20, 20, 20, 0.12);
          opacity: 0.85;
          white-space: nowrap;
          text-align: center;
        }

        /* 3-Column Desktop Grid Layout */
        .editorial-layout-grid {
          position: relative;
          z-index: 2;
          max-width: 1340px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.35fr 1fr;
          gap: 36px;
          align-items: center;
        }

        /* Card styling */
        .editorial-card-wrapper {
          position: relative;
          overflow: hidden;
          background: #D9D7D2;
          box-shadow: 0 18px 45px -12px rgba(20, 20, 20, 0.14);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .editorial-card-wrapper:hover {
          transform: translateY(-6px);
          box-shadow: 0 28px 60px -15px rgba(20, 20, 20, 0.22);
        }

        .editorial-card-img-zoom {
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .editorial-card-wrapper:hover .editorial-card-img-zoom {
          transform: scale(1.05);
        }

        /* Left Column */
        .editorial-col-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 28px;
        }

        .editorial-card-left {
          width: 100%;
          max-width: 320px;
          height: 380px;
          border-radius: 26px;
        }

        .editorial-copy-bottom-left {
          font-family: var(--font-body, system-ui, sans-serif);
          font-size: 0.88rem;
          line-height: 1.6;
          color: rgba(30, 30, 30, 0.72);
          max-width: 250px;
          margin-top: 4px;
        }

        /* Center Column (Dominant Hero Card) */
        .editorial-col-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .editorial-card-center {
          width: 100%;
          max-width: 440px;
          height: 540px;
          border-radius: 32px;
          box-shadow: 0 26px 65px -15px rgba(20, 20, 20, 0.22);
        }

        /* Right Column */
        .editorial-col-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 28px;
          margin-top: 48px; /* Staggered downwards */
        }

        .editorial-copy-top-right {
          font-family: var(--font-body, system-ui, sans-serif);
          font-size: 0.88rem;
          line-height: 1.6;
          color: rgba(30, 30, 30, 0.72);
          max-width: 270px;
          text-align: left;
          align-self: flex-start;
        }

        .editorial-card-right {
          width: 100%;
          max-width: 320px;
          height: 380px;
          border-radius: 26px;
        }

        /* Mobile specific carousel styles */
        .editorial-mobile-carousel {
          display: none;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1080px) {
          .editorial-layout-grid {
            gap: 24px;
          }
          .editorial-card-left,
          .editorial-card-right {
            height: 330px;
          }
          .editorial-card-center {
            height: 460px;
          }
          .editorial-copy-bottom-left,
          .editorial-copy-top-right {
            font-size: 0.82rem;
          }
        }

        @media (max-width: 768px) {
          .editorial-banner-section {
            padding: 60px 16px 70px;
          }

          .editorial-layout-grid {
            display: none;
          }

          .editorial-mobile-carousel {
            display: block;
            position: relative;
            z-index: 2;
            width: 100%;
          }

          .editorial-mobile-cards-track {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 16px;
            padding: 10px 4px 20px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }

          .editorial-mobile-cards-track::-webkit-scrollbar {
            display: none;
          }

          .editorial-mobile-card-item {
            flex: 0 0 82%;
            scroll-snap-align: center;
          }

          .editorial-mobile-card-item .editorial-card-wrapper {
            height: 420px;
            border-radius: 24px;
          }

          .editorial-mobile-copy {
            margin-top: 20px;
            text-align: center;
            font-size: 0.88rem;
            color: rgba(30, 30, 30, 0.75);
            line-height: 1.5;
            padding: 0 16px;
          }

          .editorial-mobile-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 16px;
          }

          .editorial-mobile-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(20, 20, 20, 0.2);
            transition: all 0.3s ease;
          }

          .editorial-mobile-dot.active {
            width: 24px;
            border-radius: 4px;
            background: var(--color-black-tie, #141414);
          }
        }
      `}</style>

      {/* Decorative Ghost Background Typography */}
      <div className="editorial-watermark-container" aria-hidden="true">
        <span className="editorial-watermark-text">{watermarkText}</span>
      </div>

      {/* Desktop 3-Card Staggered Layout */}
      <div className="editorial-layout-grid">
        {/* Left Column: Card on top, Micro-copy below */}
        <motion.div
          className="editorial-col-left"
          style={{ y: yLeft }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="editorial-card-wrapper editorial-card-left">
            <div className="editorial-card-img-zoom" style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={leftImage}
                alt={leftAlt}
                fill
                quality={92}
                sizes="(max-width: 1080px) 280px, 320px"
                style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.3) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          <p className="editorial-copy-bottom-left">
            {leftText}
          </p>
        </motion.div>

        {/* Center Column: Dominant Hero Card */}
        <motion.div
          className="editorial-col-center"
          style={{ y: yCenter }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="editorial-card-wrapper editorial-card-center">
            <div className="editorial-card-img-zoom" style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={centerImage}
                alt={centerAlt}
                fill
                priority
                quality={95}
                sizes="(max-width: 1080px) 380px, 440px"
                style={{ objectFit: 'cover', objectPosition: 'center 18%' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Floating Look Tag / Caption Pill */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '22px',
                  left: '22px',
                  right: '22px',
                  padding: '14px 20px',
                  backgroundColor: 'rgba(20, 20, 20, 0.85)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--color-golden, #C29B4C)',
                      display: 'block',
                      fontWeight: 600,
                    }}
                  >
                    {lookTitle}
                  </span>
                  <p
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      color: '#F5F5F5',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {lookSubtitle}
                  </p>
                </div>

                <Link
                  href={ctaLink}
                  aria-label="View Overcoat Details"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    flexShrink: 0,
                    transition: 'background-color 0.2s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-golden, #C29B4C)';
                    e.currentTarget.style.color = '#141414';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Micro-copy on top, Card shifted downwards */}
        <motion.div
          className="editorial-col-right"
          style={{ y: yRight }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="editorial-copy-top-right">
            {rightText}
          </p>

          <div className="editorial-card-wrapper editorial-card-right">
            <div className="editorial-card-img-zoom" style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={rightImage}
                alt={rightAlt}
                fill
                quality={92}
                sizes="(max-width: 1080px) 280px, 320px"
                style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.3) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Swipeable View */}
      <div className="editorial-mobile-carousel">
        <div
          className="editorial-mobile-cards-track"
          onScroll={(e) => {
            const el = e.currentTarget;
            const index = Math.round(el.scrollLeft / (el.offsetWidth * 0.82));
            setActiveMobileCard(Math.min(2, Math.max(0, index)));
          }}
        >
          {/* Card 0 (Left Detail) */}
          <div className="editorial-mobile-card-item">
            <div className="editorial-card-wrapper">
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={leftImage}
                  alt={leftAlt}
                  fill
                  quality={90}
                  sizes="82vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* Card 1 (Center Hero) */}
          <div className="editorial-mobile-card-item">
            <div className="editorial-card-wrapper">
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={centerImage}
                  alt={centerAlt}
                  fill
                  quality={92}
                  sizes="82vw"
                  style={{ objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(20, 20, 20, 0.88)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    color: '#FFF',
                  }}
                >
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-golden, #C29B4C)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {lookTitle}
                  </span>
                  <p style={{ fontSize: '0.86rem', fontWeight: 600, color: '#FFF', marginTop: '2px' }}>
                    {lookSubtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 (Right Detail) */}
          <div className="editorial-mobile-card-item">
            <div className="editorial-card-wrapper">
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={rightImage}
                  alt={rightAlt}
                  fill
                  quality={90}
                  sizes="82vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="editorial-mobile-dots">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`editorial-mobile-dot ${activeMobileCard === idx ? 'active' : ''}`}
            />
          ))}
        </div>

        <p className="editorial-mobile-copy">
          {activeMobileCard === 0 ? leftText : activeMobileCard === 1 ? rightText : leftText}
        </p>
      </div>

      {/* Centered Primary CTA Button */}
      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '56px',
          position: 'relative',
          zIndex: 3,
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Link href={ctaLink}>
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight size={16} />}
            style={{
              padding: '16px 36px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-black-tie, #141414)',
              color: '#FFFFFF',
              boxShadow: '0 12px 30px -8px rgba(20, 20, 20, 0.35)',
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}
          >
            {ctaText}
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

