import React from 'react';
import { ProductGridSkeleton } from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function NewArrivalsLoading() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Header Skeleton */}
        <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Skeleton width="140px" height="14px" />
          <Skeleton width="340px" height="36px" />
          <Skeleton width="480px" height="18px" />
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </main>
  );
}
