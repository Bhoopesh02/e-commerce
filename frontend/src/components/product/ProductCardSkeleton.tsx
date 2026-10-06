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

        {/* Top-left Badge Skeleton */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 2,
          }}
        >
          <Skeleton width="48px" height="22px" borderRadius="999px" />
        </div>

        {/* Top-right Wishlist Button Skeleton */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 2,
          }}
        >
          <Skeleton width="34px" height="34px" borderRadius="50%" />
        </div>
      </div>

      {/* Product Meta Skeletons */}
      <div
        style={{
          marginTop: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {/* Product Title Line */}
        <Skeleton
          width="75%"
          height="18px"
          borderRadius="4px"
        />

        {/* Product Subtitle Line */}
        <Skeleton
          width="48%"
          height="13px"
          borderRadius="3px"
        />

        {/* Price & Rating Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '4px',
          }}
        >
          {/* Price */}
          <Skeleton
            width="35%"
            height="18px"
            borderRadius="4px"
          />

          {/* Star Rating */}
          <Skeleton
            width="52px"
            height="14px"
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
      className={`product-grid max-md:!grid max-md:!grid-cols-2 max-md:!gap-[12px] ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '32px',
        width: '100%',
      }}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} variant={variant} />
      ))}
    </div>
  );
};
