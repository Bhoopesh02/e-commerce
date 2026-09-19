'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

interface ExpandingCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export const ExpandingCarousel: React.FC<ExpandingCarouselProps> = ({
  products,
  title = 'Signature Icons',
  subtitle = 'Touch to Reveal Silhouette Architecture',
}) => {
  // Limit to 4 or 5 signature items for optimal expanding balance
  const items = products.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section style={{ padding: '96px 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '12px' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {subtitle}
          </p>
        </div>

        {/* Expanding Flex Accordion Container (Desktop & Tablet) */}
        <div
          className="expanding-carousel-container"
          style={{
            display: 'flex',
            height: '560px',
            gap: '16px',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          {items.map((product, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={product.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                style={{
                  flex: isActive ? 2.5 : 1,
                  position: 'relative',
                  height: '100%',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'flex 600ms cubic-bezier(0.22, 1, 0.36, 1)',
                  boxShadow: isActive ? 'var(--shadow-editorial)' : 'var(--shadow-sm)',
                }}
              >
                {/* Background Image */}
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    filter: isActive ? 'brightness(0.9)' : 'brightness(0.75)',
                  }}
                />

                {/* Gradient Scrim */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isActive
                      ? 'linear-gradient(180deg, rgba(29, 26, 57, 0.1) 0%, rgba(29, 26, 57, 0.85) 100%)'
                      : 'linear-gradient(180deg, rgba(29, 26, 57, 0.2) 0%, rgba(29, 26, 57, 0.75) 100%)',
                    transition: 'background 500ms var(--ease-editorial)',
                  }}
                />

                {/* Content Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '28px',
                    color: '#FFF8F5',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-sunset-400)',
                      marginBottom: '6px',
                    }}
                  >
                    {product.subtitle || 'Atelier Masterpiece'}
                  </span>

                  <h3
                    style={{
                      fontSize: isActive ? '1.5rem' : '1.1rem',
                      fontFamily: 'var(--font-display)',
                      color: '#FFF8F5',
                      marginBottom: '8px',
                      whiteSpace: isActive ? 'normal' : 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      transition: 'font-size 400ms var(--ease-editorial)',
                    }}
                  >
                    {product.name}
                  </h3>

                  {/* Expanded Meta & Action (Only shown when active) */}
                  <div
                    style={{
                      maxHeight: isActive ? '180px' : '0',
                      opacity: isActive ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'all 500ms cubic-bezier(0.22, 1, 0.36, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--color-sunset-200)',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-sunset-400)' }}>
                        {formatPrice(product.price)}
                      </span>

                      <Link href={`/product/${product.slug}`}>
                        <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
                          View Garment
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Responsive mobile touch styling */}
      <style jsx>{`
        @media (max-width: 768px) {
          .expanding-carousel-container {
            display: flex !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            height: 480px !important;
            padding-bottom: 16px;
          }
          .expanding-carousel-container > div {
            flex: 0 0 82% !important;
            scroll-snap-align: center;
          }
        }
      `}</style>
    </section>
  );
};
