'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts, getCategories } from '@/lib/mockApi';
import { Product, Category } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { CategorySection, CategorySectionSkeleton, SectionAnimationVariant } from '@/components/shop/CategorySection';
import { SectionBanner } from '@/components/shop/SectionBanner';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { AnimatePresence, motion } from 'framer-motion';
import { FlatProductGrid, PAGE_SIZE } from '@/components/shop/FlatProductGrid';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { SlidersHorizontal, X, RotateCcw, ArrowUp, Check, Search } from 'lucide-react';

export const ShopViewSkeleton: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '96px', paddingTop: '76px' }} aria-busy="true">
      {/* Banner Skeleton */}
      <div
        style={{
          height: '60vh',
          minHeight: '380px',
          width: '100%',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <Skeleton width="100%" height="100%" borderRadius="0px" />
      </div>

      {/* Sticky Bar Skeleton */}
      <div
        style={{
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)',
          padding: '12px 0',
          marginBottom: '36px',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
          <Skeleton width="220px" height="38px" borderRadius="999px" />
          <Skeleton width="80px" height="38px" borderRadius="8px" />
        </div>
      </div>

      {/* Main Content Container Skeleton */}
      <div className="container">
        <CategorySectionSkeleton categoryName="Atelier Collections" />
      </div>
    </div>
  );
};




/**
 * Section Animation Mapping
 * Easily customize the card animation variant per category section.
 * Supported variants: 'fade-up' | 'stagger-slide' | 'scale-reveal' | 'subtle-float' | 'default'
 */
const SECTION_ANIMATIONS: Record<string, SectionAnimationVariant> = {
  outerwear: 'fade-up',
  tailoring: 'fade-up',
  eveningwear: 'fade-up',
  knitwear: 'fade-up',
  'leather-goods': 'fade-up',
  footwear: 'fade-up',
  'fine-jewelry': 'fade-up',
};

interface ShopViewProps {
  initialProducts: Product[];
  initialCategories: Category[];
  /** When set, activates gender-filtered mode for /collections/men|women */
  gender?: 'men' | 'women';
}

export const ShopView: React.FC<ShopViewProps> = ({
  initialProducts,
  initialCategories,
  gender,
}) => {
  const searchParams = useSearchParams();
  const { storefront } = useStorefrontStore();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);

  // Filter & Navigation States
  // 'all' is only a valid sentinel when gender is set; /shop always defaults to 'outerwear'
  const defaultCategory = gender ? 'all' : 'outerwear';
  const [activeCategory, setActiveCategory] = useState<string>(
    () => searchParams.get('categorySlug') || defaultCategory
  );
  const [stagedCategory, setStagedCategory] = useState<string>(
    () => searchParams.get('categorySlug') || defaultCategory
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [appliedAvailability, setAppliedAvailability] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('popularity');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const getPageFromParam = useCallback((param: string | null): number => {
    if (!param) return 1;
    const parsed = parseInt(param, 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, []);

  const [currentPage, setCurrentPage] = useState<number>(() =>
    getPageFromParam(searchParams.get('page'))
  );

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (newPage <= 1) {
        url.searchParams.delete('page');
      } else {
        url.searchParams.set('page', String(newPage));
      }
      window.history.replaceState(null, '', url.pathname + url.search);
    }
  }, []);

  // Sync state if URL searchParams change
  useEffect(() => {
    const urlPage = getPageFromParam(searchParams.get('page'));
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams, getPageFromParam, currentPage]);

  // Reset to page 1 on active category, filter, sort, or search query change
  useEffect(() => {
    handlePageChange(1);
  }, [activeCategory, appliedPriceRange, appliedAvailability, selectedSort, searchQuery, handlePageChange]);

  const stickyBarRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const scrollToGridTop = useCallback(() => {
    if (gridContainerRef.current) {
      const navHeight = window.innerWidth <= 767 ? 64 : 76;
      const rect = gridContainerRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset + rect.top - navHeight - 16;
      window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Scroll active category tab into view
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeTab = tabsContainerRef.current.querySelector<HTMLButtonElement>('.active-category-tab');
      if (activeTab) {
        const containerRect = tabsContainerRef.current.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        const scrollAmount = tabRect.left - containerRect.left - (containerRect.width / 2) + (tabRect.width / 2);
        tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }, [activeCategory]);

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        if (stickyBarRef.current) {
          const navHeight = window.innerWidth <= 767 ? 64 : 76;
          const rect = stickyBarRef.current.getBoundingClientRect();
          setIsStuck(rect.top <= navHeight + 2);
        }
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Server pre-fetched for storefront 'a' — skip redundant first-mount fetch
  const isInitialMount = useRef(true);

  // Load catalog data
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (storefront === 'a') return;
    }

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

  // Gender pre-filter: when gender prop is set, restrict the working set before any other filter
  const genderProducts = useMemo(() => {
    if (!gender) return products;
    return products.filter((p) => p.genders?.includes(gender));
  }, [products, gender]);

  // Categories that actually have products for this gender (used to hide empty tabs)
  const genderPopulatedCatIds = useMemo(() => {
    if (!gender) return null; // not used in /shop mode
    const ids = new Set<string>();
    genderProducts.forEach((p) => ids.add(p.categoryId));
    return ids;
  }, [genderProducts, gender]);

  // The visible category list — same as before for /shop; filtered-by-population for gender mode
  const visibleCategories = useMemo(() => {
    if (!gender || !genderPopulatedCatIds) return categories;
    return categories.filter((c) => genderPopulatedCatIds.has(c.id));
  }, [categories, gender, genderPopulatedCatIds]);

  // Client-side filtering and sorting across catalog
  const filteredProducts = useMemo(() => {
    // Start from gender-pre-filtered list (or full list for /shop)
    let list = [...genderProducts];

    // Tag filter from URL (e.g. new-arrival, trending)
    const urlTag = searchParams.get('tag');
    if (urlTag) {
      list = list.filter((p) => p.tags.includes(urlTag));
    }

    // Search query filter
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Price range
    list = list.filter((p) => p.price >= appliedPriceRange[0] && p.price <= appliedPriceRange[1]);

    // Availability
    if (appliedAvailability === 'in_stock') {
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
  }, [genderProducts, searchParams, searchQuery, appliedPriceRange, appliedAvailability, selectedSort]);

  // In gender mode with activeCategory='all', currentCategory is null (we show all categories)
  const currentCategory = useMemo(() => {
    if (gender && activeCategory === 'all') return null;
    return categories.find((c) => c.slug === activeCategory) || categories[0];
  }, [categories, activeCategory, gender]);

  // Guard: if the active category has 0 products for this gender, fall back to 'all'
  useEffect(() => {
    if (!gender || activeCategory === 'all') return;
    const cat = categories.find((c) => c.slug === activeCategory);
    if (!cat) return;
    const hasProducts = genderProducts.some((p) => p.categoryId === cat.id);
    if (!hasProducts) {
      setActiveCategory('all');
      setStagedCategory('all');
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('categorySlug');
        window.history.replaceState(null, '', url.pathname + url.search);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender, activeCategory, genderProducts, categories]);

  // Fallback to page 1 if current page exceeds total pages
  useEffect(() => {
    if (gender && activeCategory === 'all') {
      const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
      if (currentPage > totalPages) {
        handlePageChange(1);
      }
    }
  }, [filteredProducts.length, currentPage, gender, activeCategory, handlePageChange]);

  const currentCategoryProducts = useMemo(() => {
    if (!currentCategory) return [];
    return filteredProducts.filter((p) => p.categoryId === currentCategory.id);
  }, [filteredProducts, currentCategory]);

  const prevUrlCategoryRef = useRef<string | null>(searchParams.get('categorySlug'));

  // Handle category selection
  const handleCategorySelect = useCallback((slug: string) => {
    setActiveCategory(slug);
    setStagedCategory(slug);
    prevUrlCategoryRef.current = slug;

    // Keep browser URL in sync without triggering full page reload
    // In gender mode: 'all' removes the param; any specific category sets it
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (gender && slug === 'all') {
        url.searchParams.delete('categorySlug');
      } else {
        url.searchParams.set('categorySlug', slug);
      }
      window.history.replaceState(null, '', url.pathname + url.search);
    }

    // Scroll to the sticky bar to ensure the category content is visible if user is below it, otherwise keep at top
    if (stickyBarRef.current && window.pageYOffset > stickyBarRef.current.offsetTop - 80) {
      const navHeight = typeof window !== 'undefined' && window.innerWidth <= 767 ? 64 : 76;
      const naturalTop = stickyBarRef.current.offsetTop;
      const targetScroll = naturalTop - navHeight;
      if (Math.abs(window.pageYOffset - targetScroll) > 16) {
        window.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [gender]);

  const activeCategoryIndex = useMemo(() => {
    return visibleCategories.findIndex((c) => c.slug === activeCategory);
  }, [visibleCategories, activeCategory]);

  const handleNextCategory = useCallback(() => {
    if (activeCategoryIndex >= 0) {
      const nextIndex = (activeCategoryIndex + 1) % visibleCategories.length;
      handleCategorySelect(visibleCategories[nextIndex].slug);
    }
  }, [activeCategoryIndex, visibleCategories, handleCategorySelect]);

  const handlePrevCategory = useCallback(() => {
    if (activeCategoryIndex >= 0) {
      const prevIndex = (activeCategoryIndex - 1 + visibleCategories.length) % visibleCategories.length;
      handleCategorySelect(visibleCategories[prevIndex].slug);
    }
  }, [activeCategoryIndex, visibleCategories, handleCategorySelect]);

  // Sync active category only when URL changes externally (e.g. from top Navbar dropdown)
  useEffect(() => {
    const urlCatSlug = searchParams.get('categorySlug') || defaultCategory;
    if (urlCatSlug !== prevUrlCategoryRef.current) {
      prevUrlCategoryRef.current = urlCatSlug;
      setActiveCategory(urlCatSlug);
      setStagedCategory(urlCatSlug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchParams, defaultCategory]);

  const resetFilters = () => {
    setPriceRange([0, 100000]);
    setAppliedPriceRange([0, 100000]);
    setSelectedAvailability('all');
    setAppliedAvailability('all');
    setSelectedSort('popularity');
    setSearchQuery('');
    setStagedCategory(defaultCategory);
    handleCategorySelect(defaultCategory);
  };

  const hasActiveFilters =
    appliedPriceRange[0] > 0 || appliedPriceRange[1] < 100000 ||
    appliedAvailability !== 'all' ||
    searchQuery.trim().length > 0;

  // In gender mode the banner is always shown (either "all" hero or category swap)
  const bannerKey = gender ? `${gender}-${activeCategory}` : (currentCategory?.id ?? 'none');

  return (
    <div style={{ paddingTop: '76px', paddingBottom: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Category Hero Banner */}
      <AnimatePresence mode="wait">
        {(gender || currentCategory) && (
          <motion.div
            key={bannerKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }}
          >
            <SectionBanner
              category={currentCategory ?? categories[0]}
              productCount={currentCategoryProducts.length}
              gender={gender}
              activeCategorySlug={gender ? activeCategory : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Category Navigation Bar & Global Controls (Fixed Nav Bar on Collection Page) */}
      <div
        ref={stickyBarRef}
        className={`sticky-navigation-header ${isStuck ? 'is-stuck' : ''}`}
        style={{
          paddingTop: '6px',
          paddingBottom: '6px',
        }}
      >
        <div className="container">

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
            {/* Search Bar & Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
              {/* Inline Search Bar */}
              <div
                className="shop-search-bar"
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Search
                  size={15}
                  strokeWidth={1.6}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    color: 'var(--text-muted)',
                    pointerEvents: 'none',
                    flexShrink: 0,
                  }}
                />
                <input
                  type="text"
                  id="shop-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  style={{
                    width: '220px',
                    padding: '8px 32px 8px 36px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-pill, 999px)',
                    fontSize: '0.82rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--bg-surface, #fafafa)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
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
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      borderRadius: '50%',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <X size={13} />
                  </button>
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
                  setPriceRange(appliedPriceRange);
                  setSelectedAvailability(appliedAvailability);
                  setMobileFiltersOpen(true);
                }}
                className="mobile-filter-btn"
                id="collection-filters-btn"
                aria-label="Open Collection Filters"
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
            {/* Active Filters inside the Navbar */}
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
              {hasActiveFilters && (
                <>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    Active Filters:
                  </span>
                  {searchQuery.trim() && (
                    <span
                      style={{
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
                      }}
                    >
                      <span>Search: &ldquo;{searchQuery.trim()}&rdquo;</span>
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search filter"
                      />
                    </span>
                  )}
                  {(appliedPriceRange[0] > 0 || appliedPriceRange[1] < 100000) && (
                    <span
                      style={{
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
                      }}
                    >
                      <span>
                        Price: ₹{appliedPriceRange[0].toLocaleString()} - ₹{appliedPriceRange[1].toLocaleString()}
                      </span>
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setPriceRange([0, 100000]);
                          setAppliedPriceRange([0, 100000]);
                        }}
                        aria-label="Remove price filter"
                      />
                    </span>
                  )}
                  {appliedAvailability !== 'all' && (
                    <span
                      style={{
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
                      }}
                    >
                      <span>In Stock Only</span>
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedAvailability('all');
                          setAppliedAvailability('all');
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
                    }}
                  >
                    <RotateCcw size={12} /> Reset all
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div ref={gridContainerRef} className="container" style={{ marginTop: '36px' }}>
        {/* Distinct Category Sections */}
        {loading ? (
          <div className="category-sections-container">
            <CategorySectionSkeleton
              categoryName={categories.find((c) => c.slug === activeCategory)?.name || 'Outerwear'}
            />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="category-sections-container">
            <AnimatePresence>
              {gender && activeCategory === 'all' ? (
                // Gender mode + All tab: render flat grid
                <FlatProductGrid 
                  products={filteredProducts} 
                  gender={gender} 
                  currentPage={currentPage} 
                />
              ) : (
                // Single category view (original /shop behaviour or gender + specific tab)
                (gender ? visibleCategories : categories).map((category) => {
                  if (category.slug !== activeCategory) return null;
                  const categoryProducts = filteredProducts.filter((p) => p.categoryId === category.id);
                  return (
                    <CategorySection
                      key={category.id}
                      category={category}
                      products={categoryProducts}
                      animationVariant={SECTION_ANIMATIONS[category.slug] || 'fade-up'}
                      onNext={handleNextCategory}
                      onPrev={handlePrevCategory}
                      hasNext={true}
                      hasPrev={true}
                    />
                  );
                })
              )}
            </AnimatePresence>
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

        {/* Back to Top Quick Scroll Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
          <button
            onClick={() => {
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
              cursor: 'pointer',
            }}
          >
            <ArrowUp size={16} />
            <span>Return to Top</span>
          </button>
        </div>

        {/* Pagination Controls */}
        {gender && activeCategory === 'all' && filteredProducts.length > PAGE_SIZE && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '8px' }}>
            {Array.from({ length: Math.ceil(filteredProducts.length / PAGE_SIZE) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handlePageChange(idx + 1);
                  scrollToGridTop();
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  border: currentPage === idx + 1 ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                  backgroundColor: currentPage === idx + 1 ? 'var(--text-primary)' : 'var(--bg-surface)',
                  color: currentPage === idx + 1 ? 'var(--bg-primary)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filters Drawer / Bottom Sheet */}
      <Drawer
        isOpen={mobileFiltersOpen}
        onClose={() => {
          setStagedCategory(activeCategory);
          setPriceRange(appliedPriceRange);
          setSelectedAvailability(appliedAvailability);
          setMobileFiltersOpen(false);
        }}
        title="REFINE COLLECTION"
        position="right"
        contentStyle={{ backgroundColor: 'var(--bg-surface)' }}
        headerStyle={{
          borderBottom: '1px solid var(--overlay-black-5)',
          padding: '24px 32px 16px',
        }}
        titleStyle={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.4rem',
          letterSpacing: '0.02em',
          color: 'var(--text-primary)',
        }}
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
                      name="drawer-category"
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

          {/* Price Range */}
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
                {[
                  { id: 'all', label: 'All Price Tiers', range: [0, 100000] },
                  { id: 'under-20k', label: 'Under ₹20,000', range: [0, 20000] },
                  { id: '20k-35k', label: '₹20,000 - ₹35,000', range: [20000, 35000] },
                  { id: 'above-35k', label: 'Above ₹35,000', range: [35000, 100000] },
                ].map((p) => {
                  const isChecked = priceRange[0] === p.range[0] && priceRange[1] === p.range[1];
                  return (
                    <label
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        padding: '8px 10px',
                        backgroundColor: isChecked && p.id !== 'all' ? 'var(--overlay-black-5)' : 'transparent',
                        borderRadius: '8px',
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
                          border: isChecked
                            ? '1.5px solid var(--color-black-tie)'
                            : '1.5px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          backgroundColor: isChecked ? 'var(--color-black-tie)' : 'transparent',
                          transition: 'all 0.2s ease',
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
                        name="price"
                        checked={isChecked}
                        onChange={() => setPriceRange(p.range as [number, number])}
                        style={{ display: 'none' }}
                      />
                      <span
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: isChecked ? 600 : 400,
                          opacity: isChecked ? 1 : 0.85,
                        }}
                      >
                        {p.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Range Slider Visual */}
              <div style={{ width: '100%', maxWidth: '420px', boxSizing: 'border-box', minWidth: 0 }}>
                <RangeSlider
                  min={0}
                  max={100000}
                  step={5000}
                  value={priceRange}
                  onChange={setPriceRange}
                  milestones={useMemo(
                    () => [
                      { value: 0, label: '₹0' },
                      { value: 20000, label: '₹20K' },
                      { value: 35000, label: '₹35K' },
                      { value: 100000, label: '₹100K+' },
                    ],
                    []
                  )}
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
                gap: '12px',
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
                    selectedAvailability === 'in_stock'
                      ? '1.5px solid var(--color-black-tie)'
                      : '1.5px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    selectedAvailability === 'in_stock' ? 'var(--color-black-tie)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {selectedAvailability === 'in_stock' && (
                  <Check size={12} color="var(--color-diamond)" strokeWidth={3} />
                )}
              </div>
              <input
                type="checkbox"
                checked={selectedAvailability === 'in_stock'}
                onChange={(e) => setSelectedAvailability(e.target.checked ? 'in_stock' : 'all')}
                style={{ display: 'none' }}
              />
              <span
                style={{
                  fontWeight: selectedAvailability === 'in_stock' ? 600 : 400,
                  opacity: selectedAvailability === 'in_stock' ? 1 : 0.85,
                }}
              >
                In Stock Pieces Only
              </span>
            </label>
          </div>
        </div>

        {/* Sticky Footer Buttons */}
        <div style={{
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
        }}>
          <div style={{ display: 'flex', gap: '12px', width: '100%', pointerEvents: 'auto' }}>
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setStagedCategory(defaultCategory);
                setPriceRange([0, 100000]);
                setSelectedAvailability('all');
              }}
              style={{
                borderRadius: '30px',
                borderColor: 'var(--text-accent)',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontWeight: 600,
                height: '48px',
                backgroundColor: 'transparent'
              }}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                if (stagedCategory !== activeCategory) {
                  handleCategorySelect(stagedCategory);
                }
                setAppliedPriceRange(priceRange);
                setAppliedAvailability(selectedAvailability);
                setMobileFiltersOpen(false);
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
                border: 'none'
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Drawer>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 768px) {
          .silhouette-counter {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

