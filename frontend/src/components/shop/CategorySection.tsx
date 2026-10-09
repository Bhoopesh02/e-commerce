'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Category, Product } from '@/types';
import { ProductCard, ProductGridSkeleton } from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

export type SectionAnimationVariant =
  | 'fade-up'
  | 'stagger-slide'
  | 'scale-reveal'
  | 'subtle-float'
  | 'default';

export interface CategorySectionSkeletonProps {
  categoryName?: string;
}

export const CategorySectionSkeleton: React.FC<CategorySectionSkeletonProps> = ({
  categoryName,
}) => {
  return (
    <div
      className="category-section-skeleton"
      style={{
        marginBottom: '96px',
        scrollMarginTop: '130px',
      }}
      aria-hidden="true"
    >
      {/* All Products Grid Skeleton */}
      <div>
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
          <Skeleton width="220px" height="24px" borderRadius="4px" />
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
};

interface CategorySectionProps {
  category: Category;
  products: Product[];
  animationVariant?: SectionAnimationVariant;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  isLoading?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  products,
  isLoading = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (isLoading) {
    return <CategorySectionSkeleton categoryName={category?.name} />;
  }

  return (
    <motion.section
      key={category.id}
      id={`section-${category.slug}`}
      data-category-section={category.slug}
      className={`category-section section-${category.slug}`}
      initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -30, filter: 'blur(4px)' }}
      transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
      style={{
        marginBottom: '96px',
        scrollMarginTop: '130px',
      }}
    >
      {/* All Products Grid */}
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
              All {category.name}
            </h3>
          </div>
          <span
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              fontWeight: 400,
            }}
          >
            {products.length} {products.length === 1 ? 'piece' : 'pieces'}
          </span>
        </div>

        {products.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '32px',
            }}
            className="product-grid max-md:!grid max-md:!grid-cols-2 max-md:!gap-[12px]"
          >
            {products.map((product, idx) => (
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
            No pieces found in this category matching the currently applied filters.
          </div>
        )}
      </div>
    </motion.section>
  );
};
