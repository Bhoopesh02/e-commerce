'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProducts, adminDeleteProduct } from '@/lib/mockApi';
import { Product } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Package, Search, Plus, Sparkles, Filter, ChevronDown, Check, Edit2, Trash2 } from 'lucide-react';

function AdminProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState(initialCategory !== 'all' ? initialCategory : 'all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'categories' | 'statuses'>('categories');
  const [categorySearch, setCategorySearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const filterRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setFilterValue(searchParams.get('category') || 'all');
  }, [searchParams]);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterValue]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this silhouette?')) {
      try {
        const success = await adminDeleteProduct(id);
        if (success) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
          alert('Silhouette deleted temporarily.');
        } else {
          alert('Failed to delete silhouette.');
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--admin-text-primary)' }}>Loading Atelier Silhouettes...</div>;
  }

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(q) ||
                          p.categoryId.toLowerCase().includes(q) ||
                          p.id.toLowerCase().includes(q) ||
                          (p.description || '').toLowerCase().includes(q);
                          
    let matchesFilter = true;
    if (filterValue !== 'all') {
      if (['in_stock', 'low_stock', 'out_of_stock'].includes(filterValue)) {
        matchesFilter = p.availability === filterValue;
      } else {
        matchesFilter = p.categoryId === filterValue;
      }
    }
    
    return matchesSearch && matchesFilter;
  });

  const categories = Array.from(new Set(products.map(p => p.categoryId)));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sapphire)' }}>
            Inventory & Catalog
          </span>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', marginTop: '4px' }}>
            Atelier Silhouettes & Reserve
          </h1>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Plus size={15} />} onClick={() => router.push('/admin/products/new')}>
          Draft New Silhouette
        </Button>
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
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
        
        {/* Custom Filter Dropdown */}
        <div style={{ position: 'relative' }} ref={filterRef}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{ height: '40px' }}
            leftIcon={<Filter size={16} />}
            rightIcon={<ChevronDown size={16} style={{ opacity: 0.7 }} />}
          >
            {filterValue === 'all' ? 'Filter' : 
             ['in_stock', 'low_stock', 'out_of_stock'].includes(filterValue) ? 
             filterValue === 'in_stock' ? 'In Stock' : filterValue === 'low_stock' ? 'Low Stock' : 'Depleted'
             : filterValue.replace('cat_', '').charAt(0).toUpperCase() + filterValue.replace('cat_', '').slice(1)}
          </Button>
          
          {isFilterOpen && (
            <div style={{ 
              position: 'absolute', 
              top: '100%', 
              right: 0, 
              marginTop: '8px',
              backgroundColor: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              width: '280px',
              zIndex: 50,
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--admin-border)' }}>
                <button 
                  onClick={() => setFilterTab('categories')}
                  style={{ 
                    flex: 1, 
                    padding: '12px 10px', 
                    background: filterTab === 'categories' ? 'var(--admin-background)' : 'transparent', 
                    border: 'none', 
                    borderBottom: filterTab === 'categories' ? '2px solid var(--color-sapphire)' : '2px solid transparent', 
                    color: filterTab === 'categories' ? 'var(--color-sapphire)' : 'var(--admin-text-secondary)', 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Categories
                </button>
                <button 
                  onClick={() => setFilterTab('statuses')}
                  style={{ 
                    flex: 1, 
                    padding: '12px 10px', 
                    background: filterTab === 'statuses' ? 'var(--admin-background)' : 'transparent', 
                    border: 'none', 
                    borderBottom: filterTab === 'statuses' ? '2px solid var(--color-sapphire)' : '2px solid transparent', 
                    color: filterTab === 'statuses' ? 'var(--color-sapphire)' : 'var(--admin-text-secondary)', 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Statuses
                </button>
              </div>
              
              <div style={{ padding: '12px', backgroundColor: 'var(--admin-surface)' }}>
                {filterTab === 'categories' && (
                  <>
                    <div style={{ marginBottom: '12px', position: 'relative' }}>
                      <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-secondary)' }} />
                      <input 
                        type="text" 
                        placeholder="Search categories..." 
                        value={categorySearch}
                        onChange={e => setCategorySearch(e.target.value)}
                        style={{ 
                          width: '100%', 
                          padding: '8px 10px 8px 32px', 
                          fontSize: '0.85rem', 
                          borderRadius: 'var(--radius-sm)', 
                          border: '1px solid var(--admin-border)', 
                          backgroundColor: 'var(--admin-background)', 
                          color: 'var(--admin-text-primary)', 
                          outline: 'none' 
                        }}
                      />
                    </div>
                    <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button
                        onClick={() => { setFilterValue('all'); setIsFilterOpen(false); }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          padding: '10px 12px', 
                          borderRadius: 'var(--radius-sm)', 
                          border: 'none', 
                          backgroundColor: filterValue === 'all' ? 'var(--admin-background)' : 'transparent', 
                          color: 'var(--admin-text-primary)', 
                          cursor: 'pointer', 
                          textAlign: 'left', 
                          fontSize: '0.85rem' 
                        }}
                      >
                        All Categories
                        {filterValue === 'all' && <Check size={16} style={{ color: 'var(--color-sapphire)' }} />}
                      </button>
                      {categories.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase())).map(cat => (
                        <button
                          key={cat}
                          onClick={() => { setFilterValue(cat); setIsFilterOpen(false); }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            padding: '10px 12px', 
                            borderRadius: 'var(--radius-sm)', 
                            border: 'none', 
                            backgroundColor: filterValue === cat ? 'var(--admin-background)' : 'transparent', 
                            color: 'var(--admin-text-primary)', 
                            cursor: 'pointer', 
                            textAlign: 'left', 
                            fontSize: '0.85rem' 
                          }}
                        >
                          {cat.replace('cat_', '').charAt(0).toUpperCase() + cat.replace('cat_', '').slice(1)}
                          {filterValue === cat && <Check size={16} style={{ color: 'var(--color-sapphire)' }} />}
                        </button>
                      ))}
                      {categories.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase())).length === 0 && (
                        <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--admin-text-secondary)', fontSize: '0.85rem' }}>
                          No categories found.
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {filterTab === 'statuses' && (
                  <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                     <button
                        onClick={() => { setFilterValue('all'); setIsFilterOpen(false); }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          padding: '10px 12px', 
                          borderRadius: 'var(--radius-sm)', 
                          border: 'none', 
                          backgroundColor: filterValue === 'all' ? 'var(--admin-background)' : 'transparent', 
                          color: 'var(--admin-text-primary)', 
                          cursor: 'pointer', 
                          textAlign: 'left', 
                          fontSize: '0.85rem' 
                        }}
                      >
                        All Statuses
                        {filterValue === 'all' && <Check size={16} style={{ color: 'var(--color-sapphire)' }} />}
                      </button>
                    {[
                      { id: 'in_stock', label: 'In Stock' },
                      { id: 'low_stock', label: 'Low Stock' },
                      { id: 'out_of_stock', label: 'Depleted' }
                    ].map(status => (
                      <button
                        key={status.id}
                        onClick={() => { setFilterValue(status.id); setIsFilterOpen(false); }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          padding: '10px 12px', 
                          borderRadius: 'var(--radius-sm)', 
                          border: 'none', 
                          backgroundColor: filterValue === status.id ? 'var(--admin-background)' : 'transparent', 
                          color: 'var(--admin-text-primary)', 
                          cursor: 'pointer', 
                          textAlign: 'left', 
                          fontSize: '0.85rem' 
                        }}
                      >
                        {status.label}
                        {filterValue === status.id && <Check size={16} style={{ color: 'var(--color-sapphire)' }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-table-wrapper" style={{ padding: '24px', overflowX: 'auto' }}>
        <div style={{ minWidth: '700px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr className="admin-table-header">
                <th style={{ padding: '14px 16px', width: '35%' }}>Garment</th>
                <th style={{ padding: '14px 16px', width: '15%' }}>Atelier Price</th>
                <th style={{ padding: '14px 16px', width: '20%' }}>Variants & Stock</th>
                <th style={{ padding: '14px 16px', width: '15%' }}>Reserve Status</th>
                <th style={{ padding: '14px 16px', width: '15%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p) => {
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
                        <Image src={p.images[0] || '/images/hero/hero-refined.webp'} alt={p.name} fill sizes="48px" style={{ objectFit: 'cover' }} unoptimized />
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
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/products/${p.id}/edit`)}
                          style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-secondary)' }}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                          style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-error)' }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
                    No silhouettes found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px', alignItems: 'center' }}>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span style={{ fontSize: '0.88rem', color: 'var(--admin-text-primary)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <React.Suspense fallback={<div style={{ padding: '40px', color: 'var(--admin-text-primary)' }}>Loading Atelier Silhouettes...</div>}>
      <AdminProductsPageContent />
    </React.Suspense>
  );
}
