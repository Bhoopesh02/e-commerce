'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { getProducts, getCategories } from '@/lib/mockApi';
import { Product, Category } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { CategorySection, SectionAnimationVariant } from '@/components/shop/CategorySection';
import { ProductCard } from '@/components/product/ProductCard';
import { AnimatePresence, motion } from 'framer-motion';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { SlidersHorizontal, X, RotateCcw, ArrowUp } from 'lucide-react';

import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';

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

export const ShopView: React.FC = () => {
  const searchParams = useSearchParams();
  const { storefront } = useStorefrontStore();

  const [products, setProducts] = useState<Product[]>(productsData as Product[]);
  const [categories, setCategories] = useState<Category[]>(
    (categoriesData as Category[]).filter((c) => c.visible)
  );
  const [loading, setLoading] = useState(false);

  // Filter & Navigation States
  const [activeCategory, setActiveCategory] = useState<string>('outerwear');
  const [navigationDirection, setNavigationDirection] = useState<number>(1);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('popularity');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const heroBannerRef = useRef<HTMLDivElement>(null);
  const stickyBarRef = useRef<HTMLDivElement>(null);

  // Load catalog data
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

  // Client-side filtering and sorting across catalog
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Tag filter from URL (e.g. new-arrival, trending)
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
  }, [products, searchParams, selectedPriceRange, selectedAvailability, selectedSort]);

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
      const offset = stickyBarRef.current.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [categories]);

  const activeCategoryIndex = useMemo(() => {
    return categories.findIndex((c) => c.slug === activeCategory);
  }, [categories, activeCategory]);

  const handleNextCategory = useCallback(() => {
    if (activeCategoryIndex >= 0 && activeCategoryIndex < categories.length - 1) {
      handleCategorySelect(categories[activeCategoryIndex + 1].slug);
    }
  }, [activeCategoryIndex, categories, handleCategorySelect]);

  const handlePrevCategory = useCallback(() => {
    if (activeCategoryIndex > 0) {
      handleCategorySelect(categories[activeCategoryIndex - 1].slug);
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
    setSelectedPriceRange('all');
    setSelectedAvailability('all');
    setSelectedSort('popularity');
    handleCategorySelect('outerwear');
  };

  const hasActiveFilters =
    selectedPriceRange !== 'all' ||
    selectedAvailability !== 'all';

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Editorial Campaign Master Hero Banner (Untouched New Collections Banner) */}
        <div
          ref={heroBannerRef}
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '20px',
            marginBottom: '32px',
            minHeight: '320px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 24px 48px -12px rgba(12, 10, 20, 0.35)',
            border: '1px solid rgba(232, 188, 185, 0.22)',
            backgroundColor: '#0c0a14',
          }}
          className="group hero-master-banner"
        >
          {/* Background Image Container */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
            }}
          >
            <Image
              src="/images/banners/photo-1483985988355-763728e1935b.webp"
              alt="New Collections Campaign"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              style={{
                objectFit: 'cover',
                objectPosition: 'center 26%',
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="group-hover:scale-105"
            />
            {/* Multi-Stop Cinematic Editorial Gradients */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, rgba(12, 10, 20, 0.94) 0%, rgba(12, 10, 20, 0.82) 42%, rgba(12, 10, 20, 0.42) 75%, rgba(12, 10, 20, 0.6) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(0deg, rgba(12, 10, 20, 0.7) 0%, transparent 65%)',
              }}
            />
          </div>

          {/* Banner Typography & Accents */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              padding: 'clamp(36px, 5vw, 60px)',
              maxWidth: '740px',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                color: '#fff8f5',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                marginBottom: '14px',
                textShadow: '0 2px 18px rgba(0,0,0,0.5)',
              }}
            >
              New Collections
            </h1>

            <p
              style={{
                color: 'rgba(255, 248, 245, 0.9)',
                fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                lineHeight: 1.65,
                marginBottom: '22px',
                maxWidth: '620px',
                textShadow: '0 1px 10px rgba(0,0,0,0.6)',
              }}
            >
              Explore our full editorial portfolio of outerwear, Italian tailoring, cashmere knitwear, and artisanal accessories.
            </p>

            {/* Quick Editorial Tags */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '5px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  fontSize: '0.75rem',
                  color: '#fff8f5',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                {filteredProducts.length} Editorial Pieces
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '5px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  fontSize: '0.75rem',
                  color: '#fff8f5',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                Hand-Finished in Italy
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '5px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  fontSize: '0.75rem',
                  color: '#fff8f5',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                Complimentary Global Shipping
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Category Navigation Bar & Global Controls */}
        <div
          ref={stickyBarRef}
          style={{
            position: 'sticky',
            top: '70px',
            zIndex: 30,
            backgroundColor: 'var(--bg-primary)',
            paddingTop: '12px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '40px',
            transition: 'all 0.3s ease',
          }}
          className="sticky-navigation-header"
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            {/* Category Typography Navigation */}
            <div
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
                    type="button"
                    onClick={() => handleCategorySelect(cat.slug)}
                    className="group relative inline-flex flex-col items-center justify-center py-2 px-1 cursor-pointer bg-transparent border-0 outline-none select-none"
                    style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    {/* Category Label */}
                    <span
                      className={`text-xs md:text-[13px] tracking-[0.2em] uppercase transition-colors duration-200 ${
                        isActive
                          ? 'text-[#121624] font-semibold'
                          : 'text-neutral-500 group-hover:text-black font-normal'
                      }`}
                    >
                      {cat.name}
                    </span>

                    {/* 1. Inactive Hover Underline (Left-to-Right sweep on hover) */}
                    {!isActive && (
                      <span
                        className="absolute bottom-0 left-0 w-full h-[1.5px] bg-neutral-400 block origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out pointer-events-none"
                      />
                    )}

                    {/* 2. Active Fixed Underline (Scoped to active word width) */}
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryUnderline"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-[#121624] pointer-events-none"
                        initial={false}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 35,
                        }}
                        style={{
                          originX: navigationDirection > 0 ? 0 : 1,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Sort Dropdown & Product Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto', flexShrink: 0 }}>
              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--bg-surface)',
                  cursor: 'pointer',
                }}
                className="mobile-filter-btn"
              >
                <SlidersHorizontal size={14} />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }} className="silhouette-counter">
                {filteredProducts.length} Silhouettes
              </span>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active Filters:</span>
              {selectedPriceRange !== 'all' && (
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
                    padding: '3px 10px',
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
                  background: 'none',
                  border: 'none',
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
        </div>

        {/* Distinct Category Sections */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
            {Array.from({ length: 3 }).map((_, secIdx) => (
              <div key={secIdx}>
                <Skeleton height="280px" borderRadius="20px" style={{ marginBottom: '32px' }} />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '32px',
                  }}
                >
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
              </div>
            ))}
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
                    hasNext={index < categories.length - 1}
                    hasPrev={index > 0}
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
              if (heroBannerRef.current) {
                const topOffset = heroBannerRef.current.getBoundingClientRect().top + window.pageYOffset - 90;
                window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
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
        onClose={() => setMobileFiltersOpen(false)}
        title="Refine Collection"
        position="right"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Jump to Category */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Jump to Discipline
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                      padding: '12px 12px',
                      color: isActive ? '#121624' : 'var(--text-primary)',
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '1rem',
                      fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isActive && <div style={{ width: '4px', height: '4px', backgroundColor: '#121624', borderRadius: '50%' }} />}
                    {!isActive && <div style={{ width: '4px', height: '4px', backgroundColor: 'transparent' }} />}
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Price Tier
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'all', label: 'All Price Tiers' },
                { id: 'under-20k', label: 'Under ₹20,000' },
                { id: '20k-35k', label: '₹20,000 - ₹35,000' },
                { id: 'above-35k', label: 'Above ₹35,000' },
              ].map((p) => (
                <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === p.id}
                    onChange={() => setSelectedPriceRange(p.id)}
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Availability
            </h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
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
        .category-pill-strip::-webkit-scrollbar {
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
