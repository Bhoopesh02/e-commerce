'use client';

import React, { useEffect, useState } from 'react';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { HeroSection } from '@/components/sections/HeroSection';
import { ExpandingCarousel } from '@/components/sections/ExpandingCarousel';
import { CategoryShowcase } from '@/components/sections/CategoryShowcase';
import { EditorialCampaign } from '@/components/sections/EditorialCampaign';
import { ProductCard } from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  getProducts,
  getCategories,
  getStorefrontConfig,
  getNewArrivals,
  getTrendingProducts,
} from '@/lib/mockApi';
import { Product, Category, StorefrontConfig } from '@/types';
import Link from 'next/link';
import { ArrowRight, Sparkles, Feather, ShieldCheck, Compass } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const HomeView: React.FC = () => {
  const { storefront } = useStorefrontStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [config, setConfig] = useState<StorefrontConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [allProds, newArr, trend, cats, cfg] = await Promise.all([
          getProducts({ storefront }),
          getNewArrivals(storefront),
          getTrendingProducts(storefront),
          getCategories(),
          getStorefrontConfig(storefront),
        ]);

        if (isMounted) {
          setProducts(allProds);
          setNewArrivals(newArr);
          setTrending(trend);
          setCategories(cats);
          setConfig(cfg);
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

  if (loading) {
    return (
      <div style={{ paddingTop: '90px' }}>
        <Skeleton height="85vh" borderRadius="0" />
        <div className="container" style={{ padding: '60px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            <Skeleton height="380px" />
            <Skeleton height="380px" />
            <Skeleton height="380px" />
            <Skeleton height="380px" />
          </div>
        </div>
      </div>
    );
  }

  // Render individual sections based on config order
  const renderSection = (type: string, id: string) => {
    switch (type) {
      case 'hero':
        return <HeroSection key={id} />;

      case 'brand_intro':
        return (
          <section key={id} style={{ padding: '80px 0', backgroundColor: 'var(--bg-primary)' }}>
            <div className="container" style={{ maxWidth: '880px', textAlign: 'center' }}>
              <ScrollReveal duration={0.6}>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-sunset-600)',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  The House Philosophy
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)',
                    lineHeight: 1.25,
                    marginBottom: '20px',
                  }}
                >
                  Couture is not merely garment construction; it is the physical manifestation of discipline and form.
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  At Aurelia, each edition is produced in numbered runs to maintain exacting craftsmanship. We source our virgin wool from Biella, silk from Lake Como, and box calf from artisanal tanneries in Tuscany.
                </p>
              </ScrollReveal>
            </div>
          </section>
        );

      case 'category_showcase':
        return <CategoryShowcase key={id} categories={categories} />;

      case 'expanding_carousel':
        return <ExpandingCarousel key={id} products={products} />;

      case 'new_arrivals':
        return (
          <section key={id} style={{ padding: '80px 0', backgroundColor: 'var(--bg-surface)' }}>
            <div className="container">
              <ScrollReveal duration={0.5}>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: '40px',
                    gap: '16px',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--color-sunset-600)',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      Runway Dispatches
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>New Arrivals</h2>
                  </div>
                  <Link
                    href="/shop?tag=new-arrival"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--color-sunset-700)',
                    }}
                  >
                    View All New Editions <ArrowRight size={15} />
                  </Link>
                </div>
              </ScrollReveal>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '32px',
                }}
              >
                {newArrivals.slice(0, 4).map((product, idx) => (
                  <ScrollReveal key={product.id} delay={idx * 0.08} duration={0.5}>
                    <ProductCard product={product} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        );

      case 'editorial_campaign':
        return <EditorialCampaign key={id} />;

      case 'trending_products':
        return (
          <section key={id} style={{ padding: '80px 0', backgroundColor: 'var(--bg-primary)' }}>
            <div className="container">
              <ScrollReveal duration={0.5}>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: '40px',
                    gap: '16px',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--color-sunset-600)',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      House Signatures
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>Most Coveted Silhouettes</h2>
                  </div>
                  <Link
                    href="/shop"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--color-sunset-700)',
                    }}
                  >
                    Explore Complete Wardrobe <ArrowRight size={15} />
                  </Link>
                </div>
              </ScrollReveal>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '32px',
                }}
              >
                {trending.slice(0, 4).map((product, idx) => (
                  <ScrollReveal key={product.id} delay={idx * 0.08} duration={0.5}>
                    <ProductCard product={product} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        );

      case 'brand_story':
        return (
          <section
            key={id}
            id="brand-story"
            style={{
              padding: '80px 0',
              backgroundColor: 'var(--bg-surface)',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            <div className="container">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '36px',
                }}
              >
                <ScrollReveal delay={0} duration={0.5}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'rgba(243, 159, 90, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-sunset-600)',
                        flexShrink: 0,
                      }}
                    >
                      <Feather size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Purity of Material</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Only certified virgin wool, Grade-6A mulberry silk, and Mongolian cashmere. Zero synthetic filler fibers.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1} duration={0.5}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'rgba(243, 159, 90, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-sunset-600)',
                        flexShrink: 0,
                      }}
                    >
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Atelier Guarantee</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Complimentary white-glove courier delivery across India and a 7-day bespoke return/exchange privilege window.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.2} duration={0.5}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'rgba(243, 159, 90, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-sunset-600)',
                        flexShrink: 0,
                      }}
                    >
                      <Compass size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Traceable Craft</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Every piece carries an internal atelier stamp detailing the master weaver, lot number, and year of completion.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        );


      default:
        return null;
    }
  };

  const sections = config?.sections.filter((s) => s.visible) || [];

  return (
    <main>
      {sections.map((sec) => renderSection(sec.type, sec.id))}
    </main>
  );
};
