'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowLeft, Plus, Check } from 'lucide-react';
import { getProducts, getNewArrivals } from '@/lib/mockApi';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/formatPrice';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROTATING_QUERIES = [
  "Cashmere Coat",
  "Mulberry Silk Gown",
  "Double-Breasted Wool",
  "Tuscan Leather Chelsea",
  "Sculptural Gold Cuff",
];

const SUGGESTIONS = [
  "Italian Leather",
  "Double-Breasted",
  "Silk Gown",
  "Cashmere",
  "Goodyear Chelsea",
  "Gold Vermeil",
];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCartStore();

  // Rotating placeholder cycle every 2.5s when query is empty
  useEffect(() => {
    if (!isOpen || query) return;
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % ROTATING_QUERIES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen, query]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset local state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setQuery('');
        setResults([]);
      }, 250); // wait for close animation
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Fetch results based on query or default to new-arrival/featured products
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        if (!query.trim()) {
          const data = await getNewArrivals(); 
          setResults(data.slice(0, 4)); // limit to 4 items for the drawer
        } else {
          const data = await getProducts({ searchQuery: query });
          setResults(data);
        }
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleQuickAdd = (product: Product) => {
    const defaultVariant = product.variants?.[0];
    const sku = defaultVariant ? defaultVariant.sku : product.id;
    const size = defaultVariant ? defaultVariant.size : 'OS';
    const color = defaultVariant ? defaultVariant.color : 'Default';

    addItem(product, sku, size, color, 1);
    
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal={isOpen}
      aria-label="Search"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(29, 26, 57, 0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity 200ms ease-out',
      }}
    >
      {/* Drawer Panel */}
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-editorial)',
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 250ms var(--ease-luxury)',
        }}
      >
        {/* Drawer Search Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '6px',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms ease',
                transform: 'translateX(0)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateX(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>

            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                style={{
                  color: 'var(--color-sunset-600)',
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search for "${ROTATING_QUERIES[placeholderIdx]}"`}
                style={{
                  width: '100%',
                  padding: '8px 32px',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  transition: 'border-color 200ms, background-color 200ms',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-sunset-600)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Popular Searches Pills */}
          <div style={{ marginTop: '20px' }}>
            <span
              style={{
                display: 'block',
                fontSize: '10px',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                color: 'var(--color-sunset-700)',
                marginBottom: '8px',
              }}
            >
              Suggested Explorations
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SUGGESTIONS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  style={{
                    fontSize: '12px',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-sunset-600)';
                    e.currentTarget.style.color = 'var(--color-sunset-700)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Body ("What's New" or Results Grid) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontWeight: 600 }}>
              {!query.trim() ? (
                <>
                  New Arrivals
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-sunset-600)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 8l-1.5 12A1.5 1.5 0 0 0 4.5 21.5h15a1.5 1.5 0 0 0 1.5-1.5L19.5 8H4.5z" />
                    <path d="M8 8V5.5a4 4 0 0 1 8 0V8" />
                    <text x="12" y="16.5" fontSize="6.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" fill="var(--color-sunset-600)" stroke="none" style={{ textTransform: 'lowercase', letterSpacing: '-0.08em' }}>new</text>
                  </svg>
                </>
              ) : (
                "Search Results"
              )}
            </h3>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
              {isLoading ? '...' : `${results.length} Items`}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {results.map((item) => {
              const isAdded = !!addedMap[item.id];
              return (
                <div
                  key={item.id}
                  style={{
                    position: 'relative',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 200ms',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-sunset-600)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <Link href={`/product/${item.slug}`} onClick={onClose} style={{ textDecoration: 'none' }}>
                    <div style={{ position: 'relative', aspectRatio: '1/1', width: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', marginBottom: '8px' }}>
                      {(item.featured || item.isNewArrival) && (
                        <span style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          zIndex: 10,
                          fontSize: '9px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          backgroundColor: 'rgba(29, 26, 57, 0.82)',
                          backdropFilter: 'blur(4px)',
                          color: '#FFF8F5',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid rgba(255,255,255,0.15)'
                        }}>
                          {item.isNewArrival ? 'New Season' : 'Featured'}
                        </span>
                      )}
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        sizes="200px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--color-sunset-600)', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.05em', display: 'block', fontWeight: 600 }}>
                      {item.categoryId.replace('cat_', '')}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginTop: '2px', lineHeight: '1.25', fontWeight: 500 }}>
                      {item.name}
                    </h3>
                  </Link>

                  <div style={{ marginTop: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                      {formatPrice(item.price)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleQuickAdd(item);
                      }}
                      style={{
                        width: '100%',
                        padding: '6px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        transition: 'all 200ms',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        backgroundColor: isAdded ? 'var(--color-success)' : '#7c1d35',
                        color: '#ffffff',
                        border: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseOver={(e) => {
                        if (!isAdded) e.currentTarget.style.backgroundColor = '#631427';
                      }}
                      onMouseOut={(e) => {
                        if (!isAdded) e.currentTarget.style.backgroundColor = '#7c1d35';
                      }}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} /> Added
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> ADD
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)', textAlign: 'center' }}>
          <Link
            href="/shop"
            onClick={onClose}
            style={{
              fontSize: '12px',
              color: 'var(--color-sunset-700)',
              textDecoration: 'underline',
              letterSpacing: '0.05em',
              fontWeight: 600
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-sunset-900)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-sunset-700)'}
          >
            Explore Full Aurelia Catalogue →
          </Link>
        </div>
      </aside>
    </div>
  );
};
