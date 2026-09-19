import { Suspense } from 'react';
import { ShopView } from '@/components/views/ShopView';

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: '140px', textAlign: 'center' }}>Loading Catalog...</div>}>
      <ShopView />
    </Suspense>
  );
}
