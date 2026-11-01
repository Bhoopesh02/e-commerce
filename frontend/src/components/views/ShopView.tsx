'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts, getCategories, ensureClientState } from '@/lib/mockApi';
import { areProductsEqual, areCategoriesEqual } from '@/lib/catalogCompare';
import { Product, Category } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { CategorySection, CategorySectionSkeleton, SectionAnimationVariant } from '@/components/shop/CategorySection';
import { SectionBanner } from '@/components/shop/SectionBanner';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { FilterDropdownSection } from '@/components/ui/FilterDropdownSection';
import { AnimatePresence, motion } from 'framer-motion';
import { FlatProductGrid, PAGE_SIZE } from '@/components/shop/FlatProductGrid';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { SlidersHorizontal, X, RotateCcw, ArrowUp, Check, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { smoothScrollService } from '@/services/smooth-scroll';
import { COLOR_GROUPS } from '@/lib/colorUtils';

export const ShopViewSkeleton: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '96px', paddingTop: 'var(--header-total-height, 113px)' }} aria-busy="true">
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

const priceMilestones = [
  { value: 0, label: '₹0' },
  { value: 20000, label: '₹20K' },
  { value: 35000, label: '₹35K' },
  { value: 100000, label: '₹100K+' },
];

export const SORT_OPTIONS = [
  { id: 'popularity', label: 'Most Popular' },
  { id: 'newest', label: 'Newest Arrivals' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
];

interface ShopViewProps {
  initialProducts: Product[];
  initialCategories: Category[];
  /** When set, activates gender-filtered mode for /collections/men|women */
  gender?: 'men' | 'women';
}

const PRICE_MILESTONES = [
  { value: 0, label: '₹0' },
  { value: 20000, label: '₹20K' },
  { value: 35000, label: '₹35K' },
  { value: 100000, label: '₹100K+' },
];

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

  // Size filter states
  const [stagedSizes, setStagedSizes] = useState<string[]>(() => {
    const s = searchParams.get('size');
    return s ? s.split(',').filter(Boolean) : [];
  });
  const [appliedSizes, setAppliedSizes] = useState<string[]>(() => {
    const s = searchParams.get('size');
    return s ? s.split(',').filter(Boolean) : [];
  });

  // Color filter states
  const [stagedColors, setStagedColors] = useState<string[]>(() => {
    const c = searchParams.get('color');
    return c ? c.split(',').filter(Boolean) : [];
  });
  const [appliedColors, setAppliedColors] = useState<string[]>(() => {
    const c = searchParams.get('color');
    return c ? c.split(',').filter(Boolean) : [];
  });

  const [selectedSort, setSelectedSort] = useState<string>('popularity');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sort: false,
    category: false,
    size: false,
    color: false,
    price: false,
    availability: false,
  });

  const toggleFilterSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Helper to sync size and color filters to URL search parameters
  const syncFilterParamsToUrl = useCallback((newSizes: string[], newColors: string[]) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (newSizes.length > 0) {
      url.searchParams.set('size', newSizes.join(','));
    } else {
      url.searchParams.delete('size');
    }
    if (newColors.length > 0) {
      url.searchParams.set('color', newColors.join(','));
    } else {
      url.searchParams.delete('color');
    }
    window.history.replaceState(null, '', url.pathname + url.search);
  }, []);

  // Extract all available sizes from catalog products
  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((p) =>
      p.variants?.forEach((v) => {
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

  // Alphabetically sorted categories
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const [isStuck, setIsStuck] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const getPageFromParam = useCallback((param: string | null): number => {
    if (!param) return 1;
    const parsed = parseInt(param, 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, []);

  const stickyBarRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const scrollToGridTop = useCallback(() => {
    const navHeight = typeof window !== 'undefined' && window.innerWidth <= 767 ? 64 : 76;
    if (sentinelRef.current) {
      const targetScroll = sentinelRef.current.getBoundingClientRect().top + window.pageYOffset - navHeight;
      smoothScrollService.scrollTo(Math.max(0, targetScroll));
    } else if (gridContainerRef.current) {
      const rect = gridContainerRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset + rect.top - navHeight - 16;
      smoothScrollService.scrollTo(Math.max(0, scrollTop));
    } else {
      smoothScrollService.scrollTo(0);
    }
  }, []);

  const [currentPage, setCurrentPage] = useState<number>(() =>
    getPageFromParam(searchParams.get('page'))
  );

  const handlePageChange = useCallback((newPage: number, shouldScroll = true) => {
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (newPage <= 1) {
        url.searchParams.delete('page');
      } else {
        url.searchParams.set('page', String(newPage));
      }
      window.history.replaceState(null, '', url.pathname + url.search);
      if (shouldScroll) {
        requestAnimationFrame(() => {
          scrollToGridTop();
        });
      }
    }
  }, [scrollToGridTop]);

  // Sync state if URL searchParams change
  useEffect(() => {
    const urlPage = getPageFromParam(searchParams.get('page'));
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
      requestAnimationFrame(() => {
        scrollToGridTop();
      });
    }
  }, [searchParams, getPageFromParam, currentPage, scrollToGridTop]);

  // Reset to page 1 on active category, filter, sort, or search query change
  useEffect(() => {
    handlePageChange(1, false);
  }, [activeCategory, appliedPriceRange, appliedAvailability, appliedSizes, appliedColors, selectedSort, searchQuery, handlePageChange]);

  // Track sticky state via off-thread IntersectionObserver to avoid scroll jank
  useEffect(() => {
    if (!sentinelRef.current) return;
    const navHeight = typeof window !== 'undefined' && window.innerWidth <= 767 ? 64 : 76;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      {
        rootMargin: `-${navHeight}px 0px 0px 0px`,
        threshold: [0],
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const productsRef = useRef(products);
  productsRef.current = products;
  const categoriesRef = useRef(categories);
  categoriesRef.current = categories;

  // Silent mount-only reconciliation with localStorage (Strict Mode safe)
  useEffect(() => {
    let cancelled = false;
    async function reconcileOnMount() {
      ensureClientState();
      try {
        const [prods, cats] = await Promise.all([
          getProducts({ storefront }),
          getCategories(),
        ]);
        if (cancelled) return;
        if (!areProductsEqual(productsRef.current, prods)) {
          setProducts(prods);
        }
        if (!areCategoriesEqual(categoriesRef.current, cats)) {
          setCategories(cats);
        }
      } catch {
        // silent fallback
      }
    }
    reconcileOnMount();
    return () => {
      cancelled = true;
    };
  }, []);

  // Separate storefront switch effect (user-triggered storefront change)
  const prevStorefront = useRef(storefront);
  useEffect(() => {
    if (prevStorefront.current === storefront) {
      return;
    }
    prevStorefront.current = storefront;

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

    // Size filter
    if (appliedSizes.length > 0) {
      list = list.filter((p) =>
        p.variants?.some((v) => v.stock > 0 && appliedSizes.includes(v.size))
      );
    }

    // Color filter
    if (appliedColors.length > 0) {
      list = list.filter((p) => {
        return p.variants?.some((v) => {
          const matchedGroup = COLOR_GROUPS.find((g) => appliedColors.includes(g.name));
          if (!matchedGroup) return false;
          return matchedGroup.matches.some((m) =>
            v.color?.toLowerCase().includes(m.toLowerCase())
          );
        });
      });
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
  }, [genderProducts, searchParams, searchQuery, appliedPriceRange, appliedAvailability, appliedSizes, appliedColors, selectedSort]);

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
        smoothScrollService.scrollTo(Math.max(0, targetScroll));
      }
    } else {
      smoothScrollService.scrollTo(0);
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
      smoothScrollService.scrollTo(0);
    }
  }, [searchParams, defaultCategory]);

  const resetFilters = () => {
    setPriceRange([0, 100000]);
    setAppliedPriceRange([0, 100000]);
    setSelectedAvailability('all');
    setAppliedAvailability('all');
    setStagedSizes([]);
    setAppliedSizes([]);
    setStagedColors([]);
    setAppliedColors([]);
    setSelectedSort('popularity');
    setSearchQuery('');
    setStagedCategory(defaultCategory);
    handleCategorySelect(defaultCategory);
    syncFilterParamsToUrl([], []);
  };

  const hasActiveFilters =
    appliedPriceRange[0] > 0 || appliedPriceRange[1] < 100000 ||
    appliedAvailability !== 'all' ||
    appliedSizes.length > 0 ||
    appliedColors.length > 0 ||
    searchQuery.trim().length > 0;

  // In gender mode the banner is always shown (either "all" hero or category swap)
  const bannerKey = gender ? `${gender}-${activeCategory}` : (currentCategory?.id ?? 'none');

  return (
    <div style={{ paddingTop: 'var(--header-total-height, 113px)', paddingBottom: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
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

      {/* Sticky Filter Bar Sentinel for Off-Thread IntersectionObserver */}
      <div ref={sentinelRef} style={{ height: '1px', marginBottom: '-1px', pointerEvents: 'none' }} aria-hidden="true" />

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
            {/* Search Bar, Filters & Sort */}
            <div className="shop-controls-cluster" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
                    width: 'clamp(140px, 22vw, 220px)',
                    minHeight: '44px',
                    padding: '8px 32px 8px 36px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-pill, 999px)',
                    fontSize: '0.82rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--bg-surface)',
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
                      right: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Divider */}
              <div
                className="shop-controls-divider"
                style={{
                  width: '1px',
                  height: '24px',
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
                  setStagedSizes(appliedSizes);
                  setStagedColors(appliedColors);
                  setMobileFiltersOpen(true);
                }}
                className="mobile-filter-btn"
                id="collection-filters-btn"
                aria-label="Open Collection Filters"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  minHeight: '44px',
                  padding: '8px 14px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  outline: 'none',
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
                      backgroundColor: 'var(--color-golden-500)',
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
                  {appliedSizes.map((s) => (
                    <span
                      key={s}
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
                      <span>Size: {s}</span>
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          const updated = appliedSizes.filter((item) => item !== s);
                          setAppliedSizes(updated);
                          setStagedSizes(updated);
                          syncFilterParamsToUrl(updated, appliedColors);
                        }}
                        aria-label={`Remove ${s} size filter`}
                      />
                    </span>
                  ))}
                  {appliedColors.map((c) => (
                    <span
                      key={c}
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
                      <span>Color: {c}</span>
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          const updated = appliedColors.filter((item) => item !== c);
                          setAppliedColors(updated);
                          setStagedColors(updated);
                          syncFilterParamsToUrl(appliedSizes, updated);
                        }}
                        aria-label={`Remove ${c} color filter`}
                      />
                    </span>
                  ))}
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
              smoothScrollService.scrollTo(0);
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
        {gender && activeCategory === 'all' && filteredProducts.length > PAGE_SIZE && (() => {
          const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '40px',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
                style={{
                  width: '44px',
                  height: '44px',
                  minWidth: '44px',
                  minHeight: '44px',
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
                <ChevronLeft size={16} />
              </button>

              {/* Numbered Page Buttons */}
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  aria-label={`Page ${idx + 1}`}
                  aria-current={currentPage === idx + 1 ? 'page' : undefined}
                  style={{
                    width: '44px',
                    height: '44px',
                    minWidth: '44px',
                    minHeight: '44px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: currentPage === idx + 1 ? 600 : 400,
                    border: currentPage === idx + 1 ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                    backgroundColor: currentPage === idx + 1 ? 'var(--text-primary)' : 'var(--bg-surface)',
                    color: currentPage === idx + 1 ? 'var(--bg-primary)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {idx + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
                style={{
                  width: '44px',
                  height: '44px',
                  minWidth: '44px',
                  minHeight: '44px',
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
                <ChevronRight size={16} />
              </button>
            </div>
          );
        })()}
      </div>

      {/* Mobile Filters Drawer / Bottom Sheet */}
      <Drawer
        isOpen={mobileFiltersOpen}
        onClose={() => {
          setStagedCategory(activeCategory);
          setPriceRange(appliedPriceRange);
          setSelectedAvailability(appliedAvailability);
          setStagedSizes(appliedSizes);
          setStagedColors(appliedColors);
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
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          letterSpacing: '0.02em',
          color: 'var(--text-primary)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px 8px 120px' }}>
          {/* Sort Filter Dropdown */}
          <FilterDropdownSection
            title="Sort By"
            isOpen={openSections.sort}
            onToggle={() => toggleFilterSection('sort')}
            badge={SORT_OPTIONS.find((s) => s.id === selectedSort)?.label}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {SORT_OPTIONS.map((opt) => {
                const isSelected = selectedSort === opt.id;
                return (
                  <label
                    key={opt.id}
                    onClick={() => setSelectedSort(opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.95rem',
                      minHeight: '44px',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'var(--overlay-black-5)' : 'transparent',
                      transition: 'background-color 0.2s ease',
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
                    <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </FilterDropdownSection>

          {/* Category Filter Dropdown */}
          <FilterDropdownSection
            title="Category"
            isOpen={openSections.category}
            onToggle={() => toggleFilterSection('category')}
            badge={stagedCategory !== 'all' ? (categories.find((c) => c.slug === stagedCategory)?.name || stagedCategory) : null}
          >
            <div
              className="filter-scroll-container"
              style={{
                height: '210px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {sortedCategories.map((cat) => {
                const isSelected = stagedCategory === cat.slug;
                return (
                  <label
                    key={cat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '0.95rem',
                      minHeight: '44px',
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
          </FilterDropdownSection>

          {/* Size Filter Dropdown */}
          {availableSizes.length > 0 && (
            <FilterDropdownSection
              title="Size"
              isOpen={openSections.size}
              onToggle={() => toggleFilterSection('size')}
              badge={stagedSizes.length > 0 ? `${stagedSizes.length} selected` : null}
            >
              <div
                className="filter-scroll-container"
                style={{
                  height: '130px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  alignContent: 'flex-start',
                }}
              >
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
                        height: '44px',
                        minHeight: '44px',
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
            </FilterDropdownSection>
          )}

          {/* Color Filter Dropdown */}
          <FilterDropdownSection
            title="Color"
            isOpen={openSections.color}
            onToggle={() => toggleFilterSection('color')}
            badge={stagedColors.length > 0 ? `${stagedColors.length} selected` : null}
          >
            <div
              className="filter-scroll-container"
              style={{
                height: '210px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                alignContent: 'flex-start',
              }}
            >
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
                      minHeight: '44px',
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
                            backgroundColor: g.isLight ? 'var(--color-black-tie)' : 'var(--color-diamond)',
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
          </FilterDropdownSection>

          {/* Price Range Dropdown */}
          <FilterDropdownSection
            title="Price Tier"
            isOpen={openSections.price}
            onToggle={() => toggleFilterSection('price')}
            badge={
              priceRange[0] > 0 || priceRange[1] < 100000
                ? `₹${(priceRange[0] / 1000).toFixed(0)}k - ₹${(priceRange[1] / 1000).toFixed(0)}k`
                : null
            }
          >
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
                        minHeight: '44px',
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
                  milestones={PRICE_MILESTONES}
                />
              </div>
            </div>
          </FilterDropdownSection>

          {/* Availability Dropdown */}
          <FilterDropdownSection
            title="Availability"
            isOpen={openSections.availability}
            onToggle={() => toggleFilterSection('availability')}
            badge={selectedAvailability === 'in_stock' ? 'In Stock' : null}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.95rem',
                minHeight: '44px',
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
          </FilterDropdownSection>
        </div>

        {/* Sticky Footer Buttons */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '24px 24px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
          paddingLeft: 'max(24px, env(safe-area-inset-left, 24px))',
          paddingRight: 'max(24px, env(safe-area-inset-right, 24px))',
          display: 'flex',
          gap: '16px',
          background: 'linear-gradient(to top, var(--bg-surface) 75%, transparent 100%)',
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
                setStagedSizes([]);
                setStagedColors([]);
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
                setAppliedSizes(stagedSizes);
                setAppliedColors(stagedColors);
                syncFilterParamsToUrl(stagedSizes, stagedColors);
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
        @media (max-width: 767px) {
          .silhouette-counter {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

