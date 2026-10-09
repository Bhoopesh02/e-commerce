'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { HeroSection } from '@/components/sections/HeroSection';
import { ExpandingCarousel } from '@/components/sections/ExpandingCarousel';
import { CategoryShowcase } from '@/components/sections/CategoryShowcase';
import { EditorialCampaign } from '@/components/sections/EditorialCampaign';
import { MostCovetedSilhouettes } from '@/components/sections/MostCovetedSilhouettes';
import { NewArrivalsCarousel } from '@/components/sections/NewArrivalsCarousel';
import { ProductCard, ProductGridSkeleton } from '@/components/product/ProductCard';
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
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';



interface HomeViewProps {
  initialProducts: Product[];
  initialNewArrivals: Product[];
  initialTrending: Product[];
  initialCategories: Category[];
  initialConfig: StorefrontConfig;
  isLoading?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  initialProducts,
  initialNewArrivals,
  initialTrending,
  initialCategories,
  initialConfig,
  isLoading: initialLoading = false,
}) => {
  const { storefront } = useStorefrontStore();
  const currentStorefront = storefront || 'a';

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [newArrivals, setNewArrivals] = useState<Product[]>(initialNewArrivals);
  const [trending, setTrending] = useState<Product[]>(initialTrending);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [config, setConfig] = useState<StorefrontConfig>(initialConfig);
  const [loading, setLoading] = useState<boolean>(initialLoading);

  // Server pre-fetched for storefront 'a' — skip redundant first-mount fetch
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (currentStorefront === 'a') return;
    }

    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [allProds, newArr, trend, cats, cfg] = await Promise.all([
          getProducts({ storefront: currentStorefront }),
          getNewArrivals(currentStorefront),
          getTrendingProducts(currentStorefront),
          getCategories(),
          getStorefrontConfig(currentStorefront),
        ]);

        if (isMounted) {
          setProducts(allProds);
          setNewArrivals(newArr);
          setTrending(trend);
          setCategories(cats);
          setConfig(cfg);
        }
      } catch (err) {
        // Fallback gracefully to statically initialized data
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [currentStorefront]);

  // Render individual sections based on config order
  const renderSection = (type: string, id: string, title?: string, subtitle?: string) => {
    switch (type) {
      case 'hero':
        return <HeroSection key={id} />;

      case 'brand_intro':
        return (
          <section key={id} className="brand-intro-section" style={{ padding: '80px 0 20px', backgroundColor: 'var(--bg-primary)' }}>
            <div className="container" style={{ maxWidth: '880px', textAlign: 'center' }}>
              <ScrollReveal duration={0.6}>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--brand-primary)',
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
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                  At Aurelia, each edition is produced in numbered runs to maintain exacting craftsmanship. We source our virgin wool from Biella, silk from Lake Como, and box calf from artisanal tanneries in Tuscany.
                </p>
              </ScrollReveal>
            </div>
          </section>
        );

      case 'category_showcase':
        return (
          <CategoryShowcase
            key={id}
            categories={categories}
            title={title}
            subtitle={subtitle}
            isLoading={loading}
          />
        );

      case 'expanding_carousel':
        const signatureTargetNames = [
          "Quilted Silk Down Parka",
          "Sculpted Double-Breasted Blazer",
          "Silk Charmeuse Draped Evening Gown",
          "Mongolian Cashmere Ribbed Turtleneck",
          "Atelier Sculptural Leather Tote",
        ];
        const signatureProducts = signatureTargetNames
          .map((name) => products.find((p) => p.name === name || p.name.includes(name)))
          .filter(Boolean) as Product[];

        return (
          <React.Fragment key={id}>
            <section style={{ padding: '60px 0 20px', backgroundColor: 'var(--bg-primary)' }}>
              <div className="container">
                <ScrollReveal duration={0.6}>
                  <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden' }}>
                    <Image 
                      src="/images/products/new/Gemini_Generated_Image_wi5d5owi5d5owi5d.png" 
                      alt="Signature Excellence Banner"
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center', transform: 'scale(1.05)' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-golden-200)', marginBottom: '16px' }}>Our Heritage</span>
                      <h2 style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontFamily: 'var(--font-display)', marginBottom: '16px', lineHeight: 1.1 }}>
                        The Signature of Excellence
                      </h2>
                      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
                        Discover the foundational pillars that define our commitment to unparalleled craftsmanship and uncompromising quality.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>
            <ExpandingCarousel
              products={signatureProducts.length >= 4 ? signatureProducts : products}
              title={title}
              subtitle={subtitle}
            />
          </React.Fragment>
        );

      case 'new_arrivals':
        const newArrivalsTargetNames = [
          "Goodyear Welted Oxford Brogues",
          "Shearling-Lined Winter Combat Boots",
          "Santal Vanille Parfum",
          "Rose Absolute Eau de Parfum",
          "Cropped Suede Harrington Bomber",
          "Double-Faced Wool Trench Coat",
          "Monolithic Double-Breasted Peacoat",
          "Quilted Silk Down Parka",
          "Herringbone Heavy Chain Neckl",
          "Celestial Diamond Pav",
          "Molten Gold Drop Earrings",
          "Baroque Freshwater Pearl Pendant",
          "Lariat Baroque Pearl Layered",
          "Sculptural Dome Signet Ring",
          "Single-Button Fluid Viscose Blazer",
          "Tailored Asymmetrical Wrap Vest"
        ];
        const uploadedNewArrivals = newArrivals.filter((p) => 
          newArrivalsTargetNames.some(target => p.name.includes(target))
        );
        return (
          <React.Fragment key={id}>
            <section style={{ padding: '60px 0 20px', backgroundColor: 'var(--bg-primary)' }}>
              <div className="container">
                <ScrollReveal duration={0.6}>
                  <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden' }}>
                    <Image 
                      src="/images/products/new/Gemini_Generated_Image_8hy0gw8hy0gw8hy0.png" 
                      alt="New Arrivals Banner"
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center', transform: 'scale(1.05)' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-golden-200)', marginBottom: '16px' }}>Just Arrived</span>
                      <h2 style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontFamily: 'var(--font-display)', marginBottom: '16px', lineHeight: 1.1 }}>
                        The New Season Collection
                      </h2>
                      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
                        Discover our latest arrivals, featuring exquisite craftsmanship and unparalleled elegance for the modern connoisseur.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>
            <NewArrivalsCarousel products={uploadedNewArrivals} loading={loading} />
          </React.Fragment>
        );

      case 'editorial_campaign':
        return <EditorialCampaign key={id} />;

      case 'trending_products':
        const targetNames = [
          "One-Shoulder Pleated Chiffon Column",
          "Curve Calfskin Crossbody Saddle Bag",
          "Pointed Knee-High Suede Boots",
          "Cropped Suede Harrington Bomber",
          "Monolithic Double-Breasted Peacoat",
          "Quilted Silk Down Parka"
        ];
        const uploadedTrending = products.filter((p) => targetNames.includes(p.name));
        return <MostCovetedSilhouettes key={id} products={uploadedTrending} isLoading={loading} />;

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
                        width: 48,
                        height: 48,
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--color-golden-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src="/images/icons/icon-purity.webp"
                        alt="Purity of Material"
                        width={32}
                        height={32}
                        style={{ width: 32, height: 32, objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Purity of Material</h3>
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
                        width: 48,
                        height: 48,
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--color-golden-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src="/images/icons/icon-guarantee.webp"
                        alt="Atelier Guarantee"
                        width={32}
                        height={32}
                        style={{ width: 32, height: 32, objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Atelier Guarantee</h3>
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
                        width: 48,
                        height: 48,
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--color-golden-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src="/images/icons/icon-traceable.webp"
                        alt="Traceable Craft"
                        width={32}
                        height={32}
                        style={{ width: 32, height: 32, objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Traceable Craft</h3>
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
      {sections.map((sec) => renderSection(sec.type, sec.id, sec.title, sec.subtitle))}
    </main>
  );
};
