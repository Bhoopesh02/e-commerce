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
import { getLuxuryColorStyle } from '@/lib/colorUtils';
import { useScrollPreload } from '@/hooks/useScrollPreload';
import { preloadImage } from '@/lib/preloadImage';

export { ProductCardSkeleton, ProductGridSkeleton } from './ProductCardSkeleton';

export interface ProductCardProps {
  product: Product;
  aspectRatio?: string;
  variant?: 'standard' | 'overlay' | 'grid';
  sizes?: string;
  onClick?: () => void;
  priority?: boolean;
  quality?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspectRatio = '3 / 4',
  variant = 'standard',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 450px',
  onClick,
  priority = false,
  quality = 95,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const heartControls = useAnimationControls();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const isFavorited = isInWishlist(product.id);

  // Extract unique colors for this product
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

  // Resolve image based on selected color
  const currentImage = React.useMemo(() => {
    if (activeColor && product.variants) {
      const variantWithColor = product.variants.find((v) => v.color === activeColor && v.image);
      if (variantWithColor?.image) return variantWithColor.image;

      const colorIdx = availableColors.indexOf(activeColor);
      if (colorIdx !== -1 && product.images[colorIdx]) {
        return product.images[colorIdx];
      }
    }
    return product.images[0];
  }, [activeColor, product.variants, product.images, availableColors]);

  const hasSecondaryImage = product.images.length > 1 && !activeColor;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    // Add selected color variant if chosen, otherwise default first in-stock variant
    const variant = (activeColor ? product.variants.find((v) => v.color === activeColor && v.stock > 0) : null) || product.variants.find((v) => v.stock > 0) || product.variants[0];
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


  // Lookahead scroll preloader: fetches primary and secondary images 600px before card enters viewport
  const { ref: cardRef } = useScrollPreload<HTMLDivElement>(
    [currentImage, hasSecondaryImage ? product.images[1] : null],
    {
      rootMargin: '600px 0px',
      immediate: priority,
    }
  );

  return (
    <motion.div
      ref={cardRef}
      className={variant === 'grid' ? 'min-w-0 w-full p-3 rounded-xl md:p-0 md:rounded-none' : ''}
      style={variant === 'grid' ? { display: 'flex', flexDirection: 'column', position: 'relative' } : {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => {
        setIsHovered(true);
        // Preload additional color variant images on hover so color switches are instant
        if (product.images.length > 2) {
          product.images.slice(2).forEach((img) => preloadImage(img));
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <Link
        href={`/product/${product.slug}`}
        onClick={onClick}
        className={variant === 'grid' ? 'relative w-full block rounded-lg md:rounded-[var(--radius-sm)] md:overflow-hidden' : ''}
        style={variant === 'grid' ? {
          backgroundColor: 'var(--color-icy-lake)',
          aspectRatio,
        } : {
          position: 'relative',
          width: '100%',
          aspectRatio,
          overflow: 'hidden',
          borderRadius: '12px',
          backgroundColor: 'var(--color-icy-lake)',
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
              borderRadius="12px"
            />
          </div>
        )}

        {/* Primary Product Image */}
        <Image
          src={currentImage}
          alt={product.name}
          fill={variant !== 'grid'}
          width={variant === 'grid' ? 1200 : undefined}
          height={variant === 'grid' ? 1600 : undefined}
          quality={quality}
          sizes={sizes}
          priority={priority}
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
            width={variant === 'grid' ? 1200 : undefined}
            height={variant === 'grid' ? 1600 : undefined}
            quality={quality}
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
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 2,
          }}
        >
          {product.isNewArrival && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: 'var(--text-primary)',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: '9999px',
                lineHeight: 1.2,
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            >
              New
            </span>
          )}
        </div>

        {/* Wishlist Button (♡/♥) with restrained spring pop */}
        <motion.button
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          animate={heartControls}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavorited ? 'var(--brand-primary)' : 'var(--text-primary)',
            cursor: 'pointer',
            zIndex: 3,
            boxShadow: '0 1px 5px rgba(0, 0, 0, 0.12)',
            padding: 0,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <Heart
            size={16}
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
                    color: "var(--text-inverse)",
                    lineHeight: 1.2,
                    fontFamily: 'var(--font-display)',
                    marginBottom: '2px',
                    textShadow: '0 1px 3px var(--overlay-black-30)',
                  }}
                >
                  {product.name}
                </h3>
                {product.subtitle && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--overlay-white-85)' }}>
                    {product.subtitle}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: "var(--text-inverse)", textShadow: '0 1px 3px var(--overlay-black-30)' }}>
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Link>

      {/* Product Meta */}
      {(variant === 'standard' || variant === 'grid') && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Link href={`/product/${product.slug}`} onClick={onClick} style={{ textDecoration: 'none', minWidth: 0 }}>
              <h3
                style={{
                  fontSize: 'clamp(0.95rem, 3.8vw, 1.05rem)',
                  fontWeight: 400,
                  color: 'var(--text-primary)',
                  lineHeight: 1.25,
                  fontFamily: 'var(--font-display)',
                  margin: 0,
                }}
              >
                {product.name}
              </h3>
            </Link>
          </div>

          {product.subtitle && (
            <span
              style={{
                fontSize: 'clamp(0.78rem, 2.8vw, 0.82rem)',
                color: 'var(--text-muted)',
                lineHeight: 1.35,
                marginTop: '3px',
                display: 'block',
              }}
            >
              {product.subtitle}
            </span>
          )}

          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 'clamp(0.95rem, 3.6vw, 1.05rem)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Color Swatches: ONLY rendered if product has MORE THAN ONE color */}
          {availableColors.length > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '10px',
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {availableColors.map((colorName) => {
                const isSelected = (activeColor || availableColors[0]) === colorName;
                const { background, isLight } = getLuxuryColorStyle(colorName);

                return (
                  <button
                    key={colorName}
                    type="button"
                    aria-label={`Select ${colorName}`}
                    title={colorName}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveColor(colorName);
                    }}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      background: 'transparent',
                      border: isSelected ? '1px solid var(--text-primary)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease',
                      outline: 'none',
                    }}
                  >
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background,
                        boxShadow: isLight
                          ? 'inset 0 0 0 1px rgba(0, 0, 0, 0.18)'
                          : 'inset 0 0 0 1px rgba(255, 255, 255, 0.12)',
                        display: 'block',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
// Trigger rebuild
