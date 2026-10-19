'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { Heart, ShoppingBag, Check, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { Skeleton } from '@/components/ui/Skeleton';
import { getLuxuryColorStyle } from '@/lib/colorUtils';

export const BannerProductCardSkeleton: React.FC = () => {
  return (
    <div
      className="banner-product-card-skeleton"
      style={{
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        background: 'rgba(18, 20, 24, 0.95)',
        border: '1px solid var(--border-on-inverse)',
        boxShadow: '0 12px 28px -6px var(--shadow-lg)',
        padding: '7px',
        width: '100%',
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          borderRadius: '9px',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-inverse-glass)',
        }}
      >
        <Skeleton width="100%" height="100%" borderRadius="9px" />
      </div>

      <div
        style={{
          padding: '6px 2px 2px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <Skeleton width="80%" height="13px" borderRadius="3px" style={{ marginTop: '4px' }} />
        <Skeleton width="40%" height="12px" borderRadius="3px" style={{ marginTop: '4px' }} />
        <Skeleton width="100%" height="28px" borderRadius="6px" style={{ marginTop: '6px' }} />
      </div>
    </div>
  );
};

interface BannerProductCardProps {
  product: Product;
}

export const BannerProductCard: React.FC<BannerProductCardProps> = ({
  product,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const heartControls = useAnimationControls();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const isFavorited = isInWishlist(product.id);
  const imageSrc = product.images?.[0] || '/images/hero/hero-refined.webp';

  const availableColors = React.useMemo(() => {
    if (!product?.variants) return [];
    const colors: string[] = [];
    product.variants.forEach((v) => {
      if (v.color && !colors.includes(v.color)) {
        colors.push(v.color);
      }
    });
    return colors;
  }, [product?.variants]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    const variant = product.variants?.find((v) => v.stock > 0) || product.variants?.[0] || {
      sku: `${product.id}-default`,
      size: 'Standard',
      color: 'Signature',
      stock: 1,
    };
    addItem(product, variant.sku, variant.size, variant.color, 1);
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
    if (!shouldReduceMotion) {
      await heartControls.start({
        scale: [1, 1.25, 1],
        transition: {
          duration: 0.28,
          times: [0, 0.5, 1],
          ease: 'easeInOut',
        },
      });
    }
  };

  return (
    <motion.div
      className="banner-product-card group"
      style={{
        flexShrink: 0,
        scrollSnapAlign: 'start',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        background: 'rgba(18, 20, 24, 0.95)',
        border: '1px solid var(--border-on-inverse)',
        boxShadow: '0 12px 28px -6px var(--shadow-lg)',
        padding: '7px',
        transition: 'border-color 300ms ease, box-shadow 300ms ease, transform 300ms ease',
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <Link
        href={`/product/${product.slug}`}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          borderRadius: '9px',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-inverse-glass)',
          display: 'block',
        }}
      >
        {/* Skeleton Shimmer While Product Image is Loading */}
        {!isImageLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <Skeleton width="100%" height="100%" borderRadius="9px" />
          </div>
        )}

        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 250px, 350px"
          quality={80}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageLoaded(true)}
          style={{
            objectFit: 'cover',
            opacity: isImageLoaded ? 1 : 0,
            transform: isHovered && !shouldReduceMotion ? 'scale(1.08)' : 'scale(1)',
            transition: 'opacity 350ms ease, transform 550ms cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />

        {/* Soft bottom image gradient for readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, var(--shadow-sm) 0%, transparent 60%, rgba(16, 33, 39, 0.4) 100%)',
            pointerEvents: 'none',
          }}
        />


        {/* Wishlist Button (Compact) */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '44px',
            height: '44px',
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 3,
            padding: 0,
          }}
        >
          <motion.div
            animate={heartControls}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: isFavorited ? 'var(--color-black-tie)' : 'var(--overlay-black-85)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isFavorited ? 'var(--color-golden-500)' : 'var(--color-diamond)',
              boxShadow: '0 4px 10px rgba(16, 33, 39, 0.4)',
            }}
          >
            <Heart
              size={13}
              fill={isFavorited ? 'currentColor' : 'transparent'}
              stroke="currentColor"
              strokeWidth={1.8}
            />
          </motion.div>
        </button>
      </Link>

      {/* Product Meta & Information */}
      <div
        style={{
          padding: '6px 2px 2px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        <div style={{ height: '14px', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
          {product.isNewArrival && (
            <span
              style={{
                fontSize: '0.58rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-diamond)',
                lineHeight: 1,
              }}
            >
              New
            </span>
          )}
          {product.isNewArrival && product.availability === 'low_stock' && (
            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>•</span>
          )}
          {product.availability === 'low_stock' && (
            <span
              style={{
                fontSize: '0.58rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#fbbf24',
                lineHeight: 1,
              }}
            >
              Low Stock
            </span>
          )}
        </div>
        <Link
          href={`/product/${product.slug}`}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', minHeight: '44px' }}
        >
          <h4
            style={{
              fontSize: '0.78rem',
              fontWeight: 500,
              color: "var(--text-inverse)",
              lineHeight: 1.25,
              fontFamily: 'var(--font-display)',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'color 200ms ease',
            }}
            title={product.name}
          >
            {product.name}
          </h4>
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            marginTop: '3px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                color: 'var(--bg-subtle)',
                letterSpacing: '0.02em',
              }}
            >
              {formatPrice(product.price)}
            </span>
          </div>

          {availableColors.length > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {availableColors.slice(0, 3).map((colorName) => {
                const { background, isLight } = getLuxuryColorStyle(colorName);
                return (
                  <span
                    key={colorName}
                    title={colorName}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background,
                      boxShadow: isLight
                        ? 'inset 0 0 0 1px rgba(0, 0, 0, 0.25)'
                        : 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
                      display: 'inline-block',
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Add Button (Compact) */}
        <button
          onClick={handleQuickAdd}
          disabled={isAdding}
          className="banner-card-add-btn"
          style={{
            marginTop: '5px',
            width: '100%',
            minHeight: '44px',
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: isAdding ? 'var(--success-on-inverse-bg)' : 'rgba(255, 255, 255, 0.12)',
            border: isAdding ? '1px solid rgba(74, 222, 128, 0.5)' : '1px solid var(--overlay-white-20)',
            color: isAdding ? 'var(--color-success-on-inverse)' : 'var(--color-diamond)',
            fontSize: '0.68rem',
            fontWeight: 500,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            cursor: 'pointer',
            transition: 'all 200ms ease',
          }}
        >
          {isAdding ? (
            <>
              <Check size={11} />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag size={11} />
              <span>Quick Add</span>
            </>
          )}
        </button>
      </div>

    </motion.div>
  );
};
