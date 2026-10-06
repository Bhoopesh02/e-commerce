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
        background: 'rgba(12, 10, 22, 0.78)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        boxShadow: '0 12px 28px -6px rgba(0, 0, 0, 0.55)',
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
          backgroundColor: 'rgba(25, 20, 36, 0.8)',
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
        <Skeleton width="50%" height="10px" borderRadius="3px" />
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
        background: 'rgba(12, 10, 22, 0.78)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        boxShadow: '0 12px 28px -6px rgba(0, 0, 0, 0.55)',
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
          backgroundColor: 'rgba(25, 20, 36, 0.8)',
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
          sizes="(max-width: 768px) 150px, 180px"
          quality={75}
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
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 60%, rgba(0,0,0,0.4) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            zIndex: 2,
          }}
        >
          {product.rating?.average ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '2px 7px',
                borderRadius: '999px',
                backgroundColor: 'rgba(15, 12, 24, 0.85)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                color: '#FFE28A',
                fontSize: '0.68rem',
                fontWeight: 600,
              }}
            >
              <Star size={10} fill="#FFE28A" />
              {product.rating.average.toFixed(1)}
            </span>
          ) : null}
        </div>

        {/* Wishlist Button (Compact) */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '36px',
            height: '36px',
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
              backgroundColor: isFavorited ? '#121624' : 'rgba(15, 12, 24, 0.72)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isFavorited ? '#FFE28A' : '#FFFFFF',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
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
        <Link
          href={`/product/${product.slug}`}
          style={{ textDecoration: 'none' }}
        >
          <h4
            style={{
              fontSize: '0.78rem',
              fontWeight: 500,
              color: '#FFFFFF',
              lineHeight: 1.25,
              fontFamily: 'var(--font-display)',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'color 200ms ease',
            }}
            title={product.name}
          >
            {product.name}
          </h4>
        </Link>

        {product.subtitle && (
          <span
            style={{
              fontSize: '0.66rem',
              color: 'rgba(255, 248, 245, 0.7)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.subtitle}
          </span>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            marginTop: '2px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#FFF8F5',
                letterSpacing: '0.02em',
              }}
            >
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Quick Add Button (Compact) */}
        <button
          onClick={handleQuickAdd}
          disabled={isAdding}
          className="banner-card-add-btn"
          style={{
            marginTop: '5px',
            width: '100%',
            minHeight: '28px',
            padding: '4px 8px',
            borderRadius: '6px',
            backgroundColor: isAdding ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.12)',
            border: isAdding ? '1px solid rgba(74, 222, 128, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
            color: isAdding ? '#4ade80' : '#FFFFFF',
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
