import { ProductDetailView } from '@/components/views/ProductDetailView';
import {
  getInitialProductBySlug,
  getInitialReviews,
  getAllInitialProducts,
} from '@/lib/serverData';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = getInitialProductBySlug(slug);
  const allProducts = getAllInitialProducts();
  const reviews = product ? getInitialReviews(product.id) : [];

  return (
    <ProductDetailView
      slug={slug}
      initialProduct={product}
      initialReviews={reviews}
      initialAllProducts={allProducts}
    />
  );
}
