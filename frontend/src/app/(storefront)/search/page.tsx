import { Suspense } from 'react';
import { SearchView } from '@/components/views/SearchView';
import { getInitialProducts, getInitialCategories } from '@/lib/serverData';
import { ProductGridSkeleton } from '@/components/product/ProductCard';

export const metadata = {
  title: 'Search | Aurelia',
  description: 'Search for luxury products on Aurelia.',
};

export default function SearchPage() {
  const initialProducts = getInitialProducts('a');
  const initialCategories = getInitialCategories();

  return (
    <Suspense fallback={<div style={{ paddingTop: '140px', textAlign: 'center' }}><ProductGridSkeleton count={8} /></div>}>
      <SearchView initialProducts={initialProducts} initialCategories={initialCategories} />
    </Suspense>
  );
}

