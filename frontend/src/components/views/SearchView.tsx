'use client';

import React, { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getProducts, getCategories } from '@/lib/mockApi';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, Plus, X, ChevronDown, Check } from 'lucide-react';

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
  { name: 'Gold', hex: '#D4AF37', matches: ['Gold', 'Bronze'] }
];

const COLLECTIONS = [
  { id: 'new-arrival', label: 'New Arrivals' },
  { id: 'signature', label: 'Signature' },
  { id: 'bestseller', label: 'Bestsellers' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'essential', label: 'Essentials' }
];

const PRICE_RANGES = [
  { id: '0-5000', label: 'Under ₹5,000', min: 0, max: 5000 },
  { id: '5000-10000', label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { id: '10000-20000', label: '₹10,000 – ₹20,000', min: 10000, max: 20000 },
  { id: '20000-40000', label: '₹20,000 – ₹40,000', min: 20000, max: 40000 },
  { id: '40000-100000', label: '₹40,000+', min: 40000, max: 1000000 },
];

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' }
];

const SUGGESTIONS = [
  "Italian Leather",
  "Double-Breasted",
  "Silk Gown",
  "Cashmere",
  "Goodyear Chelsea",
  "Gold Vermeil",
];

// Reusable hook for detecting click outside
function useOnClickOutside<T extends HTMLElement = HTMLElement>(ref: React.RefObject<T | null>, handler: () => void) {
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

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  // Active Filters
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeCollections, setActiveCollections] = useState<string[]>([]);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [activePriceRange, setActivePriceRange] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>('recommended');

  // Popover State
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(filterRef, () => setOpenPopover(null));

  // Extract all available sizes from fetched products
  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach(p => p.variants.forEach(v => { if (v.size && v.size !== 'undefined') sizes.add(v.size) }));
    
    // Sort sizes logically if possible
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
      const cats = await getCategories();
      if (isMounted) setCategories(cats);
    }
    loadCategories();
    return () => { isMounted = false; };
  }, []);

  async function performSearch(searchQuery: string) {
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(initialQuery);
    
    if (initialQuery) {
      performSearch(initialQuery);
    } else {
      setProducts([]);
      setHasSearched(false);
    }
    
    // Sync URL filters to state
    const cats = searchParams.get('category');
    const cols = searchParams.get('collection');
    const szs = searchParams.get('size');
    const clrs = searchParams.get('color');
    const price = searchParams.get('price');
    const sort = searchParams.get('sort');
    
    setActiveCategories(cats ? cats.split(',') : []);
    setActiveCollections(cols ? cols.split(',') : []);
    setActiveSizes(szs ? szs.split(',') : []);
    setActiveColors(clrs ? clrs.split(',') : []);
    setActivePriceRange(price || null);
    setSelectedSort(sort || 'recommended');
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleFilter = (type: string, value: string) => {
    const updateArray = (current: string[]) => 
      current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      
    if (type === 'category') {
      const updated = updateArray(activeCategories);
      updateUrl({ category: updated.length ? updated.join(',') : null });
    } else if (type === 'collection') {
      const updated = updateArray(activeCollections);
      updateUrl({ collection: updated.length ? updated.join(',') : null });
    } else if (type === 'size') {
      const updated = updateArray(activeSizes);
      updateUrl({ size: updated.length ? updated.join(',') : null });
    } else if (type === 'color') {
      const updated = updateArray(activeColors);
      updateUrl({ color: updated.length ? updated.join(',') : null });
    }
  };

  const clearAllFilters = () => {
    updateUrl({
      category: null,
      collection: null,
      size: null,
      color: null,
      price: null,
      sort: null
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('q', query.trim());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];
    
    if (activeCategories.length > 0) {
      list = list.filter(p => {
        const cat = categories.find(c => c.id === p.categoryId);
        return cat && activeCategories.includes(cat.slug);
      });
    }
    
    if (activeCollections.length > 0) {
      list = list.filter(p => activeCollections.some(c => p.tags.includes(c)));
    }
    
    if (activeSizes.length > 0) {
      list = list.filter(p => p.variants.some(v => v.stock > 0 && activeSizes.includes(v.size)));
    }
    
    if (activeColors.length > 0) {
      list = list.filter(p => {
        return p.variants.some(v => {
          const matchedGroup = COLOR_GROUPS.find(g => activeColors.includes(g.name));
          if (!matchedGroup) return false;
          return matchedGroup.matches.some(m => v.color.toLowerCase().includes(m.toLowerCase()));
        });
      });
    }
    
    if (activePriceRange) {
      const range = PRICE_RANGES.find(r => r.id === activePriceRange);
      if (range) {
        list = list.filter(p => p.price >= range.min && p.price <= range.max);
      }
    }
    
    switch (selectedSort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'newest': list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0)); break;
      case 'recommended':
      default: list.sort((a, b) => b.rating.average - a.rating.average); break;
    }
    
    return list;
  }, [products, categories, activeCategories, activeCollections, activeSizes, activeColors, activePriceRange, selectedSort]);

  // UI Helpers
  const renderFilterButton = (label: string, id: string, hasActive: boolean) => (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpenPopover(openPopover === id ? null : id)}
        className={`filter-btn ${hasActive ? 'active' : ''}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '6px',
          border: `1px solid ${hasActive ? 'var(--color-sunset-600)' : 'var(--border-color)'}`,
          backgroundColor: hasActive ? 'var(--color-sunset-50)' : 'transparent',
          color: hasActive ? 'var(--color-sunset-800)' : 'var(--text-primary)',
          fontSize: '0.85rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 200ms ease'
        }}
        onMouseOver={(e) => {
          if (!hasActive) {
            e.currentTarget.style.borderColor = 'var(--text-muted)';
          }
        }}
        onMouseOut={(e) => {
          if (!hasActive) {
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }
        }}
      >
        {label} <Plus size={14} style={{ transition: 'transform 200ms', transform: openPopover === id ? 'rotate(45deg)' : 'rotate(0)' }} />
      </button>
      
      {/* Popover */}
      {openPopover === id && (
        <div 
          style={{ 
            position: 'absolute', 
            top: 'calc(100% + 8px)', 
            left: 0, 
            zIndex: 50,
            minWidth: '240px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-editorial)',
            borderRadius: '8px',
            padding: '16px',
            animation: 'fadeInUp 200ms ease forwards'
          }}
        >
          {id === 'category' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px' }}>Category</div>
              {categories.map(c => (
                <label key={c.slug} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <input 
                    type="checkbox" 
                    checked={activeCategories.includes(c.slug)}
                    onChange={() => toggleFilter('category', c.slug)}
                    style={{ accentColor: 'var(--color-sunset-600)' }}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          )}
          
          {id === 'collection' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px' }}>Collection</div>
              {COLLECTIONS.map(c => (
                <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <input 
                    type="checkbox" 
                    checked={activeCollections.includes(c.id)}
                    onChange={() => toggleFilter('collection', c.id)}
                    style={{ accentColor: 'var(--color-sunset-600)' }}
                  />
                  {c.label}
                </label>
              ))}
            </div>
          )}
          
          {id === 'size' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Size</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableSizes.length > 0 ? availableSizes.map(s => (
                  <button 
                    key={s}
                    onClick={() => toggleFilter('size', s)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: `1px solid ${activeSizes.includes(s) ? 'var(--color-sunset-600)' : 'var(--border-color)'}`,
                      backgroundColor: activeSizes.includes(s) ? 'var(--color-sunset-600)' : '#fff',
                      color: activeSizes.includes(s) ? '#fff' : 'var(--text-primary)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 200ms'
                    }}
                  >
                    {s}
                  </button>
                )) : <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No sizes found</span>}
              </div>
            </div>
          )}
          
          {id === 'color' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Color</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {COLOR_GROUPS.map(g => (
                  <label key={g.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    <div style={{ 
                      width: '18px', height: '18px', borderRadius: '50%', backgroundColor: g.hex, 
                      border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      {activeColors.includes(g.name) && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: g.hex === '#F8F5F0' ? '#000' : '#fff' }} />}
                    </div>
                    <span style={{ fontWeight: activeColors.includes(g.name) ? 600 : 400 }}>{g.name}</span>
                    <input 
                      type="checkbox" 
                      checked={activeColors.includes(g.name)}
                      onChange={() => toggleFilter('color', g.name)}
                      style={{ display: 'none' }}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {id === 'price' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px' }}>Price Range</div>
              {PRICE_RANGES.map(p => (
                <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <input 
                    type="radio" 
                    checked={activePriceRange === p.id}
                    onChange={() => {
                      updateUrl({ price: activePriceRange === p.id ? null : p.id });
                    }}
                    style={{ accentColor: 'var(--color-sunset-600)' }}
                  />
                  {p.label}
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const activeChips = [
    ...activeCategories.map(c => ({ type: 'category', value: c, label: categories.find(cat => cat.slug === c)?.name || c })),
    ...activeCollections.map(c => ({ type: 'collection', value: c, label: COLLECTIONS.find(col => col.id === c)?.label || c })),
    ...activeSizes.map(s => ({ type: 'size', value: s, label: s })),
    ...activeColors.map(c => ({ type: 'color', value: c, label: c })),
    ...(activePriceRange ? [{ type: 'price', value: activePriceRange, label: PRICE_RANGES.find(p => p.id === activePriceRange)?.label || activePriceRange }] : [])
  ];

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
      <div className="container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Search Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-sunset-700)', fontWeight: 600, marginBottom: '16px' }}>SEARCH</h1>
          {initialQuery && (
            <>
              <h2 style={{ fontSize: '14px', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontWeight: 400, marginBottom: '16px' }}>
                Search results for &quot;{initialQuery}&quot;
              </h2>
            </>
          )}
        </div>

        {/* Search Input */}
        <div style={{ maxWidth: '600px', margin: '0 auto 60px auto' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              style={{
                width: '100%',
                padding: '18px 20px 18px 56px',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                outline: 'none',
                color: 'var(--text-primary)',
                transition: 'border-color 200ms ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-sunset-600)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </form>

          {/* Popular Searches Pills */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <span
              style={{
                display: 'block',
                fontSize: '11px',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                color: 'var(--color-sunset-700)',
                marginBottom: '12px',
              }}
            >
              Suggested Explorations
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {SUGGESTIONS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setQuery(tag);
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('q', tag);
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  style={{
                    fontSize: '13px',
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-sunset-600)';
                    e.currentTarget.style.color = 'var(--color-sunset-700)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hasSearched && (
          <>
            {/* Desktop Filters */}
            <div className="hidden md:block mb-10" ref={filterRef}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderTop: '1px solid var(--border-light)', borderBottom: activeChips.length === 0 ? '1px solid var(--border-light)' : 'none', padding: '24px 0', paddingBottom: activeChips.length === 0 ? '24px' : '0' }}>
                
                {/* Left: Filter Buttons */}
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '16px' }}>
                    FILTER
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {renderFilterButton('Category', 'category', activeCategories.length > 0)}
                    {renderFilterButton('Collection', 'collection', activeCollections.length > 0)}
                    {renderFilterButton('Size', 'size', activeSizes.length > 0)}
                    {renderFilterButton('Color', 'color', activeColors.length > 0)}
                    {renderFilterButton('Price', 'price', activePriceRange !== null)}
                  </div>
                </div>

                {/* Right: Sort By */}
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '16px', textAlign: 'right' }}>
                    SORT BY
                  </div>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setOpenPopover(openPopover === 'sort' ? null : 'sort')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minWidth: '200px',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'border-color 200ms ease'
                      }}
                    >
                      {SORT_OPTIONS.find(s => s.id === selectedSort)?.label}
                      <ChevronDown size={14} style={{ transition: 'transform 200ms', transform: openPopover === 'sort' ? 'rotate(180deg)' : 'rotate(0)' }} />
                    </button>
                    {openPopover === 'sort' && (
                      <div style={{ 
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 50,
                        minWidth: '200px', backgroundColor: '#ffffff', border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-editorial)', borderRadius: '8px', padding: '8px 0',
                        animation: 'fadeInUp 200ms ease forwards'
                      }}>
                        {SORT_OPTIONS.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => { updateUrl({ sort: opt.id }); setOpenPopover(null); }}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                              padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
                              color: selectedSort === opt.id ? 'var(--color-sunset-700)' : 'var(--text-primary)',
                              fontSize: '0.85rem', fontWeight: selectedSort === opt.id ? 600 : 400,
                              textAlign: 'left'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            {opt.label}
                            {selectedSort === opt.id && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Active Chips Row */}
              {activeChips.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingBottom: '24px', borderBottom: '1px solid var(--border-light)', marginTop: '24px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginRight: '8px' }}>Active:</span>
                  {activeChips.map(chip => (
                    <button
                      key={`${chip.type}-${chip.value}`}
                      onClick={() => {
                        if (chip.type === 'price') updateUrl({ price: null });
                        else toggleFilter(chip.type, chip.value);
                      }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '4px 12px', borderRadius: '4px',
                        backgroundColor: 'var(--color-sunset-50)', border: '1px solid var(--color-sunset-200)',
                        color: 'var(--color-sunset-800)', fontSize: '0.8rem', fontWeight: 500,
                        cursor: 'pointer', transition: 'all 200ms ease'
                      }}
                    >
                      {chip.label} <X size={12} />
                    </button>
                  ))}
                  <button 
                    onClick={clearAllFilters}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer', marginLeft: '8px' }}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>


            {/* Results Header */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                {!loading ? `${filteredProducts.length} RESULTS` : '...'}
              </p>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
                {Array.from({ length: 4 }).map((_, i) => (
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} variant="standard" />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', marginBottom: '16px', color: 'var(--text-primary)' }}>NO RESULTS</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px' }}>
                  We couldn&apos;t find anything matching your filters.<br/>
                  Try adjusting your selections or explore our collections.
                </p>
                <button onClick={clearAllFilters} style={{ display: 'inline-flex', padding: '12px 28px', backgroundColor: '#7c1d35', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'background-color 200ms ease', border: 'none', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#631427'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#7c1d35'}>
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export const SearchView: React.FC = () => {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}></div>}>
      <SearchContent />
    </Suspense>
  );
};
