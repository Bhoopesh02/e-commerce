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

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.categoryId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sunset-400)' }}>
            Inventory & Catalog
          </span>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: '#FFF8F5', marginTop: '4px' }}>
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
          backgroundColor: '#231F42',
          padding: '10px 18px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(232, 188, 185, 0.15)',
          maxWidth: '420px',
        }}
      >
        <Search size={16} style={{ color: 'rgba(232, 188, 185, 0.6)' }} />
        <input
          type="text"
          placeholder="Filter silhouettes by name or division..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', color: '#FFF', fontSize: '0.88rem' }}
        />
      </div>

      {/* Products Table */}
      <div
        style={{
          backgroundColor: '#231F42',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(232, 188, 185, 0.15)',
          padding: '24px',
          overflowX: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(232, 188, 185, 0.2)', color: 'rgba(232, 188, 185, 0.7)' }}>
              <th style={{ padding: '12px' }}>Garment</th>
              <th style={{ padding: '12px' }}>Division</th>
              <th style={{ padding: '12px' }}>Atelier Price</th>
              <th style={{ padding: '12px' }}>Variants & Stock</th>
              <th style={{ padding: '12px' }}>Reserve Status</th>
              <th style={{ padding: '12px' }}>Storefronts</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);

              return (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(232, 188, 185, 0.08)' }}>
                  <td style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ position: 'relative', width: '48px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                      <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: '#FFF', display: 'block' }}>{p.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(232, 188, 185, 0.6)' }}>ID: {p.id}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px', textTransform: 'capitalize' }}>
                    {p.categoryId.replace('cat_', '')}
                  </td>
                  <td style={{ padding: '14px', fontWeight: 600 }}>{formatPrice(p.price)}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ fontWeight: 600 }}>{totalStock} units</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(232, 188, 185, 0.6)', display: 'block' }}>
                      Across {p.variants.length} sizes
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    {p.availability === 'in_stock' && <Badge variant="success">In Stock</Badge>}
                    {p.availability === 'low_stock' && <Badge variant="warning">Low Stock</Badge>}
                    {p.availability === 'out_of_stock' && <Badge variant="danger">Depleted</Badge>}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-sunset-400)', fontWeight: 600 }}>
                      {p.storefronts.join(', ').toUpperCase()}
                    </span>
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
