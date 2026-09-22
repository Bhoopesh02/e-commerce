import { Metadata } from 'next';
import { AuthView } from '@/components/views/AuthView';

export const metadata: Metadata = {
  title: 'Sign Up | ATELIER',
  description: 'Create your private client profile with our atelier for tailored privileges.',
};

export default function SignUpPage() {
  return <AuthView initialMode="register" />;
}
