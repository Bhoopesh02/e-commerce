'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';

export interface ProductCardProps {
  product: Product;
  aspectRatio?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspectRatio = '3 / 4',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const isFavorited = isInWishlist(product.id);
  const hasSecondaryImage = product.images.length > 1;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    // Add default first available variant
    const variant = product.variants.find((v) => v.stock > 0) || product.variants[0];
    addItem(product, variant.sku, variant.size, variant.color, 1);
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <Link
        href={`/product/${product.slug}`}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          overflow: 'hidden',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-surface)',
          display: 'block',
        }}
      >
        {/* Primary Product Image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="product-image-primary"
          style={{
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* Secondary Product Image with smooth crossfade switching */}
        {hasSecondaryImage && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="product-image-secondary"
            style={{
              objectFit: 'cover',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 2,
          }}
        >
          {product.isNewArrival && <Badge variant="default">New</Badge>}
          {product.availability === 'low_stock' && (
            <Badge variant="warning">Low Stock</Badge>
          )}
        </div>

        {/* Wishlist Button (♡/♥) */}
        <button
          className="hover-fill-btn"
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-pill)',
            '--fill-bg': 'rgba(255, 255, 255, 0.85)',
            '--fill-hover': 'var(--color-sunset-600)',
            '--text-hover': '#FFF',
            backdropFilter: 'blur(4px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavorited ? 'var(--color-sunset-600)' : 'var(--color-sunset-900)',
            cursor: 'pointer',
            zIndex: 3,
            transition: 'all 0.3s',
            transform: isFavorited ? 'scale(1.1)' : 'scale(1)',
          } as React.CSSProperties}
        >
          <Heart
            size={18}
            fill={isFavorited ? 'currentColor' : 'transparent'}
            stroke="currentColor"
            strokeWidth={1.8}
          />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            zIndex: 3,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
            pointerEvents: isHovered ? 'auto' : 'none',
            transition: isHovered
              ? 'opacity 320ms var(--ease-luxury) 100ms, transform 320ms var(--ease-luxury) 100ms'
              : 'opacity 200ms var(--ease-luxury), transform 200ms var(--ease-luxury)',
          }}
        >
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="quick-add-btn"
          >
            {isAdding ? (
              <>
                <span className="quick-add-icon">
                  <Check size={14} />
                </span>
                Added to Bag
              </>
            ) : (
              <>
                <span className="quick-add-icon">
                  <ShoppingBag size={14} />
                </span>
                Quick Add
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Meta */}
      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Link href={`/product/${product.slug}`}>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 1.3,
                fontFamily: 'var(--font-display)',
              }}
            >
              {product.name}
            </h3>
          </Link>
        </div>

        {product.subtitle && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {product.subtitle}
          </span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <RatingStars rating={product.rating.average} size={12} totalReviews={product.rating.count} />
        </div>
      </div>
    </div>
  );
};
