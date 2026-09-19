'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { getProductBySlug, getReviews, getProducts } from '@/lib/mockApi';
import { Product, Review, ProductVariant } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
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
  ArrowRight,
} from 'lucide-react';

interface ProductDetailViewProps {
  slug: string;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ slug }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variant selection
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Accordion active tab
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  // Modals
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addItem, setBuyNowItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { showToast } = useToastStore();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    async function loadProductData() {
      setLoading(true);
      try {
        const prod = await getProductBySlug(slug);
        if (!prod) {
          if (isMounted) setProduct(null);
          return;
        }

        const [revs, allProds] = await Promise.all([
          getReviews(prod.id),
          getProducts({ categorySlug: prod.categoryId }),
        ]);

        if (isMounted) {
          setProduct(prod);
          setReviews(revs);
          setRelated(allProds.filter((p) => p.id !== prod.id).slice(0, 4));

          // Set default selected variant (first in stock, or first)
          const firstInStock = prod.variants.find((v) => v.stock > 0) || prod.variants[0];
          setSelectedVariant(firstInStock);
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px' }}>
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
      showToast(`${product.name} (${selectedVariant.size}) added to your bag.`, 'success');
    }, 400);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    if (selectedVariant.stock < quantity) {
      showToast('Requested quantity exceeds available atelier reserve.', 'error');
      return;
    }

    setIsAddingToCart(true);
    setBuyNowItem(product, selectedVariant.sku, selectedVariant.size, selectedVariant.color, quantity);
    setTimeout(() => {
      setIsAddingToCart(false);
      router.push('/checkout');
    }, 300);
  };

  const handleReviewAdded = (newRev: Review) => {
    setReviews([newRev, ...reviews]);
  };

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '96px', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginBottom: '32px',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>Atelier</Link>
          <span>/</span>
          <Link href="/shop" style={{ textDecoration: 'none' }}>Collections</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{product.name}</span>
        </div>

        {/* Top Split: Gallery & Product Info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '56px',
            alignItems: 'flex-start',
            marginBottom: '80px',
          }}
        >
          {/* Left: Multi-Image Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Primary Main Image */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3 / 4',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-editorial)',
              }}
            >
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />

              {product.availability === 'low_stock' && (
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
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
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      position: 'relative',
                      width: '76px',
                      height: '95px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: activeImageIndex === idx ? '2px solid var(--color-sunset-700)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'border-color var(--duration-fast)',
                    }}
                  >
                    <Image src={img} alt={`${product.name} view ${idx + 1}`} fill sizes="76px" style={{ objectFit: 'cover' }} />
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
                    color: 'var(--color-sunset-600)',
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
                {product.compareAtPrice && (
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Inclusive of all luxury taxes & duties
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.65 }}>
              {product.description}
            </p>

            {/* Variant Selector: Size & Color */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Select Size
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    color: 'var(--color-sunset-600)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  <Ruler size={13} /> Sizing Chart
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.sku === v.sku;
                  const isVariantOutOfStock = v.stock === 0;

                  return (
                    <button
                      key={v.sku}
                      type="button"
                      disabled={isVariantOutOfStock}
                      onClick={() => setSelectedVariant(v)}
                      className="hover-fill-btn"
                      style={{
                        minWidth: '56px',
                        padding: '10px 18px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected
                          ? '2px solid var(--color-sunset-900)'
                          : '1px solid var(--border-color)',
                        '--fill-bg': isSelected
                          ? 'var(--color-sunset-900)'
                          : isVariantOutOfStock
                          ? 'rgba(0,0,0,0.03)'
                          : 'var(--bg-surface)',
                        '--fill-hover': 'var(--color-sunset-900)',
                        '--text-hover': '#FFF',
                        color: isSelected
                          ? '#FFF'
                          : isVariantOutOfStock
                          ? 'var(--text-muted)'
                          : 'var(--text-primary)',
                        fontSize: '0.88rem',
                        fontWeight: isSelected ? 600 : 500,
                        cursor: isVariantOutOfStock ? 'not-allowed' : 'pointer',
                        textDecoration: isVariantOutOfStock ? 'line-through' : 'none',
                      } as React.CSSProperties}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>

              {/* Stock Notice for Selected Variant */}
              {selectedVariant && (
                <div style={{ marginTop: '10px', fontSize: '0.8rem' }}>
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

            {/* Quantity and Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '6px 14px',
                    gap: '14px',
                    backgroundColor: 'var(--bg-surface)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '0.92rem', fontWeight: 600, minWidth: '18px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(selectedVariant?.stock || 5, quantity + 1))}
                    style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}
                  >
                    +
                  </button>
                </div>

                <div style={{ flex: 1 }}>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isOutOfStock}
                    isLoading={isAddingToCart}
                    onClick={handleAddToCart}
                    leftIcon={<ShoppingBag size={17} />}
                  >
                    {isOutOfStock ? 'Sold Out' : 'Add to Atelier Bag'}
                  </Button>
                </div>

                <button
                  className="hover-fill-btn"
                  type="button"
                  onClick={() => toggleItem(product.id)}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border-color)',
                    '--fill-bg': 'var(--bg-surface)',
                    '--fill-hover': 'var(--color-sunset-600)',
                    '--text-hover': '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isFavorited ? 'var(--color-sunset-600)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    flexShrink: 0,
                  } as React.CSSProperties}
                  aria-label="Toggle Wishlist"
                >
                  <Heart size={20} fill={isFavorited ? 'currentColor' : 'transparent'} strokeWidth={1.8} />
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                rightIcon={<ArrowRight size={17} />}
                style={{ letterSpacing: '0.05em' }}
              >
                PROCEED TO CHECKOUT
              </Button>
            </div>

            {/* Atelier Guarantees Pill */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                marginTop: '12px',
                textAlign: 'center',
              }}
            >
              <div>
                <Truck size={16} style={{ color: 'var(--color-sunset-600)', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>Complimentary</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>White-Glove Courier</span>
              </div>
              <div>
                <RotateCcw size={16} style={{ color: 'var(--color-sunset-600)', margin: '0 auto 4px' }} />
                <span style={{ fontSize: '0.72rem', display: 'block', fontWeight: 600 }}>7-Day Returns</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>From Delivery Date</span>
              </div>
              <div>
                <ShieldCheck size={16} style={{ color: 'var(--color-sunset-600)', margin: '0 auto 4px' }} />
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

        {/* Client Reflections / Reviews Section */}
        <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '64px', marginBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sunset-600)' }}>
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

          <ReviewForm productId={product.id} onReviewAdded={handleReviewAdded} />
          <div style={{ marginTop: '32px' }}>
            <ReviewList reviews={reviews} />
          </div>
        </section>

        {/* Related Silhouettes */}
        {related.length > 0 && (
          <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '64px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '32px' }}>Complementary Silhouettes</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '32px',
              }}
            >
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
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
    </div>
  );
};
