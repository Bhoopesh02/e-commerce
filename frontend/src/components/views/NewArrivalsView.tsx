'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getProducts, getCategories } from '@/lib/mockApi';
import { Product, Category } from '@/types';
import { ProductCard, ProductGridSkeleton } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { SlidersHorizontal, X, RotateCcw, ArrowUp, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const NewArrivalsView: React.FC = () => {
  const { storefront } = useStorefrontStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStuck, setIsStuck] = useState(false);
  const stickyBarRef = useRef<HTMLDivElement>(null);

  // Filters
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [appliedAvailability, setAppliedAvailability] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (stickyBarRef.current) {
        const navHeight = window.innerWidth <= 767 ? 64 : 76;
        const rect = stickyBarRef.current.getBoundingClientRect();
        setIsStuck(rect.top <= navHeight + 2);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          setProducts(prods.filter(p => p.isNewArrival || p.tags?.includes('new-arrival')));
          setCategories(cats);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [storefront]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'all') {
      const cat = categories.find(c => c.slug === activeCategory);
      if (cat) {
        list = list.filter(p => p.categoryId === cat.id);
      }
    }

    list = list.filter(p => p.price >= appliedPriceRange[0] && p.price <= appliedPriceRange[1]);

    if (appliedAvailability === 'in_stock') {
      list = list.filter(p => p.availability !== 'out_of_stock');
    }

    return list;
  }, [products, categories, activeCategory, appliedPriceRange, appliedAvailability]);

  const resetFilters = () => {
    setActiveCategory('all');
    setPriceRange([0, 100000]);
    setAppliedPriceRange([0, 100000]);
    setSelectedAvailability('all');
    setAppliedAvailability('all');
  };

  const hasActiveFilters = activeCategory !== 'all' || appliedPriceRange[0] > 0 || appliedPriceRange[1] < 100000 || appliedAvailability !== 'all';

  return (
    <div style={{ paddingTop: '76px', paddingBottom: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Page Header */}
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: 'var(--font-display)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          New Arrivals
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px' }}>
          Discover the latest pieces from our collection, featuring exceptional craftsmanship and timeless design.
        </p>
      </div>

      {/* Sticky Filter Bar */}
      <div
        ref={stickyBarRef}
        className={`sticky-navigation-header ${isStuck ? 'is-stuck' : ''}`}
        style={{ paddingTop: '4px', paddingBottom: '4px' }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            {/* Filters Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto', flexShrink: 0 }}>
              <button
                onClick={() => setMobileFiltersOpen(true)}
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
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active Filters:</span>
              {(appliedPriceRange[0] > 0 || appliedPriceRange[1] < 100000) && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                  Price: ₹{appliedPriceRange[0].toLocaleString()} - ₹{appliedPriceRange[1].toLocaleString()}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => { setPriceRange([0, 100000]); setAppliedPriceRange([0, 100000]); }} />
                </span>
              )}
              {appliedAvailability !== 'all' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                  In Stock Only
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => { setSelectedAvailability('all'); setAppliedAvailability('all'); }} />
                </span>
              )}
              <button onClick={resetFilters} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', fontSize: '0.78rem', color: 'var(--brand-primary)', cursor: 'pointer', marginLeft: '4px' }}>
                <RotateCcw size={12} /> Reset all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ marginTop: '36px' }}>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }} className="product-grid max-md:!grid max-md:!grid-cols-2 max-md:!gap-[12px]">
            {filteredProducts.map((product, idx) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.45, delay: (idx % 4) * 0.06 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>No Silhouettes Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>We could not find any garments matching your active filter criteria.</p>
            <Button variant="primary" onClick={resetFilters}>Reset Filters</Button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover-fill-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 500, backgroundColor: 'var(--bg-surface)', cursor: 'pointer' }}>
            <ArrowUp size={16} />
            <span>Return to Top</span>
          </button>
        </div>
      </div>

      <Drawer
        isOpen={mobileFiltersOpen}
        onClose={() => { setPriceRange(appliedPriceRange); setSelectedAvailability(appliedAvailability); setMobileFiltersOpen(false); }}
        title="REFINE COLLECTION"
        position="right"
        contentStyle={{ backgroundColor: 'var(--bg-surface)' }}
        headerStyle={{ borderBottom: '1px solid var(--overlay-black-5)', padding: '24px 32px 16px' }}
        titleStyle={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', letterSpacing: '0.02em', color: 'var(--text-primary)' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '16px 8px 120px' }}>
          {/* Category Filter */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', letterSpacing: '0.06em', marginBottom: '20px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>Category</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '1.05rem', cursor: 'pointer', color: 'var(--text-primary)', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeCategory === 'all' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#141414' }} />}
                </div>
                <input type="radio" checked={activeCategory === 'all'} onChange={() => setActiveCategory('all')} style={{ display: 'none' }} />
                <span style={{ fontWeight: activeCategory === 'all' ? 500 : 400, opacity: activeCategory === 'all' ? 1 : 0.8 }}>All Categories</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} style={{ display: 'flex', alignItems: 'center', fontSize: '1.05rem', cursor: 'pointer', color: 'var(--text-primary)', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {activeCategory === cat.slug && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#141414' }} />}
                  </div>
                  <input type="radio" checked={activeCategory === cat.slug} onChange={() => setActiveCategory(cat.slug)} style={{ display: 'none' }} />
                  <span style={{ fontWeight: activeCategory === cat.slug ? 500 : 400, opacity: activeCategory === cat.slug ? 1 : 0.8 }}>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', letterSpacing: '0.06em', marginBottom: '16px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>Price Tier</h4>
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
                    <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', cursor: 'pointer', padding: '10px 14px', backgroundColor: isChecked && p.id !== 'all' ? 'var(--color-diamond)' : 'transparent', borderRadius: '12px', boxShadow: isChecked && p.id !== 'all' ? '0 2px 8px var(--overlay-black-5)' : 'none', border: isChecked && p.id !== 'all' ? '1px solid var(--overlay-black-5)' : '1px solid transparent', transition: 'all 0.2s ease', marginLeft: '-14px', whiteSpace: 'nowrap' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--color-icy-lake-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: isChecked ? 'var(--color-icy-lake-600)' : 'transparent' }}>
                        {isChecked && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-diamond)' }} />}
                      </div>
                      <input type="radio" name="price" checked={isChecked} onChange={() => setPriceRange(p.range as [number, number])} style={{ display: 'none' }} />
                      <span style={{ color: 'var(--text-primary)' }}>{p.label}</span>
                    </label>
                  );
                })}
              </div>
              <div style={{ width: '100%', maxWidth: '420px', boxSizing: 'border-box', minWidth: 0 }}>
                <RangeSlider min={0} max={100000} step={5000} value={priceRange} onChange={setPriceRange} milestones={useMemo(() => [{ value: 0, label: '₹0' }, { value: 20000, label: '₹20K' }, { value: 35000, label: '₹35K' }, { value: 100000, label: '₹100K+' }], [])} />
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', letterSpacing: '0.06em', marginBottom: '16px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>Availability</h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', cursor: 'pointer', color: 'var(--text-primary)', marginLeft: '-2px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid var(--color-icy-lake-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: selectedAvailability === 'in_stock' ? 'var(--color-icy-lake-600)' : 'transparent' }}>
                {selectedAvailability === 'in_stock' && <Check size={12} color="var(--color-diamond)" strokeWidth={3} />}
              </div>
              <input type="checkbox" checked={selectedAvailability === 'in_stock'} onChange={(e) => setSelectedAvailability(e.target.checked ? 'in_stock' : 'all')} style={{ display: 'none' }} />
              In Stock Pieces Only
            </label>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '24px 32px 32px', display: 'flex', gap: '16px', background: 'linear-gradient(to top, var(--bg-surface) 70%, transparent 100%)', borderTop: 'none', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', gap: '12px', width: '100%', pointerEvents: 'auto' }}>
            <Button variant="outline" fullWidth onClick={resetFilters} style={{ borderRadius: '30px', borderColor: 'var(--text-accent)', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, height: '48px', backgroundColor: 'transparent' }}>Reset</Button>
            <Button variant="primary" fullWidth onClick={() => { setAppliedPriceRange(priceRange); setAppliedAvailability(selectedAvailability); setMobileFiltersOpen(false); }} style={{ borderRadius: '30px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, height: '48px', boxShadow: '0 8px 16px var(--overlay-golden-35)', border: 'none' }}>Apply Filters</Button>
          </div>
        </div>
      </Drawer>
      <style jsx global>{`
        .category-pill-strip::-webkit-scrollbar { display: none; }
        .nav-btn-custom { position: relative; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px 4px; background: transparent; border: none; outline: none; cursor: pointer; user-select: none; white-space: nowrap; flex-shrink: 0; }
        .nav-label-custom { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; transition: color 0.2s ease; color: var(--text-muted); font-weight: 400; font-family: inherit; }
        .nav-label-custom.active { color: var(--text-primary); font-weight: 600; }
      `}</style>
    </div>
  );
};
