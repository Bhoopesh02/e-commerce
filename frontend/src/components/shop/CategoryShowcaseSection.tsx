'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Product, ShowcaseBannerConfig } from '@/types';
import { BannerProductCarousel } from './BannerProductCarousel';
import { ProductCard, ProductGridSkeleton } from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

export interface CategoryShowcaseSectionSkeletonProps {
  sectionId?: string;
  headline?: string;
}

export const CategoryShowcaseSectionSkeleton: React.FC<CategoryShowcaseSectionSkeletonProps> = ({
  sectionId,
  headline,
}) => {
  return (
    <section
      id={sectionId}
      className="category-showcase-section category-showcase-section-skeleton"
      style={{
        marginBottom: '96px',
        scrollMarginTop: '140px',
      }}
      aria-hidden="true"
    >
      {/* 1. Cinematic Hero Banner Skeleton */}
      <div
        className="category-hero-banner"
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '48px',
          backgroundColor: '#0c0a14',
          boxShadow: '0 24px 56px -12px rgba(16, 33, 39, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          className="category-hero-banner-content"
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: 'clamp(28px, 4vw, 44px)',
            gap: '24px',
          }}
        >
          {/* Banner Editorial Header Skeleton */}
          <div className="category-hero-banner-header" style={{ maxWidth: '780px' }}>
            {headline ? (
              <h2
                className="category-hero-banner-title"
                style={{
                  fontSize: 'clamp(1.25rem, 3.5vw, 2.7rem)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  color: "var(--text-inverse)",
                  lineHeight: 1.18,
                  marginBottom: '12px',
                  letterSpacing: '-0.01em',
                }}
              >
                {headline}
              </h2>
            ) : (
              <Skeleton width="clamp(220px, 45%, 380px)" height="42px" borderRadius="8px" style={{ marginBottom: '12px' }} />
            )}
            <Skeleton width="clamp(260px, 65%, 520px)" height="18px" borderRadius="4px" />
          </div>

          {/* Embedded Horizontal Scrollable Products Carousel Skeleton */}
          <BannerProductCarousel isLoading={true} products={[]} />
        </div>
      </div>

      {/* 2. All Products Catalog Below the Banner Skeleton */}
      <div className="section-catalog-below">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <Skeleton width="180px" height="24px" borderRadius="4px" />
        </div>

        {/* Responsive Product Grid Skeleton */}
        <ProductGridSkeleton count={4} />
      </div>
    </section>
  );
};

interface CategoryShowcaseSectionProps {
  sectionId: string;
  config: ShowcaseBannerConfig;
  featuredProducts: Product[];
  catalogProducts: Product[];
  categoryName: string;
  isLoading?: boolean;
}

export const CategoryShowcaseSection: React.FC<CategoryShowcaseSectionProps> = ({
  sectionId,
  config,
  featuredProducts,
  catalogProducts,
  categoryName,
  isLoading = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [imgSrc, setImgSrc] = useState(config.image4k || config.fallbackImage);
  const [isBannerLoaded, setIsBannerLoaded] = useState(false);

  if (isLoading) {
    return <CategoryShowcaseSectionSkeleton sectionId={sectionId} headline={config.headline} />;
  }

  return (
    <section
      id={sectionId}
      className="category-showcase-section"
      style={{
        marginBottom: '96px',
        scrollMarginTop: '140px',
      }}
    >
      {/* 1. Cinematic 4K Hero Banner with Embedded Horizontal Product Carousel */}
      <div
        className="category-hero-banner"
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '48px',
          backgroundColor: '#0c0a14',
          boxShadow: '0 24px 56px -12px rgba(16, 33, 39, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* 4K Background Image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        >
          {!isBannerLoaded && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
              }}
            >
              <Skeleton width="100%" height="100%" borderRadius="24px" />
            </div>
          )}

          <Image
            src={imgSrc}
            alt={`${config.headline} - 4K High Clarity Banner`}
            fill
            sizes="(max-width: 1280px) 100vw, 1440px"
            quality={90}
            priority={sectionId.includes('new-arrivals')}
            onLoad={() => setIsBannerLoaded(true)}
            onError={() => {
              setIsBannerLoaded(true);
              if (imgSrc !== config.fallbackImage) {
                setImgSrc(config.fallbackImage);
              }
            }}
            style={{
              objectFit: 'cover',
              objectPosition: 'center center',
              opacity: isBannerLoaded ? 1 : 0,
              transition: 'opacity 500ms ease',
            }}
          />

          {/* Cinematic Editorial Gradients for 4K Clarity & WCAG AA Contrast */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, var(--overlay-scrim-strong) 0%, rgba(16, 33, 39, 0.72) 45%, rgba(16, 33, 39, 0.42) 80%, rgba(16, 33, 39, 0.6) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(0deg, rgba(16, 33, 39, 0.85) 0%, rgba(16, 33, 39, 0.3) 50%, rgba(16, 33, 39, 0.6) 100%)',
            }}
          />
        </div>

        {/* Content Container (Header + Product Carousel) */}
        <div
          className="category-hero-banner-content"
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: 'clamp(28px, 4vw, 44px)',
            gap: '24px',
          }}
        >
          {/* Banner Editorial Header */}
          <div className="category-hero-banner-header" style={{ maxWidth: '780px' }}>
            <h2
              className="category-hero-banner-title"
              style={{
                fontSize: 'clamp(1.25rem, 3.5vw, 2.7rem)',
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                color: "var(--text-inverse)",
                lineHeight: 1.18,
                marginBottom: '12px',
                letterSpacing: '-0.01em',
                textShadow: '0 2px 16px rgba(0,0,0,0.6)',
              }}
            >
              {config.headline}
            </h2>

            {config.subtitle && (
              <p
                className="category-hero-banner-description"
                style={{
                  color: 'rgba(245, 248, 248, 0.88)',
                  fontSize: 'clamp(0.88rem, 1.1vw, 1rem)',
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: '640px',
                  textShadow: '0 1px 8px var(--overlay-black-50)',
                }}
              >
                {config.subtitle}
              </p>
            )}
          </div>

          {/* Embedded Horizontal Scrollable Products Carousel inside the Banner */}
          {featuredProducts.length > 0 && (
            <BannerProductCarousel
              products={featuredProducts}
            />
          )}
        </div>
      </div>

      {/* 2. All Products Catalog Below the Banner */}
      <div className="section-catalog-below">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.2rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              All {config.headline}
            </h3>
          </div>
        </div>

        {/* Responsive Product Grid */}
        {catalogProducts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '32px',
            }}
            className="product-grid max-md:!grid max-md:!grid-cols-2 max-md:!gap-[12px]"
          >
            {catalogProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                className="product-card-wrapper"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={shouldReduceMotion ? undefined : { duration: 0.45, delay: (idx % 4) * 0.06 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
            }}
          >
            No garments in this section match the currently applied price or availability filters.
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 767px) {
          .category-hero-banner-description {
            display: none !important;
          }
          .category-hero-banner-title {
            font-size: 1.25rem !important;
            line-height: 1.25 !important;
            margin-bottom: 0 !important;
          }
        }
      `}</style>
    </section>
  );
};
