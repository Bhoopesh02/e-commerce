'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowLeft, Plus, Check } from 'lucide-react';
import { getProducts } from '@/lib/mockApi';
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
      }, 300); // wait for close animation
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Fetch results based on query or default to new-arrival/featured products
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        if (!query.trim()) {
          const data = await getProducts({ tag: 'new-arrival' }); 
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
  }, [query]);

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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        transition: 'opacity 300ms',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      {/* Backdrop Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Drawer Panel */}
      <aside
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#141021',
          color: '#f5f5f5',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms ease-out',
        }}
      >
        {/* Drawer Search Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: '#19142b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '6px',
                color: '#a3a3a3',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#a3a3a3')}
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>

            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                style={{
                  color: 'rgba(252, 211, 77, 0.8)',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#f5f5f5',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  outline: 'none',
                  transition: 'border-color 200ms, background-color 200ms',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.6)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
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
                    color: '#a3a3a3',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseOut={(e) => (e.currentTarget.style.color = '#a3a3a3')}
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
                color: 'rgba(253, 230, 138, 0.7)',
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
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: '#201a37',
                    color: '#d4d4d4',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.6)';
                    e.currentTarget.style.color = '#fde68a';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#d4d4d4';
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Body ("What's New" or Results Grid) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#e5e5e5', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              {!query.trim() ? "What's New" : "Search Results"} <span style={{ color: '#fbbf24', fontFamily: 'var(--font-display)' }}>★</span>
            </h3>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#a3a3a3' }}>
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
                    backgroundColor: '#1d1733',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 200ms',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <Link href={`/product/${item.slug}`} onClick={onClose} style={{ textDecoration: 'none' }}>
                    <div style={{ position: 'relative', aspectRatio: '1/1', width: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', marginBottom: '8px' }}>
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
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          backdropFilter: 'blur(4px)',
                          color: '#fde68a',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid rgba(255,255,255,0.1)'
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
                    <span style={{ fontSize: '10px', color: 'rgba(253, 230, 138, 0.6)', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.05em', display: 'block' }}>
                      {item.categoryId.replace('cat_', '')}
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: '#e5e5e5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginTop: '2px', lineHeight: '1.2' }}>
                      {item.name}
                    </h4>
                  </Link>

                  <div style={{ marginTop: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600, color: '#f5f5f5', display: 'block', marginBottom: '8px' }}>
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
                        backgroundColor: isAdded ? '#059669' : '#7c1d35',
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
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: '#19142b', textAlign: 'center' }}>
          <Link
            href="/shop"
            onClick={onClose}
            style={{
              fontSize: '12px',
              color: '#fde68a',
              textDecoration: 'underline',
              letterSpacing: '0.05em',
              fontWeight: 500
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#fde68a'}
          >
            Explore Full Aurelia Catalogue →
          </Link>
        </div>
      </aside>
    </div>
  );
};
