'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const EditorialCampaign: React.FC = () => {
  return (
    <section
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
          padding: 100px 0;
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
          top: -100px;
          bottom: -100px;
          right: 0;
          width: calc(50vw - 32px);
          overflow: hidden;
          box-shadow: var(--shadow-editorial);
          border-radius: 0;
        }
        .editorial-tag {
          left: max(24px, calc((100vw - 1280px) / 2 + 24px)) !important;
        }
        @media (max-width: 1024px) {
          .editorial-section {
            padding: 0 0 60px 0;
          }
          .editorial-grid {
            gap: 40px;
          }
          .editorial-image {
            position: relative;
            top: 0;
            bottom: 0;
            right: auto;
            width: 100vw;
            margin-left: calc(-50vw + 50%);
            height: 460px;
          }
          .editorial-tag {
            left: 24px !important;
          }
          .editorial-reveal {
            min-height: auto;
          }
        }
        @media (max-width: 640px) {
          .editorial-section {
            display: none;
          }
          .editorial-image {
            height: 360px;
          }
        }
      `}</style>
      <div className="container">
        <div className="editorial-grid">
          {/* Visual Canvas */}
          <ScrollReveal duration={0.7} yOffset={20} className="editorial-reveal">
            <div className="editorial-image">
              <Image
                src="/images/campaign/editorial-florence.webp"
                alt="Editorial Campaign Aurelia"
                fill
                quality={60}
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'linear-gradient(180deg, var(--overlay-black-10) 0%, var(--overlay-scrim) 100%)',
                }}
              />
              {/* Tag Overlay */}
              <div
                className="editorial-tag"
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  padding: '12px 18px',
                  backgroundColor: 'rgba(20, 20, 20, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(224, 224, 224, 0.25)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--brand-accent)',
                  }}
                >
                  Look 04 · Florence Salon
                </span>
                <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--bg-subtle)', marginTop: '2px' }}>
                  Belted Cashmere Wrap Overcoat & Tuscan Boots
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Editorial Copy */}
          <ScrollReveal delay={0.15} duration={0.65} style={{ display: 'flex', alignItems: 'center' }}>
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
                Precision In Drapery,{' '}
                <span className="text-editorial typography-shimmer">
                  Unwavering
                </span>{' '}
                In Silhouette.
              </h2>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--border-color)',
                  lineHeight: 1.7,
                  marginBottom: '20px',
                }}
              >
                Every pattern is drafted by master tailors in Northern Italy, respecting the natural grain of
                virgin wool and weight of double-faced cashmere. We reject seasonal disposability in favor of
                timeless heirloom construction.
              </p>

              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(224, 224, 224, 0.7)',
                  lineHeight: 1.6,
                  marginBottom: '36px',
                }}
              >
                Hand-split seam construction eliminates all internal bulk, allowing coats to drape with the
                weightlessness of silk while providing exceptional thermal insulation.
              </p>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Link href="/shop?categorySlug=outerwear">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                    Explore Overcoats
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

