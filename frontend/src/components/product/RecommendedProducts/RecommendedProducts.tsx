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
      
      {/* Standard Product Grid */}
      <div className="product-grid">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
