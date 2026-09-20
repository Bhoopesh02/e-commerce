'use client';

import React, { useState } from 'react';
import { adminExportReport, triggerCsvDownload } from '@/lib/mockApi';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/store/useToastStore';
import { Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState<'orders' | 'inventory' | 'sales' | 'customers'>('orders');
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToastStore();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const csv = await adminExportReport(reportType);
      triggerCsvDownload(csv, `aurelia_${reportType}_report_${new Date().toISOString().split('T')[0]}`);
      showToast(`Exported ${reportType.toUpperCase()} dataset to CSV.`, 'success');
    } catch {
      showToast('Export failed.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '800px' }}>
      <div>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C0703B' }}>
          Analytics & Data Export
        </span>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#0F2042', marginTop: '4px' }}>
          Atelier Reports & CSV Export
        </h1>
      </div>

      <div
        style={{
          backgroundColor: '#231F42',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(232, 188, 185, 0.15)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#FFF', marginBottom: '12px' }}>
            Select Dataset to Export
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { id: 'orders', label: 'Commissions & Fulfillment Log' },
              { id: 'inventory', label: 'Silhouette Reserves & Variant Stock' },
              { id: 'sales', label: 'Revenue & Tax Settlements' },
              { id: 'customers', label: 'Private Client Roster' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setReportType(item.id as 'orders' | 'inventory' | 'sales' | 'customers')}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: reportType === item.id ? 'rgba(243, 159, 90, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: reportType === item.id ? '2px solid var(--color-sunset-400)' : '1px solid rgba(232, 188, 185, 0.15)',
                  color: reportType === item.id ? '#FFF' : 'rgba(232, 188, 185, 0.75)',
                  textAlign: 'left',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <FileSpreadsheet size={18} style={{ color: reportType === item.id ? 'var(--color-sunset-400)' : 'inherit' }} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(232, 188, 185, 0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="primary"
            size="lg"
            isLoading={isExporting}
            onClick={handleExport}
            leftIcon={<Download size={16} />}
          >
            Download CSV Report
          </Button>
        </div>
      </div>
    </div>
  );
}
