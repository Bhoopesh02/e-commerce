'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { CuratedEditsHeroBanner } from '@/components/sections/CuratedEditsHeroBanner';
import styles from './CollectionsView.module.css';

interface CollectionsViewProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  initialProducts,
  initialCategories,
}) => {
  // Count products per category
  const productCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    initialProducts.forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
    });
    return counts;
  }, [initialProducts]);

  // Featured runway pieces (coveted / new arrivals)
  const runwayPieces = useMemo(() => {
    return initialProducts.filter((p) => p.isNewArrival || p.isTrending).slice(0, 8);
  }, [initialProducts]);

  // Department collections data
  const departmentCollections = [
    {
      id: 'men',
      name: 'Aurelia Homme',
      title: "The Men's Wardrobe",
      subtitle: 'Architectural silhouettes, Savile Row precision, and noble natural fibers crafted for longevity.',
      href: '/collections/men',
      image: '/images/banners/all-collections/shop-by-department/men.webp',
      badge: 'Savile Row Precision',
      tagline: 'Italian tailoring & natural fibers',
      itemCount: initialProducts.filter((p) => p.genders?.includes('men')).length,
      cta: 'Shop the collection',
      objectPosition: 'center 8%',
    },
    {
      id: 'women',
      name: 'Aurelia Femme',
      title: "The Women's Collection",
      subtitle: 'Sculptural drapery, liquid mulberry silks, and tactile tailoring designed with quiet authority.',
      href: '/collections/women',
      image: '/images/banners/all-collections/shop-by-department/women.webp',
      badge: 'Sculptural Drapery',
      tagline: 'Mulberry silks & tactile tailoring',
      itemCount: initialProducts.filter((p) => p.genders?.includes('women')).length,
      cta: 'Shop now',
      objectPosition: 'center 8%',
    },
    {
      id: 'runway',
      name: 'Runway & Debut',
      title: 'The New-Season Drop',
      subtitle: 'Direct from the Paris & Milan ateliers — fresh drop coats, fluid eveningwear, and limited runs.',
      href: '/new-arrivals',
      image: '/images/banners/all-collections/shop-by-department/runway.webp',
      badge: 'Autumn / Winter 2026',
      tagline: 'Limited atelier releases',
      itemCount: initialProducts.filter((p) => p.isNewArrival).length,
      cta: 'Shop the edit',
      objectPosition: '76% center',
    },
  ];

  // Primary 2 departments (Men & Women)
  const primaryDepartments = departmentCollections.filter((d) => d.id !== 'runway');
  const runwayDepartment = departmentCollections.find((d) => d.id === 'runway');

  return (
    <div className={styles.pageContainer}>
      {/* Top Banner: Curated Edits Editorial Campaign Banner */}
      <CuratedEditsHeroBanner />

      {/* Main Container */}
      <div className={styles.mainContainer}>
        
        {/* Section 1: Department Pillars */}
        <section className={styles.departmentSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                Shop by Department
              </h2>
            </div>
            <span className={styles.sectionCount}>
              {departmentCollections.length} Main Collections
            </span>
          </div>

          {/* Row 1: Men's & Women's Collections in a 2-Column Responsive Row */}
          <div className={styles.departmentGrid}>
            {primaryDepartments.map((dept) => (
              <Link
                key={dept.id}
                href={dept.href}
                className={`group ${styles.departmentCard}`}
              >
                <div className={styles.imageContainer}>
                  <Image
                    src={dept.image}
                    alt={dept.title}
                    fill
                    priority
                    loading="eager"
                    sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1200px) 50vw, 680px"
                    quality={85}
                    style={{
                      objectPosition: dept.objectPosition || 'center 8%',
                    }}
                    className={styles.departmentImage}
                  />
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    {dept.title}
                  </h3>
                  <p className={styles.cardSubtitle}>
                    {dept.subtitle}
                  </p>
                  <div>
                    <span
                      className="extending-underline-link"
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        letterSpacing: '0.02em',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span>{dept.cta}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Row 2: The New-Season Drop / Runway below them in 16:9 ratio */}
          {runwayDepartment && (
            <div className={styles.runwayContainer}>
              <Link
                href={runwayDepartment.href}
                className={`group ${styles.departmentCard}`}
              >
                <div className={styles.runwayImageContainer}>
                  <Image
                    src={runwayDepartment.image}
                    alt={runwayDepartment.title}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1440px"
                    quality={85}
                    style={{
                      objectFit: 'cover',
                      objectPosition: runwayDepartment.objectPosition || '76% center',
                      transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="group-hover:scale-105"
                  />
                </div>

                <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      fontWeight: 400,
                      color: 'var(--text-primary)',
                      margin: '0 0 8px 0',
                      lineHeight: 1.25,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {runwayDepartment.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.94rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.55,
                      margin: '0 0 16px 0',
                      maxWidth: '720px',
                    }}
                  >
                    {runwayDepartment.subtitle}
                  </p>
                  <div>
                    <span
                      className="extending-underline-link"
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        letterSpacing: '0.02em',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span>{runwayDepartment.cta}</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </section>

        {/* Section 2: Wardrobe Disciplines (The 8 Categories) */}
        <section style={{ marginBottom: '88px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 400, margin: 0 }}>
                Shop by Category
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {initialCategories.length} Disciplines
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {initialCategories.map((category) => {
              const count = productCountByCategory[category.id] || 0;
              return (
                <Link
                  key={category.id}
                  href={`/shop?categorySlug=${category.slug}`}
                  className="group"
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    textDecoration: 'none',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 5', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)' }}>
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      className="group-hover:scale-105"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
                      }}
                    />

                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 2, color: 'var(--color-diamond)' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-diamond)', margin: 0, lineHeight: 1.2 }}>
                        {category.name}
                      </h3>
                      <span style={{ fontSize: '0.78rem', opacity: 0.85, marginTop: '4px', display: 'block' }}>
                        {count} {count === 1 ? 'Design' : 'Designs'}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      className="extending-underline-link"
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      <span>Explore Collection</span>
                      <span className="arrow-micro">
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Section 3: Most Coveted Runway Highlights */}
        <section style={{ marginTop: '48px', paddingTop: '48px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 400, margin: 0 }}>
                Coveted Pieces Across Collections
              </h2>
            </div>
            <Link
              href="/shop"
              className="extending-underline-link"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              <span>Browse All Products</span>
              <span className="arrow-micro">
                <ArrowRight size={14} />
              </span>
            </Link>
          </div>

          <div className="product-grid">
            {runwayPieces.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
