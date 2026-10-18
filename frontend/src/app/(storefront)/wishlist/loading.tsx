import React from 'react';
import { ProductGridSkeleton } from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function WishlistLoading() {
  return (
    <div style={{ paddingTop: '110px', paddingBottom: '96px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        <Skeleton height="40px" width="300px" style={{ marginBottom: '32px' }} />
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}
