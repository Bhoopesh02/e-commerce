'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { getProducts } from '@/lib/mockApi';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { productIds, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const { showToast } = useToastStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadWishlistItems() {
      setLoading(true);
      try {
        const all = await getProducts();
        if (isMounted) {
          setProducts(all.filter((p) => productIds.includes(p.id)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadWishlistItems();
    return () => {
      isMounted = false;
    };
  }, [productIds]);

  const handleMoveAllToBag = () => {
    let addedCount = 0;
    products.forEach((p) => {
      const variant = p.variants.find((v) => v.stock > 0);
      if (variant) {
        addItem(p, variant.sku, variant.size, variant.color, 1);
        addedCount++;
      }
    });
    showToast(`Transferred ${addedCount} available silhouettes to your bag.`, 'success');
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '110px', paddingBottom: '96px' }} className="container">
        <Skeleton height="40px" width="300px" style={{ marginBottom: '32px' }} />
        <div 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}
          className="product-grid"
        >
          <Skeleton height="380px" />
          <Skeleton height="380px" />
          <Skeleton height="380px" />
          <Skeleton height="380px" className="max-md:block hidden" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '96px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
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
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-sapphire)',
                marginBottom: '8px',
              }}
            >
              <Heart size={13} fill="currentColor" />
              <span>Personal Curation</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>Wishlist</h1>
          </div>

          {products.length > 0 && (
            <Button
              variant="outline"
              onClick={handleMoveAllToBag}
              leftIcon={<ShoppingBag size={16} />}
            >
              Move All Available to Bag
            </Button>
          )}
        </div>

        {products.length === 0 ? (
          <div
            style={{
              padding: '80px 24px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <Heart size={44} style={{ color: 'var(--border-color)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
              Your Wishlist is Empty
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Explore our runway collections and bookmark pieces to monitor atelier reserve and sizing.
            </p>
            <Link href="/shop">
              <Button variant="primary" rightIcon={<ArrowRight size={15} />}>
                Discover Silhouettes
              </Button>
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '36px',
            }}
            className="product-grid"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
