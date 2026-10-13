'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { CollectionsBannerCarousel } from '@/components/sections/CollectionsBannerCarousel';

interface CollectionsViewProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

interface CuratedEdit {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  categorySlug: string;
  image: string;
  badge: string;
}

const CURATED_EDITS: CuratedEdit[] = [
  {
    id: 'heritage',
    title: 'Heritage Styles',
    subtitle: 'Double-faced virgin wool trench coats, Spanish shearling aviators, and archival silhouettes.',
    tag: 'outerwear',
    categorySlug: 'outerwear',
    image: '/images/categories/cat-outerwear.jpg',
    badge: 'Archival Heritage',
  },
  {
    id: 'sartorial',
    title: 'Sartorial Elegance',
    subtitle: 'Deconstructed wool suiting, razor-sharp peak lapels, and floating canvas bespoke tailoring.',
    tag: 'tailoring',
    categorySlug: 'tailoring',
    image: '/images/categories/cat-tailoring.jpg',
    badge: 'Savile Row Cut',
  },
  {
    id: 'cashmere',
    title: 'Cashmere Essentials',
    subtitle: 'Ultra-fine 15.2-micron Grade-A Mongolian cashmere, brushed mohair, and seamless ribbed jumpers.',
    tag: 'knitwear',
    categorySlug: 'knitwear',
    image: '/images/categories/cat-knitwear.jpg',
    badge: 'Pure Cashmere',
  },
  {
    id: 'evening',
    title: 'The Evening Edit',
    subtitle: 'Liquid 30-momme mulberry silk charmeuse, floor-grazing puddle trains, and draped formal gala gowns.',
    tag: 'eveningwear',
    categorySlug: 'eveningwear',
    image: '/images/categories/cat-eveningwear.jpg',
    badge: 'Nocturne Gala',
  },
  {
    id: 'monochrome',
    title: 'Monochrome Atelier',
    subtitle: 'Pebbled leather weekenders, obsidian calfskin folios, and structured saddle silhouettes.',
    tag: 'leather-goods',
    categorySlug: 'leather-goods',
    image: '/images/categories/cat-leather-goods.webp',
    badge: 'Atelier Leather',
  },
];

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
      image: '/images/banners/gen/men/all.jpg',
      badge: 'Savile Row Precision',
      tagline: 'Italian tailoring & natural fibers',
      itemCount: initialProducts.filter((p) => p.genders?.includes('men')).length,
    },
    {
      id: 'women',
      name: 'Aurelia Femme',
      title: "The Women's Collection",
      subtitle: 'Sculptural drapery, liquid mulberry silks, and tactile tailoring designed with quiet authority.',
      href: '/collections/women',
      image: '/images/banners/gen/women/all.jpg',
      badge: 'Sculptural Drapery',
      tagline: 'Mulberry silks & tactile tailoring',
      itemCount: initialProducts.filter((p) => p.genders?.includes('women')).length,
    },
    {
      id: 'runway',
      name: 'Runway & Debut',
      title: 'The New-Season Drop',
      subtitle: 'Direct from the Paris & Milan ateliers — fresh drop coats, fluid eveningwear, and limited runs.',
      href: '/new-arrivals',
      image: '/images/banners/new-arrivals/new-arrivals-hero.webp',
      badge: 'Autumn / Winter 2026',
      tagline: 'Limited atelier releases',
      itemCount: initialProducts.filter((p) => p.isNewArrival).length,
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* Top Banner Carousel */}
      <CollectionsBannerCarousel />

      {/* Main Container */}
      <div className="container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 24px 0' }}>
        
        {/* Section 1: Department Pillars */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-golden-600)', fontWeight: 600 }}>
                Primary Pillars
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 400, marginTop: '4px' }}>
                Shop by Department
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {departmentCollections.length} Main Collections
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {departmentCollections.map((dept) => (
              <Link
                key={dept.id}
                href={dept.href}
                className="group"
                style={{
                  position: 'relative',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)' }}>
                  <Image
                    src={dept.image}
                    alt={dept.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
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
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)',
                    }}
                  />
                  <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(20, 20, 20, 0.75)',
                        backdropFilter: 'blur(8px)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        border: '1px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      {dept.badge}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 2, color: '#fff' }}>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.9, marginBottom: '4px' }}>
                      {dept.name}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 400, color: '#fff', margin: 0 }}>
                      {dept.title}
                    </h3>
                  </div>
                </div>

                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
                    {dept.subtitle}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {dept.itemCount} Curated Pieces
                    </span>
                    <span
                      className="extending-underline-link"
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span>Explore</span>
                      <span className="arrow-micro">
                        <ArrowRight size={15} />
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2: Wardrobe Disciplines (The 8 Categories) */}
        <section style={{ marginBottom: '88px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-golden-600)', fontWeight: 600 }}>
                Permanent House Disciplines
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 400, marginTop: '4px' }}>
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
                    {category.bannerBadges && category.bannerBadges[0] && (
                      <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 2 }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '3px',
                            backgroundColor: 'rgba(255, 255, 255, 0.85)',
                            color: 'var(--color-black-tie)',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {category.bannerBadges[0]}
                        </span>
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 2, color: '#fff' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.2 }}>
                        {category.name}
                      </h3>
                      <span style={{ fontSize: '0.78rem', opacity: 0.85, marginTop: '4px', display: 'block' }}>
                        {count} {count === 1 ? 'Design' : 'Designs'}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                      {category.description}
                    </p>
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

        {/* Section 3: Curated Edits */}
        <section style={{ marginBottom: '88px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-golden-600)', fontWeight: 600 }}>
                Curated Stylings
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 400, marginTop: '4px' }}>
                Shop by Edit
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {CURATED_EDITS.length} Curated Edits
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {CURATED_EDITS.map((edit) => (
              <Link
                key={edit.id}
                href={`/shop?categorySlug=${edit.categorySlug}`}
                className="group"
                style={{
                  position: 'relative',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 11', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)' }}>
                  <Image
                    src={edit.image}
                    alt={edit.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 20vw"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="group-hover:scale-105"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
                    }}
                  />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '3px',
                        backgroundColor: 'rgba(20, 20, 20, 0.75)',
                        backdropFilter: 'blur(6px)',
                        color: '#fff',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {edit.badge}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '6px', color: 'var(--text-primary)' }}>
                      {edit.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                      {edit.subtitle}
                    </p>
                  </div>
                  <div
                    className="extending-underline-link"
                    style={{
                      color: 'var(--color-golden-600)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span>View Edit</span>
                    <span className="arrow-micro">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: Most Coveted Runway Highlights */}
        <section style={{ marginTop: '48px', paddingTop: '48px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-golden-600)', fontWeight: 600 }}>
                Iconic Selections
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 400, marginTop: '4px' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '28px' }}>
            {runwayPieces.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
