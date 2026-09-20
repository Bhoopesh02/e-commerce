'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getProducts } from '@/lib/mockApi';
import { Product } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Package, Search, Plus, Sparkles } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--admin-text-primary)' }}>Loading Atelier Silhouettes...</div>;
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.categoryId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sunset-700)' }}>
            Inventory & Catalog
          </span>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', marginTop: '4px' }}>
            Atelier Silhouettes & Reserve
          </h1>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Plus size={15} />}>
          Draft New Silhouette
        </Button>
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'var(--admin-surface)',
          padding: '10px 18px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--admin-border)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          maxWidth: '420px',
        }}
      >
        <Search size={16} style={{ color: 'var(--admin-text-secondary)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Filter silhouettes by name or division..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            color: 'var(--admin-text-primary)',
            fontSize: '0.88rem',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
          }}
        />
      </div>

      {/* Products Table */}
      <div className="admin-table-wrapper" style={{ padding: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr className="admin-table-header">
              <th style={{ padding: '14px 16px', width: '36%' }}>Garment</th>
              <th style={{ padding: '14px 16px', width: '16%' }}>Division</th>
              <th style={{ padding: '14px 16px', width: '16%' }}>Atelier Price</th>
              <th style={{ padding: '14px 16px', width: '18%' }}>Variants & Stock</th>
              <th style={{ padding: '14px 16px', width: '14%' }}>Reserve Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);

              return (
                <tr key={p.id} className="admin-table-row">
                  <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        position: 'relative',
                        width: '48px',
                        height: '60px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid var(--admin-border)',
                      }}
                    >
                      <Image src={p.images[0]} alt={p.name} fill sizes="48px" style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--admin-text-primary)', display: 'block' }}>{p.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>ID: {p.id}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textTransform: 'capitalize', color: 'var(--admin-text-primary)' }}>
                    {p.categoryId.replace('cat_', '')}
                  </td>
                  <td style={{ padding: '16px', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                    {formatPrice(p.price)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--admin-text-primary)' }}>{totalStock} units</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)', display: 'block' }}>
                      Across {p.variants.length} sizes
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {p.availability === 'in_stock' && <Badge variant="success">In Stock</Badge>}
                    {p.availability === 'low_stock' && <Badge variant="warning">Low Stock</Badge>}
                    {p.availability === 'out_of_stock' && <Badge variant="danger">Depleted</Badge>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
