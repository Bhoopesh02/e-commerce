/**
 * Server-side data accessors for React Server Components.
 * These read the raw JSON imports synchronously — no simulated delay,
 * no localStorage, no browser APIs. Used to pre-populate initial data
 * at the page level so the first paint already has content (no skeleton).
 */
import { Product, Category, Review, StorefrontConfig, StorefrontId } from '@/types';

import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import reviewsData from '@/data/reviews.json';
import storefrontConfigData from '@/data/storefrontConfig.json';

const products = productsData as Product[];
const categories = categoriesData as Category[];
const reviews = reviewsData as Review[];

export function getInitialProducts(storefront: StorefrontId = 'a'): Product[] {
  return products.filter((p) => p.storefronts.includes(storefront));
}

export function getInitialNewArrivals(storefront: StorefrontId = 'a'): Product[] {
  return products.filter(
    (p) => p.storefronts.includes(storefront) && p.isNewArrival,
  );
}

export function getInitialTrending(storefront: StorefrontId = 'a'): Product[] {
  return products.filter(
    (p) => p.storefronts.includes(storefront) && p.isTrending,
  );
}

export function getInitialCategories(): Category[] {
  return categories.filter((c) => c.visible);
}

export function getInitialStorefrontConfig(
  storefront: StorefrontId = 'a',
): StorefrontConfig {
  const configs = storefrontConfigData as Record<string, StorefrontConfig>;
  return configs[storefront] || configs['a'];
}

export function getInitialProductBySlug(slug: string): Product | null {
  return products.find((p) => p.slug === slug) ?? null;
}

export function getInitialReviews(productId: string): Review[] {
  return reviews.filter(
    (r) => r.productId === productId && r.status === 'published',
  );
}

export function getAllInitialProducts(): Product[] {
  return products;
}
