'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export interface ProductCardSkeletonProps {
  aspectRatio?: string;
  variant?: 'standard' | 'overlay' | 'grid';
  className?: string;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  aspectRatio = '3 / 4',
  variant = 'standard',
  className = '',
}) => {
  return (
    <div
      className={`product-card-skeleton ${variant === 'grid' ? 'min-w-0 w-full p-3 rounded-xl md:p-0 md:rounded-none' : ''} ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100%',
      }}
      aria-hidden="true"
    >
      {/* Product Image Skeleton Frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          borderRadius: variant === 'grid' ? '8px' : 'var(--radius-sm)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <Skeleton
          width="100%"
          height="100%"
          borderRadius={variant === 'grid' ? '8px' : 'var(--radius-sm)'}
        />

        {/* Top-right Wishlist Button Skeleton */}
        <div
          className="card-wishlist-skeleton"
          style={{
            position: 'absolute',
            zIndex: 2,
          }}
        >
          <Skeleton borderRadius="50%" className="card-action-skeleton-circle" />
        </div>
      </div>

      {/* Product Meta Skeletons */}
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Status Line Placeholder (Height 18px) */}
        <div style={{ height: '18px', display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <Skeleton width="42px" height="11px" borderRadius="3px" />
        </div>

        {/* Product Title Slot (Reserved 2-line height) */}
        <div style={{ minHeight: '2.6em', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Skeleton
            width="75%"
            height="16px"
            borderRadius="4px"
          />
        </div>

        {/* Price Row (Reduced size) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '6px',
          }}
        >
          <Skeleton
            width="32%"
            height="15px"
            borderRadius="4px"
          />
        </div>
      </div>
    </div>
  );
};

export interface ProductGridSkeletonProps {
  count?: number;
  variant?: 'standard' | 'overlay' | 'grid';
  className?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 4,
  variant = 'standard',
  className = '',
}) => {
  return (
    <div
      className={`product-grid ${className}`}
      style={{
        width: '100%',
      }}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} variant={variant} />
      ))}
    </div>
  );
};
