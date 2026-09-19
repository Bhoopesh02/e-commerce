'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface CategoryShowcaseProps {
  categories: Category[];
  title?: string;
  subtitle?: string;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  categories,
  title = 'Curated Disciplines',
  subtitle = 'Discover tailored collections crafted for longevity and quiet distinction.',
}) => {
  return (
    <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Section Header */}
        <ScrollReveal>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '48px',
            }}
          >
          <span
            style={{
              fontSize: '0.78rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-sunset-600)',
              fontWeight: 600,
            }}
          >
            Atelier Divisions
          </span>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>{title}</h2>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '0.04em',
              }}
            >
              View Full Catalog <ArrowUpRight size={15} />
            </Link>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '540px' }}>
            {subtitle}
          </p>
        </div>
        </ScrollReveal>

        {/* Editorial Category Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {categories.map((cat, idx) => (
            <ScrollReveal key={cat.id} delay={idx * 0.07} duration={0.5}>
              <Link
                href={`/shop?categorySlug=${cat.slug}`}
                style={{
                  position: 'relative',
                  height: idx === 0 || idx === 3 ? '420px' : '360px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '24px',
                  color: '#FFF8F5',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform var(--duration-normal) var(--ease-editorial)',
                }}
                className="category-card"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 600ms var(--ease-editorial)',
                  }}
                  className="category-image"
                />

                {/* Scrim Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'linear-gradient(180deg, rgba(29, 26, 57, 0.1) 0%, rgba(29, 26, 57, 0.75) 100%)',
                    zIndex: 1,
                  }}
                />

                {/* Text Meta */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '1.45rem',
                        fontFamily: 'var(--font-display)',
                        color: '#FFF8F5',
                      }}
                    >
                      {cat.name}
                    </h3>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  {cat.description && (
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--color-sunset-200)',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {cat.description}
                    </p>
                  )}
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .category-card:hover .category-image {
          transform: scale(1.06);
        }
      `}</style>
    </section>
  );
};
