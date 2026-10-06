'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { getProducts, getCategories } from '@/lib/mockApi';
import { Product, Category } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { CategorySection, CategorySectionSkeleton, SectionAnimationVariant } from '@/components/shop/CategorySection';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { ProductCard } from '@/components/product/ProductCard';
import { CollectionNewArrivals } from '@/components/sections/CollectionNewArrivals';
import { CollectionsBannerCarousel } from '@/components/sections/CollectionsBannerCarousel';
import { AnimatePresence, motion } from 'framer-motion';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { SlidersHorizontal, X, RotateCcw, ArrowUp, CloudRain, Scissors, Sparkles, Shirt, ShoppingBag, Footprints, Gem, FlaskConical, Check } from 'lucide-react';

export const ShopViewSkeleton: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '96px', paddingTop: '100px' }} aria-busy="true">
      {/* Sticky Bar Skeleton */}
      <div
        style={{
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)',
          padding: '16px 0',
          marginBottom: '36px',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'hidden' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} width="110px" height="38px" borderRadius="999px" />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Skeleton width="130px" height="38px" borderRadius="8px" />
          </div>
        </div>
      </div>

      {/* Main Content Container Skeleton */}
      <div className="container">
        <CategorySectionSkeleton categoryName="Atelier Collections" />
      </div>
    </div>
  );
};



const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'outerwear': return <CloudRain size={22} strokeWidth={1.2} />;
    case 'tailoring': return <Scissors size={22} strokeWidth={1.2} />;
    case 'eveningwear': return <Sparkles size={22} strokeWidth={1.2} />;
    case 'knitwear': return <Shirt size={22} strokeWidth={1.2} />;
    case 'leather-goods': return <ShoppingBag size={22} strokeWidth={1.2} />;
    case 'footwear': return <Footprints size={22} strokeWidth={1.2} />;
    case 'fine-jewelry': return <Gem size={22} strokeWidth={1.2} />;
    case 'fragrances': return <FlaskConical size={22} strokeWidth={1.2} />;
    default: return <Shirt size={22} strokeWidth={1.2} />;
  }
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
}

export const ShopView: React.FC<ShopViewProps> = ({
  initialProducts,
  initialCategories,
}) => {
  const searchParams = useSearchParams();
  const { storefront } = useStorefrontStore();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);

  // Filter & Navigation States
  const [activeCategory, setActiveCategory] = useState<string>('outerwear');
  const [navigationDirection, setNavigationDirection] = useState<number>(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [appliedAvailability, setAppliedAvailability] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('popularity');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isStuck, setIsStuck] = useState(false);

  const stickyBarRef = useRef<HTMLDivElement>(null);
  const categoryScrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryTabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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

  useEffect(() => {
    const updateScroll = () => {
      if (window.innerWidth > 767) return;
      
      const container = categoryScrollContainerRef.current;
      const tab = categoryTabRefs.current[activeCategory];
      
      if (!container || !tab) return;
      
      const target = tab.offsetLeft - (container.clientWidth - tab.offsetWidth) / 2;
      const max = container.scrollWidth - container.clientWidth;
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      container.scrollTo({ 
        left: Math.max(0, Math.min(target, max)), 
        behavior: prefersReducedMotion ? 'auto' : 'smooth' 
      });
    };

    updateScroll();
    window.addEventListener('resize', updateScroll);
    return () => window.removeEventListener('resize', updateScroll);
  }, [activeCategory]);

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

  // Client-side filtering and sorting across catalog
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Tag filter from URL (e.g. new-arrival, trending)
    const urlTag = searchParams.get('tag');
    if (urlTag) {
      list = list.filter((p) => p.tags.includes(urlTag));
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
  }, [products, searchParams, appliedPriceRange, appliedAvailability, selectedSort]);

  const newArrivals = useMemo(() => {
    return products.filter((p) => p.isNewArrival);
  }, [products]);

  // Handle category selection
  const handleCategorySelect = useCallback((slug: string) => {
    setActiveCategory((prev) => {
      const prevIndex = categories.findIndex((c) => c.slug === prev);
      const newIndex = categories.findIndex((c) => c.slug === slug);
      if (prevIndex !== -1 && newIndex !== -1) {
        setNavigationDirection(newIndex > prevIndex ? 1 : -1);
      }
      return slug;
    });

    // Scroll to the sticky bar to ensure the category content is visible
    if (stickyBarRef.current) {
      const navHeight = typeof window !== 'undefined' && window.innerWidth <= 767 ? 64 : 76;
      const naturalTop = stickyBarRef.current.offsetTop;
      const targetScroll = naturalTop - navHeight;
      if (Math.abs(window.pageYOffset - targetScroll) > 16) {
        window.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [categories]);

  const activeCategoryIndex = useMemo(() => {
    return categories.findIndex((c) => c.slug === activeCategory);
  }, [categories, activeCategory]);

  const handleNextCategory = useCallback(() => {
    if (activeCategoryIndex >= 0) {
      const nextIndex = (activeCategoryIndex + 1) % categories.length;
      handleCategorySelect(categories[nextIndex].slug);
    }
  }, [activeCategoryIndex, categories, handleCategorySelect]);

  const handlePrevCategory = useCallback(() => {
    if (activeCategoryIndex >= 0) {
      const prevIndex = (activeCategoryIndex - 1 + categories.length) % categories.length;
      handleCategorySelect(categories[prevIndex].slug);
    }
  }, [activeCategoryIndex, categories, handleCategorySelect]);

  // Handle URL category slug on initial mount
  useEffect(() => {
    const urlCatSlug = searchParams.get('categorySlug');
    if (urlCatSlug && !loading) {
      const timeout = setTimeout(() => {
        handleCategorySelect(urlCatSlug);
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [searchParams, loading, handleCategorySelect]);

  const resetFilters = () => {
    setPriceRange([0, 100000]);
    setAppliedPriceRange([0, 100000]);
    setSelectedAvailability('all');
    setAppliedAvailability('all');
    setSelectedSort('popularity');
    handleCategorySelect('outerwear');
  };

  const hasActiveFilters =
    appliedPriceRange[0] > 0 || appliedPriceRange[1] < 100000 ||
    appliedAvailability !== 'all';

  return (
    <div style={{ paddingTop: '76px', paddingBottom: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <CollectionsBannerCarousel />

      <div className="container">
        {newArrivals.length > 0 && (
          <CollectionNewArrivals
            products={newArrivals}
            title="New Arrivals"
            subtitle="Latest Discoveries"
            onExploreClick={() => {
              if (stickyBarRef.current) {
                const navHeight = typeof window !== 'undefined' && window.innerWidth <= 767 ? 64 : 76;
                const offset = stickyBarRef.current.offsetTop - navHeight;
                window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
              }
            }}
          />
        )}
      </div>

      {/* Sticky Category Navigation Bar & Global Controls (Fixed Nav Bar on Collection Page) */}
      <div
        ref={stickyBarRef}
        className={`sticky-navigation-header ${isStuck ? 'is-stuck' : ''}`}
        style={{
          paddingTop: '12px',
          paddingBottom: '12px',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            {/* Category Typography Navigation */}
            <div
              ref={categoryScrollContainerRef}
              className="flex items-center justify-center gap-6 md:gap-10 category-pill-strip"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                maxWidth: '100%',
                padding: '4px 0',
              }}
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat.slug;

                return (
                  <button
                    key={cat.id}
                    ref={(el) => {
                      categoryTabRefs.current[cat.slug] = el;
                    }}
                    type="button"
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`nav-btn-custom ${isActive ? 'active-mobile-tab' : ''}`}
                  >
                    {/* Category Label */}
                    <span
                      className={`nav-label-custom ${isActive ? 'active' : ''}`}
                    >
                      {cat.name}
                    </span>

                    {/* 1. Inactive Hover Underline (Left-to-Right sweep on hover) */}
                    {!isActive && (
                      <span className="hover-underline-custom" />
                    )}

                    {/* 2. Active Fixed Underline (Scoped to active word width) */}
                    {isActive && (
                      <motion.div
                        className="mobile-hide-underline"
                        layoutId="activeCategoryUnderline"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 35,
                        }}
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '2px',
                          backgroundColor: '#121624',
                          pointerEvents: 'none',
                          originX: navigationDirection > 0 ? 0 : 1,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Filters Trigger Button & Product Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto', flexShrink: 0 }}>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="mobile-filter-btn"
                id="collection-filters-btn"
                aria-label="Open Collection Filters"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 18px',
                  borderRadius: 'var(--radius-pill)',
                  border: hasActiveFilters ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: hasActiveFilters ? 'var(--text-primary)' : 'var(--bg-surface)',
                  color: hasActiveFilters ? 'var(--bg-primary)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
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
                      backgroundColor: 'var(--color-terracotta, #D19662)',
                      marginLeft: '2px',
                    }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active Filters:</span>
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
                  }}
                >
                  Price: ₹{appliedPriceRange[0].toLocaleString()} - ₹{appliedPriceRange[1].toLocaleString()}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => { setPriceRange([0, 100000]); setAppliedPriceRange([0, 100000]); }} />
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
                  }}
                >
                  In Stock Only
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => { setSelectedAvailability('all'); setAppliedAvailability('all'); }} />
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
                  color: 'var(--color-sapphire)',
                  cursor: 'pointer',
                  marginLeft: '4px',
                }}
              >
                <RotateCcw size={12} /> Reset all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ marginTop: '36px' }}>
        {/* Distinct Category Sections */}
        {loading ? (
          <div className="category-sections-container">
            <CategorySectionSkeleton
              categoryName={categories.find((c) => c.slug === activeCategory)?.name || 'Outerwear'}
            />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="category-sections-container">
            <AnimatePresence mode="wait">
              {categories.map((category, index) => {
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
              })}
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
      </div>

      {/* Mobile Filters Drawer / Bottom Sheet */}
      <Drawer
        isOpen={mobileFiltersOpen}
        onClose={() => {
          setPriceRange(appliedPriceRange);
          setSelectedAvailability(appliedAvailability);
          setMobileFiltersOpen(false);
        }}
        title="REFINE COLLECTION"
        position="right"
        contentStyle={{ backgroundColor: '#F8F5F0' }}
        headerStyle={{
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          padding: '24px 32px 16px',
        }}
        titleStyle={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.4rem',
          letterSpacing: '0.02em',
          color: '#1a1a1a',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '16px 8px 120px' }}>
          {/* Jump to Category */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', letterSpacing: '0.06em', marginBottom: '16px', color: '#1a1a1a', textTransform: 'uppercase' }}>
              Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {categories.map((c) => {
                const isActive = activeCategory === c.slug;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      handleCategorySelect(c.slug);
                      setMobileFiltersOpen(false);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      color: isActive ? '#A37C63' : '#333',
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '1.05rem',
                      fontWeight: isActive ? 500 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ color: isActive ? '#A37C63' : '#555', display: 'flex', alignItems: 'center' }}>
                      {getCategoryIcon(c.slug)}
                    </span>
                    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                      {isActive && <span style={{ position: 'absolute', left: '-12px', width: '6px', height: '6px', backgroundColor: '#A37C63', borderRadius: '50%' }} />}
                      {c.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', letterSpacing: '0.06em', marginBottom: '16px', color: '#1a1a1a', textTransform: 'uppercase' }}>
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
                    <label key={p.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      padding: '10px 14px',
                      backgroundColor: isChecked && p.id !== 'all' ? '#FFFFFF' : 'transparent',
                      borderRadius: '12px',
                      boxShadow: isChecked && p.id !== 'all' ? '0 2px 8px rgba(0,0,0,0.03)' : 'none',
                      border: isChecked && p.id !== 'all' ? '1px solid rgba(0,0,0,0.04)' : '1px solid transparent',
                      transition: 'all 0.2s ease',
                      marginLeft: '-14px',
                      whiteSpace: 'nowrap'
                    }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '1px solid #758b85',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        backgroundColor: isChecked ? '#758b85' : 'transparent'
                      }}>
                        {isChecked && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff' }} />}
                      </div>
                      <input
                        type="radio"
                        name="price"
                        checked={isChecked}
                        onChange={() => setPriceRange(p.range as [number, number])}
                        style={{ display: 'none' }}
                      />
                      <span style={{ color: '#1a1a1a' }}>{p.label}</span>
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
                  milestones={useMemo(() => [
                    { value: 0, label: '₹0' },
                    { value: 20000, label: '₹20K' },
                    { value: 35000, label: '₹35K' },
                    { value: 100000, label: '₹100K+' }
                  ], [])}
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', letterSpacing: '0.06em', marginBottom: '16px', color: '#1a1a1a', textTransform: 'uppercase' }}>
              Availability
            </h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', cursor: 'pointer', color: '#1a1a1a', marginLeft: '-2px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                border: '1px solid #758b85',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selectedAvailability === 'in_stock' ? '#758b85' : 'transparent',
              }}>
                {selectedAvailability === 'in_stock' && <Check size={12} color="#fff" strokeWidth={3} />}
              </div>
              <input
                type="checkbox"
                checked={selectedAvailability === 'in_stock'}
                onChange={(e) => setSelectedAvailability(e.target.checked ? 'in_stock' : 'all')}
                style={{ display: 'none' }}
              />
              In Stock Pieces Only
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
          background: 'linear-gradient(to top, #F8F5F0 70%, rgba(248, 245, 240, 0) 100%)',
          borderTop: 'none',
          pointerEvents: 'none',
        }}>
          <div style={{ display: 'flex', gap: '12px', width: '100%', pointerEvents: 'auto' }}>
            <Button
              variant="outline"
              fullWidth
              onClick={resetFilters}
              style={{
                borderRadius: '30px',
                borderColor: '#A37C63',
                color: '#1a1a1a',
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
                setAppliedPriceRange(priceRange);
                setAppliedAvailability(selectedAvailability);
                setMobileFiltersOpen(false);
              }}
              style={{
                borderRadius: '30px',
                backgroundColor: '#D19662',
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontWeight: 600,
                height: '48px',
                boxShadow: '0 8px 16px rgba(209, 150, 98, 0.25)',
                border: 'none'
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Drawer>

      <style jsx global>{`
        .category-pill-strip::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 768px) {
          .silhouette-counter {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .category-pill-strip {
            justify-content: flex-start !important;
            padding-inline: 16px !important;
            scroll-padding-inline: 16px !important;
          }
          .nav-btn-custom.active-mobile-tab {
            border-bottom: 2px solid var(--color-sapphire);
          }
          .mobile-hide-underline {
            display: none !important;
          }
        }
        .nav-btn-custom {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 4px;
          background: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .nav-label-custom {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: color 0.2s ease;
          color: #737373;
          font-weight: 400;
          font-family: inherit;
        }
        .nav-label-custom.active {
          color: #121624;
          font-weight: 600;
        }
        .nav-btn-custom:hover .nav-label-custom:not(.active) {
          color: #000;
        }
        .hover-underline-custom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1.5px;
          background-color: #a3a3a3;
          display: block;
          transform-origin: left;
          transform: scaleX(0);
          transition: transform 0.3s ease-out;
          pointer-events: none;
        }
        .nav-btn-custom:hover .hover-underline-custom {
          transform: scaleX(1);
        }
        @media (min-width: 768px) {
          .nav-label-custom {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};
