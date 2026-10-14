'use client';

import React, { useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
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
}

/**
 * Precomputes high-frequency decaying jitter keyframes
 * offset = sin(t * freq) * amplitude * (1 - p)^1.4
 */
const generateShakeKeyframes = (
  durationMs = 850,
  steps = 26,
  maxAmpX = 5,
  maxAmpY = 4,
  maxRot = 2.5,
  phaseOffset = 0,
  rotDir = -1
) => {
  const x: number[] = [];
  const y: number[] = [];
  const rot: number[] = [];
  const times: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const p = i / steps; // progress 0 -> 1
    const decay = Math.pow(1 - p, 1.4); // decaying envelope
    const t = p * (durationMs / 1000);

    const xVal = p === 1 ? 0 : Math.sin(t * 26 * 2 * Math.PI + phaseOffset) * maxAmpX * decay;
    const yVal = p === 1 ? 0 : Math.cos(t * 22 * 2 * Math.PI + phaseOffset * 1.3) * maxAmpY * decay;
    const rotVal = p === 1 ? 0 : rotDir * Math.sin(t * 28 * 2 * Math.PI + phaseOffset * 0.7) * maxRot * decay;

    x.push(Number(xVal.toFixed(2)));
    y.push(Number(yVal.toFixed(2)));
    rot.push(Number(rotVal.toFixed(2)));
    times.push(Number(p.toFixed(3)));
  }

  return { x, y, rot, times };
};

/**
 * Splits paragraph copy into structured, balanced lines for masked line reveals.
 */
const splitIntoLines = (text: string): string[] => {
  if (text.includes('\n')) return text.split('\n').filter(Boolean);
  if (text.includes('|')) return text.split('|').map((s) => s.trim()).filter(Boolean);

  const words = text.split(' ');
  if (words.length <= 7) return [text];
  const count = Math.ceil(words.length / 3);
  const l1 = words.slice(0, count).join(' ');
  const l2 = words.slice(count, count * 2).join(' ');
  const l3 = words.slice(count * 2).join(' ');
  return [l1, l2, l3].filter(Boolean);
};

interface SplitParagraphProps {
  text: string;
  className?: string;
  startDelay: number;
  staggerDelay?: number;
  isInView: boolean;
  shouldReduceMotion: boolean;
}

const SplitParagraph: React.FC<SplitParagraphProps> = ({
  text,
  className,
  startDelay,
  staggerDelay = 0.11,
  isInView,
  shouldReduceMotion,
}) => {
  const lines = useMemo(() => splitIntoLines(text), [text]);

  return (
    <p className={className} aria-label={text}>
      {lines.map((line, idx) => (
        <span
          key={idx}
          className="editorial-line-mask"
          style={{
            display: 'block',
            overflow: 'hidden',
            paddingBottom: '0.12em',
            marginBottom: '-0.12em',
          }}
        >
          <motion.span
            style={{
              display: 'block',
              transformOrigin: 'left bottom',
              willChange: 'transform, opacity',
            }}
            initial={shouldReduceMotion ? { opacity: 0 } : { y: '110%', rotate: 2, opacity: 0 }}
            animate={
              isInView
                ? { y: '0%', rotate: 0, opacity: 1 }
                : shouldReduceMotion
                ? { opacity: 0 }
                : { y: '110%', rotate: 2, opacity: 0 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.4 }
                : {
                    duration: 0.7,
                    delay: startDelay + idx * staggerDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
          >
            {line}
          </motion.span>
        </span>
      ))}
    </p>
  );
};

export const EditorialCampaign: React.FC<EditorialCampaignProps> = ({
  watermarkText = 'SILHOUETTE',
  leftText = 'Performance-driven tailoring—|drafted by master artisans in Northern Italy,|engineered for effortless drape and winter endurance.',
  rightText = 'Stay warm, stay refined.|Double-faced cashmere and virgin wool blend|thermal insulation with fluid flexibility in cold.',
  ctaText = 'Explore Overcoats',
  ctaLink = '/shop?categorySlug=outerwear',
  leftImage = '/images/banners/editorial/editorial-left.webp',
  centerImage = '/images/banners/editorial/editorial-center.webp',
  rightImage = '/images/banners/editorial/editorial-cuff-detail.webp',
  leftAlt = 'Cropped Suede Harrington Bomber Jacket',
  centerAlt = 'Belted Cashmere Wrap Overcoat Florence Salon',
  rightAlt = 'Italian leather cuff and gloved tailoring detail',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

  // Slower decaying shake profiles for Left and Right dots (850ms duration)
  const leftShake = useMemo(
    () => generateShakeKeyframes(850, 26, 5, 4, 2.5, 0, -1),
    []
  );
  const rightShake = useMemo(
    () => generateShakeKeyframes(850, 26, 4.5, 3.8, 2.2, 1.8, 1),
    []
  );

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
          will-change: transform, opacity;
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
          position: relative;
          background: #D9D7D2;
          box-shadow: 0 18px 45px -12px rgba(20, 20, 20, 0.14);
          overflow: hidden;
          will-change: transform, opacity, clip-path;
        }

        .editorial-copy-bottom-left {
          font-family: var(--font-body, system-ui, sans-serif);
          font-size: 0.88rem;
          line-height: 1.6;
          color: rgba(30, 30, 30, 0.72);
          max-width: 260px;
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
          position: relative;
          background: #D9D7D2;
          box-shadow: 0 26px 65px -15px rgba(20, 20, 20, 0.22);
          overflow: hidden;
          will-change: transform, opacity, clip-path;
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
          position: relative;
          background: #D9D7D2;
          box-shadow: 0 18px 45px -12px rgba(20, 20, 20, 0.14);
          overflow: hidden;
          will-change: transform, opacity, clip-path;
        }

        /* Hover Zoom on Cards once settled */
        .editorial-card-img-zoom {
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .editorial-card-left:hover .editorial-card-img-zoom,
        .editorial-card-right:hover .editorial-card-img-zoom,
        .editorial-card-center:hover .editorial-card-img-zoom {
          transform: scale(1.04);
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
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .editorial-col-left,
          .editorial-col-center,
          .editorial-col-right {
            align-items: center;
            margin-top: 0;
          }
          .editorial-copy-top-right {
            align-self: center;
            text-align: center;
          }
          .editorial-copy-bottom-left {
            text-align: center;
          }
        }
      `}</style>

      {/* 0.0s: Background Outline Letters fade in & slow horizontal drift (2.15s duration) */}
      <div className="editorial-watermark-container" aria-hidden="true">
        <motion.span
          className="editorial-watermark-text"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -35 }}
          animate={
            isInView
              ? { opacity: 0.85, x: 0 }
              : shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, x: -35 }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0.5 }
              : { duration: 2.15, delay: 0.0, ease: [0.16, 1, 0.3, 1] }
          }
        >
          {watermarkText}
        </motion.span>
      </div>

      {/* Desktop 3-Card Master Layout */}
      <div className="editorial-layout-grid">
        {/* Left Column: Grow from dot with jitter shake -> lands at 1.4s -> text at 1.85s */}
        <div className="editorial-col-left">
          {/* Outer Jitter Shake Wrapper (0.55s to 1.4s, duration 0.85s) */}
          <motion.div
            style={{ width: '100%', maxWidth: '320px', willChange: 'transform' }}
            initial={shouldReduceMotion ? { opacity: 0 } : { x: 0, y: 0, rotate: 0 }}
            animate={
              isInView && !shouldReduceMotion
                ? {
                    x: leftShake.x,
                    y: leftShake.y,
                    rotate: leftShake.rot,
                  }
                : { x: 0, y: 0, rotate: 0 }
            }
            transition={{
              delay: 0.55,
              duration: 0.85,
              times: leftShake.times,
              ease: 'linear',
            }}
          >
            {/* Inner Growth & Shape Morph Wrapper */}
            <motion.div
              className="editorial-card-left"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      scale: 0.1,
                      clipPath: 'circle(0% at 50% 50%)',
                    }
              }
              animate={
                isInView
                  ? shouldReduceMotion
                    ? { opacity: 1 }
                    : {
                        opacity: [0, 1, 1, 1],
                        scale: [0.1, 0.6, 1.04, 1.0],
                        clipPath: [
                          'circle(0% at 50% 50%)',
                          'circle(45% at 50% 50%)',
                          'circle(75% at 50% 50%)',
                          'inset(0% 0% 0% 0% round 26px)',
                        ],
                      }
                  : { opacity: 0 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.5 }
                  : {
                      delay: 0.55,
                      duration: 0.85,
                      times: [0, 0.45, 0.85, 1],
                      ease: [0.16, 1, 0.3, 1],
                    }
              }
            >
              <div
                className="editorial-card-img-zoom"
                style={{ position: 'relative', width: '100%', height: '100%' }}
              >
                <Image
                  src={leftImage}
                  alt={leftAlt}
                  fill
                  quality={92}
                  sizes="(max-width: 1080px) 280px, 320px"
                  style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* 1.60s: Left Paragraph line-by-line staggered reveal */}
          <SplitParagraph
            text={leftText}
            className="editorial-copy-bottom-left"
            startDelay={1.60}
            staggerDelay={0.09}
            isInView={isInView}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>

        {/* Center Column: 0.25s Rising from below with slow inner zoom (1.35s duration) */}
        <div className="editorial-col-center">
          <motion.div
            className="editorial-card-center"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: 120,
                    scale: 0.95,
                    clipPath: 'inset(100% 0% 0% 0% round 32px)',
                  }
            }
            animate={
              isInView
                ? shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      clipPath: 'inset(0% 0% 0% 0% round 32px)',
                    }
                : shouldReduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: 120,
                    scale: 0.95,
                    clipPath: 'inset(100% 0% 0% 0% round 32px)',
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.5 }
                : {
                    duration: 1.35,
                    delay: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
          >
            {/* Inner Image with 2.15s slow zoom settle */}
            <motion.div
              className="editorial-card-img-zoom"
              style={{ position: 'relative', width: '100%', height: '100%' }}
              initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.2 }}
              animate={isInView ? { scale: 1 } : shouldReduceMotion ? { scale: 1 } : { scale: 1.2 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.5 }
                  : {
                      duration: 2.15,
                      delay: 0.25,
                      ease: [0.16, 1, 0.3, 1],
                    }
              }
            >
              <Image
                src={centerImage}
                alt={centerAlt}
                fill
                priority
                quality={95}
                sizes="(max-width: 1080px) 380px, 440px"
                style={{ objectFit: 'cover', objectPosition: 'center 18%' }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column: 2.10s Top text -> 0.75s Dot grows with positive shake -> lands at 1.6s */}
        <div className="editorial-col-right">
          {/* 1.85s: Right Paragraph line-by-line staggered reveal */}
          <SplitParagraph
            text={rightText}
            className="editorial-copy-top-right"
            startDelay={1.85}
            staggerDelay={0.09}
            isInView={isInView}
            shouldReduceMotion={shouldReduceMotion}
          />

          {/* Outer Jitter Shake Wrapper (0.75s to 1.6s, duration 0.85s) */}
          <motion.div
            style={{ width: '100%', maxWidth: '320px', willChange: 'transform' }}
            initial={shouldReduceMotion ? { opacity: 0 } : { x: 0, y: 0, rotate: 0 }}
            animate={
              isInView && !shouldReduceMotion
                ? {
                    x: rightShake.x,
                    y: rightShake.y,
                    rotate: rightShake.rot,
                  }
                : { x: 0, y: 0, rotate: 0 }
            }
            transition={{
              delay: 0.75,
              duration: 0.85,
              times: rightShake.times,
              ease: 'linear',
            }}
          >
            {/* Inner Growth & Shape Morph Wrapper */}
            <motion.div
              className="editorial-card-right"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      scale: 0.1,
                      clipPath: 'circle(0% at 50% 50%)',
                    }
              }
              animate={
                isInView
                  ? shouldReduceMotion
                    ? { opacity: 1 }
                    : {
                        opacity: [0, 1, 1, 1],
                        scale: [0.1, 0.6, 1.04, 1.0],
                        clipPath: [
                          'circle(0% at 50% 50%)',
                          'circle(45% at 50% 50%)',
                          'circle(75% at 50% 50%)',
                          'inset(0% 0% 0% 0% round 26px)',
                        ],
                      }
                  : { opacity: 0 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.5 }
                  : {
                      delay: 0.75,
                      duration: 0.85,
                      times: [0, 0.45, 0.85, 1],
                      ease: [0.16, 1, 0.3, 1],
                    }
              }
            >
              <div
                className="editorial-card-img-zoom"
                style={{ position: 'relative', width: '100%', height: '100%' }}
              >
                <Image
                  src={rightImage}
                  alt={rightAlt}
                  fill
                  quality={92}
                  sizes="(max-width: 1080px) 280px, 320px"
                  style={{ objectFit: 'cover', objectPosition: 'center center' }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 2.25s: Centered Primary CTA Button */}
      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '56px',
          position: 'relative',
          zIndex: 3,
        }}
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={
          isInView
            ? { opacity: 1, y: 0 }
            : shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 20 }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0.4 }
            : { duration: 0.6, delay: 2.25, ease: [0.16, 1, 0.3, 1] }
        }
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



