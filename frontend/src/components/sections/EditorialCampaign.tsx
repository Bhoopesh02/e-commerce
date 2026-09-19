'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const EditorialCampaign: React.FC = () => {
  return (
    <section
      style={{
        padding: '100px 0',
        backgroundColor: 'var(--color-sunset-900)',
        color: '#FFF8F5',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Visual Canvas */}
          <ScrollReveal duration={0.7} yOffset={20}>
            <div
              style={{
                position: 'relative',
                height: '580px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-editorial)',
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
                alt="Editorial Campaign Aurelia"
                fill
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
                    'linear-gradient(180deg, rgba(29, 26, 57, 0.1) 0%, rgba(29, 26, 57, 0.6) 100%)',
                }}
              />
              {/* Tag Overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  padding: '12px 18px',
                  backgroundColor: 'rgba(29, 26, 57, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(232, 188, 185, 0.25)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--color-sunset-400)',
                  }}
                >
                  Look 04 · Florence Salon
                </span>
                <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFF8F5', marginTop: '2px' }}>
                  Belted Cashmere Wrap Overcoat & Tuscan Boots
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Editorial Copy */}
          <ScrollReveal delay={0.15} duration={0.65}>
            <div style={{ maxWidth: '520px' }}>

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                  lineHeight: 1.1,
                  marginBottom: '24px',
                  color: '#FFF8F5',
                }}
              >
                Precision In Drapery,{' '}
                <span className="text-editorial" style={{ color: 'var(--color-sunset-400)' }}>
                  Unwavering
                </span>{' '}
                In Silhouette.
              </h2>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--color-sunset-200)',
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
                  color: 'rgba(232, 188, 185, 0.7)',
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
