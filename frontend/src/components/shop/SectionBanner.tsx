'use client';

import React from 'react';
import Image from 'next/image';
import { Category } from '@/types';

interface SectionBannerProps {
  category: Category;
  productCount: number;
}

export const SectionBanner: React.FC<SectionBannerProps> = ({
  category,
  productCount,
}) => {
  const generatedCategories = [
    'outerwear', 'tailoring', 'eveningwear', 'knitwear', 
    'leather-goods', 'footwear', 'fine-jewelry', 'fragrances'
  ];

  const bannerSrc = generatedCategories.includes(category.slug)
    ? `/images/banners/gen/${category.slug}.jpg`
    : category.bannerImage || category.image;
  
  // Custom specific text for outerwear to match the user's reference image if it's outerwear,
  // else use category default names.
  const isOuterwear = category.slug === 'outerwear';
  const smallText = isOuterwear ? 'HEAVY-DUTY WARMTH' : `${category.name} COLLECTION`;
  const largeText = isOuterwear ? 'That Shearling Feeling' : category.name;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '0px',
        marginBottom: '0px',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        minHeight: '60vh',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
      }}
      className="section-banner-split"
    >
      {/* Left side: Typography */}
      <div
        style={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <p
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#333',
              marginBottom: '16px',
            }}
          >
            {smallText}
          </p>
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 4vw, 4rem)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              color: '#000',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {largeText}
          </h2>
        </div>
      </div>

      {/* Right side: Image */}
      <div
        style={{
          flex: '1 1 50%',
          position: 'relative',
          minHeight: '400px', // Fallback min height for mobile
        }}
        className="banner-image-container"
      >
        <Image
          src={bannerSrc}
          alt={`${category.name} Campaign`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>

      <style jsx>{`
        .split-arrow-btn:hover {
          background-color: #f5f5f5 !important;
          border-color: #d0d0d0 !important;
        }
        @media (max-width: 768px) {
          .section-banner-split {
            flex-direction: column !important;
          }
          .banner-image-container {
            height: 400px;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
