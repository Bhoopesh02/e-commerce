'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts, getCategories } from '@/lib/mockApi';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';

export const ShopView: React.FC = () => {
  const searchParams = useSearchParams();
  const { storefront } = useStorefrontStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('categorySlug') || 'all'
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('popularity');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          getProducts({ storefront }),
          getCategories(),
        ]);
        if (isMounted) {
          setProducts(prods);
          setCategories(cats);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [storefront]);

  // Client-side filtering and sorting
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category: URL param takes precedence (supports navigation); clicking pills updates selectedCategory state
    const urlCatSlug = searchParams.get('categorySlug');
    const effectiveCat = urlCatSlug || selectedCategory;

    if (effectiveCat !== 'all') {
      const catObj = categories.find((c) => c.slug === effectiveCat);
      if (catObj) {
        list = list.filter((p) => p.categoryId === catObj.id);
      }
    }

    // Tag filter from URL — derived inside memo so it stays reactive
    const urlTag = searchParams.get('tag');
    if (urlTag) {
      list = list.filter((p) => p.tags.includes(urlTag));
    }

    // Price range
    if (selectedPriceRange === 'under-20k') {
      list = list.filter((p) => p.price < 20000);
    } else if (selectedPriceRange === '20k-35k') {
      list = list.filter((p) => p.price >= 20000 && p.price <= 35000);
    } else if (selectedPriceRange === 'above-35k') {
      list = list.filter((p) => p.price > 35000);
    }

    // Availability
    if (selectedAvailability === 'in_stock') {
      list = list.filter((p) => p.availability !== 'out_of_stock');
    }

    // Sorting
    switch (selectedSort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating.average - a.rating.average);
        break;
      case 'newest':
        list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'popularity':
      default:
        list.sort((a, b) => b.rating.count - a.rating.count);
        break;
    }

    return list;
  }, [products, categories, selectedCategory, searchParams, selectedPriceRange, selectedAvailability, selectedSort]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSelectedAvailability('all');
    setSelectedSort('popularity');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedPriceRange !== 'all' ||
    selectedAvailability !== 'all';

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '96px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Header Banner */}
        <div style={{ padding: '36px 0 44px', borderBottom: '1px solid var(--border-light)', marginBottom: '40px' }}>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', marginBottom: '12px' }}>
            {selectedCategory === 'all'
              ? 'Complete Collection'
              : categories.find((c) => c.slug === selectedCategory)?.name || 'Wardrobe Division'}
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', lineHeight: 1.6 }}>
            {selectedCategory === 'all'
              ? 'Explore our full editorial portfolio of outerwear, Italian tailoring, cashmere knitwear, and artisanal accessories.'
              : categories.find((c) => c.slug === selectedCategory)?.description}
          </p>
        </div>

        {/* Filter Bar & Sort Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {/* Desktop Category Pills */}
          <div
            style={{
              display: 'none',
              flexWrap: 'wrap',
              gap: '8px',
            }}
            className="desktop-category-pills"
          >
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-editorial)',
                backgroundColor: selectedCategory === 'all' ? 'var(--color-sunset-900)' : 'transparent',
                color: selectedCategory === 'all' ? '#FFF' : 'var(--text-secondary)',
                border: `1px solid ${selectedCategory === 'all' ? 'var(--color-sunset-900)' : 'var(--border-color)'}`,
              }}
            >
              All Disciplines
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-editorial)',
                  backgroundColor: selectedCategory === cat.slug ? 'var(--color-sunset-900)' : 'transparent',
                  color: selectedCategory === cat.slug ? '#FFF' : 'var(--text-secondary)',
                  border: `1px solid ${selectedCategory === cat.slug ? 'var(--color-sunset-900)' : 'var(--border-color)'}`,
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Mobile Filter Trigger Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: 'var(--bg-surface)',
            }}
            className="mobile-filter-btn"
          >
            <SlidersHorizontal size={15} />
            <span>Filter & Sort {hasActiveFilters && '•'}</span>
          </button>

          {/* Right: Sort Dropdown & Product Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {filteredProducts.length} Silhouettes
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="sort-select" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Sort:
              </label>
              <select
                id="sort-select"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                <option value="popularity">House Popularity</option>
                <option value="newest">Newest Editions</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Client Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active Filters:</span>
            {selectedCategory !== 'all' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.78rem',
                }}
              >
                Category: {categories.find((c) => c.slug === selectedCategory)?.name}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('all')} />
              </span>
            )}
            {selectedPriceRange !== 'all' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.78rem',
                }}
              >
                Price: {selectedPriceRange}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedPriceRange('all')} />
              </span>
            )}
            {selectedAvailability !== 'all' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.78rem',
                }}
              >
                In Stock Only
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedAvailability('all')} />
              </span>
            )}
            <button
              onClick={resetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                color: 'var(--color-sunset-600)',
                cursor: 'pointer',
                marginLeft: '4px',
              }}
            >
              <RotateCcw size={12} /> Reset all
            </button>
          </div>
        )}

        {/* Product Catalog Grid */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '32px',
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton height="380px" borderRadius="var(--radius-sm)" />
                <div style={{ marginTop: '12px' }}>
                  <Skeleton height="20px" width="70%" />
                  <Skeleton height="16px" width="40%" style={{ marginTop: '6px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '36px',
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 24px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
              No Silhouettes Found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              We could not find any garments matching your active filter criteria.
            </p>
            <Button variant="primary" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Filters Drawer / Bottom Sheet */}
      <Drawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Refine Collection"
        position="right"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Category
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="cat"
                  checked={selectedCategory === 'all'}
                  onChange={() => setSelectedCategory('all')}
                />
                All Categories
              </label>
              {categories.map((c) => (
                <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                  <input
                    type="radio"
                    name="cat"
                    checked={selectedCategory === c.slug}
                    onChange={() => setSelectedCategory(c.slug)}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Price Range
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange === 'all'}
                  onChange={() => setSelectedPriceRange('all')}
                />
                All Values
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange === 'under-20k'}
                  onChange={() => setSelectedPriceRange('under-20k')}
                />
                Under ₹20,000
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange === '20k-35k'}
                  onChange={() => setSelectedPriceRange('20k-35k')}
                />
                ₹20,000 - ₹35,000
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange === 'above-35k'}
                  onChange={() => setSelectedPriceRange('above-35k')}
                />
                Above ₹35,000
              </label>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Availability
            </h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={selectedAvailability === 'in_stock'}
                onChange={(e) => setSelectedAvailability(e.target.checked ? 'in_stock' : 'all')}
              />
              In Stock Pieces Only
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '20px' }}>
            <Button variant="outline" fullWidth onClick={resetFilters}>
              Reset
            </Button>
            <Button variant="primary" fullWidth onClick={() => setMobileFiltersOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Drawer>

      <style jsx global>{`
        @media (min-width: 900px) {
          .desktop-category-pills {
            display: flex !important;
          }
          .mobile-filter-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
