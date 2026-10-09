'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, ArrowLeft, ChevronDown, SlidersHorizontal, RotateCcw, ArrowUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getProducts, getNewArrivals, getCategories } from '@/lib/mockApi';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { useScrollLock } from '@/hooks/useScrollLock';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROTATING_QUERIES = [
  "Cashmere Coat",
  "Mulberry Silk Gown",
  "Double-Breasted Wool",
  "Tuscan Leather Chelsea",
  "Sculptural Gold Cuff",
];

const SUGGESTIONS = [
  "Italian Leather",
  "Double-Breasted",
  "Silk Gown",
  "Cashmere",
  "Goodyear Chelsea",
  "Gold Vermeil",
];

// Luxury color grouping
const COLOR_GROUPS = [
  { name: 'Black', hex: '#1A1A1A', matches: ['Black', 'Noir', 'Abyss', 'Nocturne', 'Onyx', 'Stealth'] },
  { name: 'Navy', hex: '#1B2431', matches: ['Navy', 'Midnight', 'Blue'] },
  { name: 'Burgundy', hex: '#4A1C20', matches: ['Burgundy', 'Aubergine', 'Wine', 'Crimson'] },
  { name: 'Brown', hex: '#4A3728', matches: ['Brown', 'Cognac', 'Espresso', 'Chocolate', 'Havana', 'Ochre'] },
  { name: 'Camel / Beige', hex: '#C19A6B', matches: ['Camel', 'Sand', 'Tan', 'Khaki', 'Oatmeal', 'Vicuna', 'Taupe'] },
  { name: 'Ivory / White', hex: '#F8F5F0', matches: ['Ivory', 'Ecru', 'Alabaster', 'Milk', 'Pearl', 'White'] },
  { name: 'Green', hex: '#2E4C38', matches: ['Emerald', 'Forest', 'Sage', 'Olive'] },
  { name: 'Grey', hex: '#4B4B4B', matches: ['Charcoal', 'Grey', 'Gray', 'Slate'] },
  { name: 'Gold', hex: '#D4AF37', matches: ['Gold', 'Bronze', 'Brass'] },
];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Data sets
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCatalog, setAllCatalog] = useState<Product[]>([]);
  const [newArrivalsList, setNewArrivalsList] = useState<Product[]>([]);
  const [queryResults, setQueryResults] = useState<Product[]>([]);

  // Mobile Filters State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedProductName, setSelectedProductName] = useState<string>('');
  const [nameSortOrder, setNameSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [activePanel, setActivePanel] = useState<'category' | 'size' | 'color' | 'product_name' | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Track mobile viewport to keep search results inline on small screens
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Rotating placeholder cycle every 2.5s when query is empty
  useEffect(() => {
    if (!isOpen || query) return;
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % ROTATING_QUERIES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen, query]);

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    setTimeout(() => inputRef.current?.focus(), 150);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Load categories and initial products on open
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function initData() {
      try {
        const [cats, prods, arrivals] = await Promise.all([
          getCategories(),
          getProducts(),
          getNewArrivals()
        ]);
        if (isMounted) {
          setCategories(cats);
          setAllCatalog(prods);
          setNewArrivalsList(arrivals);
        }
      } catch (err) {
        console.error('Failed to load search catalog data:', err);
      }
    }

    initData();
    return () => { isMounted = false; };
  }, [isOpen]);

  // Reset local state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setQuery('');
        setQueryResults([]);
        setSelectedCategory(null);
        setSelectedSize(null);
        setSelectedColor(null);
        setSelectedProductName('');
        setNameSortOrder(null);
        setActivePanel(null);
      }, 250); // wait for close animation
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Fetch results based on search query
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setQueryResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await getProducts({ searchQuery: query });
        setQueryResults(data);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Determine active filter count
  const activeFilterCount = useMemo(() => {
    return (
      (selectedCategory ? 1 : 0) +
      (selectedSize ? 1 : 0) +
      (selectedColor ? 1 : 0) +
      (selectedProductName.trim() || nameSortOrder ? 1 : 0)
    );
  }, [selectedCategory, selectedSize, selectedColor, selectedProductName, nameSortOrder]);

  const hasActiveMobileFilters = activeFilterCount > 0;

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSize(null);
    setSelectedColor(null);
    setSelectedProductName('');
    setNameSortOrder(null);
    setActivePanel(null);
  };

  // Extract available sizes dynamically from catalog
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    const pool = queryResults.length > 0 ? queryResults : allCatalog;
    pool.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.size && v.size !== 'undefined') set.add(v.size);
      });
    });
    const order = ['XS', 'S', 'M', 'L', 'XL', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'One Size'];
    return Array.from(set).sort((a, b) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [queryResults, allCatalog]);

  // Extract matching product names for quick selection
  const availableProductNames = useMemo(() => {
    const pool = queryResults.length > 0 ? queryResults : allCatalog;
    const names = Array.from(new Set(pool.map((p) => p.name)));
    return names.sort((a, b) => a.localeCompare(b));
  }, [queryResults, allCatalog]);

  // Filter and sort results
  const finalResults = useMemo(() => {
    let list: Product[] = [];

    if (query.trim()) {
      list = [...queryResults];
    } else if (hasActiveMobileFilters) {
      list = [...allCatalog];
    } else {
      list = newArrivalsList.slice(0, 4);
    }

    // 1. Filter by Category
    if (selectedCategory) {
      list = list.filter((p) => {
        const cat = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
        return p.categoryId === selectedCategory || (cat && p.categoryId === cat.id);
      });
    }

    // 2. Filter by Size
    if (selectedSize) {
      list = list.filter((p) =>
        p.variants?.some((v) => v.size && v.size.toLowerCase() === selectedSize.toLowerCase())
      );
    }

    // 3. Filter by Color
    if (selectedColor) {
      const group = COLOR_GROUPS.find((g) => g.name === selectedColor);
      if (group) {
        list = list.filter((p) =>
          p.variants?.some((v) =>
            group.matches.some((m) => v.color?.toLowerCase().includes(m.toLowerCase()))
          )
        );
      }
    }

    // 4. Filter by Product Name
    if (selectedProductName.trim()) {
      const term = selectedProductName.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(term));
    }

    // Sort by Product Name if requested
    if (nameSortOrder === 'asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (nameSortOrder === 'desc') {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }

    return list;
  }, [
    query,
    queryResults,
    allCatalog,
    newArrivalsList,
    hasActiveMobileFilters,
    selectedCategory,
    selectedSize,
    selectedColor,
    selectedProductName,
    nameSortOrder,
    categories,
  ]);

  const togglePanel = (panel: 'category' | 'size' | 'color' | 'product_name') => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <div
      role="dialog"
      aria-modal={isOpen}
      aria-label="Search"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(20, 20, 20, 0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        visibility: isOpen ? 'visible' : 'hidden',
        transition: isOpen 
          ? 'opacity 200ms ease-out, visibility 0s linear 0s' 
          : 'opacity 200ms ease-out, visibility 0s linear 200ms',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          .mobile-search-filters-container {
            display: none !important;
          }
        }
        @keyframes filterSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />

      {/* Drawer Panel */}
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-editorial)',
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 250ms var(--ease-luxury)',
        }}
      >
        {/* Drawer Search Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '6px',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms ease',
                transform: 'translateX(0)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateX(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>

            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                style={{
                  color: 'var(--brand-primary)',
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) {
                    if (!isMobile) {
                      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                      onClose();
                    }
                    // On mobile, query state already drives inline results — no redirect needed
                  }
                }}
                placeholder={`Search for "${ROTATING_QUERIES[placeholderIdx]}"`}
                style={{
                  width: '100%',
                  padding: '8px 32px',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  transition: 'border-color 200ms, background-color 200ms',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--brand-primary)';
                  e.currentTarget.style.backgroundColor = 'var(--color-diamond)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.backgroundColor = 'var(--color-diamond)';
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Popular Searches Pills */}
          <div style={{ marginTop: '20px' }}>
            <span
              style={{
                display: 'block',
                fontSize: '10px',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                color: 'var(--brand-primary)',
                marginBottom: '8px',
              }}
            >
              Suggested Explorations
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SUGGESTIONS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setQuery(tag);
                    if (!isMobile) {
                      router.push(`/search?q=${encodeURIComponent(tag)}`);
                      onClose();
                    }
                  }}
                  style={{
                    fontSize: '12px',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--brand-primary)';
                    e.currentTarget.style.color = 'var(--brand-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.backgroundColor = 'var(--color-diamond)';
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Body ("What's New" or Results Grid) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-primary)' }}>
          
          {/* MOBILE VIEW ONLY: Interactive Filters Bar */}
          <div className="mobile-search-filters-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
            {/* Filter Bar Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <SlidersHorizontal size={13} style={{ color: 'var(--brand-primary)' }} />
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: 'var(--brand-primary)' }}>
                  Refine By
                </span>
                {hasActiveMobileFilters && (
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '1px 6px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--brand-primary)',
                      color: 'var(--color-diamond)',
                      fontWeight: 700,
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </div>

              {hasActiveMobileFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: 'var(--brand-primary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    padding: 0,
                  }}
                >
                  <RotateCcw size={11} />
                  Reset all
                </button>
              )}
            </div>

            {/* Horizontal Scrollable Filter Pills */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '2px',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {/* Category Pill */}
              <button
                onClick={() => togglePanel('category')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  border: `1px solid ${selectedCategory ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                  backgroundColor: selectedCategory ? 'var(--surface-brand)' : 'var(--bg-primary)',
                  color: selectedCategory ? 'var(--brand-primary)' : 'var(--text-primary)',
                  fontWeight: selectedCategory ? 600 : 400,
                }}
              >
                <span>
                  {selectedCategory
                    ? (categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory)?.name || 'Category')
                    : 'Category'}
                </span>
                <ChevronDown
                  size={13}
                  style={{
                    transform: activePanel === 'category' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                  }}
                />
              </button>

              {/* Size Pill */}
              <button
                onClick={() => togglePanel('size')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  border: `1px solid ${selectedSize ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                  backgroundColor: selectedSize ? 'var(--surface-brand)' : 'var(--bg-primary)',
                  color: selectedSize ? 'var(--brand-primary)' : 'var(--text-primary)',
                  fontWeight: selectedSize ? 600 : 400,
                }}
              >
                <span>{selectedSize ? `Size: ${selectedSize}` : 'Size'}</span>
                <ChevronDown
                  size={13}
                  style={{
                    transform: activePanel === 'size' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                  }}
                />
              </button>

              {/* Color Pill */}
              <button
                onClick={() => togglePanel('color')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  border: `1px solid ${selectedColor ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                  backgroundColor: selectedColor ? 'var(--surface-brand)' : 'var(--bg-primary)',
                  color: selectedColor ? 'var(--brand-primary)' : 'var(--text-primary)',
                  fontWeight: selectedColor ? 600 : 400,
                }}
              >
                {selectedColor && (
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: COLOR_GROUPS.find((g) => g.name === selectedColor)?.hex || '#000',
                      border: '1px solid rgba(0,0,0,0.15)',
                    }}
                  />
                )}
                <span>{selectedColor ? selectedColor : 'Color'}</span>
                <ChevronDown
                  size={13}
                  style={{
                    transform: activePanel === 'color' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                  }}
                />
              </button>


            </div>

            {/* Expandable Filter Panel */}
            {activePanel && (
              <div
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                  animation: 'filterSlideDown 180ms ease forwards',
                }}
              >
                {/* Panel Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--brand-primary)' }}>
                    {activePanel === 'category' && 'Filter by Category'}
                    {activePanel === 'size' && 'Filter by Size'}
                    {activePanel === 'color' && 'Filter by Color'}
                  </span>
                  <button
                    onClick={() => setActivePanel(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      padding: '2px',
                      cursor: 'pointer',
                      display: 'flex',
                    }}
                    aria-label="Close filter panel"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* 1. Category Options */}
                {activePanel === 'category' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        border: `1px solid ${selectedCategory === null ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                        backgroundColor: selectedCategory === null ? 'var(--brand-primary)' : 'var(--bg-primary)',
                        color: selectedCategory === null ? 'var(--color-diamond)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'all 150ms',
                      }}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(isSelected ? null : cat.slug)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                            backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-primary)',
                            color: isSelected ? 'var(--color-diamond)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            transition: 'all 150ms',
                          }}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 2. Size Options */}
                {activePanel === 'size' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <button
                      onClick={() => setSelectedSize(null)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        border: `1px solid ${selectedSize === null ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                        backgroundColor: selectedSize === null ? 'var(--brand-primary)' : 'var(--bg-primary)',
                        color: selectedSize === null ? 'var(--color-diamond)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'all 150ms',
                      }}
                    >
                      All Sizes
                    </button>
                    {availableSizes.map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(isSelected ? null : sz)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                            backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-primary)',
                            color: isSelected ? 'var(--color-diamond)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            transition: 'all 150ms',
                          }}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 3. Color Options */}
                {activePanel === 'color' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedColor(null)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        border: `1px solid ${selectedColor === null ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                        backgroundColor: selectedColor === null ? 'var(--brand-primary)' : 'var(--bg-primary)',
                        color: selectedColor === null ? 'var(--color-diamond)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'all 150ms',
                      }}
                    >
                      All Colors
                    </button>
                    {COLOR_GROUPS.map((grp) => {
                      const isSelected = selectedColor === grp.name;
                      return (
                        <button
                          key={grp.name}
                          onClick={() => setSelectedColor(isSelected ? null : grp.name)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                            backgroundColor: isSelected ? 'var(--surface-brand)' : 'var(--bg-primary)',
                            color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            fontWeight: isSelected ? 600 : 400,
                            transition: 'all 150ms',
                          }}
                        >
                          <span
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              backgroundColor: grp.hex,
                              border: grp.hex === '#F8F5F0' ? '1px solid #ccc' : '1px solid rgba(0,0,0,0.15)',
                              flexShrink: 0,
                            }}
                          />
                          <span>{grp.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}


              </div>
            )}

            {/* Active Filters Removable Badges */}
            {hasActiveMobileFilters && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--surface-brand)',
                      border: '1px solid var(--border-brand)',
                      color: 'var(--brand-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory)?.name || selectedCategory}</span>
                    <X size={11} />
                  </button>
                )}

                {selectedSize && (
                  <button
                    onClick={() => setSelectedSize(null)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--surface-brand)',
                      border: '1px solid var(--border-brand)',
                      color: 'var(--brand-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>Size: {selectedSize}</span>
                    <X size={11} />
                  </button>
                )}

                {selectedColor && (
                  <button
                    onClick={() => setSelectedColor(null)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--surface-brand)',
                      border: '1px solid var(--border-brand)',
                      color: 'var(--brand-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: COLOR_GROUPS.find((g) => g.name === selectedColor)?.hex || '#000',
                        border: '1px solid rgba(0,0,0,0.15)',
                      }}
                    />
                    <span>{selectedColor}</span>
                    <X size={11} />
                  </button>
                )}

                {(selectedProductName.trim() || nameSortOrder) && (
                  <button
                    onClick={() => {
                      setSelectedProductName('');
                      setNameSortOrder(null);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--surface-brand)',
                      border: '1px solid var(--border-brand)',
                      color: 'var(--brand-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{selectedProductName.trim() ? `"${selectedProductName.trim()}"` : `Sort: ${nameSortOrder === 'asc' ? 'A-Z' : 'Z-A'}`}</span>
                    <X size={11} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontWeight: 600 }}>
              {!query.trim() && !hasActiveMobileFilters ? (
                <>
                  New Arrivals
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--brand-primary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 8l-1.5 12A1.5 1.5 0 0 0 4.5 21.5h15a1.5 1.5 0 0 0 1.5-1.5L19.5 8H4.5z" />
                    <path d="M8 8V5.5a4 4 0 0 1 8 0V8" />
                    <text x="12" y="16.5" fontSize="6.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" fill="var(--brand-primary)" stroke="none" style={{ textTransform: 'lowercase', letterSpacing: '-0.08em' }}>new</text>
                  </svg>
                </>
              ) : (
                "Search Results"
              )}
            </h3>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
              {isLoading ? '...' : `${finalResults.length} Items`}
            </span>
          </div>

          {/* Products Grid or Empty State */}
          {finalResults.length === 0 && !isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '13px', marginBottom: '12px' }}>No products match your selected filters.</p>
              <button
                onClick={clearFilters}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--brand-primary)',
                  backgroundColor: 'var(--surface-brand)',
                  color: 'var(--brand-primary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }} className="max-md:!grid max-md:!grid-cols-2 max-md:!gap-[12px]">
              {finalResults.map((item) => (
                <ProductCard key={item.id} product={item} onClick={onClose} />
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)', textAlign: 'center' }}>
          <Link
            href="/shop"
            onClick={onClose}
            style={{
              fontSize: '12px',
              color: 'var(--brand-primary)',
              textDecoration: 'underline',
              letterSpacing: '0.05em',
              fontWeight: 600
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-black-tie)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--brand-primary)'}
          >
            Explore Full Aurelia Catalogue →
          </Link>
        </div>
      </aside>
    </div>
  );
};

