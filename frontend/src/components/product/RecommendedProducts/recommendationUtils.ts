export type RecommendationType = 'complete-the-look' | 'similar';

import { Product } from '@/types';

export function getRecommendations(
  currentProduct: Product,
  allProducts: Product[],
  recommendationType: RecommendationType,
  limit: number
): Product[] {
  if (!currentProduct || !allProducts || !Array.isArray(allProducts)) {
    return [];
  }

  // Filter out the current product and out of stock products
  const availableProducts = allProducts.filter(p => {
    if (p.id === currentProduct.id) return false;
    
    // Determine stock status - if availability field exists, use it
    if (p.availability && p.availability === 'out_of_stock') return false;
    
    // Otherwise, check variants if they exist
    if (p.variants && p.variants.length > 0) {
      const totalStock = p.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
      if (totalStock === 0) return false;
    }
    
    return true;
  });

  const currentTags = currentProduct.tags || [];
  
  if (recommendationType === 'complete-the-look') {
    // 1. Different but complementary category
    // 2. Shared tags
    // 3. Shared style/material/color attributes (we'll use tags for this in MVP)
    // 4. Similar price tier
    
    const scoredProducts = availableProducts.map(p => {
      let score = 0;
      
      // Different category is prioritized for "Complete the Look"
      if (p.categoryId !== currentProduct.categoryId) {
        score += 10;
      }
      
      // Shared tags (color, style, collection implied)
      const sharedTags = (p.tags || []).filter(t => currentTags.includes(t)).length;
      score += sharedTags * 2;
      
      // Similar price tier (within 30%)
      const priceDiff = Math.abs(p.price - currentProduct.price) / currentProduct.price;
      if (priceDiff <= 0.3) {
        score += 3;
      } else if (priceDiff <= 0.5) {
        score += 1;
      }
      
      return { product: p, score };
    });
    
    // Sort by score descending, then return top 'limit'
    scoredProducts.sort((a, b) => b.score - a.score);
    return scoredProducts.slice(0, limit).map(item => item.product);
    
  } else if (recommendationType === 'similar') {
    // 1. Same category
    // 2. Shared tags
    // 3. Similar price range
    
    const scoredProducts = availableProducts.map(p => {
      let score = 0;
      
      // Same category is prioritized for "Similar"
      if (p.categoryId === currentProduct.categoryId) {
        score += 10;
      }
      
      // Shared tags
      const sharedTags = (p.tags || []).filter(t => currentTags.includes(t)).length;
      score += sharedTags * 2;
      
      // Similar price tier (within 20%)
      const priceDiff = Math.abs(p.price - currentProduct.price) / currentProduct.price;
      if (priceDiff <= 0.2) {
        score += 3;
      }
      
      return { product: p, score };
    });
    
    scoredProducts.sort((a, b) => b.score - a.score);
    return scoredProducts.slice(0, limit).map(item => item.product);
  }

  return [];
}
