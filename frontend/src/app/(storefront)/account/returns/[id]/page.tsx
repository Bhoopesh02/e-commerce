import { ReturnDetailView } from '@/components/views/ReturnDetailView';

export default async function ReturnDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReturnDetailView returnId={id} />;
}
