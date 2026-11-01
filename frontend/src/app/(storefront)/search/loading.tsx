import React from 'react';
import { ProductGridSkeleton } from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function SearchLoading() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', paddingTop: 'calc(var(--header-total-height, 113px) + 24px)', paddingBottom: '80px' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Search Input Bar Skeleton */}
        <div style={{ width: '100%', maxWidth: '640px', marginBottom: '48px' }}>
          <Skeleton width="100%" height="52px" borderRadius="var(--radius-pill, 999px)" />
        </div>

        {/* Results Skeleton Grid */}
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: '24px' }}>
            <Skeleton width="160px" height="18px" />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </main>
  );
}
