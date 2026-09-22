import { Metadata } from 'next';
import { AuthView } from '@/components/views/AuthView';

export const metadata: Metadata = {
  title: 'Sign In | ATELIER',
  description: 'Access your private client profile, saved orders, and personalized privileges.',
};

export default function SignInPage() {
  return <AuthView initialMode="login" />;
}
