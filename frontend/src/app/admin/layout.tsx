import React, { Suspense } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { ToastContainer } from '@/components/ui/Toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-admin="true" className="admin-layout">
      <Suspense fallback={<div className="admin-sidebar" style={{ minHeight: '100vh' }}></div>}>
        <AdminSidebar />
      </Suspense>
      <div className="admin-main">
        <AdminTopbar />
        <main className="admin-main-content">{children}</main>
        <ToastContainer />
      </div>
    </div>
  );
}
