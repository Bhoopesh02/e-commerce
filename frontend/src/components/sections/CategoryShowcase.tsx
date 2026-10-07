'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Category } from '@/types';
import { ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Skeleton } from '@/components/ui/Skeleton';

export interface CategoryShowcaseProps {
  categories?: Category[];
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
}

export interface CategoryShowcaseSkeletonProps {
  title?: string;
  subtitle?: string;
}

export const CategoryShowcaseSkeleton: React.FC<CategoryShowcaseSkeletonProps> = ({
  title = 'Curated Disciplines',
  subtitle = 'Discover tailored collections crafted for longevity and quiet distinction.',
}) => {
  return (
    <section
      className="category-showcase-section"
      aria-busy="true"
      style={{
        padding: '80px 0',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          {title ? (
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-display)', marginBottom: '16px' }}>{title}</h2>
          ) : (
            <Skeleton width="280px" height="38px" borderRadius="6px" style={{ margin: '0 auto 16px' }} />
          )}
          {subtitle ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              {subtitle}
            </p>
          ) : (
            <Skeleton width="420px" height="18px" borderRadius="4px" style={{ margin: '0 auto' }} />
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ aspectRatio: '1/1', backgroundColor: '#f4f5f7', borderRadius: '12px' }}>
                <Skeleton width="100%" height="100%" borderRadius="12px" />
              </div>
              <Skeleton width="120px" height="20px" borderRadius="4px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  categories = [],
  title = 'Shop by category',
  subtitle = '',
  isLoading = false,
}) => {
  const router = useRouter();

  if (isLoading || !categories || categories.length === 0) {
    return <CategoryShowcaseSkeleton title={title} subtitle={subtitle} />;
  }

  return (
    <section className="category-showcase-section" style={{ padding: '80px 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        <ScrollReveal duration={0.6}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-display)', fontWeight: 400 }}>{title}</h2>
            {subtitle && (
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '16px auto 0' }}>
                {subtitle}
              </p>
            )}
          </div>
        </ScrollReveal>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '24px',
          justifyContent: 'center'
        }}>
          {categories.map((cat, idx) => (
            <ScrollReveal key={cat.id} delay={idx * 0.1} duration={0.6}>
              <div 
                onClick={() => router.push(`/shop?categorySlug=${cat.slug}`)}
                className="category-card group"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  cursor: 'pointer'
                }}
              >
                <div 
                  className="category-image-container"
                  style={{
                    backgroundColor: '#f4f5f7',
                    borderRadius: '12px',
                    aspectRatio: '1/1',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    quality={80}
                    priority
                    loading="eager"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    className="category-card-image"
                  />
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  transition: 'color 0.3s ease'
                }} className="category-card-title">
                  {cat.name} <ChevronRight size={14} />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .category-card:hover .category-card-image {
          transform: scale(1.05);
        }
        .category-card:hover .category-card-title {
          color: var(--text-primary) !important;
        }
      `}</style>
    </section>
  );
};
