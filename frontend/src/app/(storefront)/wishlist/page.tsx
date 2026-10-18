import { WishlistView } from '@/components/views/WishlistView';
import { getAllInitialProducts } from '@/lib/serverData';

export default function WishlistPage() {
  const allProducts = getAllInitialProducts();
  return <WishlistView initialAllProducts={allProducts} />;
}
