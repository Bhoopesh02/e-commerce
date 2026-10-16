'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { getProductBySlug, getReviews, getProducts, getOrders } from '@/lib/mockApi';
import { Product, Review, ProductVariant } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToastStore } from '@/store/useToastStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { RatingStars } from '@/components/ui/RatingStars';
import { Skeleton } from '@/components/ui/Skeleton';
import { ReviewList } from '@/components/product/ReviewList';
import { ReviewForm } from '@/components/product/ReviewForm';
import { ProductCard } from '@/components/product/ProductCard';
import { RecommendedProducts } from '@/components/product/RecommendedProducts';
import { ProductImageLightbox } from '@/components/product/ProductImageLightbox';
import {
  Heart,
  ShoppingBag,
  Check,
  Ruler,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronLeft,
} from 'lucide-react';
import { getLuxuryColorStyle } from '@/lib/colorUtils';

interface ProductDetailViewProps {
  slug: string;
  initialProduct: Product | null;
  initialReviews: Review[];
  initialAllProducts: Product[];
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  slug,
  initialProduct,
  initialReviews,
  initialAllProducts,
}) => {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [allProducts, setAllProducts] = useState<Product[]>(initialAllProducts);
  const [loading, setLoading] = useState(!initialProduct);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variant selection
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    if (!initialProduct) return null;
    return initialProduct.variants.find((v) => v.stock > 0) || initialProduct.variants[0];
  });
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    if (!initialProduct) return '';
    const initialVar = initialProduct.variants.find((v) => v.stock > 0) || initialProduct.variants[0];
    return initialVar?.color || '';
  });
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Accordion active tab
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  // Modals
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { user, isAuthenticated } = useAuthStore();
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { showToast } = useToastStore();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    async function verifyPurchase() {
      if (!product || !isAuthenticated || !user?.id) {
        setIsVerifiedBuyer(false);
        return;
      }
      setCheckingPurchase(true);
      try {
        const orders = await getOrders(user.id);
        const hasPurchased = orders.some(
          (o) =>
            o.status !== 'Cancelled' &&
            o.items.some((item) => item.productId === product.id)
        );
        if (isMounted) {
          setIsVerifiedBuyer(hasPurchased);
        }
      } catch (err) {
        console.error('Error verifying purchase status:', err);
      } finally {
        if (isMounted) {
          setCheckingPurchase(false);
        }
      }
    }
    verifyPurchase();
    return () => {
      isMounted = false;
    };
  }, [product, user?.id, isAuthenticated]);

  const handleReviewAdded = (newRev: Review) => {
    setReviews((prev) => [newRev, ...prev]);
    setIsReviewFormOpen(false);
    if (product) {
      const allRevs = [newRev, ...reviews];
      const newAverage = allRevs.reduce((acc, r) => acc + r.rating, 0) / allRevs.length;
      setProduct({
        ...product,
        rating: {
          average: Number(newAverage.toFixed(1)),
          count: allRevs.length,
        },
      });
    }
  };

  const hasUserReviewed = Boolean(
    user?.id && reviews.some((r) => r.userId === user.id)
  );

  // Server pre-fetched data for this slug — skip redundant first-mount fetch
  const isInitialMount = useRef(true);

  // Gallery references for accessibility focus return
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mainImageRef = useRef<HTMLDivElement | null>(null);

  // Track touch position for tap-to-view interaction (differentiates taps from scrolls)
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartPos.current && e.changedTouches.length === 1) {
      const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartPos.current.x);
      const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartPos.current.y);
      // Minimal movement (<10px) represents a deliberate touch-to-view tap rather than scrolling
      if (deltaX < 10 && deltaY < 10) {
        setIsLightboxOpen(true);
      }
    }
    touchStartPos.current = null;
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (initialProduct) return;
    }

    let isMounted = true;
    async function loadProductData() {
      try {
        // Concurrent fetch — no waterfall
        const [prod, catalogProds] = await Promise.all([
          getProductBySlug(slug),
          getProducts(),
        ]);

        if (!prod) {
          if (isMounted) {
            setProduct(null);
            setLoading(false);
          }
          return;
        }

        const revs = await getReviews(prod.id);

        if (isMounted) {
          setProduct(prod);
          setReviews(revs);
          setAllProducts(catalogProds);
          const firstInStock = prod.variants.find((v) => v.stock > 0) || prod.variants[0];
          setSelectedVariant(firstInStock);
          if (firstInStock?.color) {
            setSelectedColor(firstInStock.color);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProductData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div style={{ paddingTop: '110px', paddingBottom: '96px' }} className="container">
        <div className="pdp-split-layout">
          <Skeleton height="620px" borderRadius="var(--radius-sm)" />
          <div>
            <Skeleton height="40px" width="80%" />
            <Skeleton height="24px" width="50%" style={{ marginTop: '12px' }} />
            <Skeleton height="32px" width="30%" style={{ marginTop: '24px' }} />
            <Skeleton height="120px" style={{ marginTop: '32px' }} />
            <Skeleton height="54px" style={{ marginTop: '24px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ paddingTop: '140px', paddingBottom: '120px', textAlign: 'center' }} className="container">
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Silhouette Not Located</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          The atelier piece you requested may have retired from current editions.
        </p>
        <Link href="/shop">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = !selectedVariant || selectedVariant.stock === 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    if (selectedVariant.stock < quantity) {
      showToast('Requested quantity exceeds available atelier reserve.', 'error');
      return;
    }

    setIsAddingToCart(true);
    addItem(product, selectedVariant.sku, selectedVariant.size, selectedVariant.color, quantity);
    setTimeout(() => {
      setIsAddingToCart(false);
      showToast(`${product.name} (${selectedVariant.color} · ${selectedVariant.size}) added to your bag.`, 'success');
    }, 400);
  };


  return (
    <div style={{ paddingTop: '110px', paddingBottom: '96px', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Back Navigation */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) {
              router.back();
            } else {
              router.push('/shop');
            }
          }}
          className="animated-back-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            color: 'var(--text-primary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '32px',
            fontWeight: 500,
          }}
        >
          <ChevronLeft size={16} />
          <span className="back-text">Back</span>
        </button>

        {/* Top Split: Gallery & Product Info */}
        <div className="pdp-split-layout">
          {/* Left: Multi-Image Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Primary Main Image - touch or click to view full screen */}
            <div
              ref={mainImageRef}
              role="button"
              tabIndex={0}
              aria-label={`View ${product.name} in full screen`}
              title="Touch or click to view full screen"
              onClick={() => setIsLightboxOpen(true)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsLightboxOpen(true);
                }
              }}
              className="pdp-main-image-container"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3 / 4',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-editorial)',
                cursor: 'zoom-in',
                touchAction: 'pan-y',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none',
              }}
            >
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                quality={95}
                sizes="(max-width: 1024px) 100vw, 55vw"
                style={{
                  objectFit: 'cover',
                  transition: 'transform var(--duration-normal) var(--ease-editorial)',
                }}
              />

              {product.availability === 'low_stock' && (
                <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>
                  <Badge variant="warning">Low Atelier Reserve</Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Rail */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    ref={(el) => {
                      thumbnailRefs.current[idx] = el;
                    }}
                    onClick={() => {
                      if (activeImageIndex === idx) {
                        setIsLightboxOpen(true);
                      } else {
                        setActiveImageIndex(idx);
                      }
                    }}
                    aria-label={`Select photo ${idx + 1}`}
                    style={{
                      position: 'relative',
                      width: '76px',
                      height: '95px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: activeImageIndex === idx ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'border-color var(--duration-fast)',
                    }}
                  >
                    <Image src={img} alt={`${product.name} view ${idx + 1}`} fill sizes="160px" quality={90} style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Garment Information & Purchasing Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--brand-primary)',
                  }}
                >
                  {product.subtitle || 'Atelier Master Edition'}
                </span>

                <RatingStars rating={product.rating.average} size={14} showScore totalReviews={product.rating.count} />
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  lineHeight: 1.15,
                  marginBottom: '12px',
                }}
              >
                {product.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {formatPrice(product.price)}
                </span>
                {/* Strikethrough compare price removed as requested */}
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Inclusive of all luxury taxes & duties
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.65 }}>
              {product.description}
            </p>

            {/* Variant Selector: Color & Size */}
            {(() => {
              // Extract unique colors for this product
              const availableColors: string[] = [];
              product.variants.forEach((v) => {
                if (v.color && !availableColors.includes(v.color)) {
                  availableColors.push(v.color);
                }
              });

              // Sizes for currently selected color
              const variantsForColor = availableColors.length > 0 && selectedColor
                ? product.variants.filter((v) => v.color === selectedColor)
                : product.variants;

              // Color change handler - switches variant and switches ONLY the product image
              const handleColorChange = (color: string) => {
                setSelectedColor(color);

                const variantsInColor = product.variants.filter((v) => v.color === color);
                const currentSize = selectedVariant?.size;
                const matchingSizeVariant = variantsInColor.find((v) => v.size === currentSize);
                const inStockVariant = variantsInColor.find((v) => v.stock > 0);
                const targetVariant = matchingSizeVariant || inStockVariant || variantsInColor[0] || null;

                if (targetVariant) {
                  setSelectedVariant(targetVariant);
                }

                // Switch ONLY the product image
                if (targetVariant?.image) {
                  const idx = product.images.indexOf(targetVariant.image);
                  if (idx !== -1) {
                    setActiveImageIndex(idx);
                    return;
                  }
                }
                const anyWithImg = variantsInColor.find((v) => v.image);
                if (anyWithImg?.image) {
                  const idx = product.images.indexOf(anyWithImg.image);
                  if (idx !== -1) {
                    setActiveImageIndex(idx);
                    return;
                  }
                }
                const cIndex = availableColors.indexOf(color);
                if (cIndex !== -1 && product.images[cIndex]) {
                  setActiveImageIndex(cIndex);
                }
              };

              return (
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '22px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {/* 1. Color Selection (Gucci / Net-a-Porter luxury pattern) */}
                  {availableColors.length > 0 && (
                    <div>
                      <div style={{ marginBottom: '12px', fontSize: '0.94rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>Color: </span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedColor}</span>
                      </div>

                      <div
                        role="radiogroup"
                        aria-label="Color choices"
                        style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}
                      >
                        {availableColors.map((colorName) => {
                          const isSelected = selectedColor === colorName;
                          const isHovered = hoveredColor === colorName;
                          const colorVariants = product.variants.filter((v) => v.color === colorName);
                          const isColorOutOfStock = colorVariants.length > 0 && colorVariants.every((v) => v.stock === 0);
                          const { background, isLight } = getLuxuryColorStyle(colorName);

                          return (
                            <button
                              key={colorName}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              aria-label={`Select ${colorName}${isColorOutOfStock ? ' (Out of stock)' : ''}`}
                              title={colorName}
                              onClick={() => handleColorChange(colorName)}
                              onMouseEnter={() => setHoveredColor(colorName)}
                              onMouseLeave={() => setHoveredColor(null)}
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                background: 'transparent',
                                border: isSelected
                                  ? '1.5px solid var(--text-primary)'
                                  : isHovered
                                  ? '1.5px solid var(--text-muted)'
                                  : '1.5px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                outline: 'none',
                              }}
                            >
                              {/* Inner Color Swatch Circle */}
                              <span
                                style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  background,
                                  boxShadow: isLight
                                    ? 'inset 0 0 0 1px rgba(0, 0, 0, 0.18)'
                                    : 'inset 0 0 0 1px rgba(255, 255, 255, 0.12)',
                                  display: 'block',
                                  position: 'relative',
                                  overflow: 'hidden',
                                }}
                              >
                                {isColorOutOfStock && (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '-20%',
                                      width: '140%',
                                      height: '1.5px',
                                      backgroundColor: '#B00020',
                                      transform: 'rotate(-45deg)',
                                      transformOrigin: 'center',
                                    }}
                                  />
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Size Selection */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.94rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        Size:
                      </span>
                      <button
                        type="button"
                        onClick={() => setSizeGuideOpen(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.84rem',
                          color: 'var(--text-secondary)',
                          textDecoration: 'underline',
                          textUnderlineOffset: '3px',
                          cursor: 'pointer',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontWeight: 400,
                        }}
                      >
                        <Ruler size={13} /> View size guide
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {variantsForColor.map((v) => {
                        const isSelected = selectedVariant?.sku === v.sku;
                        const isVariantOutOfStock = v.stock === 0;

                        return (
                          <button
                            key={v.sku}
                            type="button"
                            disabled={isVariantOutOfStock}
                            onClick={() => setSelectedVariant(v)}
                            aria-label={`Size ${v.size}${isVariantOutOfStock ? ' (Out of stock)' : ''}`}
                            style={{
                              minWidth: '68px',
                              height: '46px',
                              padding: '0 16px',
                              borderRadius: '2px',
                              fontSize: '0.88rem',
                              fontWeight: isSelected ? 600 : 400,
                              cursor: isVariantOutOfStock ? 'not-allowed' : 'pointer',
                              position: 'relative',
                              overflow: 'hidden',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease',
                              outline: 'none',
                              ...(isSelected
                                ? {
                                    backgroundColor: 'var(--color-black-tie)',
                                    color: 'var(--color-diamond)',
                                    border: '1px solid var(--color-black-tie)',
                                  }
                                : isVariantOutOfStock
                                ? {
                                    backgroundColor: '#FAFAFA',
                                    color: '#9CA3AF',
                                    border: '1px solid #E5E7EB',
                                    backgroundImage:
                                      'linear-gradient(to top right, transparent calc(50% - 0.75px), #D1D5DB calc(50% - 0.75px), #D1D5DB calc(50% + 0.75px), transparent calc(50% + 0.75px))',
                                  }
                                : {
                                    backgroundColor: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                  }),
                            }}
                          >
                            {v.size}
                          </button>
                        );
                      })}
                    </div>

                    {/* Stock Notice for Selected Variant */}
                    {selectedVariant && (
                      <div style={{ marginTop: '12px', fontSize: '0.82rem' }}>
                        {selectedVariant.stock > 0 && selectedVariant.stock <= 3 ? (
                          <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>
                            Only {selectedVariant.stock} remaining in atelier inventory
                          </span>
                        ) : selectedVariant.stock > 3 ? (
                          <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>
                            ✓ Reserve available in Milan warehouse
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>
                            Out of stock — join waitlist
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Quantity and Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '6px' }}>
              {/* Quantity Stepper Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '2px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Quantity
                </span>
                <div
                  className="pdp-quantity-selector"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-color)',
                    borderRadius: '2px',
                    padding: '2px 10px',
                    gap: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    height: '38px',
                    boxSizing: 'border-box',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      fontSize: '1.1rem',
                      color: 'var(--text-secondary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0 4px',
                      lineHeight: 1,
                    }}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      minWidth: '20px',
                      textAlign: 'center',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(selectedVariant?.stock || 5, quantity + 1))}
                    style={{
                      fontSize: '1.1rem',
                      color: 'var(--text-secondary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0 4px',
                      lineHeight: 1,
                    }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons Stack (Styled after uploaded luxury reference) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* 1. Add to Atelier Bag */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isOutOfStock}
                  isLoading={isAddingToCart}
                  onClick={handleAddToCart}
                  disableSheen
                  className="pdp-btn-bag"
                  style={{
                    borderRadius: '2px',
                    height: '50px',
                    minHeight: '50px',
                    backgroundColor: 'var(--color-black-tie)',
                    color: 'var(--color-diamond)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    border: '1px solid var(--color-black-tie)',
                  }}
                >
                  {isOutOfStock ? 'Sold Out' : 'Add to Atelier Bag'}
                </Button>

                {/* 2. Add to Wish List (Heart button matching uploaded reference) */}
                <button
                  type="button"
                  onClick={() => toggleItem(product.id)}
                  aria-label={isFavorited ? 'Remove from Wish List' : 'Add to Wish List'}
                  className="pdp-wishlist-action-btn"
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '50px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--color-black-tie)',
                    borderRadius: '2px',
                    color: 'var(--color-black-tie)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    padding: '0 24px',
                    transition: 'all var(--duration-normal) var(--ease-editorial)',
                  }}
                >
                  <Heart
                    size={19}
                    strokeWidth={1.8}
                    fill={isFavorited ? 'var(--color-black-tie)' : 'none'}
                    color="var(--color-black-tie)"
                    style={{
                      position: 'absolute',
                      left: '20px',
                      flexShrink: 0,
                      transition: 'transform 0.2s ease, fill 0.2s ease',
                    }}
                  />
                  <span>{isFavorited ? 'Saved to Wish List' : 'Add to Wish List'}</span>
                </button>
              </div>
            </div>

            {/* Atelier Guarantees Pill */}
            <div className="pdp-guarantees">
              <div>
                <Truck size={16} style={{ color: 'var(--brand-primary)', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>Complimentary</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>White-Glove Courier</span>
              </div>
              <div>
                <RotateCcw size={16} style={{ color: 'var(--brand-primary)', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>7-Day Returns</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>From Delivery Date</span>
              </div>
              <div>
                <ShieldCheck size={16} style={{ color: 'var(--brand-primary)', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>Authentic Heirloom</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>100% Traceable</span>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              {/* Accordion 1: Details */}
              <div style={{ borderBottom: '1px solid var(--border-light)' }}>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
                  style={{
                    width: '100%',
                    padding: '16px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <span>Garment Architecture & Details</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: openAccordion === 'details' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform var(--duration-fast)',
                    }}
                  />
                </button>
                {openAccordion === 'details' && (
                  <div style={{ paddingBottom: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <ul style={{ paddingLeft: '20px', lineHeight: 1.7 }}>
                      {product.details?.map((d, i) => (
                        <li key={i}>{d}</li>
                      )) || <li>Hand-crafted by master tailors in Milan.</li>}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Materials & Care */}
              <div style={{ borderBottom: '1px solid var(--border-light)' }}>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'materials' ? null : 'materials')}
                  style={{
                    width: '100%',
                    padding: '16px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <span>Material Provenance & Care</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: openAccordion === 'materials' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform var(--duration-fast)',
                    }}
                  />
                </button>
                {openAccordion === 'materials' && (
                  <div style={{ paddingBottom: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Composition: </strong>
                      {product.materials?.join(', ') || 'Virgin wool & Italian cupro.'}
                    </div>
                    <div>
                      <strong>Preservation: </strong>
                      {product.careGuide?.join('. ') || 'Specialist clean only.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & 7-Day Return Policy */}
              <div style={{ borderBottom: '1px solid var(--border-light)' }}>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  style={{
                    width: '100%',
                    padding: '16px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <span>Courier & 7-Day Return Privilege</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: openAccordion === 'shipping' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform var(--duration-fast)',
                    }}
                  />
                </button>
                {openAccordion === 'shipping' && (
                  <div style={{ paddingBottom: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p style={{ marginBottom: '8px' }}>
                      Orders are dispatched via BlueDart Express luxury courier service with full transit insurance. Delivery is fulfilled within 2–4 business days across metropolitan centers.
                    </p>
                    <p>
                      In accordance with house guidelines, returns and exchanges may be requested exclusively when the order status reaches <strong>Delivered</strong>, within <strong>7 days</strong> of physical handover. All garments must retain atelier security seals and packaging intact.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete the Look Section */}
        <RecommendedProducts
          currentProduct={product}
          products={allProducts}
          recommendationType="complete-the-look"
          limit={4}
        />

        {/* Client Reflections / Reviews Section */}
        <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '64px', marginBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand-primary)' }}>
                Client Impressions
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>Reflections & Fit Notes</h2>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                {product.rating.average.toFixed(1)}
              </span>
              <div style={{ marginTop: '2px' }}>
                <RatingStars rating={product.rating.average} size={14} />
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Based on {reviews.length} verified owner reflections
              </span>
            </div>
          </div>

          {/* Verified purchase submission CTA / notice */}
          {isVerifiedBuyer && !hasUserReviewed && (
            <div
              style={{
                marginBottom: '28px',
                padding: '20px 24px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(180, 140, 80, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-primary)',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>
                    Verified Commission
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    You have acquired this piece. Share your reflections on its drape, tailoring, and fit with fellow patrons.
                  </p>
                </div>
              </div>
              <Button
                variant={isReviewFormOpen ? 'ghost' : 'outline'}
                size="sm"
                onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
              >
                {isReviewFormOpen ? 'Close Reflection' : 'Write Client Reflection'}
              </Button>
            </div>
          )}

          {isVerifiedBuyer && hasUserReviewed && (
            <div
              style={{
                marginBottom: '24px',
                padding: '14px 18px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.84rem',
                color: 'var(--text-secondary)',
              }}
            >
              <Check size={16} style={{ color: 'var(--color-success)' }} />
              <span>You have submitted a verified reflection for this piece. Thank you for contributing to our atelier archives.</span>
            </div>
          )}

          {!isVerifiedBuyer && !checkingPurchase && (
            <div
              style={{
                marginBottom: '28px',
                padding: '16px 20px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={16} style={{ color: 'var(--brand-primary)' }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Purchased commissions earn the verified owner badge. You may also record your silhouette impression below.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {!isAuthenticated ? (
                  <Link
                    href="/account/login"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--brand-primary)',
                      textDecoration: 'underline',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Sign in to verify
                  </Link>
                ) : (
                  <Link
                    href="/account/orders"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--brand-primary)',
                      textDecoration: 'underline',
                      letterSpacing: '0.02em',
                    }}
                  >
                    View your commissions
                  </Link>
                )}
                <Button
                  variant={isReviewFormOpen ? 'ghost' : 'outline'}
                  size="sm"
                  onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                >
                  {isReviewFormOpen ? 'Close Reflection' : 'Write Client Reflection'}
                </Button>
              </div>
            </div>
          )}

          {/* Expandable Review Form */}
          {isReviewFormOpen && (
            <div style={{ marginBottom: '32px' }}>
              <ReviewForm
                productId={product.id}
                productName={product.name}
                isVerifiedBuyer={isVerifiedBuyer}
                initialExpanded
                onReviewAdded={handleReviewAdded}
                onCancel={() => setIsReviewFormOpen(false)}
              />
            </div>
          )}

          <div style={{ marginTop: '32px' }}>
            <ReviewList reviews={reviews} />
          </div>
        </section>

        {/* You May Also Like Section */}
        <RecommendedProducts
          currentProduct={product}
          products={allProducts}
          recommendationType="similar"
          limit={4}
        />
      </div>

      {/* Sizing Chart Modal */}
      <Modal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} title="Atelier Size & Dimension Guide">
        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '16px' }}>
            Our garments are tailored to European luxury standards. Measure directly against your frame with a flexible tape:
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-primary)' }}>
                <th style={{ padding: '8px' }}>Size</th>
                <th style={{ padding: '8px' }}>EU</th>
                <th style={{ padding: '8px' }}>Chest (in)</th>
                <th style={{ padding: '8px' }}>Waist (in)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '8px', fontWeight: 600 }}>S / 38R</td>
                <td style={{ padding: '8px' }}>48</td>
                <td style={{ padding: '8px' }}>37 – 39</td>
                <td style={{ padding: '8px' }}>30 – 32</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '8px', fontWeight: 600 }}>M / 40R</td>
                <td style={{ padding: '8px' }}>50</td>
                <td style={{ padding: '8px' }}>39 – 41</td>
                <td style={{ padding: '8px' }}>32 – 34</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '8px', fontWeight: 600 }}>L / 42R</td>
                <td style={{ padding: '8px' }}>52</td>
                <td style={{ padding: '8px' }}>41 – 43</td>
                <td style={{ padding: '8px' }}>34 – 36</td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            For bespoke fitting advice, our client concierge is at your service via the support portal.
          </p>
        </div>
      </Modal>

      {/* Full-Screen Product Image Lightbox */}
      <ProductImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={product.images}
        productName={product.name}
        initialIndex={activeImageIndex}
        onIndexChange={(newIdx) => setActiveImageIndex(newIdx)}
        returnFocusElement={thumbnailRefs.current[activeImageIndex] || mainImageRef.current}
      />
    </div>
  );
};
