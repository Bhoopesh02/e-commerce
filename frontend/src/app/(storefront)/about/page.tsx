import { Metadata } from 'next';
import { AboutView } from '@/components/views/AboutView';
import { BRAND_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `About Us | ${BRAND_NAME} Atelier`,
  description:
    'The House of Aurelia — Haute Couture & Ready-to-Wear Atelier. Discover our house philosophy, the dressing ritual, and uncompromising dedication to noble natural fibers and sculptural tailoring.',
};

export default function AboutPage() {
  return <AboutView />;
}
