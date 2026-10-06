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
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

export { ProductCardSkeleton, ProductGridSkeleton } from './ProductCardSkeleton';

export interface ProductCardProps {
  product: Product;
  aspectRatio?: string;
  variant?: 'standard' | 'overlay' | 'grid';
  sizes?: string;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspectRatio = '3 / 4',
  variant = 'standard',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px',
  onClick,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const heartControls = useAnimationControls();
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

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
    if (!shouldReduceMotion) {
      await heartControls.start({
        scale: [1, 1.2, 1],
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
      className={variant === 'grid' ? 'min-w-0 w-full p-3 rounded-xl md:p-0 md:rounded-none' : ''}
      style={variant === 'grid' ? { display: 'flex', flexDirection: 'column', position: 'relative' } : {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <Link
        href={`/product/${product.slug}`}
        onClick={onClick}
        className={variant === 'grid' ? 'relative w-full block rounded-lg md:rounded-[var(--radius-sm)] md:overflow-hidden' : ''}
        style={variant === 'grid' ? {
          backgroundColor: 'var(--bg-surface)',
          aspectRatio,
        } : {
          position: 'relative',
          width: '100%',
          aspectRatio,
          overflow: 'hidden',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-surface)',
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
            <Skeleton
              width="100%"
              height="100%"
              borderRadius={variant === 'grid' ? '8px' : 'var(--radius-sm)'}
            />
          </div>
        )}

        {/* Primary Product Image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill={variant !== 'grid'}
          width={variant === 'grid' ? 600 : undefined}
          height={variant === 'grid' ? 800 : undefined}
          quality={60}
          sizes={sizes}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageLoaded(true)}
          className={variant === 'grid' ? 'product-image-primary w-full h-auto object-cover rounded-lg md:rounded-none md:absolute md:h-full md:inset-0' : 'product-image-primary'}
          style={variant === 'grid' ? {
            opacity: isImageLoaded ? 1 : 0,
            transform: isHovered && !shouldReduceMotion ? 'scale(1.15)' : 'scale(1)',
            transition: 'opacity 350ms ease, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          } : {
            objectFit: 'cover',
            opacity: isImageLoaded ? 1 : 0,
            transform: isHovered && !shouldReduceMotion ? 'scale(1.15)' : 'scale(1)',
            transition: 'opacity 350ms ease, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />

        {/* Secondary Product Image with smooth crossfade switching */}
        {hasSecondaryImage && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fill={variant !== 'grid'}
            width={variant === 'grid' ? 600 : undefined}
            height={variant === 'grid' ? 800 : undefined}
            quality={60}
            sizes={sizes}
            className={variant === 'grid' ? 'product-image-secondary absolute inset-0 w-full h-full object-cover rounded-lg md:rounded-none' : 'product-image-secondary'}
            style={variant === 'grid' ? {
              opacity: isHovered ? 1 : 0,
              transform: isHovered && !shouldReduceMotion ? 'scale(1.15)' : 'scale(1)',
              transition: 'opacity 450ms ease, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              pointerEvents: 'none',
            } : {
              objectFit: 'cover',
              opacity: isHovered ? 1 : 0,
              transform: isHovered && !shouldReduceMotion ? 'scale(1.15)' : 'scale(1)',
              transition: 'opacity 450ms ease, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Top Badges */}
        <div
          className={`scale-[0.75] origin-top-left md:scale-100 ${variant === 'grid' ? 'drop-shadow-sm md:drop-shadow-none' : ''}`}
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
        </div>

        {/* Wishlist Button (♡/♥) with restrained spring pop */}
        <motion.button
          className={`hover-fill-btn ${variant === 'grid' ? 'absolute top-2 right-2 z-10 flex shrink-0 items-center justify-center rounded-full bg-white/90 shadow-sm w-8 h-8 min-w-[32px] min-h-[32px] md:top-[12px] md:right-[12px] md:w-[36px] md:h-[36px]' : ''}`}
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          animate={heartControls}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
          style={variant === 'grid' ? {
            '--fill-bg': 'rgba(255, 255, 255, 0.85)',
            '--fill-hover': 'var(--color-sapphire)',
            '--text-hover': '#FFF',
            backdropFilter: 'blur(4px)',
            border: 'none',
            color: isFavorited ? 'var(--color-sapphire)' : 'var(--color-black-tie)',
            cursor: 'pointer',
          } as React.CSSProperties : {
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-pill)',
            '--fill-bg': 'rgba(255, 255, 255, 0.85)',
            '--fill-hover': 'var(--color-sapphire)',
            '--text-hover': '#FFF',
            backdropFilter: 'blur(4px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavorited ? 'var(--color-sapphire)' : 'var(--color-black-tie)',
            cursor: 'pointer',
            zIndex: 3,
          } as React.CSSProperties}
        >
          <Heart
            size={18}
            className={variant === 'grid' ? 'w-4 h-4 md:w-[18px] md:h-[18px]' : ''}
            fill={isFavorited ? 'currentColor' : 'transparent'}
            stroke="currentColor"
            strokeWidth={1.8}
          />
        </motion.button>

        {/* Quick Add Overlay on Hover */}
        <div
          className="quick-add-overlay"
          style={{
            position: 'absolute',
            bottom: variant === 'overlay' ? '80px' : '12px',
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
            className={`quick-add-btn ${variant === 'grid' ? 'h-9 text-[11px] md:h-[var(--btn-height)] md:text-[var(--btn-text)]' : ''}`}
            aria-label={`Quick add ${product.name} to bag`}
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

        {/* Overlay Product Meta */}
        {variant === 'overlay' && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '60px 16px 16px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              pointerEvents: 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, paddingRight: '12px' }}>
                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    color: '#FFFFFF',
                    lineHeight: 1.2,
                    fontFamily: 'var(--font-display)',
                    marginBottom: '2px',
                    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }}
                >
                  {product.name}
                </h3>
                {product.subtitle && (
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>
                    {product.subtitle}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Link>

      {/* Product Meta */}
      {(variant === 'standard' || variant === 'grid') && (
        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Link href={`/product/${product.slug}`} onClick={onClick} className={variant === 'grid' ? 'min-w-0' : ''}>
            <h3
              className={variant === 'grid' ? 'text-[15px] font-serif line-clamp-2 md:text-[1rem] md:font-display md:line-clamp-none' : ''}
              style={variant === 'grid' ? {
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 1.3,
              } : {
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
          <span className={variant === 'grid' ? 'truncate block text-[12px] md:text-[0.8rem]' : ''} style={variant === 'grid' ? { color: 'var(--text-muted)' } : { fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {product.subtitle}
          </span>
        )}

        <div 
          className={variant === 'grid' ? 'flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0 mt-2 md:mt-[6px] md:flex-nowrap md:justify-between md:gap-0' : ''}
          style={variant === 'grid' ? undefined : { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={variant === 'grid' ? 'text-[15px] md:text-[0.98rem]' : ''} style={variant === 'grid' ? { fontWeight: 600, color: 'var(--text-primary)' } : { fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {formatPrice(product.price)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="desktop-rating">
              <RatingStars rating={product.rating.average} size={12} totalReviews={product.rating.count} />
            </div>
            <div className="mobile-rating">
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>
                {product.rating.average.toFixed(1)}
              </span>
              <Star size={13} fill="var(--color-golden)" stroke="var(--color-golden)" strokeWidth={1.5} />
            </div>
          </div>
        </div>
        </div>
      )}
    </motion.div>
  );
};
// Trigger rebuild
