import { Suspense } from 'react';
import { NewArrivalsView } from '@/components/views/NewArrivalsView';
import { getInitialProducts, getInitialCategories } from '@/lib/serverData';

export default function NewArrivalsPage() {
  const initialProducts = getInitialProducts('a');
  const initialCategories = getInitialCategories();

  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', paddingTop: '100px' }}>Loading...</div>}>
      <NewArrivalsView
        initialProducts={initialProducts}
        initialCategories={initialCategories}
      />
    </Suspense>
  );
}
