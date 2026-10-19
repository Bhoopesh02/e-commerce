import { Suspense } from 'react';
import { SearchView } from '@/components/views/SearchView';
import { getInitialProducts, getInitialCategories, getInitialNewArrivals } from '@/lib/serverData';
import { ProductGridSkeleton } from '@/components/product/ProductCard';

export const metadata = {
  title: 'Search | Aurelia',
  description: 'Search for luxury products on Aurelia.',
};

export default function SearchPage() {
  const initialProducts = getInitialProducts('a');
  const initialCategories = getInitialCategories();
  const initialCuratedFallback = getInitialNewArrivals('a').slice(0, 4);

  return (
    <Suspense fallback={<div style={{ paddingTop: 'calc(var(--header-total-height, 113px) + 24px)', textAlign: 'center' }}><ProductGridSkeleton count={8} /></div>}>
      <SearchView
        initialProducts={initialProducts}
        initialCategories={initialCategories}
        initialCuratedFallback={initialCuratedFallback}
      />
    </Suspense>
  );
}

