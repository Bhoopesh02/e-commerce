import { NewArrivalsView } from '@/components/views/NewArrivalsView';
import { getInitialProducts, getInitialCategories } from '@/lib/serverData';

export default function NewArrivalsPage() {
  const initialProducts = getInitialProducts('a');
  const initialCategories = getInitialCategories();

  return (
    <NewArrivalsView
      initialProducts={initialProducts}
      initialCategories={initialCategories}
    />
  );
}
