'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { TextLoop } from '@/components/ui/TextLoop';

export const HeroSection: React.FC = () => {
  const { storefront } = useStorefrontStore();

  const isEditorial = storefront === 'a';

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '88px',
        paddingBottom: '48px',
        backgroundColor: 'var(--color-sunset-900)',
      }}
    >
      {/* Background Image with Slow Scale Animation */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Image
          src={
            isEditorial
              ? '/images/hero/Gemini_Generated_Image_62wq5062wq5062wq.webp'
              : '/images/hero/hero-refined.webp'
          }
          alt="Aurelia Luxury Campaign"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="animate-hero-scale"
          style={{
            objectFit: 'cover',
            objectPosition: 'center 20%',
          }}
        />

        {/* Editorial Dramatic Gradients */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isEditorial
              ? 'linear-gradient(180deg, rgba(29, 26, 57, 0.4) 0%, rgba(69, 25, 82, 0.6) 50%, rgba(29, 26, 57, 0.9) 100%)'
              : 'linear-gradient(180deg, rgba(29, 26, 57, 0.35) 0%, rgba(29, 26, 57, 0.75) 100%)',
          }}
        />
      </div>

      {/* Hero Content Container */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          color: '#FFF8F5',
          textAlign: isEditorial ? 'left' : 'center',
          maxWidth: isEditorial ? '1200px' : '900px',
        }}
      >
        {isEditorial ? (
          /* Editorial Experience Layout */
          <div style={{ maxWidth: '720px' }}>


            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                marginBottom: '20px',
                color: '#FFF8F5',
              }}
            >
              Nocturnal <span className="text-editorial typography-shimmer">Silhouettes</span> & Sculptural Wool.
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                color: 'var(--color-sunset-200)',
                lineHeight: 1.6,
                maxWidth: '560px',
                marginBottom: '36px',
              }}
            >
              An editorial study in hand-finished Italian nappa leather, double-faced cashmere, and bias-cut mulberry silk gowns.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Link href="/shop?categorySlug=outerwear">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                  Discover Collection
                </Button>
              </Link>
              <Link href="/shop?tag=new-arrival">
                <Button variant="white" size="lg">
                  View Runway Arrivals
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Refined Shopping Mode Layout */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '0 auto',
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-sunset-400)',
                marginBottom: '16px',
              }}
            >
              Aurelia Wardrobe Foundations
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
                lineHeight: 1.1,
                fontWeight: 500,
                marginBottom: '20px',
                color: '#FFF8F5',
              }}
            >
              The Permanent Collection
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--color-sunset-200)',
                lineHeight: 1.6,
                maxWidth: '620px',
                marginBottom: '32px',
              }}
            >
              Essential Italian tailoring, pure Mongolian cashmere, and artisan leather accessories engineered for effortless longevity.
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Link href="/shop">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                  Shop Full Catalog
                </Button>
              </Link>
              <Link href="/shop?categorySlug=tailoring">
                <Button variant="white" size="lg">
                  Explore Tailoring
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Edge Attached Infinite Text Loop Ribbon */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 10,
          borderTop: '1px solid rgba(243, 159, 90, 0.18)',
        }}
      >
        <TextLoop
          text="AUTUMN / WINTER 2026 EDITION • PURE VIRGIN CASHMERE • HAND-FINISHED IN BIELLA & COMO • NUMBERED ATELIER RUNS • ARCHIVAL SILHOUETTES"
          shape="line"
          speed={42}
          direction="forward"
          separator="✦"
          fontSize={12.5}
          fontWeight={500}
          letterSpacing={2.5}
          uppercase={true}
          color="var(--color-sunset-400, #F39F5A)"
          ribbon={true}
          ribbonColor="var(--color-sunset-900, #1D1A39)"
          ribbonWidth={40}
          pauseOnHover={false}
        />
      </div>
    </section>
  );
};
