'use client';

import React, { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getProducts, getCategories } from '@/lib/mockApi';
import { Product, Category } from '@/types';
import { ProductCard, ProductGridSkeleton } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { smoothScrollService } from '@/services/smooth-scroll';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Search,
  X,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  ArrowUp,
} from 'lucide-react';

const PRODUCTS_PER_PAGE = 36;

// Helper to group complex color names into selectable swatches
const COLOR_GROUPS = [
  { name: 'Black', hex: '#1A1A1A', matches: ['Black', 'Noir', 'Abyss', 'Nocturne'] },
  { name: 'Navy', hex: '#1B2431', matches: ['Navy'] },
  { name: 'Burgundy', hex: '#4A1C20', matches: ['Burgundy', 'Aubergine'] },
  { name: 'Brown', hex: '#4A3728', matches: ['Brown', 'Cognac', 'Espresso', 'Chocolate', 'Havana'] },
  { name: 'Camel / Beige', hex: '#C19A6B', matches: ['Camel', 'Sand', 'Tan', 'Khaki', 'Oatmeal', 'Vicuna', 'Taupe'] },
  { name: 'Ivory / White', hex: '#F8F5F0', matches: ['Ivory', 'Ecru', 'Alabaster', 'Milk', 'Pearl', 'White'] },
  { name: 'Green', hex: '#2E4C38', matches: ['Emerald', 'Forest', 'Sage'] },
  { name: 'Grey', hex: '#4B4B4B', matches: ['Charcoal'] },
  { name: 'Gold', hex: '#D4AF37', matches: ['Gold', 'Bronze'] },
];

const COLLECTIONS = [
  { id: 'new-arrival', label: 'New Arrivals' },
  { id: 'signature', label: 'Signature' },
  { id: 'bestseller', label: 'Bestsellers' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'essential', label: 'Essentials' },
];

const PRICE_PRESETS: { id: string; label: string; range: [number, number] }[] = [
  { id: 'all', label: 'All Price Tiers', range: [0, 100000] },
  { id: 'under-20k', label: 'Under ₹20,000', range: [0, 20000] },
  { id: '20k-35k', label: '₹20,000 - ₹35,000', range: [20000, 35000] },
  { id: 'above-35k', label: 'Above ₹35,000', range: [35000, 100000] },
];

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
];

// Reusable hook for detecting click outside
function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export interface SearchViewProps {
  initialProducts?: Product[];
  initialCategories?: Category[];
}

function SearchContent({ initialProducts = [], initialCategories = [] }: SearchViewProps) {
  const shouldReduceMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialQuery = searchParams.get('q') || '';
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(initialProducts.length > 0 || !!initialQuery);

  // Active Applied Filters
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeCollection, setActiveCollection] = useState<string>('all');
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([0, 100000]);
  const [appliedAvailability, setAppliedAvailability] = useState<'all' | 'in_stock'>('all');
  const [selectedSort, setSelectedSort] = useState<string>('recommended');

  // Staged Filter State for Drawer
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [stagedCategory, setStagedCategory] = useState<string>('all');
  const [stagedCollection, setStagedCollection] = useState<string>('all');
  const [stagedSizes, setStagedSizes] = useState<string[]>([]);
  const [stagedColors, setStagedColors] = useState<string[]>([]);
  const [stagedPriceRange, setStagedPriceRange] = useState<[number, number]>([0, 100000]);
  const [stagedAvailability, setStagedAvailability] = useState<'all' | 'in_stock'>('all');

  // Sticky Bar & Sort Popover
  const [isStuck, setIsStuck] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const stickyBarRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(sortRef, () => setSortOpen(false));

  const priceMilestones = useMemo(
    () => [
      { value: 0, label: '₹0' },
      { value: 20000, label: '₹20K' },
      { value: 35000, label: '₹35K' },
      { value: 100000, label: '₹100K+' },
    ],
    []
  );

  // Sticky Filter Bar Sentinel IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasSearched]);

  // Extract all available sizes from fetched products
  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((p) =>
      p.variants.forEach((v) => {
        if (v.size && v.size !== 'undefined') sizes.add(v.size);
      })
    );

    const sizeArray = Array.from(sizes);
    const order = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];
    return sizeArray.sort((a, b) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [products]);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      if (initialCategories.length > 0) return;
      const cats = await getCategories();
      if (isMounted) setCategories(cats);
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, [initialCategories]);

  async function performSearch(searchQuery: string) {
    if (!searchQuery && initialProducts.length > 0) {
      setProducts(initialProducts);
      setHasSearched(true);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const results = await getProducts({ searchQuery });
      setProducts(results);
    } finally {
      setLoading(false);
    }
  }

  // Parse URL params into state
  useEffect(() => {
    setQuery(initialQuery);
    performSearch(initialQuery);

    const cats = searchParams.get('category');
    const cols = searchParams.get('collection');
    const szs = searchParams.get('size');
    const clrs = searchParams.get('color');
    const priceParam = searchParams.get('price');
    const availParam = searchParams.get('availability');
    const sortParam = searchParams.get('sort');

    const catValue = cats || 'all';
    setActiveCategory(catValue);
    setStagedCategory(catValue);

    const colValue = cols || 'all';
    setActiveCollection(colValue);
    setStagedCollection(colValue);

    const parsedSizes = szs ? szs.split(',').filter(Boolean) : [];
    setActiveSizes(parsedSizes);
    setStagedSizes(parsedSizes);

    const parsedColors = clrs ? clrs.split(',').filter(Boolean) : [];
    setActiveColors(parsedColors);
    setStagedColors(parsedColors);

    let initialPriceRange: [number, number] = [0, 100000];
    if (priceParam) {
      const parts = priceParam.split('-');
      if (parts.length === 2) {
        const min = parseInt(parts[0], 10);
        const max = parseInt(parts[1], 10);
        if (!isNaN(min) && !isNaN(max)) {
          initialPriceRange = [min, max];
        }
      } else {
        const matchedPreset = PRICE_PRESETS.find((p) => p.id === priceParam);
        if (matchedPreset) {
          initialPriceRange = matchedPreset.range;
        }
      }
    }
    setAppliedPriceRange(initialPriceRange);
    setStagedPriceRange(initialPriceRange);

    const availValue = availParam === 'in_stock' ? 'in_stock' : 'all';
    setAppliedAvailability(availValue);
    setStagedAvailability(availValue);

    setSelectedSort(sortParam || 'recommended');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateUrl = (updates: Record<string, string | null>, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString());
    if (resetPage && !('page' in updates)) {
      params.delete('page');
    }
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage > 1 ? String(newPage) : null }, false);
    smoothScrollService.scrollTo(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setActiveCategory('all');
    setActiveCollection('all');
    setActiveSizes([]);
    setActiveColors([]);
    setAppliedPriceRange([0, 100000]);
    setAppliedAvailability('all');

    setStagedCategory('all');
    setStagedCollection('all');
    setStagedSizes([]);
    setStagedColors([]);
    setStagedPriceRange([0, 100000]);
    setStagedAvailability('all');

    updateUrl({
      category: null,
      collection: null,
      size: null,
      color: null,
      price: null,
      availability: null,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      activeCategory !== 'all' ||
      activeCollection !== 'all' ||
      activeSizes.length > 0 ||
      activeColors.length > 0 ||
      appliedPriceRange[0] > 0 ||
      appliedPriceRange[1] < 100000 ||
      appliedAvailability !== 'all'
    );
  }, [
    activeCategory,
    activeCollection,
    activeSizes,
    activeColors,
    appliedPriceRange,
    appliedAvailability,
  ]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'all') {
      list = list.filter((p) => {
        const cat = categories.find((c) => c.id === p.categoryId);
        return cat && cat.slug === activeCategory;
      });
    }

    if (activeCollection !== 'all') {
      list = list.filter((p) => p.tags.includes(activeCollection));
    }

    if (activeSizes.length > 0) {
      list = list.filter((p) =>
        p.variants.some((v) => v.stock > 0 && activeSizes.includes(v.size))
      );
    }

    if (activeColors.length > 0) {
      list = list.filter((p) => {
        return p.variants.some((v) => {
          const matchedGroup = COLOR_GROUPS.find((g) => activeColors.includes(g.name));
          if (!matchedGroup) return false;
          return matchedGroup.matches.some((m) =>
            v.color.toLowerCase().includes(m.toLowerCase())
          );
        });
      });
    }

    if (appliedPriceRange[0] > 0 || appliedPriceRange[1] < 100000) {
      list = list.filter(
        (p) => p.price >= appliedPriceRange[0] && p.price <= appliedPriceRange[1]
      );
    }

    if (appliedAvailability === 'in_stock') {
      list = list.filter((p) => p.variants.some((v) => v.stock > 0));
    }

    switch (selectedSort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'recommended':
      default:
        list.sort((a, b) => {
          if (b.rating.count !== a.rating.count) {
            return b.rating.count - a.rating.count;
          }
          return b.rating.average - a.rating.average;
        });
        break;
    }

    return list;
  }, [
    products,
    categories,
    activeCategory,
    activeCollection,
    activeSizes,
    activeColors,
    appliedPriceRange,
    appliedAvailability,
    selectedSort,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      updateUrl({ page: totalPages > 1 ? String(totalPages) : null }, false);
    }
  }, [totalPages, currentPage]);

  const getVisiblePageNumbers = (current: number, total: number): (number | string)[] => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const chipStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 10px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--border-color)',
    fontSize: '0.78rem',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
  };

  return (
    <div className="search-page-root" style={{ paddingTop: '100px', paddingBottom: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 767px) {
          .search-page-root {
            padding-top: 80px !important;
            padding-bottom: 80px !important;
          }
          .search-page-container {
            padding-left: 14px !important;
            padding-right: 14px !important;
          }
          .search-input-wrapper {
            margin-bottom: 24px !important;
          }
        }
      `}} />

      <div className="container search-page-container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
        {/* Search Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--brand-primary)', fontWeight: 600, marginBottom: '12px' }}>
            SEARCH
          </h1>
          {initialQuery && (
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontWeight: 400, marginBottom: '8px' }}>
              Search results for &ldquo;{initialQuery}&rdquo;
            </h2>
          )}
        </div>

        {/* Search Input */}
        <div className="search-input-wrapper" style={{ maxWidth: '580px', margin: '0 auto 40px auto' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              autoFocus={!initialQuery}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product, category, color..."
              style={{
                width: '100%',
                padding: '16px 46px 16px 50px',
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                outline: 'none',
                color: 'var(--text-primary)',
                transition: 'border-color 200ms ease, box-shadow 200ms ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-muted)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.04)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('q');
                  params.delete('page');
                  router.push(`${pathname}?${params.toString()}`);
                }}
                aria-label="Clear search input"
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
              >
                <X size={16} />
              </button>
            )}
          </form>
        </div>
      </div>

      {hasSearched && (
        <>
          {/* Sticky Filter Bar Sentinel */}
          <div ref={sentinelRef} style={{ height: '1px', marginBottom: '-1px', pointerEvents: 'none' }} aria-hidden="true" />

          {/* Sticky Filter Bar matching New Arrivals */}
          <div
            ref={stickyBarRef}
            className={`sticky-navigation-header ${isStuck ? 'is-stuck' : ''}`}
            style={{ paddingTop: '8px', paddingBottom: '8px', marginBottom: '28px' }}
          >
            <div className="container search-page-container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  minHeight: '36px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Active Filters inside the Bar */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  {hasActiveFilters ? (
                    <>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        Active Filters:
                      </span>
                      {activeCategory !== 'all' && (
                        <span style={chipStyle}>
                          <span>Category: {categories.find((c) => c.slug === activeCategory)?.name || activeCategory}</span>
                          <X
                            size={12}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setActiveCategory('all');
                              setStagedCategory('all');
                              updateUrl({ category: null });
                            }}
                            aria-label="Remove category filter"
                          />
                        </span>
                      )}
                      {activeCollection !== 'all' && (
                        <span style={chipStyle}>
                          <span>Collection: {COLLECTIONS.find((c) => c.id === activeCollection)?.label || activeCollection}</span>
                          <X
                            size={12}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setActiveCollection('all');
                              setStagedCollection('all');
                              updateUrl({ collection: null });
                            }}
                            aria-label="Remove collection filter"
                          />
                        </span>
                      )}
                      {activeSizes.map((s) => (
                        <span key={s} style={chipStyle}>
                          <span>Size: {s}</span>
                          <X
                            size={12}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              const next = activeSizes.filter((item) => item !== s);
                              setActiveSizes(next);
                              setStagedSizes(next);
                              updateUrl({ size: next.length ? next.join(',') : null });
                            }}
                            aria-label={`Remove size ${s} filter`}
                          />
                        </span>
                      ))}
                      {activeColors.map((c) => (
                        <span key={c} style={chipStyle}>
                          <span>Color: {c}</span>
                          <X
                            size={12}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              const next = activeColors.filter((item) => item !== c);
                              setActiveColors(next);
                              setStagedColors(next);
                              updateUrl({ color: next.length ? next.join(',') : null });
                            }}
                            aria-label={`Remove color ${c} filter`}
                          />
                        </span>
                      ))}
                      {(appliedPriceRange[0] > 0 || appliedPriceRange[1] < 100000) && (
                        <span style={chipStyle}>
                          <span>
                            Price: ₹{appliedPriceRange[0].toLocaleString()} - ₹{appliedPriceRange[1].toLocaleString()}
                          </span>
                          <X
                            size={12}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setAppliedPriceRange([0, 100000]);
                              setStagedPriceRange([0, 100000]);
                              updateUrl({ price: null });
                            }}
                            aria-label="Remove price filter"
                          />
                        </span>
                      )}
                      {appliedAvailability !== 'all' && (
                        <span style={chipStyle}>
                          <span>In Stock Only</span>
                          <X
                            size={12}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setAppliedAvailability('all');
                              setStagedAvailability('all');
                              updateUrl({ availability: null });
                            }}
                            aria-label="Remove availability filter"
                          />
                        </span>
                      )}
                      <button
                        onClick={resetFilters}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'none',
                          border: 'none',
                          fontSize: '0.78rem',
                          color: 'var(--brand-primary)',
                          cursor: 'pointer',
                          marginLeft: '4px',
                          padding: 0,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <RotateCcw size={12} /> Reset all
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                      {!loading ? (
                        totalPages > 1
                          ? `${filteredProducts.length} Results (Page ${currentPage} of ${totalPages})`
                          : `${filteredProducts.length} Results`
                      ) : (
                        'Searching...'
                      )}
                    </span>
                  )}
                </div>

                {/* Right side: Sort + Filter trigger */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, marginLeft: 'auto' }}>
                  {/* Sort Dropdown */}
                  <div style={{ position: 'relative' }} ref={sortRef}>
                    <button
                      onClick={() => setSortOpen((prev) => !prev)}
                      aria-label="Sort options"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-pill)',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-surface)',
                        fontSize: '0.82rem',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease',
                      }}
                    >
                      <span>{SORT_OPTIONS.find((s) => s.id === selectedSort)?.label}</span>
                      <ChevronDown
                        size={14}
                        style={{
                          transform: sortOpen ? 'rotate(180deg)' : 'rotate(0)',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </button>
                    {sortOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 6px)',
                          right: 0,
                          zIndex: 60,
                          minWidth: '190px',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-light)',
                          boxShadow: 'var(--shadow-editorial)',
                          borderRadius: '10px',
                          padding: '6px 0',
                          overflow: 'hidden',
                        }}
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setSelectedSort(opt.id);
                              updateUrl({ sort: opt.id });
                              setSortOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              padding: '8px 16px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: selectedSort === opt.id ? 'var(--brand-primary)' : 'var(--text-primary)',
                              fontSize: '0.82rem',
                              fontWeight: selectedSort === opt.id ? 600 : 400,
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <span>{opt.label}</span>
                            {selectedSort === opt.id && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      width: '1px',
                      height: '20px',
                      backgroundColor: 'var(--border-color)',
                      flexShrink: 0,
                    }}
                  />

                  {/* Filters Button */}
                  <button
                    onClick={() => {
                      setStagedCategory(activeCategory);
                      setStagedCollection(activeCollection);
                      setStagedSizes(activeSizes);
                      setStagedColors(activeColors);
                      setStagedPriceRange(appliedPriceRange);
                      setStagedAvailability(appliedAvailability);
                      setFilterDrawerOpen(true);
                    }}
                    aria-label="Open Filters"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 0px',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      backgroundColor: 'transparent',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      outline: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    <SlidersHorizontal size={14} />
                    <span>Filters</span>
                    {hasActiveFilters && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-terracotta, var(--color-golden-500))',
                          marginLeft: '2px',
                        }}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid Container */}
          <div className="container search-page-container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : paginatedProducts.length > 0 ? (
              <>
                <div
                  className="product-grid max-md:!grid max-md:!grid-cols-2 max-md:!gap-[12px]"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}
                >
                  {paginatedProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      className="product-card-wrapper"
                      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
                      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-20px' }}
                      transition={shouldReduceMotion ? undefined : { duration: 0.4, delay: (idx % 4) * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div
                    style={{
                      marginTop: '56px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '20px',
                      paddingTop: '32px',
                      borderTop: '1px solid var(--border-light)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–
                      {Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} Results
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* Previous Page Button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous Page"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          opacity: currentPage === 1 ? 0.35 : 1,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <ChevronLeft size={18} />
                      </button>

                      {/* Page Numbers */}
                      {getVisiblePageNumbers(currentPage, totalPages).map((pageNum, idx) => {
                        if (typeof pageNum === 'string') {
                          return (
                            <span
                              key={`ellipsis-${idx}`}
                              style={{
                                width: '32px',
                                textAlign: 'center',
                                color: 'var(--text-muted)',
                                fontSize: '0.9rem',
                                userSelect: 'none',
                              }}
                            >
                              {pageNum}
                            </span>
                          );
                        }

                        const isActive = currentPage === pageNum;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            aria-label={`Page ${pageNum}`}
                            aria-current={isActive ? 'page' : undefined}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.875rem',
                              fontWeight: isActive ? 600 : 400,
                              border: isActive ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                              backgroundColor: isActive ? 'var(--text-primary)' : 'var(--bg-surface)',
                              color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {/* Next Page Button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next Page"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          opacity: currentPage === totalPages ? 0.35 : 1,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Return to Top Button matching New Arrivals */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: filteredProducts.length > PRODUCTS_PER_PAGE ? '36px' : '60px',
                  }}
                >
                  <button
                    onClick={() => {
                      smoothScrollService.scrollTo(0);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover-fill-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 24px',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowUp size={16} />
                    <span>Return to Top</span>
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 24px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  margin: '40px 0',
                }}
              >
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', marginBottom: '16px', color: 'var(--text-primary)' }}>
                  NO RESULTS FOUND
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px', maxWidth: '440px', margin: '0 auto 28px auto' }}>
                  We couldn&apos;t find anything matching your search and filter criteria. Try adjusting or clearing your filters.
                </p>
                <button
                  onClick={resetFilters}
                  style={{
                    display: 'inline-flex',
                    padding: '12px 28px',
                    backgroundColor: 'var(--text-primary)',
                    color: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    transition: 'opacity 200ms ease',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Slide-over Filter Drawer matching New Arrivals */}
      <Drawer
        isOpen={filterDrawerOpen}
        onClose={() => {
          setStagedCategory(activeCategory);
          setStagedCollection(activeCollection);
          setStagedSizes(activeSizes);
          setStagedColors(activeColors);
          setStagedPriceRange(appliedPriceRange);
          setStagedAvailability(appliedAvailability);
          setFilterDrawerOpen(false);
        }}
        title="REFINE SEARCH"
        position="right"
        contentStyle={{ backgroundColor: 'var(--bg-surface)' }}
        headerStyle={{ borderBottom: '1px solid var(--overlay-black-5)', padding: '24px 32px 16px' }}
        titleStyle={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', letterSpacing: '0.02em', color: 'var(--text-primary)' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '16px 8px 120px' }}>
          {/* Category Filter */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.05rem',
                letterSpacing: '0.06em',
                marginBottom: '16px',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
              }}
            >
              Category
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  backgroundColor: stagedCategory === 'all' ? 'var(--overlay-black-5)' : 'transparent',
                  transition: 'background-color 0.2s ease, opacity 0.2s ease',
                  userSelect: 'none',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border:
                      stagedCategory === 'all'
                        ? '1.5px solid var(--color-black-tie)'
                        : '1.5px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: stagedCategory === 'all' ? 'var(--color-black-tie)' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {stagedCategory === 'all' && (
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-diamond)',
                      }}
                    />
                  )}
                </div>
                <input
                  type="radio"
                  name="search-category"
                  checked={stagedCategory === 'all'}
                  onChange={() => setStagedCategory('all')}
                  style={{ display: 'none' }}
                />
                <span
                  style={{
                    fontWeight: stagedCategory === 'all' ? 600 : 400,
                    opacity: stagedCategory === 'all' ? 1 : 0.85,
                    letterSpacing: '0.01em',
                  }}
                >
                  All Categories
                </span>
              </label>

              {categories.map((cat) => {
                const isSelected = stagedCategory === cat.slug;
                return (
                  <label
                    key={cat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'var(--overlay-black-5)' : 'transparent',
                      transition: 'background-color 0.2s ease, opacity 0.2s ease',
                      userSelect: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: isSelected
                          ? '1.5px solid var(--color-black-tie)'
                          : '1.5px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        backgroundColor: isSelected ? 'var(--color-black-tie)' : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-diamond)',
                          }}
                        />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="search-category"
                      checked={isSelected}
                      onChange={() => setStagedCategory(cat.slug)}
                      style={{ display: 'none' }}
                    />
                    <span
                      style={{
                        fontWeight: isSelected ? 600 : 400,
                        opacity: isSelected ? 1 : 0.85,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {cat.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Collection Filter */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.05rem',
                letterSpacing: '0.06em',
                marginBottom: '16px',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
              }}
            >
              Collection
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  backgroundColor: stagedCollection === 'all' ? 'var(--overlay-black-5)' : 'transparent',
                  transition: 'background-color 0.2s ease, opacity 0.2s ease',
                  userSelect: 'none',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border:
                      stagedCollection === 'all'
                        ? '1.5px solid var(--color-black-tie)'
                        : '1.5px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: stagedCollection === 'all' ? 'var(--color-black-tie)' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {stagedCollection === 'all' && (
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-diamond)',
                      }}
                    />
                  )}
                </div>
                <input
                  type="radio"
                  name="search-collection"
                  checked={stagedCollection === 'all'}
                  onChange={() => setStagedCollection('all')}
                  style={{ display: 'none' }}
                />
                <span
                  style={{
                    fontWeight: stagedCollection === 'all' ? 600 : 400,
                    opacity: stagedCollection === 'all' ? 1 : 0.85,
                    letterSpacing: '0.01em',
                  }}
                >
                  All Collections
                </span>
              </label>

              {COLLECTIONS.map((col) => {
                const isSelected = stagedCollection === col.id;
                return (
                  <label
                    key={col.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'var(--overlay-black-5)' : 'transparent',
                      transition: 'background-color 0.2s ease, opacity 0.2s ease',
                      userSelect: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: isSelected
                          ? '1.5px solid var(--color-black-tie)'
                          : '1.5px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        backgroundColor: isSelected ? 'var(--color-black-tie)' : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-diamond)',
                          }}
                        />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="search-collection"
                      checked={isSelected}
                      onChange={() => setStagedCollection(col.id)}
                      style={{ display: 'none' }}
                    />
                    <span
                      style={{
                        fontWeight: isSelected ? 600 : 400,
                        opacity: isSelected ? 1 : 0.85,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {col.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          {availableSizes.length > 0 && (
            <div>
              <h4
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1rem',
                  letterSpacing: '0.06em',
                  marginBottom: '16px',
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                }}
              >
                Size
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableSizes.map((s) => {
                  const isSelected = stagedSizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setStagedSizes((prev) =>
                          prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
                        );
                      }}
                      style={{
                        minWidth: '44px',
                        height: '40px',
                        padding: '0 14px',
                        borderRadius: 'var(--radius-pill)',
                        border: isSelected
                          ? '1.5px solid var(--color-black-tie)'
                          : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--color-black-tie)' : 'var(--bg-surface)',
                        color: isSelected ? 'var(--color-diamond)' : 'var(--text-primary)',
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colors */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem',
                letterSpacing: '0.06em',
                marginBottom: '16px',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
              }}
            >
              Color
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {COLOR_GROUPS.map((g) => {
                const isSelected = stagedColors.includes(g.name);
                return (
                  <label
                    key={g.name}
                    onClick={() => {
                      setStagedColors((prev) =>
                        prev.includes(g.name) ? prev.filter((c) => c !== g.name) : [...prev, g.name]
                      );
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--overlay-black-5)' : 'transparent',
                      transition: 'all 0.2s ease',
                      userSelect: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: g.hex,
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: g.hex === '#F8F5F0' ? '#000' : 'var(--color-diamond)',
                          }}
                        />
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)',
                        fontWeight: isSelected ? 600 : 400,
                        opacity: isSelected ? 1 : 0.85,
                      }}
                    >
                      {g.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Tier */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem',
                letterSpacing: '0.06em',
                marginBottom: '16px',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
              }}
            >
              Price Tier
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', minWidth: 0 }}>
                {PRICE_PRESETS.map((p) => {
                  const isChecked = stagedPriceRange[0] === p.range[0] && stagedPriceRange[1] === p.range[1];
                  return (
                    <label
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        padding: '8px 10px',
                        backgroundColor: isChecked && p.id !== 'all' ? 'var(--color-diamond)' : 'transparent',
                        borderRadius: '8px',
                        border: isChecked && p.id !== 'all' ? '1px solid var(--overlay-black-5)' : '1px solid transparent',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                        userSelect: 'none',
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isChecked ? '1.5px solid var(--color-black-tie)' : '1.5px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          backgroundColor: isChecked ? 'var(--color-black-tie)' : 'transparent',
                        }}
                      >
                        {isChecked && (
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-diamond)',
                            }}
                          />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="search-price"
                        checked={isChecked}
                        onChange={() => setStagedPriceRange(p.range)}
                        style={{ display: 'none' }}
                      />
                      <span style={{ color: 'var(--text-primary)', fontWeight: isChecked ? 600 : 400 }}>{p.label}</span>
                    </label>
                  );
                })}
              </div>
              <div style={{ width: '100%', maxWidth: '420px', boxSizing: 'border-box', minWidth: 0 }}>
                <RangeSlider
                  min={0}
                  max={100000}
                  step={5000}
                  value={stagedPriceRange}
                  onChange={setStagedPriceRange}
                  milestones={priceMilestones}
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem',
                letterSpacing: '0.06em',
                marginBottom: '16px',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
              }}
            >
              Availability
            </h4>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.95rem',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                padding: '8px 10px',
                borderRadius: '8px',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border:
                    stagedAvailability === 'in_stock'
                      ? '1.5px solid var(--color-black-tie)'
                      : '1.5px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    stagedAvailability === 'in_stock' ? 'var(--color-black-tie)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {stagedAvailability === 'in_stock' && (
                  <Check size={12} color="var(--color-diamond)" strokeWidth={3} />
                )}
              </div>
              <input
                type="checkbox"
                checked={stagedAvailability === 'in_stock'}
                onChange={(e) => setStagedAvailability(e.target.checked ? 'in_stock' : 'all')}
                style={{ display: 'none' }}
              />
              <span style={{ fontWeight: stagedAvailability === 'in_stock' ? 600 : 400 }}>
                In Stock Pieces Only
              </span>
            </label>
          </div>
        </div>

        {/* Sticky Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '24px 32px 32px',
            display: 'flex',
            gap: '16px',
            background: 'linear-gradient(to top, var(--bg-surface) 70%, transparent 100%)',
            borderTop: 'none',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', width: '100%', pointerEvents: 'auto' }}>
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setStagedCategory('all');
                setStagedCollection('all');
                setStagedSizes([]);
                setStagedColors([]);
                setStagedPriceRange([0, 100000]);
                setStagedAvailability('all');
              }}
              style={{
                borderRadius: '30px',
                borderColor: 'var(--text-accent)',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontWeight: 600,
                height: '48px',
                backgroundColor: 'transparent',
              }}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setActiveCategory(stagedCategory);
                setActiveCollection(stagedCollection);
                setActiveSizes(stagedSizes);
                setActiveColors(stagedColors);
                setAppliedPriceRange(stagedPriceRange);
                setAppliedAvailability(stagedAvailability);
                setFilterDrawerOpen(false);
                updateUrl({
                  category: stagedCategory !== 'all' ? stagedCategory : null,
                  collection: stagedCollection !== 'all' ? stagedCollection : null,
                  size: stagedSizes.length ? stagedSizes.join(',') : null,
                  color: stagedColors.length ? stagedColors.join(',') : null,
                  price:
                    stagedPriceRange[0] > 0 || stagedPriceRange[1] < 100000
                      ? `${stagedPriceRange[0]}-${stagedPriceRange[1]}`
                      : null,
                  availability: stagedAvailability !== 'all' ? stagedAvailability : null,
                });
              }}
              style={{
                borderRadius: '30px',
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontWeight: 600,
                height: '48px',
                boxShadow: '0 8px 16px var(--overlay-golden-35)',
                border: 'none',
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export const SearchView: React.FC<SearchViewProps> = (props) => {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}><ProductGridSkeleton count={8} /></div>}>
      <SearchContent {...props} />
    </Suspense>
  );
};
