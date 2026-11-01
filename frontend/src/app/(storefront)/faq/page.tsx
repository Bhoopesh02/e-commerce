import { Metadata } from 'next';
import { FaqView } from '@/components/views/FaqView';

export const metadata: Metadata = {
  title: 'Help Centre & Frequently Asked Questions | Aurelia Atelier',
  description:
    'Comprehensive guidance on bespoke tailoring, European sizing, white-glove delivery, our 7-day return privilege, and fine textile care.',
};

export default async function FaqPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  return (
    <div style={{ paddingTop: 'calc(var(--header-total-height, 113px) + 32px)', paddingBottom: '96px' }}>
      <div className="container">
        <FaqView initialCategory={category || 'all'} />
      </div>
    </div>
  );
}
