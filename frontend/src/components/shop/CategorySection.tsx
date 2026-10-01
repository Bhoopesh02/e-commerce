'use client';

import React from 'react';
import { motion, useReducedMotion, Transition } from 'framer-motion';
import { Category, Product } from '@/types';
import { SectionBanner } from './SectionBanner';
import { ProductCard } from '@/components/product/ProductCard';

export type SectionAnimationVariant =
  | 'fade-up'
  | 'stagger-slide'
  | 'scale-reveal'
  | 'subtle-float'
  | 'default';

interface CategorySectionProps {
  category: Category;
  products: Product[];
  animationVariant?: SectionAnimationVariant;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const ANIMATION_PRESETS: Record<
  string,
  {
    initial: Record<string, number | string>;
    whileInView: Record<string, number | string>;
    transition: (i: number) => Transition;
  }
> = {
  'fade-up': {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    transition: (i: number) => ({
      duration: 0.55,
      delay: (i % 4) * 0.08,
      ease: [0.22, 1, 0.36, 1],
    }),
  },
  'stagger-slide': {
    initial: { opacity: 0, x: -24 },
    whileInView: { opacity: 1, x: 0 },
    transition: (i: number) => ({
      duration: 0.5,
      delay: (i % 4) * 0.1,
      ease: [0.22, 1, 0.36, 1],
    }),
  },
  'scale-reveal': {
    initial: { opacity: 0, scale: 0.94 },
    whileInView: { opacity: 1, scale: 1 },
    transition: (i: number) => ({
      duration: 0.45,
      delay: (i % 4) * 0.07,
      ease: [0.22, 1, 0.36, 1],
    }),
  },
  'subtle-float': {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: (i: number) => ({
      duration: 0.6,
      delay: (i % 4) * 0.08,
      ease: [0.16, 1, 0.3, 1],
    }),
  },
  default: {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: (i: number) => ({
      duration: 0.48,
      delay: (i % 4) * 0.06,
      ease: [0.22, 1, 0.36, 1],
    }),
  },
};

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  products,
  animationVariant = 'fade-up',
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const preset = ANIMATION_PRESETS[animationVariant] || ANIMATION_PRESETS.default;

  return (
    <motion.section
      key={category.id}
      id={`section-${category.slug}`}
      data-category-section={category.slug}
      data-animation={animationVariant}
      className={`category-section section-${category.slug}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      style={{
        marginBottom: '96px',
        scrollMarginTop: '130px',
      }}
    >
      {/* Dedicated Section Banner */}
      <SectionBanner
        category={category}
        productCount={products.length}
        onNext={onNext}
        onPrev={onPrev}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />

      {/* Product Grid or Empty Filter Feedback */}
      {products.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '36px',
          }}
          className={`product-grid product-grid-${category.slug} max-md:!grid max-md:!grid-cols-2 max-md:!gap-[12px]`}
        >
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              className={`product-card-wrapper product-card-${category.slug}`}
              initial={shouldReduceMotion ? undefined : preset.initial}
              whileInView={shouldReduceMotion ? undefined : preset.whileInView}
              viewport={{ once: true, margin: '-40px' }}
              transition={shouldReduceMotion ? undefined : preset.transition(idx)}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-color)',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
          }}
        >
          No silhouettes in {category.name} match the currently applied filters.
        </div>
      )}
    </motion.section>
  );
};
