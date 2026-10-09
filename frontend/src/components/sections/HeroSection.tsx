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
          src="/images/banners/Gemini_Generated_Image_piepdipiepdipiep.png"
          alt="Aurelia Luxury Campaign - The Winter Collection"
          fill
          priority
          quality={100}
          unoptimized
          sizes="100vw"
          className="animate-hero-scale hero-image"
          style={{
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Dark gradient overlay behind text on mobile for readability */}
      <div className="hero-mobile-overlay" aria-hidden="true" />

      {/* Hero Content Container */}
      <div
        className={`container hero-content-container ${isEditorial ? 'editorial-layout' : 'refined-layout'}`}
        style={{
          position: 'relative',
          zIndex: 3,
          color: 'var(--bg-subtle)',
          maxWidth: isEditorial ? '1200px' : '900px',
          width: '100%',
        }}
      >
        {isEditorial ? (
          /* Editorial Experience Layout */
          <div className="hero-text-block editorial-text-block" style={{ maxWidth: '600px', textShadow: '0 2px 10px rgba(0, 0, 0, 0.45)' }}>
            <span
              className="hero-eyebrow"
              style={{
                fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
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
              className="hero-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 7vw, 5rem)',
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
                color: 'var(--bg-subtle)',
                textTransform: 'uppercase',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              NOCTURNAL SILHOUETTES
            </h1>

            <p
              className="hero-description"
              style={{
                fontSize: 'clamp(0.875rem, 1.4vw, 1.05rem)',
                color: 'var(--bg-subtle)',
                lineHeight: 1.6,
                maxWidth: '38ch',
                marginBottom: '32px',
              }}
            >
              The new collection arrives at Aurelia. Hand-finished Italian nappa leather, double-faced cashmere, and bias-cut mulberry silk.
            </p>

            <div className="hero-cta-group">
              <Link href="/shop?categorySlug=outerwear" className="hero-cta-link">
                <Button variant="white" size="lg" className="hero-cta-button" style={{ borderRadius: '0' }}>
                  Discover more
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Refined Shopping Mode Layout */
          <div className="hero-text-block refined-mode-inner">
            <span
              className="hero-eyebrow"
              style={{
                fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
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
              className="hero-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 7vw, 5rem)',
                lineHeight: 1.1,
                fontWeight: 500,
                marginBottom: '20px',
                color: 'var(--bg-subtle)',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              The Permanent Collection
            </h1>

            <p
              className="hero-description"
              style={{
                fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
                color: 'var(--border-color)',
                lineHeight: 1.6,
                maxWidth: '38ch',
                marginBottom: '32px',
              }}
            >
              Essential Italian tailoring, pure Mongolian cashmere, and artisan leather accessories engineered for effortless longevity.
            </p>

            <div className="hero-cta-group">
              <Link href="/shop" className="hero-cta-link">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />} className="hero-cta-button">
                  Shop Full Catalog
                </Button>
              </Link>
              <Link href="/shop?categorySlug=tailoring" className="hero-cta-link">
                <Button variant="white" size="lg" className="hero-cta-button">
                  Explore Tailoring
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .hero-section {
          width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          box-sizing: border-box;
          align-items: center;
          justify-content: flex-start;
          padding-top: max(88px, env(safe-area-inset-top, 0px));
          padding-bottom: var(--space-8);
        }

        .hero-content-container {
          padding-left: clamp(1rem, 4vw, 3rem) !important;
          padding-right: clamp(1rem, 4vw, 3rem) !important;
          box-sizing: border-box;
        }

        .hero-image {
          object-fit: cover !important;
          object-position: center 20% !important;
        }

        .hero-mobile-overlay {
          display: none;
        }

        .hero-heading {
          font-size: clamp(2.25rem, 7vw, 5rem) !important;
          overflow-wrap: break-word;
          word-break: break-word;
        }

        .hero-description {
          max-width: 38ch !important;
        }

        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .hero-cta-link {
          display: inline-block;
          width: auto;
        }

        .hero-cta-button {
          width: auto !important;
        }

        .editorial-layout {
          text-align: left;
        }

        .editorial-text-block {
          max-width: 600px;
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

        /* Desktop: >= 1024px */
        @media (min-width: 1024px) {
          .hero-section {
            min-height: min(100vh, 960px);
            min-height: min(100svh, 960px);
            max-height: 960px;
            align-items: center;
            justify-content: flex-start;
          }

          .hero-image {
            object-position: center 20% !important;
          }

          .hero-cta-button {
            min-width: 180px;
          }
        }

        /* Tablets: 640px to 1023px */
        @media (min-width: 640px) and (max-width: 1023px) {
          .hero-section {
            align-items: flex-end;
            justify-content: flex-start;
            padding-top: max(88px, env(safe-area-inset-top, 0px));
            padding-bottom: clamp(48px, 8vh, 80px);
          }

          .hero-content-container {
            text-align: left !important;
          }

          .hero-text-block {
            max-width: 60% !important;
          }

          .refined-mode-inner {
            align-items: flex-start !important;
            margin: 0 !important;
          }

          .hero-image {
            object-position: 60% center !important;
          }

          .hero-cta-button {
            min-width: 180px;
          }
        }

        /* Phones: < 640px */
        @media (max-width: 639px) {
          .hero-section {
            align-items: flex-end;
            justify-content: flex-start;
            padding-top: max(84px, env(safe-area-inset-top, 0px));
            padding-bottom: clamp(28px, 6vh, 44px);
          }

          .hero-mobile-overlay {
            display: block;
            position: absolute;
            inset: 0;
            z-index: 2;
            pointer-events: none;
            background: linear-gradient(
              to top,
              rgba(20, 20, 20, 0.75) 0%,
              transparent 100%
            );
          }

          .hero-content-container {
            width: 100% !important;
            max-width: 100% !important;
            text-align: left !important;
          }

          .hero-text-block {
            max-width: 100% !important;
            width: 100% !important;
          }

          .refined-mode-inner {
            align-items: flex-start !important;
            margin: 0 !important;
            width: 100% !important;
          }

          .hero-image {
            object-position: 70% center !important;
          }
        }

        /* Button: full width below 480px, auto on desktop/tablet */
        @media (max-width: 479px) {
          .hero-cta-group {
            width: 100%;
            flex-direction: column;
          }

          .hero-cta-link {
            width: 100%;
            display: block;
          }

          .hero-cta-button {
            width: 100% !important;
            min-width: 0 !important;
          }
        }
      `}</style>
    </section>
  );
};
