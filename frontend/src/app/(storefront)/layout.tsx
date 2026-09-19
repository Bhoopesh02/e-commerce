import React from 'react';
import { StorefrontLayoutWrapper } from '@/components/layout/StorefrontLayoutWrapper';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StorefrontLayoutWrapper>{children}</StorefrontLayoutWrapper>;
}
