'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { storefront } = useStorefrontStore();

  const isEditorial = storefront === 'a';

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: 'var(--color-black-tie)',
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
              ? '/images/hero/homepage_banner_split.jpg'
              : '/images/hero/hero-refined.webp'
          }
          alt="Aurelia Luxury Campaign"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="animate-hero-scale hero-image"
          style={{
            objectFit: 'cover',
          }}
        />

        {/* Editorial Dramatic Gradients */}
        <div
          className={`hero-gradient ${isEditorial ? 'gradient-editorial' : 'gradient-refined'}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </div>

      {/* Hero Content Container */}
      <div
        className={`container hero-content-container ${isEditorial ? 'editorial-layout' : 'refined-layout'}`}
        style={{
          position: 'relative',
          zIndex: 2,
          color: 'var(--bg-subtle)',
          maxWidth: isEditorial ? '1200px' : '900px',
          width: '100%',
        }}
      >
        {isEditorial ? (
          /* Editorial Experience Layout */
          <div style={{ maxWidth: '600px' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--bg-subtle)',
                marginBottom: '16px',
                display: 'block',
              }}
            >
              EXCLUSIVE: AURELIA ATELIER
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 4vw, 4rem)',
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
                color: 'var(--bg-subtle)',
                textTransform: 'uppercase',
              }}
            >
              NOCTURNAL SILHOUETTES
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
                color: 'var(--bg-subtle)',
                lineHeight: 1.6,
                maxWidth: '560px',
                marginBottom: '36px',
              }}
            >
              The new collection arrives at Aurelia. Hand-finished Italian nappa leather, double-faced cashmere, and bias-cut mulberry silk.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Link href="/shop?categorySlug=outerwear">
                <Button variant="white" size="lg" style={{ minWidth: '180px', borderRadius: '0' }}>
                  Discover more
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Refined Shopping Mode Layout */
          <div className="refined-mode-inner">
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--brand-accent)',
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
                color: 'var(--bg-subtle)',
              }}
            >
              The Permanent Collection
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--border-color)',
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


      <style jsx global>{`
        .hero-section {
          height: 100dvh;
          min-height: unset;
          max-height: 100dvh;
          align-items: flex-end;
          justify-content: flex-start;
          padding-top: 88px;
          padding-bottom: 48px;
        }

        .hero-image {
          object-position: center 20% !important;
        }

        .gradient-editorial {
          background: linear-gradient(90deg, rgba(16, 33, 39, 0.7) 0%, rgba(16, 33, 39, 0) 50%);
        }

        .gradient-refined {
          background: linear-gradient(180deg, rgba(16, 33, 39, 0.35) 0%, rgba(16, 33, 39, 0.75) 100%);
        }

        .editorial-layout {
          text-align: left;
        }

        .refined-layout {
          text-align: center;
        }

        .refined-mode-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 100dvh;
            min-height: unset;
            align-items: center;
          }
          
          .hero-image {
            object-position: right center !important;
          }

          .gradient-editorial {
            background: linear-gradient(90deg, rgba(16, 33, 39, 0.9) 0%, rgba(16, 33, 39, 0.6) 80%, rgba(16, 33, 39, 0) 100%);
          }

          .hero-content-container.refined-layout {
            text-align: left;
          }

          .refined-mode-inner {
            align-items: flex-start;
            margin: 0;
          }
        }
      `}</style>
    </section>
  );
};
