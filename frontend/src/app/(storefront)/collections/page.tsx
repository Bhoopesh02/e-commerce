import { Metadata } from 'next';
import { CollectionsView } from '@/components/views/CollectionsView';
import { getInitialProducts, getInitialCategories } from '@/lib/serverData';

export const metadata: Metadata = {
  title: 'All Collections | AURELIA Luxury Atelier',
  description:
    'Explore the complete universe of Aurelia collections: Men, Women, Tailoring, Outerwear, Knitwear, Leather Goods, and Fine Jewelry.',
};

export default function CollectionsIndexPage() {
  const initialProducts = getInitialProducts('a');
  const initialCategories = getInitialCategories();

  return (
    <CollectionsView
      initialProducts={initialProducts}
      initialCategories={initialCategories}
    />
  );
}
