import { Suspense } from 'react';
import { ShopView, ShopViewSkeleton } from '@/components/views/ShopView';
import {
  getInitialProducts,
  getInitialCategories,
} from '@/lib/serverData';

export default function ShopPage() {
  const initialProducts = getInitialProducts('a');
  const initialCategories = getInitialCategories();

  return (
    <Suspense fallback={<ShopViewSkeleton />}>
      <ShopView
        initialProducts={initialProducts}
        initialCategories={initialCategories}
      />
    </Suspense>
  );
}
