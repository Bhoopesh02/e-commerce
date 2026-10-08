import { Suspense } from 'react';
import { NewArrivalsView } from '@/components/views/NewArrivalsView';

export default function NewArrivalsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', paddingTop: '100px' }}>Loading...</div>}>
      <NewArrivalsView />
    </Suspense>
  );
}
