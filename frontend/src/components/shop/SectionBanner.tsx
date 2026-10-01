'use client';

import React from 'react';
import Image from 'next/image';
import { Category } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SectionBannerProps {
  category: Category;
  productCount: number;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const SectionBanner: React.FC<SectionBannerProps> = ({
  category,
  productCount,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  const bannerSrc = category.bannerImage || category.image;
  const headline = category.bannerHeadline || category.name;
  const subtitle = category.bannerSubtitle || category.description;
  const badges = category.bannerBadges || [];

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '20px',
        marginBottom: '36px',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 24px 48px -12px rgba(12, 10, 20, 0.35)',
        border: '1px solid rgba(232, 188, 185, 0.22)',
        backgroundColor: '#0c0a14',
      }}
      className="group section-banner"
    >
      {/* Background Image Container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      >
        <Image
          src={bannerSrc}
          alt={`${category.name} Editorial Campaign Banner`}
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
            willChange: 'transform',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="group-hover:scale-105"
        />
        {/* Cinematic Editorial Gradients - Vivid 4K Visibility with Pristine Text Legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(10, 8, 18, 0.78) 0%, rgba(10, 8, 18, 0.46) 40%, rgba(10, 8, 18, 0.12) 75%, rgba(10, 8, 18, 0.28) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(0deg, rgba(10, 8, 18, 0.45) 0%, transparent 55%)',
          }}
        />
      </div>

      {/* Banner Typography & Accents */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: 'clamp(32px, 4.5vw, 54px)',
          maxWidth: '740px',
          paddingLeft: 'clamp(56px, 6vw, 80px)', // Make room for left arrow
          paddingRight: 'clamp(56px, 6vw, 80px)', // Make room for right arrow
        }}
      >

        <h2
          style={{
            fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            color: '#fff8f5',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '14px',
            textShadow: '0 2px 18px rgba(0,0,0,0.55)',
          }}
        >
          {headline}
        </h2>

        {subtitle && (
          <p
            className="banner-subtitle"
            style={{
              color: 'rgba(255, 248, 245, 0.9)',
              fontSize: 'clamp(0.92rem, 1.15vw, 1.05rem)',
              lineHeight: 1.6,
              marginBottom: '22px',
              maxWidth: '620px',
              textShadow: '0 1px 10px rgba(0,0,0,0.6)',
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Quick Editorial Tags */}
        <div
          className="banner-badges"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px 14px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              fontSize: '0.75rem',
              color: '#fff8f5',
              fontWeight: 500,
              letterSpacing: '0.04em',
            }}
          >
            {productCount} Silhouettes
          </span>

          {badges.map((badge, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '5px 14px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                fontSize: '0.75rem',
                color: '#fff8f5',
                fontWeight: 500,
                letterSpacing: '0.04em',
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* In-Banner Navigation Controls */}
      {hasPrev && onPrev && (
        <button
          onClick={onPrev}
          className="carousel-arrow-btn"
          style={{
            position: 'absolute',
            left: 'clamp(12px, 2vw, 24px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          aria-label="Previous Category"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>
      )}

      {hasNext && onNext && (
        <button
          onClick={onNext}
          className="carousel-arrow-btn"
          style={{
            position: 'absolute',
            right: 'clamp(12px, 2vw, 24px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          aria-label="Next Category"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      )}

      <style jsx>{`
        .carousel-arrow-btn {
          width: 32px;
          height: 32px;
        }
        @media (min-width: 768px) {
          .carousel-arrow-btn {
            width: 36px;
            height: 36px;
          }
        }
        .carousel-arrow-btn:hover {
          opacity: 0.8;
        }
        .carousel-arrow-btn:active {
          opacity: 0.6;
        }
        @media (max-width: 767px) {
          .section-banner {
            height: 180px !important;
          }
          .banner-subtitle,
          .banner-badges {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
