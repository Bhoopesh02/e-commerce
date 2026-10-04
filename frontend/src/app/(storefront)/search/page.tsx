import { Suspense } from 'react';
import { SearchView } from '@/components/views/SearchView';

export const metadata = {
  title: 'Search | Aurelia',
  description: 'Search for luxury products on Aurelia.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: '140px', textAlign: 'center' }}>Loading Search...</div>}>
      <SearchView />
    </Suspense>
  );
}
