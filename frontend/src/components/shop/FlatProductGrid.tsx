'use client';

import React from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { PromoBanner } from '@/components/shop/PromoBanner';
import { motion, useReducedMotion } from 'framer-motion';

import { GENDER_COLLECTIONS } from '@/data/genderCollections';

interface FlatProductGridProps {
  products: Product[];
  gender: 'men' | 'women';
  currentPage: number;
}

export const PAGE_SIZE = 36;
export const PROMO_GROUP_SIZE = 12;

export const FlatProductGrid: React.FC<FlatProductGridProps> = ({ products, gender, currentPage }) => {
  const shouldReduceMotion = useReducedMotion();
  const banners = GENDER_COLLECTIONS[gender]?.promoBanners || [];
  
  // Calculate products for the current page
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageProducts = products.slice(startIndex, startIndex + PAGE_SIZE);
  
  const chunks = [];
  for (let i = 0; i < pageProducts.length; i += PROMO_GROUP_SIZE) {
    chunks.push(pageProducts.slice(i, i + PROMO_GROUP_SIZE));
  }

  // To know which banner to pick, we need to know how many banners came before this page.
  // Number of banners before this page = total products before this page / 10
  // Actually, wait, "On the next page the pattern starts again"
  // "So the men's page (36 products) has banners after products 10 and 20, then 6 more products on page 2 with no banner. The women's page (57 products) has page 1 with two banners and page 2 with 27 products and a banner after the 10th."
  // Wait, if page 1 of women's has 30 products, it has banner after 10, banner after 20, and ends with product 30.
  // Page 2 of women's has 27 products, it has banner after 10, banner after 20, and ends with product 27.
  // The banner index (0 or 1) alternates based on the overall chunk index on the current page or overall?
  // "On the next page the pattern starts again." -> This means on page 2, the first banner is Banner 1!
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      {chunks.map((chunk, chunkIndex) => {
        const bannerIndex = chunkIndex;
        const bannerData = banners[bannerIndex % banners.length];
        const isLastChunkOnPage = chunkIndex === chunks.length - 1;
        // The prompt: "A banner only appears if more products follow it."
        // We only check if there are more products overall, or more products on THIS page?
        // Wait, "page 1 with two banners... page 2 with 27 products and a banner after the 10th".
        // Wait, if page 2 has 27 products (3 chunks: 10, 10, 7), it should have a banner after the first 10, and after the second 10.
        // Wait, the prompt says "a banner after the 10th" - maybe a typo in the prompt, or it meant 10th and 20th?
        // "A banner only appears if more products follow it." -> Yes, if chunk has products and is not the absolute last chunk, or if there are more products on the current page.
        // Since we are rendering per page, we just check if it's the last chunk of the PAGE.
        // Wait, if it's the last chunk of the PAGE, and there are more pages, should there be a banner at the end of the page?
        // "each page reads as 10 products, banner, 10 products, banner, 10 products."
        // That means NO banner after the last 10 products on page 1.
        // So a banner only appears if `!isLastChunkOnPage`.
        
        const showBanner = !isLastChunkOnPage;

        return (
          <React.Fragment key={chunkIndex}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '32px',
              }}
              className="product-grid max-md:!grid max-md:!grid-cols-2 max-md:!gap-[12px]"
            >
              {chunk.map((product, idx) => (
                <motion.div
                  key={product.id}
                  className="product-card-wrapper"
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.45, delay: (idx % 4) * 0.06 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {showBanner && (
              <div style={{ margin: '32px 0' }}>
                <PromoBanner
                  imageSrc={bannerData.imageSrc}
                  eyebrow={bannerData.eyebrow}
                  headline={bannerData.headline}
                  quote={bannerData.quote}
                  imageSide={bannerIndex % 2 === 0 ? 'left' : 'right'}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
