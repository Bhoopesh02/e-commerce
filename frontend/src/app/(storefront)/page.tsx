import { HomeView } from '@/components/views/HomeView';
import {
  getInitialProducts,
  getInitialNewArrivals,
  getInitialTrending,
  getInitialCategories,
  getInitialStorefrontConfig,
} from '@/lib/serverData';

export default function HomePage() {
  const storefront = 'a';
  const initialProducts = getInitialProducts(storefront);
  const initialNewArrivals = getInitialNewArrivals(storefront);
  const initialTrending = getInitialTrending(storefront);
  const initialCategories = getInitialCategories();
  const initialConfig = getInitialStorefrontConfig(storefront);

  return (
    <HomeView
      initialProducts={initialProducts}
      initialNewArrivals={initialNewArrivals}
      initialTrending={initialTrending}
      initialCategories={initialCategories}
      initialConfig={initialConfig}
    />
  );
}
