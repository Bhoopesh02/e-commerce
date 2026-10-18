import React from 'react';
import { ProductGridSkeleton } from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function HomeLoading() {
  return (
    <main style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Hero Banner Skeleton */}
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - var(--announcement-bar-height, 37px))',
          minHeight: '520px',
          backgroundColor: 'var(--color-black-tie)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="skeleton-shimmer"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.15,
          }}
        />
      </div>

      {/* Featured Silhouettes Skeleton Section */}
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Skeleton width="180px" height="14px" />
          <Skeleton width="320px" height="32px" />
        </div>
        <ProductGridSkeleton count={4} />
      </div>
    </main>
  );
}
