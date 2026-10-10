'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ArrowLeft,
  Save,
  UploadCloud,
  X,
  Crop,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import {
  SilhouetteImageCropperModal,
  CropQueueItem,
  CroppedSilhouetteImage,
} from '@/components/admin/SilhouetteImageCropperModal';
import { createProduct } from '@/lib/mockApi';

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'cat_outerwear',
    price: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stored 3:4 cropped images
  const [silhouetteImages, setSilhouetteImages] = useState<CroppedSilhouetteImage[]>([]);

  // Cropper modal state
  const [cropperModalOpen, setCropperModalOpen] = useState(false);
  const [cropQueue, setCropQueue] = useState<CropQueueItem[]>([]);
  const [cropperCurrentIndex, setCropperCurrentIndex] = useState(0);

  // Drag and drop state
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const processIncomingFiles = (files: File[]) => {
    const remainingSlots = 8 - silhouetteImages.length;
    const filesToProcess = files.slice(0, remainingSlots);

    if (filesToProcess.length === 0) return;

    const newQueueItems: CropQueueItem[] = [];
    let readCount = 0;

    filesToProcess.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        newQueueItems.push({
          id: `queue_${Date.now()}_${index}`,
          file,
          originalDataUrl: reader.result as string,
          name: file.name,
        });

        readCount++;
        if (readCount === filesToProcess.length) {
          setCropQueue(newQueueItems);
          setCropperCurrentIndex(0);
          setCropperModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(Array.from(e.target.files));
      // Reset input value so same files can be selected again if needed
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imageFiles = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      );
      if (imageFiles.length > 0) {
        processIncomingFiles(imageFiles);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  // Re-crop an already cropped image
  const handleRecrop = (img: CroppedSilhouetteImage) => {
    const queueItem: CropQueueItem = {
      id: img.id,
      file: img.file,
      originalDataUrl: img.originalDataUrl,
      name: img.name,
    };
    setCropQueue([queueItem]);
    setCropperCurrentIndex(0);
    setCropperModalOpen(true);
  };

  // Callback when an image finishes cropping
  const handleCropFinished = (result: CroppedSilhouetteImage) => {
    // Mathematical guarantee: strict 3:4 check before storing
    const ratio = result.width / result.height;
    if (Math.abs(ratio - 3 / 4) > 0.01) {
      alert('Security validation: Image must strictly adhere to 3:4 aspect ratio to be stored.');
      return;
    }

    setSilhouetteImages((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === result.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = result;
        return next;
      }
      return [...prev, result];
    });
  };

  const removeImage = (id: string) => {
    setSilhouetteImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (silhouetteImages.length === 0) {
      alert('Atelier policy requires at least 1 verified 3:4 cropped silhouette image.');
      return;
    }

    // Double check that all stored images strictly satisfy 3:4
    const non3x4Images = silhouetteImages.filter(
      (img) => Math.abs(img.width / img.height - 3 / 4) > 0.01
    );

    if (non3x4Images.length > 0) {
      alert('Non 3:4 image detected. Only strictly cropped 3:4 silhouette images may be stored.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createProduct({
        name: formData.name,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price) || 0,
        description: formData.description,
        images: silhouetteImages.map((img) => img.previewUrl),
        tags: ['Atelier Silhouette', 'New Arrival', '3:4 Curated'],
      });

      alert('New silhouette drafted successfully with verified 3:4 imagery!');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Failed to save silhouette draft.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '840px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--admin-surface)',
            color: 'var(--admin-text-primary)',
            boxShadow: '0 1px 3px var(--overlay-black-5)',
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--brand-primary)',
            }}
          >
            Inventory & Catalog Management
          </span>
          <h1
            style={{
              fontSize: '2rem',
              fontFamily: 'var(--font-display)',
              color: 'var(--admin-text-primary)',
              marginTop: '4px',
            }}
          >
            Draft New Silhouette
          </h1>
        </div>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          backgroundColor: 'var(--admin-surface)',
          padding: '32px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--admin-border)',
          boxShadow: '0 2px 8px var(--overlay-black-5)',
        }}
      >
        <Input
          label="Silhouette Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. The Midnight Wool Trench"
          required
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
            }}
          >
            Category Division
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              outline: 'none',
            }}
            required
          >
            <option value="cat_outerwear">Outerwear</option>
            <option value="cat_dresses">Dresses</option>
            <option value="cat_tailoring">Tailoring</option>
            <option value="cat_eveningwear">Eveningwear</option>
            <option value="cat_knitwear">Knitwear</option>
            <option value="cat_leather_goods">Leather Goods</option>
            <option value="cat_footwear">Footwear</option>
            <option value="cat_jewelry">Fine Jewelry</option>
            <option value="cat_fragrances">Fragrances</option>
          </select>
        </div>

        <Input
          label="Atelier Price (₹)"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g. 24500"
          required
        />

        {/* Silhouette Images Upload with 3:4 Enforcement */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Silhouette Imagery (1-8 Images)
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--brand-accent)',
                  backgroundColor: 'var(--overlay-golden-10)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--overlay-golden-35)',
                }}
              >
                3:4 Ratio Locked
              </span>
            </label>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {silhouetteImages.length} / 8 stored
            </span>
          </div>

          {/* Ratio Enforcement Helper Card */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(36, 75, 87, 0.08)',
              border: '1px solid rgba(36, 75, 87, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            <ShieldCheck size={16} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
            <span>
              <strong>Atelier Visual Standard:</strong> All uploaded images must be cropped to a strict{' '}
              <strong>3:4 aspect ratio</strong>. The interactive cropper will open automatically upon upload.
            </span>
          </div>

          {/* Stored 3:4 Cropped Images Grid */}
          {silhouetteImages.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '16px',
                marginTop: '6px',
              }}
            >
              {silhouetteImages.map((img, index) => (
                <div
                  key={img.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 2px 6px var(--overlay-black-5)',
                    position: 'relative',
                  }}
                >
                  {/* Exact 3:4 Display Box */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '3 / 4',
                      overflow: 'hidden',
                      backgroundColor: 'var(--text-primary)',
                    }}
                  >
                    <img
                      src={img.previewUrl}
                      alt={img.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />

                    {/* Cover Badge for First Image */}
                    {index === 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          backgroundColor: 'var(--brand-primary)',
                          color: "var(--text-inverse)",
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Cover
                      </span>
                    )}

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      title="Remove image"
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        background: 'var(--overlay-black-70)',
                        color: "var(--text-inverse)",
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Metadata and Recrop action */}
                  <div
                    style={{
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      backgroundColor: 'var(--bg-surface)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.72rem',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--color-success)',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <CheckCircle2 size={12} />
                        3:4 Stored
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {img.width}×{img.height}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRecrop(img)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-background, var(--bg-subtle))',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Crop size={13} />
                      Re-crop (3:4)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Dropzone (active when less than 8 images) */}
          {silhouetteImages.length < 8 && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: isDraggingOver
                  ? '2px dashed var(--brand-primary)'
                  : '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '36px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                backgroundColor: isDraggingOver
                  ? 'rgba(36, 75, 87, 0.05)'
                  : 'var(--bg-surface)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(36, 75, 87, 0.08)',
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UploadCloud size={24} />
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    display: 'block',
                  }}
                >
                  Upload Silhouette Photography
                </span>
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    marginTop: '2px',
                    display: 'block',
                  }}
                >
                  Select or drag photos. You will interactively crop each image into <strong>3:4 ratio</strong>.
                </span>
              </div>

              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  backgroundColor: 'var(--bg-background, var(--bg-subtle))',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                }}
              >
                JPG, PNG, WEBP (Only 3:4 stored)
              </span>
            </div>
          )}
        </div>

        {/* Description field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
            }}
          >
            Silhouette Description & Atelier Notes
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the architectural tailoring, drape, and silhouette provenance..."
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              outline: 'none',
              minHeight: '120px',
              resize: 'vertical',
            }}
            required
          />
        </div>

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
            paddingTop: '20px',
            borderTop: '1px solid var(--admin-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {silhouetteImages.length > 0 ? (
              <span
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--color-success)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle2 size={16} />
                {silhouetteImages.length} 3:4 {silhouetteImages.length === 1 ? 'image' : 'images'} ready for storage
              </span>
            ) : (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Please add and crop at least 1 image to 3:4
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            leftIcon={<Save size={16} />}
            disabled={isSubmitting || silhouetteImages.length === 0}
          >
            {isSubmitting ? 'Storing Silhouette...' : 'Save & Publish Silhouette'}
          </Button>
        </div>
      </form>

      {/* 3:4 Image Cropper Modal */}
      <SilhouetteImageCropperModal
        isOpen={cropperModalOpen}
        queue={cropQueue}
        currentIndex={cropperCurrentIndex}
        onClose={() => setCropperModalOpen(false)}
        onCropFinished={handleCropFinished}
      />
    </div>
  );
}
