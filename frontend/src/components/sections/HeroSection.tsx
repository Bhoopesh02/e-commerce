'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import {
  StaggerContainer,
  StaggerFadeUp,
  LineReveal,
} from '@/components/ui/StaggerReveal';
import heroImg from '../../../public/images/banners/Gemini_Generated_Image_piepdipiepdipiep.png';
import heroMobileImg from '../../../public/images/banners/hero-mobile.png';

export const HeroSection: React.FC = () => {
  const { storefront } = useStorefrontStore();
  const isEditorial = storefront === 'a';

  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <section
      className="relative w-full min-h-screen min-h-[100svh] overflow-hidden flex flex-col hero-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: '#2b241d',
      }}
    >
      {/* Background Image Container - Mobile Portrait Crop (<768px) */}
      <div
        className="hero-image-mobile-wrapper block md:hidden absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <Image
          src={heroMobileImg}
          alt="Aurelia Luxury Campaign - The Winter Collection"
          fill
          priority
          quality={90}
          sizes="(max-width: 767px) 100vw, 1px"
          onLoad={() => setLoaded(true)}
          className="object-cover object-center hero-image-mobile"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />
      </div>

      {/* Background Image Container - Desktop Landscape Banner (>=768px) */}
      <div
        className="hero-image-desktop-wrapper hidden md:block absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <Image
          ref={imgRef}
          src={heroImg}
          alt="Aurelia Luxury Campaign - The Winter Collection"
          fill
          priority
          quality={90}
          sizes="(min-width: 768px) 100vw, 1px"
          onLoad={() => setLoaded(true)}
          className="object-cover md:object-center hero-image"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />
      </div>

      {/* Dark gradient overlay behind text on mobile for readability */}
      <div className="hero-mobile-overlay" aria-hidden="true" />

      {/* Hero Content Wrapper */}
      <div
        className={`relative z-10 flex flex-col justify-center text-left w-full min-h-screen min-h-[100svh] px-6 sm:px-10 md:px-16 lg:px-24 hero-content-container ${
          isEditorial ? 'editorial-layout' : 'refined-layout'
        }`}
        style={{
          position: 'relative',
          zIndex: 10,
          color: 'var(--bg-subtle)',
          width: '100%',
        }}
      >
        {isEditorial ? (
          /* Editorial Experience Layout */
          <StaggerContainer
            key="editorial-hero"
            className="hero-text-block editorial-text-block max-w-xl w-full text-left"
            delayChildren={0.3}
            staggerChildren={0.14}
            animate={loaded ? 'show' : 'hidden'}
            style={{
              maxWidth: '600px',
              width: '100%',
              textAlign: 'left',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.45)',
            }}
          >
            <StaggerFadeUp
              as="span"
              className="hero-eyebrow text-left block mb-4"
              style={{
                fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--bg-subtle)',
                marginBottom: '16px',
                display: 'block',
                textAlign: 'left',
              }}
            >
              EXCLUSIVE: AURELIA ATELIER
            </StaggerFadeUp>

            <h1
              className="hero-heading text-left"
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
                textAlign: 'left',
              }}
            >
              <LineReveal bottomPadding="8px">NOCTURNAL</LineReveal>
              <LineReveal bottomPadding="8px">SILHOUETTES</LineReveal>
            </h1>

            <StaggerFadeUp
              as="p"
              className="hero-description text-left max-w-[38ch] mb-6"
              style={{
                fontSize: 'clamp(0.875rem, 1.4vw, 1.05rem)',
                color: 'var(--bg-subtle)',
                lineHeight: 1.6,
                maxWidth: '38ch',
                marginBottom: '24px',
                textAlign: 'left',
              }}
            >
              The new collection arrives at Aurelia. Hand-finished Italian nappa
              leather, double-faced cashmere, and bias-cut mulberry silk.
            </StaggerFadeUp>

            <div className="hero-cta-group flex flex-wrap gap-4 items-center justify-start text-left">
              <StaggerFadeUp className="hero-cta-link text-left inline-flex self-start w-auto">
                <Link
                  href="/shop?categorySlug=outerwear"
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                  className="inline-flex self-start w-auto"
                >
                  <Button
                    variant="white"
                    size="lg"
                    disableSheen
                    className="hero-cta-button inline-flex items-center justify-center w-auto self-start px-7 py-3.5 sm:px-9 sm:py-4 md:px-10 lg:px-12 min-h-[48px] text-xs tracking-[0.2em] sm:text-sm uppercase whitespace-nowrap max-w-full"
                    style={{ borderRadius: '0', transition: 'none', transform: 'none' }}
                  >
                    Discover more
                  </Button>
                </Link>
              </StaggerFadeUp>
            </div>
          </StaggerContainer>
        ) : (
          /* Refined Shopping Mode Layout */
          <StaggerContainer
            key="refined-hero"
            className="hero-text-block refined-mode-inner max-w-xl w-full text-left"
            delayChildren={0.3}
            staggerChildren={0.14}
            animate={loaded ? 'show' : 'hidden'}
            style={{
              maxWidth: '600px',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <StaggerFadeUp
              as="span"
              className="hero-eyebrow text-left block mb-4"
              style={{
                fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--brand-accent)',
                marginBottom: '16px',
                display: 'block',
                textAlign: 'left',
              }}
            >
              Aurelia Wardrobe Foundations
            </StaggerFadeUp>

            <h1
              className="hero-heading text-left"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 7vw, 5rem)',
                lineHeight: 1.1,
                fontWeight: 500,
                marginBottom: '20px',
                color: 'var(--bg-subtle)',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                textAlign: 'left',
              }}
            >
              <LineReveal bottomPadding="8px">The Permanent</LineReveal>
              <LineReveal bottomPadding="8px">Collection</LineReveal>
            </h1>

            <StaggerFadeUp
              as="p"
              className="hero-description text-left max-w-[38ch] mb-8"
              style={{
                fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
                color: 'var(--border-color)',
                lineHeight: 1.6,
                maxWidth: '38ch',
                marginBottom: '32px',
                textAlign: 'left',
              }}
            >
              Essential Italian tailoring, pure Mongolian cashmere, and artisan
              leather accessories engineered for effortless longevity.
            </StaggerFadeUp>

            <div className="hero-cta-group flex flex-wrap gap-4 items-center justify-start text-left">
              <StaggerFadeUp className="hero-cta-link text-left">
                <Link
                  href="/shop"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight size={16} />}
                    className="hero-cta-button"
                  >
                    Shop Full Catalog
                  </Button>
                </Link>
              </StaggerFadeUp>
              <StaggerFadeUp className="hero-cta-link text-left">
                <Link
                  href="/shop?categorySlug=tailoring"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <Button variant="white" size="lg" disableSheen className="hero-cta-button">
                    Explore Tailoring
                  </Button>
                </Link>
              </StaggerFadeUp>
            </div>
          </StaggerContainer>
        )}
      </div>

      <style jsx global>{`
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-color: #2b241d;
        }

        .hero-image-mobile-wrapper {
          display: block;
        }

        .hero-image-desktop-wrapper {
          display: none;
        }

        .hero-image-mobile {
          object-fit: cover !important;
          object-position: center center !important;
          filter: none !important;
        }

        .hero-image {
          object-fit: cover !important;
          object-position: center center !important;
          filter: none !important;
        }

        @media (min-width: 768px) {
          .hero-image-mobile-wrapper {
            display: none !important;
          }
          .hero-image-desktop-wrapper {
            display: block !important;
          }
        }

        .hero-content-container {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: center !important;
          width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          box-sizing: border-box;
          text-align: left;
          padding-left: 24px;
          padding-right: 24px;
          padding-top: max(88px, env(safe-area-inset-top, 0px));
          padding-bottom: max(32px, env(safe-area-inset-bottom, 0px));
        }

        @media (min-width: 640px) {
          .hero-content-container {
            padding-left: 40px;
            padding-right: 40px;
          }
        }

        @media (min-width: 768px) {
          .hero-content-container {
            justify-content: center !important;
            padding-left: 64px;
            padding-right: 64px;
            padding-bottom: 0;
          }
        }

        @media (min-width: 1024px) {
          .hero-content-container {
            padding-left: 96px;
            padding-right: 96px;
          }
        }

        .hero-mobile-overlay {
          display: none;
        }

        @media (max-width: 767px) {
          .hero-mobile-overlay {
            display: block;
            position: absolute;
            inset: 0;
            z-index: 2;
            pointer-events: none;
            background: linear-gradient(
              to top,
              rgba(20, 20, 20, 0.75) 0%,
              rgba(20, 20, 20, 0.35) 50%,
              rgba(20, 20, 20, 0.2) 100%
            );
          }
        }

        .hero-heading {
          font-size: clamp(2.25rem, 7vw, 5rem) !important;
          overflow-wrap: break-word;
          word-break: break-word;
          text-align: left !important;
        }

        .hero-description {
          max-width: 38ch !important;
          text-align: left !important;
          margin-bottom: 24px !important;
        }

        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: flex-start;
          align-items: center;
          text-align: left;
        }

        .hero-cta-link {
          display: inline-block;
          width: auto;
          text-align: left;
        }

        .hero-cta-button {
          display: inline-flex !important;
          width: auto !important;
          max-width: 100% !important;
          align-self: flex-start !important;
          white-space: nowrap !important;
          min-height: 48px !important;
          padding: 14px 28px !important;
          font-size: 0.75rem !important;
          letter-spacing: 0.2em !important;
          text-transform: uppercase !important;
          transition: none !important;
          transform: none !important;
        }

        .hero-cta-button:hover,
        .hero-cta-button:focus-visible,
        .hero-cta-button:active,
        a:hover .hero-cta-button,
        a:focus-visible .hero-cta-button {
          transform: none !important;
          box-shadow: none !important;
          background-color: var(--bg-primary) !important;
        }

        .hero-cta-button::after,
        .hero-cta-button:hover::after,
        .hero-cta-button:focus-visible::after,
        a:hover .hero-cta-button::after,
        a:focus-visible .hero-cta-button::after {
          display: none !important;
          content: none !important;
          opacity: 0 !important;
          transform: none !important;
          animation: none !important;
        }

        @media (min-width: 640px) {
          .hero-cta-button {
            padding: 16px 36px !important;
            font-size: 0.875rem !important;
          }
        }

        @media (min-width: 768px) {
          .hero-cta-button {
            padding-left: 40px !important;
            padding-right: 40px !important;
          }
        }

        @media (min-width: 1024px) {
          .hero-cta-button {
            padding-left: 48px !important;
            padding-right: 48px !important;
          }
        }

        .editorial-layout,
        .refined-layout {
          text-align: left !important;
        }

        .editorial-text-block,
        .refined-mode-inner {
          display: flex;
          flex-direction: column;
          align-items: flex-start !important;
          text-align: left !important;
          margin: 0 !important;
          max-width: 600px;
          width: 100%;
        }

        @media (max-width: 479px) {
          .hero-cta-group {
            width: auto;
            flex-direction: column;
            align-items: flex-start;
          }

          .hero-cta-link {
            width: auto;
            display: inline-flex;
          }

          .hero-cta-button {
            width: auto !important;
            min-width: 0 !important;
          }
        }
      `}</style>
    </section>
  );
};

