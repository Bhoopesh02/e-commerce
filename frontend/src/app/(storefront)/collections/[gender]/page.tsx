import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ShopView, ShopViewSkeleton } from '@/components/views/ShopView';
import { getInitialProducts, getInitialCategories } from '@/lib/serverData';
import { GENDER_COLLECTIONS } from '@/data/genderCollections';

interface PageProps {
  params: Promise<{
    gender: string;
  }>;
}

export function generateStaticParams() {
  return [{ gender: 'men' }, { gender: 'women' }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gender } = await params;
  if (gender !== 'men' && gender !== 'women') {
    return { title: 'Collection Not Found' };
  }

  const config = GENDER_COLLECTIONS[gender];
  return {
    title: `${gender === 'men' ? "Men's" : "Women's"} Collection | AURELIA`,
    description: config.subtitle,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { gender } = await params;

  if (gender !== 'men' && gender !== 'women') {
    notFound();
  }

  const initialProducts = getInitialProducts('a');
  const initialCategories = getInitialCategories();

  return (
    <Suspense fallback={<ShopViewSkeleton />}>
      <ShopView
        initialProducts={initialProducts}
        initialCategories={initialCategories}
        gender={gender as 'men' | 'women'}
      />
    </Suspense>
  );
}
