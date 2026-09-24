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
  const [statusFilter, setStatusFilter] = useState('all');
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

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.categoryId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.availability === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const groupedProducts = filtered.reduce((acc, p) => {
    const division = p.categoryId.replace('cat_', '');
    if (!acc[division]) acc[division] = [];
    acc[division].push(p);
    return acc;
  }, {} as Record<string, Product[]>);

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

      {/* Controls row */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
            flex: 1,
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
        
        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            backgroundColor: 'var(--admin-surface)',
            color: 'var(--admin-text-primary)',
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--admin-border)',
            fontSize: '0.88rem',
            outline: 'none',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Statuses</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Depleted</option>
        </select>
      </div>

      {/* Products Tables Grouped by Division */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {Object.entries(groupedProducts).map(([division, items]) => (
          <div key={division} className="admin-table-wrapper" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', marginBottom: '16px', textTransform: 'capitalize', paddingBottom: '12px', borderBottom: '1px solid var(--admin-border)' }}>
              {division} Division
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr className="admin-table-header">
                  <th style={{ padding: '14px 16px', width: '40%' }}>Garment</th>
                  <th style={{ padding: '14px 16px', width: '20%' }}>Atelier Price</th>
                  <th style={{ padding: '14px 16px', width: '20%' }}>Variants & Stock</th>
                  <th style={{ padding: '14px 16px', width: '20%' }}>Reserve Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => {
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
        ))}
      </div>
    </div>
  );
}
