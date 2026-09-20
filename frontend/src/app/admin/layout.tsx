import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { ToastContainer } from '@/components/ui/Toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-admin="true" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--admin-canvas)', color: 'var(--admin-text-primary)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <AdminTopbar />
        <main style={{ flex: 1, padding: '32px' }}>{children}</main>
        <ToastContainer />
      </div>
    </div>
  );
}
