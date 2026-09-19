import { ProductDetailView } from '@/components/views/ProductDetailView';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailView slug={slug} />;
}
