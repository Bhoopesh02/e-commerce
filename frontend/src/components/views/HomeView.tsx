'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { HeroSection } from '@/components/sections/HeroSection';
import { ExpandingCarousel } from '@/components/sections/ExpandingCarousel';
import { CategoryShowcase } from '@/components/sections/CategoryShowcase';
import { EditorialCampaign } from '@/components/sections/EditorialCampaign';
import { BrandStory } from '@/components/sections/BrandStory';
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
import {
  StaggerContainer,
  StaggerFadeUp,
  LineReveal,
} from '@/components/ui/StaggerReveal';
import signatureEveningwearBannerDesktop from '../../../public/images/banners/new/signature_eveningwear_banner_desktop.webp';
import signatureEveningwearBannerMobile from '../../../public/images/banners/new/signature_eveningwear_banner_mobile.webp';
import newArrivalsBannerImg from '../../../public/images/banners/new/luxury_reloved_banner_desktop.webp';
import newArrivalsBannerMobileImg from '../../../public/images/banners/new/luxury_reloved_banner_mobile.webp';

interface HomeBannerCardProps {
  imageSrc: StaticImageData;
  mobileImageSrc?: StaticImageData;
  alt: string;
  eyebrow?: string;
  headline: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  align?: 'left' | 'center';
}

const HomeBannerCard: React.FC<HomeBannerCardProps> = ({
  imageSrc,
  mobileImageSrc,
  alt,
  eyebrow,
  headline,
  description,
  buttonText,
  buttonLink,
  align = 'center',
}) => {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopImgRef = useRef<HTMLImageElement>(null);
  const mobileImgRef = useRef<HTMLImageElement>(null);
  const hasEntered = useInView(containerRef, { once: true, margin: '200px' });
  const isInView = useInView(containerRef, { once: true, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (desktopImgRef.current?.complete || mobileImgRef.current?.complete) {
      setLoaded(true);
    }
  }, [hasEntered]);

  const isReady = isInView && loaded;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(340px, 32vw, 520px)',
        height: 'clamp(340px, 32vw, 520px)',
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: 'var(--color-black-tie)',
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
        {hasEntered && (
          mobileImageSrc ? (
            <>
              <div className="home-banner-img-mobile">
                <Image
                  ref={mobileImgRef}
                  src={mobileImageSrc}
                  alt={alt}
                  fill
                  quality={88}
                  sizes="(max-width: 767px) 100vw, 1px"
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
                  quality={88}
                  sizes="(max-width: 767px) 1px, 100vw"
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
              quality={88}
              sizes="100vw"
              onLoad={() => setLoaded(true)}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          )
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
          background:
            align === 'left'
              ? 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.06) 100%)'
              : 'rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: align === 'left' ? 'flex-start' : 'center',
          justifyContent: 'center',
          textAlign: align === 'left' ? 'left' : 'center',
          padding: align === 'left' ? 'clamp(24px, 6vw, 90px)' : '20px',
          zIndex: 2,
        }}
      >
        {eyebrow && (
          <StaggerFadeUp
            as="span"
            style={{
              fontFamily: 'var(--font-accent)',
              fontSize: 'clamp(0.72rem, 1vw, 0.85rem)',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-golden-200)',
              marginBottom: '10px',
              display: 'block',
            }}
          >
            {eyebrow}
          </StaggerFadeUp>
        )}

        <h2
          style={{
            color: 'var(--color-diamond)',
            fontSize: 'clamp(1.5rem, 3.8vw, 3.2rem)',
            fontFamily: 'var(--font-display)',
            marginBottom: description ? '12px' : '16px',
            lineHeight: 1.15,
            maxWidth: '620px',
          }}
        >
          <LineReveal bottomPadding="8px">
            {headline}
          </LineReveal>
        </h2>

        {description && (
          <StaggerFadeUp
            as="p"
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
              maxWidth: '480px',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {description}
          </StaggerFadeUp>
        )}

        {buttonText && buttonLink && (
          <StaggerFadeUp as="div" style={{ marginTop: '22px' }}>
            <Link
              href={buttonLink}
              className="home-banner-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#ffffff',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.75)',
                borderRadius: '4px',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.25s ease',
                textDecoration: 'none',
              }}
            >
              <span>{buttonText}</span>
              <ArrowRight size={14} />
            </Link>
          </StaggerFadeUp>
        )}
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
        return <BrandStory key={id} />;

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
          <section key={id} id="signature-icons" style={{ scrollMarginTop: '80px' }}>
            <section style={{ width: '100%', padding: '0 0 20px', backgroundColor: 'var(--bg-primary)' }}>
              <HomeBannerCard
                imageSrc={signatureEveningwearBannerDesktop}
                mobileImageSrc={signatureEveningwearBannerMobile}
                alt="Signature Eveningwear Collection"
                eyebrow="Signature Icons"
                headline="The Evening Edit"
                description="Sculptural draping and fluid silk silhouettes crafted for twilight occasions."
                buttonText="Explore Eveningwear"
                buttonLink="/shop?categorySlug=eveningwear"
                align="left"
              />
            </section>
            <ExpandingCarousel
              products={signatureProducts.length >= 4 ? signatureProducts : products}
              title={title}
              subtitle={subtitle}
            />
          </section>
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
          <section key={id} id="new-arrivals" style={{ scrollMarginTop: '80px' }}>
            <section style={{ width: '100%', padding: '60px 0 20px', backgroundColor: 'var(--bg-primary)' }}>
              <HomeBannerCard
                imageSrc={newArrivalsBannerImg}
                mobileImageSrc={newArrivalsBannerMobileImg}
                alt="New Arrivals Collection"
                eyebrow="Just Arrived"
                headline="The New Season"
                description="Curated craftsmanship and timeless luxury."
                buttonText="Discover"
                buttonLink="/new-arrivals"
                align="left"
              />
            </section>
            <NewArrivalsCarousel products={uploadedNewArrivals} loading={loading} />
          </section>
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
        return (
          <section key={id} id="house-favorites" style={{ scrollMarginTop: '80px' }}>
            <MostCovetedSilhouettes products={uploadedTrending} isLoading={loading} />
          </section>
        );

      case 'brand_story':
        return <BrandStory key={id} />;


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
