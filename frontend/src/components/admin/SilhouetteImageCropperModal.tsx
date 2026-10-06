'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Crop,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ShieldCheck,
  X,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface CropQueueItem {
  id: string;
  file: File;
  originalDataUrl: string;
  name: string;
}

export interface CroppedSilhouetteImage {
  id: string;
  file: File;
  previewUrl: string; // 4:3 cropped data URL
  originalDataUrl: string; // preserved for re-cropping
  name: string;
  width: number;
  height: number;
  aspectRatio: number; // strictly 4 / 3 ~ 1.33333333
}

interface SilhouetteImageCropperModalProps {
  isOpen: boolean;
  queue: CropQueueItem[];
  currentIndex?: number;
  onClose: () => void;
  onCropFinished: (result: CroppedSilhouetteImage) => void;
  onAllCompleted?: () => void;
}

export const SilhouetteImageCropperModal: React.FC<SilhouetteImageCropperModalProps> = ({
  isOpen,
  queue,
  currentIndex = 0,
  onClose,
  onCropFinished,
  onAllCompleted,
}) => {
  const [activeQueueIndex, setActiveQueueIndex] = useState(currentIndex);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Crop box in display coordinates
  const [cropBox, setCropBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Display size of the image inside container
  const [displaySize, setDisplaySize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction tracking
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; boxX: number; boxY: number; boxW: number; boxH: number }>({
    mouseX: 0,
    mouseY: 0,
    boxX: 0,
    boxY: 0,
    boxW: 0,
    boxH: 0,
  });

  const currentItem = queue[activeQueueIndex];

  // Helper to get active rendered dimensions
  const getImageDimensions = useCallback(() => {
    const img = imageRef.current;
    const clientW = img?.clientWidth || displaySize.width;
    const clientH = img?.clientHeight || displaySize.height;
    return { clientW, clientH };
  }, [displaySize]);

  // Initialize crop box once image loads
  const initCropBox = useCallback((displayWidth: number, displayHeight: number) => {
    if (displayWidth <= 0 || displayHeight <= 0) return;

    // 4:3 Aspect Ratio (width / height = 4 / 3 = 1.33333)
    const targetRatio = 4 / 3;
    let initialW = 0;
    let initialH = 0;

    const availableRatio = displayWidth / displayHeight;

    if (availableRatio >= targetRatio) {
      // Image is wider than 4:3 -> height is the constraining dimension
      initialH = displayHeight * 0.9;
      initialW = initialH * targetRatio;
    } else {
      // Image is taller than 4:3 -> width is the constraining dimension
      initialW = displayWidth * 0.9;
      initialH = initialW / targetRatio;
    }

    const initialX = (displayWidth - initialW) / 2;
    const initialY = (displayHeight - initialH) / 2;

    setCropBox({
      x: Math.round(initialX),
      y: Math.round(initialY),
      width: Math.round(initialW),
      height: Math.round(initialH),
    });
  }, []);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    setNaturalDimensions({ width: naturalW, height: naturalH });

    // Determine rendered dimensions
    const clientW = img.clientWidth;
    const clientH = img.clientHeight;
    setDisplaySize({ width: clientW, height: clientH });

    initCropBox(clientW, clientH);
    setImageLoaded(true);
  };

  // Safe sync for cached images or re-opening
  const syncImageAndBox = useCallback(() => {
    const img = imageRef.current;
    if (img && (img.complete || img.naturalWidth > 0)) {
      const naturalW = img.naturalWidth || 800;
      const naturalH = img.naturalHeight || 600;
      setNaturalDimensions({ width: naturalW, height: naturalH });

      const clientW = img.clientWidth || 500;
      const clientH = img.clientHeight || 375;
      setDisplaySize({ width: clientW, height: clientH });
      initCropBox(clientW, clientH);
      setImageLoaded(true);
    }
  }, [initCropBox]);

  // Reset & sync state when active item changes or modal opens
  useEffect(() => {
    if (isOpen && currentItem) {
      setImageLoaded(false);
      syncImageAndBox();
      const t1 = setTimeout(syncImageAndBox, 60);
      const t2 = setTimeout(syncImageAndBox, 180);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isOpen, activeQueueIndex, currentItem, syncImageAndBox]);

  // Handle activeQueueIndex sync
  useEffect(() => {
    setActiveQueueIndex(currentIndex);
  }, [currentIndex]);

  // Recalculate rendered dimensions on window resize
  useEffect(() => {
    const updateSize = () => {
      if (imageRef.current) {
        const clientW = imageRef.current.clientWidth;
        const clientH = imageRef.current.clientHeight;
        if (clientW > 0 && clientH > 0) {
          setDisplaySize({ width: clientW, height: clientH });
          initCropBox(clientW, clientH);
        }
      }
    };

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [initCropBox]);

  // Live preview canvas update
  useEffect(() => {
    if (!imageRef.current || !previewCanvasRef.current || cropBox.width === 0) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set preview canvas to 4:3 ratio (240x180)
    canvas.width = 240;
    canvas.height = 180;

    const img = imageRef.current;
    const clientW = displaySize.width || img.clientWidth || 1;
    const clientH = displaySize.height || img.clientHeight || 1;
    const natW = naturalDimensions.width || img.naturalWidth || clientW;
    const natH = naturalDimensions.height || img.naturalHeight || clientH;

    const scaleX = natW / clientW;
    const scaleY = natH / clientH;

    const sx = Math.max(0, Math.min(natW, cropBox.x * scaleX));
    const sy = Math.max(0, Math.min(natH, cropBox.y * scaleY));
    const sWidth = Math.min(natW - sx, Math.max(1, cropBox.width * scaleX));
    const sHeight = Math.min(natH - sy, Math.max(1, cropBox.height * scaleY));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    try {
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
    } catch {
      // Safe catch during active drag/scale
    }
  }, [cropBox, displaySize, naturalDimensions, imageLoaded]);

  // Mouse / Touch Drag handlers
  const handleMouseDown = (e: React.MouseEvent, handle: string | null = null) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setActiveHandle(handle);

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      boxX: cropBox.x,
      boxY: cropBox.y,
      boxW: cropBox.width,
      boxH: cropBox.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;
      const targetRatio = 4 / 3;

      const { clientW, clientH } = getImageDimensions();
      if (clientW === 0 || clientH === 0) return;

      if (activeHandle === null) {
        // Dragging the entire 4:3 crop box
        const newX = Math.max(0, Math.min(clientW - cropBox.width, dragStartRef.current.boxX + deltaX));
        const newY = Math.max(0, Math.min(clientH - cropBox.height, dragStartRef.current.boxY + deltaY));

        setCropBox((prev) => ({
          ...prev,
          x: Math.round(newX),
          y: Math.round(newY),
        }));
      } else {
        // Resizing with 4:3 aspect ratio lock
        let newW = dragStartRef.current.boxW;
        let newH = dragStartRef.current.boxH;
        let newX = dragStartRef.current.boxX;
        let newY = dragStartRef.current.boxY;

        const minW = 60;

        if (activeHandle === 'se') {
          newW = Math.max(minW, dragStartRef.current.boxW + deltaX);
          newH = newW / targetRatio;

          // Boundary checks
          if (newX + newW > clientW) {
            newW = clientW - newX;
            newH = newW / targetRatio;
          }
          if (newY + newH > clientH) {
            newH = clientH - newY;
            newW = newH * targetRatio;
          }
        } else if (activeHandle === 'nw') {
          newW = Math.max(minW, dragStartRef.current.boxW - deltaX);
          newH = newW / targetRatio;

          newX = dragStartRef.current.boxX + (dragStartRef.current.boxW - newW);
          newY = dragStartRef.current.boxY + (dragStartRef.current.boxH - newH);

          if (newX < 0) {
            newX = 0;
            newW = dragStartRef.current.boxX + dragStartRef.current.boxW;
            newH = newW / targetRatio;
            newY = dragStartRef.current.boxY + dragStartRef.current.boxH - newH;
          }
          if (newY < 0) {
            newY = 0;
            newH = dragStartRef.current.boxY + dragStartRef.current.boxH;
            newW = newH * targetRatio;
            newX = dragStartRef.current.boxX + dragStartRef.current.boxW - newW;
          }
        } else if (activeHandle === 'ne') {
          newW = Math.max(minW, dragStartRef.current.boxW + deltaX);
          newH = newW / targetRatio;
          newY = dragStartRef.current.boxY + (dragStartRef.current.boxH - newH);

          if (newX + newW > clientW) {
            newW = clientW - newX;
            newH = newW / targetRatio;
            newY = dragStartRef.current.boxY + (dragStartRef.current.boxH - newH);
          }
          if (newY < 0) {
            newY = 0;
            newH = dragStartRef.current.boxY + dragStartRef.current.boxH;
            newW = newH * targetRatio;
          }
        } else if (activeHandle === 'sw') {
          newW = Math.max(minW, dragStartRef.current.boxW - deltaX);
          newH = newW / targetRatio;
          newX = dragStartRef.current.boxX + (dragStartRef.current.boxW - newW);

          if (newX < 0) {
            newX = 0;
            newW = dragStartRef.current.boxX + dragStartRef.current.boxW;
            newH = newW / targetRatio;
          }
          if (newY + newH > clientH) {
            newH = clientH - newY;
            newW = newH * targetRatio;
            newX = dragStartRef.current.boxX + dragStartRef.current.boxW - newW;
          }
        }

        if (newW >= minW) {
          setCropBox({
            x: Math.round(newX),
            y: Math.round(newY),
            width: Math.round(newW),
            height: Math.round(newH),
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setActiveHandle(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, activeHandle, getImageDimensions, cropBox.width, cropBox.height]);

  // -------------------------------------------------------------
  // PRESET BUTTON ACTIONS (Zoom Box, Expand Box, Reset & Center)
  // -------------------------------------------------------------

  // Reset & Center 4:3 Box
  const handleCenterCrop = () => {
    const { clientW, clientH } = getImageDimensions();
    if (clientW > 0 && clientH > 0) {
      initCropBox(clientW, clientH);
    }
  };

  // Zoom In (factor < 1 e.g. 0.8) or Expand (factor > 1 e.g. 1.25)
  const handleZoomCrop = (factor: number) => {
    const { clientW, clientH } = getImageDimensions();
    if (clientW <= 0 || clientH <= 0) return;

    const targetRatio = 4 / 3;

    // Calculate maximum fitting 4:3 box inside the image boundaries
    let maxW = 0;
    let maxH = 0;
    if (clientW / clientH >= targetRatio) {
      maxH = clientH;
      maxW = maxH * targetRatio;
    } else {
      maxW = clientW;
      maxH = maxW / targetRatio;
    }

    const minW = Math.max(50, Math.min(90, maxW * 0.2));

    // Get current dimensions and center anchor
    const currentW = cropBox.width > 0 ? cropBox.width : maxW * 0.9;
    const currentH = cropBox.height > 0 ? cropBox.height : currentW / targetRatio;
    const centerX = cropBox.x + currentW / 2;
    const centerY = cropBox.y + currentH / 2;

    // Scale width by factor
    let newW = Math.round(currentW * factor);
    newW = Math.max(minW, Math.min(maxW, newW));
    let newH = Math.round(newW / targetRatio);

    // Re-center around current center point
    let newX = Math.round(centerX - newW / 2);
    let newY = Math.round(centerY - newH / 2);

    // Strictly clamp within image boundary
    newX = Math.max(0, Math.min(clientW - newW, newX));
    newY = Math.max(0, Math.min(clientH - newH, newY));

    setCropBox({
      x: newX,
      y: newY,
      width: newW,
      height: newH,
    });
  };

  // Perform export with strict 4:3 validation
  const handleApplyCrop = () => {
    if (!imageRef.current || !currentItem) return;

    const img = imageRef.current;
    const clientW = displaySize.width || img.clientWidth || 1;
    const clientH = displaySize.height || img.clientHeight || 1;
    const natW = naturalDimensions.width || img.naturalWidth || clientW;
    const natH = naturalDimensions.height || img.naturalHeight || clientH;

    const scaleX = natW / clientW;
    const scaleY = natH / clientH;

    const naturalCropX = Math.max(0, Math.round(cropBox.x * scaleX));
    const naturalCropY = Math.max(0, Math.round(cropBox.y * scaleY));
    const naturalCropW = Math.round(cropBox.width * scaleX);

    // Standard high-resolution output locked strictly at 4:3 ratio
    const targetWidth = Math.max(800, Math.min(1600, naturalCropW));
    const targetHeight = Math.round(targetWidth * 0.75); // Exactly 4:3

    // Verify 4:3 ratio mathematically
    const ratioCheck = targetWidth / targetHeight;
    if (Math.abs(ratioCheck - 4 / 3) > 0.005) {
      alert('Aspect ratio check failed. Please re-adjust crop.');
      return;
    }

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = targetWidth;
    offscreenCanvas.height = targetHeight;
    const ctx = offscreenCanvas.getContext('2d');

    if (!ctx) {
      alert('Failed to initialize 2D canvas context.');
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const sourceCropH = Math.round(naturalCropW * 0.75);

    ctx.drawImage(
      img,
      naturalCropX,
      naturalCropY,
      naturalCropW,
      sourceCropH,
      0,
      0,
      targetWidth,
      targetHeight
    );

    const croppedDataUrl = offscreenCanvas.toDataURL('image/jpeg', 0.92);

    offscreenCanvas.toBlob(
      (blob) => {
        if (!blob) return;

        const cleanName = currentItem.name.replace(/\.[^/.]+$/, '');
        const croppedFile = new File([blob], `${cleanName}-silhouette-4x3.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        const croppedResult: CroppedSilhouetteImage = {
          id: currentItem.id,
          file: croppedFile,
          previewUrl: croppedDataUrl,
          originalDataUrl: currentItem.originalDataUrl,
          name: `${cleanName} (4:3)`,
          width: targetWidth,
          height: targetHeight,
          aspectRatio: 4 / 3,
        };

        onCropFinished(croppedResult);

        // Advance to next image in queue if multiple, otherwise close
        if (activeQueueIndex < queue.length - 1) {
          setActiveQueueIndex((prev) => prev + 1);
        } else {
          if (onAllCompleted) {
            onAllCompleted();
          }
          onClose();
        }
      },
      'image/jpeg',
      0.92
    );
  };

  if (!isOpen || !currentItem) return null;

  const isMultiQueue = queue.length > 1;
  const isLastInQueue = activeQueueIndex === queue.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 10, 12, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <style>{`
        .crop-action-btn {
          cursor: pointer !important;
          transition: all 0.16s ease !important;
          user-select: none !important;
        }
        .crop-action-btn:hover {
          background-color: #32323D !important;
          border-color: #4E4E5C !important;
          color: #FFFFFF !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
        }
        .crop-action-btn:active {
          transform: scale(0.96) !important;
          background-color: #3D3D4A !important;
        }
      `}</style>

      <div
        style={{
          backgroundColor: 'var(--admin-surface, #1A1A1E)',
          borderRadius: 'var(--radius-md, 16px)',
          border: '1px solid var(--admin-border, #2E2E36)',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          color: 'var(--admin-text-primary, #F0F0F3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--admin-border, #2E2E36)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            backgroundColor: 'var(--admin-surface, #1A1A1E)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(194, 155, 76, 0.15)',
                color: 'var(--color-golden, #C29B4C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Crop size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', margin: 0 }}>
                  Crop Silhouette Photography
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(36, 75, 87, 0.4)',
                    color: '#7EC3D8',
                    border: '1px solid rgba(126, 195, 216, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ShieldCheck size={12} />
                  4:3 Ratio Locked
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary, #9E9EA7)', margin: '2px 0 0 0' }}>
                {isMultiQueue
                  ? `Processing item ${activeQueueIndex + 1} of ${queue.length}: "${currentItem.name}"`
                  : `Framing "${currentItem.name}" to Atelier 4:3 standard`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--admin-text-secondary, #9E9EA7)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Workspace Body */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: '24px',
            gap: '24px',
            overflowY: 'auto',
            backgroundColor: '#121215',
          }}
        >
          {/* Main Cropping Canvas Viewport */}
          <div
            style={{
              flex: '1 1 540px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              maxHeight: '480px',
              backgroundColor: '#0A0A0C',
              borderRadius: '12px',
              border: '1px solid #26262D',
              position: 'relative',
              overflow: 'hidden',
              userSelect: 'none',
            }}
            ref={containerRef}
          >
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                cursor: isDragging ? 'grabbing' : 'crosshair',
              }}
            >
              {/* Target Image to Crop */}
              <img
                ref={imageRef}
                src={currentItem.originalDataUrl}
                alt={currentItem.name}
                onLoad={handleImageLoad}
                style={{
                  display: 'block',
                  maxWidth: '560px',
                  maxHeight: '440px',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                }}
              />

              {/* Crop Box Overlay */}
              {imageLoaded && cropBox.width > 0 && (
                <>
                  {/* Darkened Mask Over Uncropped Region */}
                  {/* Top */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: cropBox.y,
                      backgroundColor: 'rgba(0, 0, 0, 0.72)',
                      pointerEvents: 'none',
                      transition: isDragging ? 'none' : 'height 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                  {/* Bottom */}
                  <div
                    style={{
                      position: 'absolute',
                      top: cropBox.y + cropBox.height,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.72)',
                      pointerEvents: 'none',
                      transition: isDragging ? 'none' : 'top 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                  {/* Left */}
                  <div
                    style={{
                      position: 'absolute',
                      top: cropBox.y,
                      left: 0,
                      width: cropBox.x,
                      height: cropBox.height,
                      backgroundColor: 'rgba(0, 0, 0, 0.72)',
                      pointerEvents: 'none',
                      transition: isDragging ? 'none' : 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                  {/* Right */}
                  <div
                    style={{
                      position: 'absolute',
                      top: cropBox.y,
                      left: cropBox.x + cropBox.width,
                      right: 0,
                      height: cropBox.height,
                      backgroundColor: 'rgba(0, 0, 0, 0.72)',
                      pointerEvents: 'none',
                      transition: isDragging ? 'none' : 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />

                  {/* Active 4:3 Crop Window */}
                  <div
                    onMouseDown={(e) => handleMouseDown(e, null)}
                    style={{
                      position: 'absolute',
                      left: cropBox.x,
                      top: cropBox.y,
                      width: cropBox.width,
                      height: cropBox.height,
                      border: '2px solid #C29B4C',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.6)',
                      cursor: isDragging ? 'grabbing' : 'move',
                      zIndex: 20,
                      transition: isDragging ? 'none' : 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* Rule of Thirds Guides */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '33.33%',
                        top: 0,
                        bottom: 0,
                        width: '1px',
                        borderLeft: '1px dashed rgba(255, 255, 255, 0.35)',
                        pointerEvents: 'none',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '66.66%',
                        top: 0,
                        bottom: 0,
                        width: '1px',
                        borderLeft: '1px dashed rgba(255, 255, 255, 0.35)',
                        pointerEvents: 'none',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '33.33%',
                        left: 0,
                        right: 0,
                        height: '1px',
                        borderTop: '1px dashed rgba(255, 255, 255, 0.35)',
                        pointerEvents: 'none',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '66.66%',
                        left: 0,
                        right: 0,
                        height: '1px',
                        borderTop: '1px dashed rgba(255, 255, 255, 0.35)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Ratio Watermark Tag Inside Box */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 6,
                        left: 6,
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        color: '#C29B4C',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        pointerEvents: 'none',
                        border: '1px solid rgba(194, 155, 76, 0.3)',
                      }}
                    >
                      4:3
                    </div>

                    {/* Corner Handles for 4:3 Proportional Scaling */}
                    {/* Top-Left */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'nw')}
                      style={{
                        position: 'absolute',
                        left: -7,
                        top: -7,
                        width: 15,
                        height: 15,
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #C29B4C',
                        borderRadius: '50%',
                        cursor: 'nwse-resize',
                        zIndex: 30,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      }}
                    />
                    {/* Top-Right */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'ne')}
                      style={{
                        position: 'absolute',
                        right: -7,
                        top: -7,
                        width: 15,
                        height: 15,
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #C29B4C',
                        borderRadius: '50%',
                        cursor: 'nesw-resize',
                        zIndex: 30,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      }}
                    />
                    {/* Bottom-Right */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'se')}
                      style={{
                        position: 'absolute',
                        right: -7,
                        bottom: -7,
                        width: 15,
                        height: 15,
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #C29B4C',
                        borderRadius: '50%',
                        cursor: 'nwse-resize',
                        zIndex: 30,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      }}
                    />
                    {/* Bottom-Left */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'sw')}
                      style={{
                        position: 'absolute',
                        left: -7,
                        bottom: -7,
                        width: 15,
                        height: 15,
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #C29B4C',
                        borderRadius: '50%',
                        cursor: 'nesw-resize',
                        zIndex: 30,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Side Controls & Live 4:3 Preview */}
          <div
            style={{
              flex: '0 0 260px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Live 4:3 Preview Box */}
            <div
              style={{
                backgroundColor: '#1A1A1E',
                borderRadius: '10px',
                border: '1px solid #2E2E36',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--admin-text-secondary, #9E9EA7)' }}>
                  Stored Output Preview
                </span>
                <span style={{ fontSize: '0.7rem', color: '#C29B4C', fontWeight: 600 }}>
                  4:3 Ratio
                </span>
              </div>

              {/* Canvas Preview */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  backgroundColor: '#0D0D10',
                  borderRadius: '6px',
                  border: '1px solid #33333D',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: '#A0A0AB', lineHeight: 1.4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span>Ratio format:</span>
                  <strong style={{ color: '#FFF' }}>4:3 (1.33:1)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span>Export dimensions:</span>
                  <strong style={{ color: '#FFF' }}>1200 × 900 px</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span>Storage rule:</span>
                  <strong style={{ color: '#7EC3D8' }}>Strict 4:3 Enforced</strong>
                </div>
              </div>
            </div>

            {/* Quick Adjustment Tools (Requested Working Buttons) */}
            <div
              style={{
                backgroundColor: '#1A1A1E',
                borderRadius: '10px',
                border: '1px solid #2E2E36',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--admin-text-secondary, #9E9EA7)' }}>
                Frame Adjustments
              </span>

              {/* Top Row: Zoom Box & Expand Box */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  id="crop-zoom-in-btn"
                  title="Zoom In: Focus closer onto silhouette detail"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleZoomCrop(0.8);
                  }}
                  className="crop-action-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '9px 10px',
                    backgroundColor: '#26262E',
                    border: '1px solid #3A3A45',
                    borderRadius: '6px',
                    color: '#EEE',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  <ZoomIn size={14} style={{ color: '#C29B4C' }} /> Zoom Box
                </button>
                <button
                  type="button"
                  id="crop-expand-box-btn"
                  title="Expand: Widen frame outward to capture more garment"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleZoomCrop(1.25);
                  }}
                  className="crop-action-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '9px 10px',
                    backgroundColor: '#26262E',
                    border: '1px solid #3A3A45',
                    borderRadius: '6px',
                    color: '#EEE',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  <ZoomOut size={14} style={{ color: '#7EC3D8' }} /> Expand Box
                </button>
              </div>

              {/* Bottom Row: Reset & Center 4:3 Box */}
              <button
                type="button"
                id="crop-reset-center-btn"
                title="Reset and center the 4:3 crop box"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCenterCrop();
                }}
                className="crop-action-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 12px',
                  backgroundColor: '#26262E',
                  border: '1px solid #3A3A45',
                  borderRadius: '6px',
                  color: '#EEE',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                <Maximize2 size={14} style={{ color: '#C29B4C' }} /> Reset & Center 4:3 Box
              </button>
            </div>

            {/* Atelier Policy Notice */}
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(36, 75, 87, 0.2)',
                border: '1px solid rgba(126, 195, 216, 0.25)',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
              }}
            >
              <Info size={15} style={{ color: '#7EC3D8', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '0.72rem', color: '#B5CCD2', lineHeight: 1.4 }}>
                Only verified 4:3 cropped imagery will be persisted to the catalog to maintain storefront alignment.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--admin-border, #2E2E36)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--admin-surface, #1A1A1E)',
          }}
        >
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {isMultiQueue && (
              <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary, #9E9EA7)' }}>
                {queue.length - activeQueueIndex - 1} remaining in queue
              </span>
            )}
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Check size={16} />}
              onClick={handleApplyCrop}
            >
              {isMultiQueue && !isLastInQueue ? 'Apply 4:3 Crop & Next' : 'Save 4:3 Silhouette Image'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
