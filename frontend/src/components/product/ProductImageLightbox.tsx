'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollLock } from '@/hooks/useScrollLock';

export interface ProductImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  productName: string;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  returnFocusElement?: HTMLElement | null;
}

export const ProductImageLightbox: React.FC<ProductImageLightboxProps> = ({
  isOpen,
  onClose,
  images,
  productName,
  initialIndex = 0,
  onIndexChange,
  returnFocusElement,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isZoomed, setIsZoomed] = useState(false);

  // High-res decode and zero-flash swap state
  const [displaySrc, setDisplaySrc] = useState(images[initialIndex] || images[0] || '');

  // DOM Refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const centerStageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const triggerFocusRef = useRef<HTMLElement | null>(null);

  // Animation values for scale and transform-origin (normalized 0.0 to 1.0)
  const currentScale = useRef<number>(1);
  const targetScale = useRef<number>(1);
  const currentOriginX = useRef<number>(0.5);
  const currentOriginY = useRef<number>(0.5);
  const targetOriginX = useRef<number>(0.5);
  const targetOriginY = useRef<number>(0.5);

  const rafId = useRef<number | null>(null);
  const isLoopRunning = useRef<boolean>(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Touch tracking references
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchDragOriginStart = useRef<{ originX: number; originY: number } | null>(null);

  // Lock body scroll while open or animating
  useScrollLock(isRendered);

  // Lerp loop for smooth transform-origin and scale animations
  const updateAnimation = useCallback(() => {
    const LERP_FACTOR = 0.12;
    const THRESHOLD = 0.002;

    const scaleDiff = targetScale.current - currentScale.current;
    currentScale.current += scaleDiff * LERP_FACTOR;

    const originXDiff = targetOriginX.current - currentOriginX.current;
    currentOriginX.current += originXDiff * LERP_FACTOR;

    const originYDiff = targetOriginY.current - currentOriginY.current;
    currentOriginY.current += originYDiff * LERP_FACTOR;

    const isScaleSettled = Math.abs(scaleDiff) < THRESHOLD;
    const isOriginXSettled = Math.abs(originXDiff) < THRESHOLD;
    const isOriginYSettled = Math.abs(originYDiff) < THRESHOLD;

    if (isScaleSettled && isOriginXSettled && isOriginYSettled) {
      currentScale.current = targetScale.current;
      currentOriginX.current = targetOriginX.current;
      currentOriginY.current = targetOriginY.current;

      if (imageRef.current) {
        imageRef.current.style.transformOrigin = `${(currentOriginX.current * 100).toFixed(3)}% ${(currentOriginY.current * 100).toFixed(3)}%`;
        imageRef.current.style.transform = `scale(${currentScale.current.toFixed(4)})`;
      }

      isLoopRunning.current = false;
      rafId.current = null;
      return;
    }

    if (imageRef.current) {
      imageRef.current.style.transformOrigin = `${(currentOriginX.current * 100).toFixed(3)}% ${(currentOriginY.current * 100).toFixed(3)}%`;
      imageRef.current.style.transform = `scale(${currentScale.current.toFixed(4)})`;
    }

    rafId.current = requestAnimationFrame(updateAnimation);
  }, []);

  const startAnimationLoop = useCallback(() => {
    if (!isLoopRunning.current) {
      isLoopRunning.current = true;
      rafId.current = requestAnimationFrame(updateAnimation);
    }
  }, [updateAnimation]);

  const resetZoomImmediate = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    isLoopRunning.current = false;

    currentScale.current = 1;
    targetScale.current = 1;
    currentOriginX.current = 0.5;
    targetOriginX.current = 0.5;
    currentOriginY.current = 0.5;
    targetOriginY.current = 0.5;

    if (imageRef.current) {
      imageRef.current.style.transformOrigin = '50% 50%';
      imageRef.current.style.transform = 'scale(1)';
    }
    setIsZoomed(false);
  }, []);

  // Handle open / close synchronization
  useEffect(() => {
    if (isOpen) {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      // Record element to return focus to upon closing
      triggerFocusRef.current = returnFocusElement || (document.activeElement as HTMLElement) || null;

      const safeIndex = Math.max(0, Math.min(initialIndex, images.length - 1));
      setCurrentIndex(safeIndex);
      setIsRendered(true);

      // Trigger .3s fade-in and scale(.96) -> 1 animation
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      resetZoomImmediate();
      closeTimeoutRef.current = setTimeout(() => {
        setIsRendered(false);
      }, 300);
    }

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [isOpen, initialIndex, images.length, returnFocusElement, resetZoomImmediate]);

  // Decode high-res image and swap seamlessly with no flash
  useEffect(() => {
    if (!images[currentIndex]) return;
    const targetSrc = images[currentIndex];

    // Maintain current thumbnail/image as display fallback while full-res loads
    setDisplaySrc(targetSrc);

    if (typeof window !== 'undefined') {
      const img = new window.Image();
      img.src = targetSrc;
      if ('decode' in img) {
        img.decode().catch(() => {});
      }
    }
  }, [currentIndex, images]);

  // Close handler with 0.3s fade-out, scroll unlock, and return-focus
  const handleClose = useCallback(() => {
    setIsVisible(false);
    resetZoomImmediate();

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      setIsRendered(false);
      onClose();

      // Return focus to thumbnail or element that opened it
      if (triggerFocusRef.current && typeof triggerFocusRef.current.focus === 'function') {
        triggerFocusRef.current.focus();
      }
    }, 300);
  }, [onClose, resetZoomImmediate]);

  // Navigation handlers with end-looping
  const goToSlide = useCallback(
    (index: number) => {
      if (images.length <= 1) return;
      const nextIndex = (index + images.length) % images.length;
      resetZoomImmediate();
      setCurrentIndex(nextIndex);
      onIndexChange?.(nextIndex);
    },
    [images.length, onIndexChange, resetZoomImmediate]
  );

  const handlePrev = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  const handleNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  // Keyboard navigation: Escape to close, ArrowLeft / ArrowRight to navigate
  useEffect(() => {
    if (!isRendered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRendered, handleClose, handlePrev, handleNext]);

  // Zoom logic: Click toggles scale 1 <-> 2 around cursor position
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const clickY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    if (targetScale.current === 1) {
      // Zooming in: set current and target origin to the click point first so there's no jump
      currentOriginX.current = clickX;
      currentOriginY.current = clickY;
      targetOriginX.current = clickX;
      targetOriginY.current = clickY;

      if (imageRef.current) {
        imageRef.current.style.transformOrigin = `${(clickX * 100).toFixed(3)}% ${(clickY * 100).toFixed(3)}%`;
      }

      targetScale.current = 2;
      setIsZoomed(true);
      startAnimationLoop();
    } else {
      // Zooming out: reset scale to 1 and origin to center (0.5, 0.5)
      targetScale.current = 1;
      targetOriginX.current = 0.5;
      targetOriginY.current = 0.5;
      setIsZoomed(false);
      startAnimationLoop();
    }
  };

  // Pan logic: Mouse move while zoomed sets target transform-origin (clamped 0 to 1)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (targetScale.current <= 1 || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const mouseY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    targetOriginX.current = mouseX;
    targetOriginY.current = mouseY;
    startAnimationLoop();
  };

  // Touch logic: Tap toggles zoom, one-finger drag pans when zoomed, swipe at scale 1 changes slide
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      touchDragOriginStart.current = {
        originX: currentOriginX.current,
        originY: currentOriginY.current,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || e.touches.length !== 1 || !frameRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    if (targetScale.current > 1 && touchDragOriginStart.current) {
      const rect = frameRef.current.getBoundingClientRect();
      const newOriginX = Math.max(0, Math.min(1, touchDragOriginStart.current.originX - deltaX / rect.width));
      const newOriginY = Math.max(0, Math.min(1, touchDragOriginStart.current.originY - deltaY / rect.height));

      targetOriginX.current = newOriginX;
      targetOriginY.current = newOriginY;
      startAnimationLoop();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || !frameRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const elapsed = Date.now() - touchStartRef.current.time;

    // Detect tap: small movement and brief touch duration
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && elapsed < 350) {
      const rect = frameRef.current.getBoundingClientRect();
      const tapX = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
      const tapY = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));

      if (targetScale.current === 1) {
        currentOriginX.current = tapX;
        currentOriginY.current = tapY;
        targetOriginX.current = tapX;
        targetOriginY.current = tapY;

        if (imageRef.current) {
          imageRef.current.style.transformOrigin = `${(tapX * 100).toFixed(3)}% ${(tapY * 100).toFixed(3)}%`;
        }

        targetScale.current = 2;
        setIsZoomed(true);
        startAnimationLoop();
      } else {
        targetScale.current = 1;
        targetOriginX.current = 0.5;
        targetOriginY.current = 0.5;
        setIsZoomed(false);
        startAnimationLoop();
      }
    } else if (targetScale.current === 1 && Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      // Swipe left or right at scale 1 changes the slide
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }

    touchStartRef.current = null;
    touchDragOriginStart.current = null;
  };

  if (!isRendered) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} image viewer`}
      data-lenis-prevent
      onClick={(e) => {
        // Clicking on the empty white area closes the viewer
        if (e.target === overlayRef.current || e.target === centerStageRef.current) {
          handleClose();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        backgroundColor: 'var(--color-diamond)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* "×" Close button at the top left */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close viewer (Esc)"
        title="Close (Esc)"
        style={{
          position: 'absolute',
          top: 'clamp(16px, 3vw, 28px)',
          left: 'clamp(16px, 3vw, 28px)',
          zIndex: 60,
          background: 'none',
          border: 'none',
          padding: '8px',
          cursor: 'pointer',
          color: 'var(--color-black-tie)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.15s ease, opacity 0.15s ease',
        }}
      >
        <X size={26} strokeWidth={1.5} />
      </button>

      {/* "‹" Left Arrow navigation button */}
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
            left: 'clamp(12px, 3vw, 32px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 60,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '50%',
            width: 'clamp(44px, 4.5vw, 54px)',
            height: 'clamp(44px, 4.5vw, 54px)',
            color: 'var(--color-black-tie)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.15s ease, background-color 0.15s ease',
          }}
        >
          <ChevronLeft size={28} strokeWidth={1.5} />
        </button>
      )}

      {/* "›" Right Arrow navigation button */}
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
            right: 'clamp(12px, 3vw, 32px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 60,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '50%',
            width: 'clamp(44px, 4.5vw, 54px)',
            height: 'clamp(44px, 4.5vw, 54px)',
            color: 'var(--color-black-tie)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.15s ease, background-color 0.15s ease',
          }}
        >
          <ChevronRight size={28} strokeWidth={1.5} />
        </button>
      )}

      {/* Centered Image Container with .3s scale(.96) -> 1 entrance ease */}
      <div
        ref={centerStageRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isVisible ? 'scale(1)' : 'scale(0.96)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'auto',
        }}
      >
        {/* Fixed-Size Frame with overflow hidden (frame never resizes) */}
        <div
          ref={frameRef}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            position: 'relative',
            maxWidth: '92vw',
            maxHeight: '86vh',
            width: 'min(92vw, calc(86vh * 3 / 4))',
            height: 'min(86vh, calc(92vw * 4 / 3))',
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
            backgroundColor: 'var(--color-diamond)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: isZoomed ? 'none' : 'pan-y',
          }}
        >
          <img
            ref={imageRef}
            src={displaySrc}
            alt={`${productName} view ${currentIndex + 1}`}
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              willChange: 'transform, transform-origin',
              transform: 'scale(1)',
              transformOrigin: '50% 50%',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Dot Indicators at bottom center */}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(18px, 3.5vw, 36px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
          }}
        >
          {images.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: isActive ? '20px' : '7px',
                  height: '7px',
                  borderRadius: '4px',
                  backgroundColor: isActive ? 'var(--color-black-tie)' : 'rgba(0, 0, 0, 0.22)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
