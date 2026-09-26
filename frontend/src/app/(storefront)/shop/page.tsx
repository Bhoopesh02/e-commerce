import { Suspense } from 'react';
import { ShopView } from '@/components/views/ShopView';
import {
  getInitialProducts,
  getInitialCategories,
} from '@/lib/serverData';

export default function ShopPage() {
  const initialProducts = getInitialProducts('a');
  const initialCategories = getInitialCategories();

  return (
    <Suspense fallback={<div style={{ paddingTop: '140px', textAlign: 'center' }}>Loading Catalog...</div>}>
      <ShopView
        initialProducts={initialProducts}
        initialCategories={initialCategories}
      />
    </Suspense>
  );
}
