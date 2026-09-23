'use client';

import React, { useMemo } from 'react';
import { Product } from '@/types';
import { getRecommendations, RecommendationType } from './recommendationUtils';
import { ProductCard } from '../ProductCard';

export interface RecommendedProductsProps {
  currentProduct: Product;
  products: Product[];
  recommendationType: RecommendationType;
  limit?: number;
}

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  currentProduct,
  products,
  recommendationType,
  limit = 4,
}) => {
  const recommendations = useMemo(() => {
    return getRecommendations(currentProduct, products, recommendationType, limit);
  }, [currentProduct, products, recommendationType, limit]);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const title =
    recommendationType === 'complete-the-look'
      ? 'COMPLETE THE LOOK'
      : 'YOU MAY ALSO LIKE';

  return (
    <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '64px', marginBottom: '80px' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '32px' }}>{title}</h2>
      
      {/* Mobile Horizontal Scroll + Desktop Grid Container */}
      <div
        className="recommendations-container"
        style={{
          // Desktop uses grid template columns, mobile overrides with flex below via CSS-like inline if needed,
          // but we can just use CSS grid with auto-flow column on mobile.
          // Since we can't reliably use media queries inline for overflow layout,
          // we will use standard CSS grid that naturally wraps, or flex with overflow.
          // The prompt requested 'overflow-x: auto on mobile' and 'CSS scroll snapping'.
          display: 'flex',
          gap: '32px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '16px', // For scrollbar clearance
          // Hide scrollbar but keep functionality
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>
          {`
            .recommendations-container::-webkit-scrollbar {
              display: none;
            }
            .recommendation-item {
              flex: 0 0 calc(85vw - 32px);
              scroll-snap-align: start;
            }
            @media (min-width: 768px) {
              .recommendations-container {
                display: grid !important;
                grid-template-columns: repeat(4, 1fr);
                overflow-x: visible !important;
              }
              .recommendation-item {
                flex: none;
                width: 100%;
              }
            }
          `}
        </style>
        {recommendations.map((product) => (
          <div key={product.id} className="recommendation-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
