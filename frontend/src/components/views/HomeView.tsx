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
import Image, { StaticImageData } from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import {
  StaggerContainer,
  StaggerFadeUp,
  LineReveal,
} from '@/components/ui/StaggerReveal';
import heritageBannerImg from '../../../public/images/banners/new/Gemini_Generated_Image_wi5d5owi5d5owi5d.png';
import heritageBannerMobileImg from '../../../public/images/banners/new/Gemini_Generated_Image_n4wph0n4wph0n4wp.png';
import newArrivalsBannerImg from '../../../public/images/banners/new/Gemini_Generated_Image_8hy0gw8hy0gw8hy0.png';
import newArrivalsBannerMobileImg from '../../../public/images/banners/new/Gemini_Generated_Image_lo7saulo7saulo7s.png';

interface HomeBannerCardProps {
  imageSrc: StaticImageData;
  mobileImageSrc?: StaticImageData;
  alt: string;
  eyebrow: string;
  headline: string;
  description: string;
}

const HomeBannerCard: React.FC<HomeBannerCardProps> = ({
  imageSrc,
  mobileImageSrc,
  alt,
  eyebrow,
  headline,
  description,
}) => {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopImgRef = useRef<HTMLImageElement>(null);
  const mobileImgRef = useRef<HTMLImageElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (desktopImgRef.current?.complete || mobileImgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  const isReady = isInView && loaded;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(320px, 48vw, 420px)',
        height: 'clamp(320px, 48vw, 420px)',
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: '#1c1917',
      }}
    >
      {/* Background Image with Loaded Gate Animation */}
      <motion.div
        initial={false}
        animate={{
          opacity: loaded ? 1 : 0,
          ...(shouldReduceMotion ? { scale: 1 } : { scale: isReady ? 1 : 1.08 }),
        }}
        transition={{
          opacity: { duration: 0.8, ease: 'easeOut' },
          scale: { duration: 2.4, ease: [0.22, 1, 0.36, 1] },
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >
        {mobileImageSrc ? (
          <>
            <div className="home-banner-img-mobile">
              <Image
                ref={mobileImgRef}
                src={mobileImageSrc}
                alt={alt}
                fill
                quality={92}
                sizes="(max-width: 767px) 100vw, 1px"
                placeholder="blur"
                onLoad={() => setLoaded(true)}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <div className="home-banner-img-desktop">
              <Image
                ref={desktopImgRef}
                src={imageSrc}
                alt={alt}
                fill
                quality={92}
                sizes="(max-width: 767px) 1px, (max-width: 1200px) 100vw, 1200px"
                placeholder="blur"
                onLoad={() => setLoaded(true)}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </>
        ) : (
          <Image
            ref={desktopImgRef}
            src={imageSrc}
            alt={alt}
            fill
            quality={92}
            sizes="(max-width: 1200px) 100vw, 1200px"
            placeholder="blur"
            onLoad={() => setLoaded(true)}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        )}
      </motion.div>

      <StaggerContainer
        initial="hidden"
        animate={isReady ? 'show' : 'hidden'}
        delayChildren={0.25}
        staggerChildren={0.14}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '20px',
          zIndex: 2,
        }}
      >
        <StaggerFadeUp
          as="span"
          style={{
            fontSize: 'clamp(0.72rem, 1vw, 0.85rem)',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-golden-200)',
            marginBottom: '12px',
            display: 'block',
          }}
        >
          {eyebrow}
        </StaggerFadeUp>

        <h2
          style={{
            color: '#fff',
            fontSize: 'clamp(1.5rem, 3.8vw, 3.2rem)',
            fontFamily: 'var(--font-display)',
            marginBottom: '14px',
            lineHeight: 1.15,
          }}
        >
          <LineReveal bottomPadding="8px">
            {headline}
          </LineReveal>
        </h2>

        <StaggerFadeUp
          as="p"
          style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
            maxWidth: '560px',
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {description}
        </StaggerFadeUp>
      </StaggerContainer>
    </div>
  );
};



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
            <section style={{ padding: '0 0 20px', backgroundColor: 'var(--bg-primary)' }}>
              <div className="container">
                <HomeBannerCard
                  imageSrc={heritageBannerImg}
                  mobileImageSrc={heritageBannerMobileImg}
                  alt="Signature Excellence Banner"
                  eyebrow="Our Heritage"
                  headline="The Signature of Excellence"
                  description="Discover the foundational pillars that define our commitment to unparalleled craftsmanship and uncompromising quality."
                />
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
                <HomeBannerCard
                  imageSrc={newArrivalsBannerImg}
                  mobileImageSrc={newArrivalsBannerMobileImg}
                  alt="New Arrivals Banner"
                  eyebrow="Just Arrived"
                  headline="The New Season Collection"
                  description="Discover our latest arrivals, featuring exquisite craftsmanship and unparalleled elegance for the modern connoisseur."
                />
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
        return null;


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
