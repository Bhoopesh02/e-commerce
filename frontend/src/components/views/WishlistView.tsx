'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { getProducts, ensureClientState } from '@/lib/mockApi';
import { areProductsEqual } from '@/lib/catalogCompare';
import { Product } from '@/types';
import { ProductCard, ProductGridSkeleton } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export interface WishlistViewProps {
  initialAllProducts?: Product[];
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  initialAllProducts,
}) => {
  const { productIds, toggleItem, hydrated: isStoreHydrated } = useWishlistStore();
  const { addItem } = useCartStore();
  const { showToast } = useToastStore();

  const [allCatalog, setAllCatalog] = useState<Product[]>(() => initialAllProducts || []);
  const [products, setProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);

  const allCatalogRef = useRef(allCatalog);
  allCatalogRef.current = allCatalog;
  const productsRef = useRef(products);
  productsRef.current = products;

  // Silent mount reconciliation with localStorage (Strict Mode safe)
  useEffect(() => {
    let cancelled = false;

    async function waitForWishlistHydration(): Promise<string[]> {
      if (useWishlistStore.persist?.hasHydrated?.()) {
        return useWishlistStore.getState().productIds;
      }
      return new Promise((resolve) => {
        let resolved = false;
        const unsub = useWishlistStore.persist?.onFinishHydration?.((state) => {
          if (!resolved) {
            resolved = true;
            unsub?.();
            resolve(state?.productIds || useWishlistStore.getState().productIds);
          }
        });
        if (useWishlistStore.persist?.hasHydrated?.()) {
          if (!resolved) {
            resolved = true;
            unsub?.();
            resolve(useWishlistStore.getState().productIds);
          }
        }
      });
    }

    async function reconcileWishlist() {
      ensureClientState();
      try {
        const [all, currentIds] = await Promise.all([
          getProducts(),
          waitForWishlistHydration(),
        ]);
        if (cancelled) return;
        if (!areProductsEqual(allCatalogRef.current, all)) {
          setAllCatalog(all);
        }
        const nextWishlistProds = all.filter((p) => currentIds.includes(p.id));
        if (!areProductsEqual(productsRef.current, nextWishlistProds)) {
          setProducts(nextWishlistProds);
        }
      } catch {
        // silent fallback
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    }
    reconcileWishlist();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync displayed items when client productIds change or allCatalog updates
  useEffect(() => {
    if (!hydrated) return;
    const nextProds = allCatalog.filter((p) => productIds.includes(p.id));
    if (!areProductsEqual(productsRef.current, nextProds)) {
      setProducts(nextProds);
    }
  }, [productIds, allCatalog, hydrated]);

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

  if (!hydrated || !isStoreHydrated || loading) {
    return (
      <div style={{ paddingTop: '110px', paddingBottom: '96px' }} className="container">
        <Skeleton height="40px" width="300px" style={{ marginBottom: '32px' }} />
        <ProductGridSkeleton count={4} />
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
              className="type-eyebrow"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--brand-primary)',
                marginBottom: '8px',
              }}
            >
              <Heart size={13} fill="currentColor" />
              <span>Personal Curation</span>
            </div>
            <h1 className="type-h1">Wishlist</h1>
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
            <h3 className="type-h3" style={{ marginBottom: '8px' }}>
              Your Wishlist is Empty
            </h3>
            <p className="type-body" style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Explore our runway collections and bookmark pieces to monitor atelier reserve and sizing.
            </p>
            <Link href="/shop">
              <Button variant="primary" rightIcon={<ArrowRight size={15} />}>
                Discover Silhouettes
              </Button>
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
