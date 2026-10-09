'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

/**
 * Linear interpolation helper clamped to [outMin, outMax]
 */
const lerp = (p: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  if (p <= inMin) return outMin;
  if (p >= inMax) return outMax;
  return outMin + ((p - inMin) / (inMax - inMin)) * (outMax - outMin);
};

export const EditorialCampaign: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll-linked progress from "start 90%" (entering view) to "start 30%" (settled in view)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 90%', 'start 30%'],
  });

  // Fluid physics spring that tracks scroll progress and reverses smoothly on scroll up
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  // 1. Image: scale 1.25 -> 1 (desktop) or 1.12 -> 1 (mobile), x -40px -> 0 (desktop) or 0 (mobile) over [0, 0.6]
  const imageScale = useTransform(smoothProgress, (p) =>
    lerp(p, 0, 0.6, isMobile ? 1.12 : 1.25, 1)
  );
  const imageX = useTransform(smoothProgress, (p) =>
    lerp(p, 0, 0.6, isMobile ? 0 : -40, 0)
  );

  // 2. Headline: split into 3 lines rising from behind masks (y: 110% -> 0%)
  const line1Y = useTransform(smoothProgress, (p) => `${lerp(p, 0.15, 0.45, 110, 0)}%`);
  const line2Y = useTransform(smoothProgress, (p) => `${lerp(p, 0.25, 0.55, 110, 0)}%`);
  const line3Y = useTransform(smoothProgress, (p) => `${lerp(p, 0.35, 0.65, 110, 0)}%`);

  // 3. Paragraphs: opacity 0 -> 1 and y: 24px -> 0 (desktop) or 16px -> 0 (mobile)
  const p1Opacity = useTransform(smoothProgress, (p) => lerp(p, 0.45, 0.65, 0, 1));
  const p1Y = useTransform(smoothProgress, (p) => lerp(p, 0.45, 0.65, isMobile ? 16 : 24, 0));

  const p2Opacity = useTransform(smoothProgress, (p) => lerp(p, 0.55, 0.75, 0, 1));
  const p2Y = useTransform(smoothProgress, (p) => lerp(p, 0.55, 0.75, isMobile ? 16 : 24, 0));

  // 4. "Explore Overcoats" button: opacity 0 -> 1 and y: 24px -> 0 (desktop) or 16px -> 0 (mobile) over [0.7, 0.9]
  const btnOpacity = useTransform(smoothProgress, (p) => lerp(p, 0.7, 0.9, 0, 1));
  const btnY = useTransform(smoothProgress, (p) => lerp(p, 0.7, 0.9, isMobile ? 16 : 24, 0));

  // 5. "Look 04" caption card: opacity 0 -> 1 and y: 16px -> 0 over [0.75, 0.95]
  const captionOpacity = useTransform(smoothProgress, (p) => lerp(p, 0.75, 0.95, 0, 1));
  const captionY = useTransform(smoothProgress, (p) => lerp(p, 0.75, 0.95, 16, 0));

  return (
    <section
      ref={sectionRef}
      className="editorial-section"
      style={{
        backgroundColor: 'var(--color-black-tie)',
        color: 'var(--bg-subtle)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .editorial-section {
          padding: 40px 0;
        }
        .editorial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 64px;
          align-items: stretch;
        }
        .editorial-reveal {
          position: relative;
          height: 100%;
          min-height: 580px;
        }
        .editorial-image {
          position: absolute;
          top: -40px;
          bottom: -40px;
          right: 0;
          width: calc(50vw - 32px);
          overflow: hidden;
          box-shadow: var(--shadow-editorial);
          border-radius: 0;
        }
        .editorial-tag {
          left: max(24px, calc((100vw - 1280px) / 2 + 24px)) !important;
        }
        .headline-mask-wrapper {
          display: block;
          overflow: hidden;
          padding-bottom: 0.12em;
          margin-bottom: -0.12em;
        }
        @media (max-width: 1024px) {
          .editorial-section {
            padding: 0 0 60px 0;
          }
          .editorial-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .editorial-image {
            position: relative;
            top: 0;
            bottom: 0;
            right: auto;
            width: 100%;
            height: 440px;
          }
          .editorial-tag {
            left: 24px !important;
          }
          .editorial-reveal {
            min-height: auto;
          }
        }
        @media (max-width: 768px) {
          .editorial-section {
            padding: 0 0 48px 0;
          }
          .editorial-grid {
            gap: 32px;
          }
          .editorial-image {
            height: 380px;
            width: 100%;
            margin-left: 0;
          }
          .editorial-tag {
            left: 16px !important;
            right: 16px;
            bottom: 16px;
            max-width: calc(100% - 32px);
          }
        }
        @media (max-width: 480px) {
          .editorial-image {
            height: 340px;
          }
        }
      `}</style>
      <div className="container">
        <div className="editorial-grid">
          {/* Visual Canvas */}
          <div className="editorial-reveal">
            <div className="editorial-image">
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  scale: shouldReduceMotion ? 1 : imageScale,
                  x: shouldReduceMotion ? 0 : imageX,
                  transformOrigin: 'center center',
                  willChange: 'transform',
                }}
              >
                <Image
                  src="/images/categories/cat-outerwear.jpg"
                  alt="Editorial Campaign Aurelia"
                  fill
                  quality={60}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </motion.div>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'linear-gradient(180deg, var(--overlay-black-10) 0%, var(--overlay-scrim) 100%)',
                  pointerEvents: 'none',
                }}
              />
              {/* Tag Overlay ("Look 04" caption card) */}
              <motion.div
                className="editorial-tag"
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  padding: '12px 18px',
                  backgroundColor: 'rgba(20, 20, 20, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(224, 224, 224, 0.25)',
                  opacity: shouldReduceMotion ? 1 : captionOpacity,
                  y: shouldReduceMotion ? 0 : captionY,
                  zIndex: 2,
                  willChange: 'transform, opacity',
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--brand-accent)',
                    display: 'block',
                  }}
                >
                  Look 04 · Florence Salon
                </span>
                <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--bg-subtle)', marginTop: '2px' }}>
                  Belted Cashmere Wrap Overcoat & Tuscan Boots
                </p>
              </motion.div>
            </div>
          </div>

          {/* Editorial Copy */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ maxWidth: '520px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                  lineHeight: 1.1,
                  marginBottom: '24px',
                  color: 'var(--bg-subtle)',
                }}
              >
                <span className="headline-mask-wrapper">
                  <motion.span
                    style={{
                      display: 'block',
                      y: shouldReduceMotion ? '0%' : line1Y,
                      willChange: 'transform',
                    }}
                  >
                    Precision In Drapery,
                  </motion.span>
                </span>
                <span className="headline-mask-wrapper">
                  <motion.span
                    style={{
                      display: 'block',
                      y: shouldReduceMotion ? '0%' : line2Y,
                      willChange: 'transform',
                    }}
                  >
                    <span className="text-editorial typography-shimmer">
                      Unwavering
                    </span>
                  </motion.span>
                </span>
                <span className="headline-mask-wrapper">
                  <motion.span
                    style={{
                      display: 'block',
                      y: shouldReduceMotion ? '0%' : line3Y,
                      willChange: 'transform',
                    }}
                  >
                    In Silhouette.
                  </motion.span>
                </span>
              </h2>

              <motion.p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--border-color)',
                  lineHeight: 1.7,
                  marginBottom: '20px',
                  opacity: shouldReduceMotion ? 1 : p1Opacity,
                  y: shouldReduceMotion ? 0 : p1Y,
                  willChange: 'transform, opacity',
                }}
              >
                Every pattern is drafted by master tailors in Northern Italy, respecting the natural grain of
                virgin wool and weight of double-faced cashmere. We reject seasonal disposability in favor of
                timeless heirloom construction.
              </motion.p>

              <motion.p
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(224, 224, 224, 0.7)',
                  lineHeight: 1.6,
                  marginBottom: '36px',
                  opacity: shouldReduceMotion ? 1 : p2Opacity,
                  y: shouldReduceMotion ? 0 : p2Y,
                  willChange: 'transform, opacity',
                }}
              >
                Hand-split seam construction eliminates all internal bulk, allowing coats to drape with the
                weightlessness of silk while providing exceptional thermal insulation.
              </motion.p>

              <motion.div
                style={{
                  display: 'flex',
                  gap: '16px',
                  opacity: shouldReduceMotion ? 1 : btnOpacity,
                  y: shouldReduceMotion ? 0 : btnY,
                  willChange: 'transform, opacity',
                }}
              >
                <Link href="/shop?categorySlug=outerwear">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                    Explore Overcoats
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
