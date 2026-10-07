'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ProductImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  productName: string;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
}

export const ProductImageLightbox: React.FC<ProductImageLightboxProps> = ({
  isOpen,
  onClose,
  images,
  productName,
  initialIndex = 0,
  onIndexChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Touch handling references
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to clamp pan offsets so the image NEVER shifts into blank views
  const clampPan = useCallback(
    (newX: number, newY: number, currentZoom: number) => {
      if (currentZoom <= 1 || !containerRef.current) {
        return { x: 0, y: 0 };
      }

      const clientWidth = containerRef.current.clientWidth;
      const clientHeight = containerRef.current.clientHeight;

      // Max allowable pan in screen pixels before image edge pulls away from container
      const maxX = Math.max(0, (clientWidth * (currentZoom - 1)) / 2);
      const maxY = Math.max(0, (clientHeight * (currentZoom - 1)) / 2);

      return {
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      };
    },
    []
  );

  // Sync initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, images.length - 1)));
      setZoom(1);
      setPanOffset({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex, images.length]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => {
      const nextIndex = prev === 0 ? images.length - 1 : prev - 1;
      onIndexChange?.(nextIndex);
      return nextIndex;
    });
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, [images.length, onIndexChange]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => {
      const nextIndex = prev === images.length - 1 ? 0 : prev + 1;
      onIndexChange?.(nextIndex);
      return nextIndex;
    });
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, [images.length, onIndexChange]);

  // Zoom handlers
  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const toggleZoom = useCallback(() => {
    setZoom((prev) => {
      const nextZoom = prev > 1 ? 1 : 2;
      setPanOffset({ x: 0, y: 0 });
      return nextZoom;
    });
  }, []);

  // Keyboard navigation & accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoom((prev) => {
          const next = Math.min(3, +(prev + 0.5).toFixed(1));
          setPanOffset((cur) => clampPan(cur.x, cur.y, next));
          return next;
        });
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setZoom((prev) => {
          const next = Math.max(1, +(prev - 0.5).toFixed(1));
          if (next === 1) {
            setPanOffset({ x: 0, y: 0 });
          } else {
            setPanOffset((cur) => clampPan(cur.x, cur.y, next));
          }
          return next;
        });
      } else if (e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, handleResetZoom, clampPan, onClose]);

  // Mouse pan handling when zoomed (desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    const rawX = e.clientX - dragStart.x;
    const rawY = e.clientY - dragStart.y;
    setPanOffset(clampPan(rawX, rawY, zoom));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handling for mobile: swipe between images & drag to pan & double-tap to zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const now = Date.now();

      // Double-tap to zoom toggle
      if (now - lastTapRef.current < 320) {
        toggleZoom();
        lastTapRef.current = 0;
        touchStartRef.current = null;
        return;
      }
      lastTapRef.current = now;

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: now,
      };

      if (zoom > 1) {
        setIsDragging(true);
        setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && zoom > 1) {
      const touch = e.touches[0];
      const rawX = touch.clientX - dragStart.x;
      const rawY = touch.clientY - dragStart.y;
      setPanOffset(clampPan(rawX, rawY, zoom));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);

    // If zoomed, ensure strictly clamped within image boundaries
    if (zoom > 1) {
      setPanOffset((cur) => clampPan(cur.x, cur.y, zoom));
    }

    // If not zoomed, detect clean horizontal swipe to navigate photos
    if (zoom <= 1 && touchStartRef.current && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4 && deltaTime < 400) {
        if (deltaX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    touchStartRef.current = null;
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} image viewer`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'var(--overlay-lightbox)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
        overflow: 'hidden',
        color: "var(--text-inverse)",
      }}
      onClick={(e) => {
        if (zoom > 1) {
          handleResetZoom();
        } else if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Floating Minimalist Close Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close full screen view"
        title="Close (Esc)"
        style={{
          position: 'absolute',
          top: 'clamp(14px, 3vw, 24px)',
          right: 'clamp(14px, 3vw, 24px)',
          zIndex: 60,
          width: 44,
          height: 44,
          borderRadius: '50%',
          backgroundColor: 'rgba(20, 20, 20, 0.75)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          color: "var(--text-inverse)",
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45)',
        }}
      >
        <X size={20} />
      </button>

      {/* Main Stage: Center Image & Navigation Chevrons */}
      <main
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          if (zoom > 1) {
            handleResetZoom();
          } else if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Previous Image Chevron */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
            style={{
              position: 'absolute',
              left: 'clamp(12px, 3vw, 36px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: 'clamp(44px, 5vw, 56px)',
              height: 'clamp(44px, 5vw, 56px)',
              borderRadius: '50%',
              backgroundColor: 'rgba(10, 10, 10, 0.65)',
              border: '1px solid var(--overlay-white-20)',
              color: "var(--text-inverse)",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.25s ease',
            }}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Next Image Chevron */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
            style={{
              position: 'absolute',
              right: 'clamp(12px, 3vw, 36px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: 'clamp(44px, 5vw, 56px)',
              height: 'clamp(44px, 5vw, 56px)',
              borderRadius: '50%',
              backgroundColor: 'rgba(10, 10, 10, 0.65)',
              border: '1px solid var(--overlay-white-20)',
              color: "var(--text-inverse)",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.25s ease',
            }}
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* High-Resolution Centered Product Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxWidth: '100vw',
            maxHeight: images.length > 1 ? 'calc(100vh - 100px)' : '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform',
            }}
          >
            <Image
              src={currentImage}
              alt={`${productName} view ${currentIndex + 1}`}
              fill
              priority
              sizes="100vw"
              unoptimized
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </div>
        </div>
      </main>

      {/* Bottom Thumbnail Strip (if multiple images) */}
      {images.length > 1 && (
        <footer
          style={{
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(0deg, var(--overlay-black-85) 0%, rgba(0, 0, 0, 0) 100%)',
            zIndex: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              padding: '4px 8px',
              maxWidth: '94vw',
              scrollbarWidth: 'none',
            }}
          >
            {images.map((img, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                    onIndexChange?.(idx);
                    setZoom(1);
                    setPanOffset({ x: 0, y: 0 });
                  }}
                  aria-label={`View photo ${idx + 1}`}
                  style={{
                    position: 'relative',
                    width: 54,
                    height: 68,
                    borderRadius: '6px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    cursor: 'pointer',
                    border: isActive
                      ? '2px solid var(--color-golden, var(--color-golden-500))'
                      : '1px solid var(--overlay-white-20)',
                    boxShadow: isActive ? '0 0 12px rgba(194, 155, 76, 0.5)' : 'none',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    opacity: isActive ? 1 : 0.65,
                    backgroundColor: 'rgba(20, 20, 20, 0.8)',
                  }}
                >
                  <Image
                    src={img}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    fill
                    sizes="54px"
                    unoptimized
                    style={{ objectFit: 'cover' }}
                  />
                </button>
              );
            })}
          </div>
        </footer>
      )}
    </div>
  );
};
