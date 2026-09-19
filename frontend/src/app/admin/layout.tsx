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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1A1733', color: '#FFF8F5' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <AdminTopbar />
        <main style={{ flex: 1, padding: '32px' }}>{children}</main>
        <ToastContainer />
      </div>
    </div>
  );
}
