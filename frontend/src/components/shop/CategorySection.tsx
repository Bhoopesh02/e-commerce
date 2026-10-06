'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Category, Product, CategoryShowcaseConfig } from '@/types';
import { SectionBanner } from './SectionBanner';
import { CategoryShowcaseSection, CategoryShowcaseSectionSkeleton } from './CategoryShowcaseSection';
import { CATEGORY_SHOWCASE_CONFIG } from '@/data/categoryBanners';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

export type SectionAnimationVariant =
  | 'fade-up'
  | 'stagger-slide'
  | 'scale-reveal'
  | 'subtle-float'
  | 'default';

export interface CategorySectionSkeletonProps {
  categoryName?: string;
}

export const CategorySectionSkeleton: React.FC<CategorySectionSkeletonProps> = ({
  categoryName,
}) => {
  return (
    <div
      className="category-section-skeleton"
      style={{
        marginBottom: '96px',
        scrollMarginTop: '130px',
      }}
      aria-hidden="true"
    >
      {/* Category Main Banner Skeleton */}
      <div
        style={{
          height: '240px',
          borderRadius: 'var(--radius-lg, 20px)',
          overflow: 'hidden',
          marginBottom: '32px',
        }}
      >
        <Skeleton width="100%" height="100%" borderRadius="20px" />
      </div>

      {/* Subnav Pills Skeleton */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '36px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <Skeleton width="100px" height="32px" borderRadius="999px" />
        <Skeleton width="110px" height="32px" borderRadius="999px" />
        <Skeleton width="90px" height="32px" borderRadius="999px" />
        <Skeleton width="140px" height="32px" borderRadius="999px" />
      </div>

      {/* Category Showcase Section Skeletons */}
      <CategoryShowcaseSectionSkeleton headline={categoryName ? `${categoryName} New Arrivals` : undefined} />
      <CategoryShowcaseSectionSkeleton headline={categoryName ? `${categoryName} Top Picks` : undefined} />
      <CategoryShowcaseSectionSkeleton headline={categoryName ? `Recommended ${categoryName}` : undefined} />
    </div>
  );
};

interface CategorySectionProps {
  category: Category;
  products: Product[];
  animationVariant?: SectionAnimationVariant;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  isLoading?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  products,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  isLoading = false,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'new-arrivals' | 'top-picks' | 'recommended'>('all');

  if (isLoading) {
    return <CategorySectionSkeleton categoryName={category?.name} />;
  }

  // Category Banner Configuration with safe fallback
  const showcaseConfig: CategoryShowcaseConfig = useMemo(() => {
    if (CATEGORY_SHOWCASE_CONFIG[category.slug]) {
      return CATEGORY_SHOWCASE_CONFIG[category.slug];
    }
    const defaultImg = category.bannerImage || category.image || '/images/hero/hero-refined.webp';
    return {
      newArrivals: {
        headline: `${category.name} New Arrivals`,
        subtitle: `Discover the newly unveiled ${category.name.toLowerCase()} silhouettes crafted in our European ateliers.`,
        badge: 'New Season Drop',
        image4k: defaultImg,
        fallbackImage: defaultImg,
      },
      topPicks: {
        headline: `${category.name} Top Picks`,
        subtitle: `Curated iconic ${category.name.toLowerCase()} pieces chosen for impeccable tailoring and material excellence.`,
        badge: 'Atelier Icons',
        image4k: defaultImg,
        fallbackImage: defaultImg,
      },
      recommended: {
        headline: `Recommended ${category.name}`,
        subtitle: `Tailored silhouettes calibrated to complement your discerning aesthetic and seasonal wardrobe.`,
        badge: 'Curated For You',
        image4k: defaultImg,
        fallbackImage: defaultImg,
      },
    };
  }, [category]);

  // Product Partitioning
  const newArrivalsData = useMemo(() => {
    let list = products.filter(
      (p) => p.isNewArrival || p.tags?.includes('new-arrival')
    );
    if (list.length === 0) {
      list = [...products].sort((a, b) => b.price - a.price);
    }
    const featured = list.slice(0, 6);
    return { featured, catalog: list };
  }, [products]);

  const topPicksData = useMemo(() => {
    let list = products.filter(
      (p) =>
        p.featured ||
        p.isTrending ||
        (p.rating && p.rating.average >= 4.8) ||
        p.tags?.includes('bestseller') ||
        p.tags?.includes('iconic') ||
        p.tags?.includes('signature')
    );
    if (list.length === 0) {
      list = [...products].sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    }
    const featured = list.slice(0, 6);
    return { featured, catalog: list };
  }, [products]);

  const recommendedData = useMemo(() => {
    // Curated recommendations prioritizing high quality ratings & diverse silhouettes
    let list = products.filter(
      (p) =>
        p.tags?.some((t) => ['editorial', 'luxury', 'iconic', 'heritage', 'bestseller'].includes(t)) ||
        p.featured
    );
    if (list.length === 0) {
      list = [...products];
    }
    const featured = list.slice(0, 6);
    return { featured, catalog: list };
  }, [products]);

  const scrollToSubSection = (sectionId: string, tab: 'all' | 'new-arrivals' | 'top-picks' | 'recommended') => {
    setActiveSubTab(tab);
    const navOffset = typeof window !== 'undefined' && window.innerWidth <= 767 ? 118 : 130;
    if (tab === 'all') {
      const topEl = document.getElementById(`section-${category.slug}`);
      if (topEl) {
        const offset = topEl.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
      }
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      key={category.id}
      id={`section-${category.slug}`}
      data-category-section={category.slug}
      className={`category-section section-${category.slug}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      style={{
        marginBottom: '96px',
        scrollMarginTop: '130px',
      }}
    >
      {/* Existing Category Main Banner (Preserved) */}
      <SectionBanner
        category={category}
        productCount={products.length}
        onNext={onNext}
        onPrev={onPrev}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />

      {/* Category Header Controls & Sub-Section Anchors */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '36px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {/* Left: Section Jump Anchor Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            maxWidth: '100%',
          }}
          className="category-subnav-pills"
        >
          <button
            onClick={() => scrollToSubSection(`section-${category.slug}`, 'all')}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 500,
              backgroundColor: activeSubTab === 'all' ? 'var(--text-primary)' : 'var(--bg-surface)',
              color: activeSubTab === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            All Sections
          </button>

          <button
            onClick={() =>
              scrollToSubSection(`sec-${category.slug}-new-arrivals`, 'new-arrivals')
            }
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 500,
              backgroundColor: activeSubTab === 'new-arrivals' ? 'var(--text-primary)' : 'var(--bg-surface)',
              color: activeSubTab === 'new-arrivals' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            New Arrivals
          </button>

          <button
            onClick={() =>
              scrollToSubSection(`sec-${category.slug}-top-picks`, 'top-picks')
            }
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 500,
              backgroundColor: activeSubTab === 'top-picks' ? 'var(--text-primary)' : 'var(--bg-surface)',
              color: activeSubTab === 'top-picks' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            Top Picks
          </button>

          <button
            onClick={() =>
              scrollToSubSection(`sec-${category.slug}-recommended`, 'recommended')
            }
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 500,
              backgroundColor: activeSubTab === 'recommended' ? 'var(--text-primary)' : 'var(--bg-surface)',
              color: activeSubTab === 'recommended' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            Recommended For You
          </button>
        </div>

        {/* Right: Category Next / Prev Switches */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          {hasPrev && onPrev && (
            <button
              onClick={onPrev}
              aria-label="Previous Category"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Prev Category</span>
            </button>
          )}

          {hasNext && onNext && (
            <button
              onClick={onNext}
              aria-label="Next Category"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              <span className="hidden sm:inline">Next Category</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: New Arrivals Showcase */}
      <CategoryShowcaseSection
        sectionId={`sec-${category.slug}-new-arrivals`}
        config={showcaseConfig.newArrivals}
        featuredProducts={newArrivalsData.featured}
        catalogProducts={newArrivalsData.catalog}
        categoryName={category.name}
      />

      {/* SECTION 2: Top Picks Showcase */}
      <CategoryShowcaseSection
        sectionId={`sec-${category.slug}-top-picks`}
        config={showcaseConfig.topPicks}
        featuredProducts={topPicksData.featured}
        catalogProducts={topPicksData.catalog}
        categoryName={category.name}
      />

      {/* SECTION 3: Recommended For You Showcase */}
      <CategoryShowcaseSection
        sectionId={`sec-${category.slug}-recommended`}
        config={showcaseConfig.recommended}
        featuredProducts={recommendedData.featured}
        catalogProducts={recommendedData.catalog}
        categoryName={category.name}
      />
    </motion.section>
  );
};
