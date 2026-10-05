'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Save, UploadCloud, X } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    description: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const remainingSlots = 8 - imageFiles.length;
      const filesToAdd = files.slice(0, remainingSlots);

      if (filesToAdd.length > 0) {
        setImageFiles((prev) => [...prev, ...filesToAdd]);
        
        filesToAdd.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreviews((prev) => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        });
      }
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      alert('Please upload at least 1 image.');
      return;
    }
    // Here we'd call an API to save the product
    alert('Silhouette drafted successfully!');
    router.push('/admin/products');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '800px' }}>
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
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sapphire)' }}>
            Inventory & Catalog
          </span>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', marginTop: '4px' }}>
            Draft New Silhouette
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'var(--admin-surface)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-border)', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
        <Input
          label="Silhouette Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. The Midnight Trench"
          required
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Category
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
            <option value="" disabled>Select a category</option>
            <option value="cat_outerwear">Outerwear</option>
            <option value="cat_dresses">Dresses</option>
            <option value="cat_tops">Tops</option>
            <option value="cat_bottoms">Bottoms</option>
            <option value="cat_accessories">Accessories</option>
          </select>
        </div>

        <Input
          label="Atelier Price (₹)"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g. 15000"
          required
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Silhouette Images (1-8)
          </label>
          <div
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: imagePreviews.length > 0 ? '16px' : '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              backgroundColor: 'var(--bg-surface)',
              cursor: imagePreviews.length < 8 ? 'pointer' : 'default',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '160px'
            }}
          >
            {imagePreviews.length < 8 && (
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                  zIndex: 10
                }}
              />
            )}
            
            {imagePreviews.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', width: '100%' }}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{ position: 'relative', width: '120px', height: '120px' }}>
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeImage(index);
                      }}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 20
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {imagePreviews.length < 8 && (
                  <div style={{ width: '120px', height: '120px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <UploadCloud size={24} />
                    <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Add More</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <UploadCloud size={36} color="var(--text-muted)" />
                <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  Click or drag images to upload (Max 8)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  SVG, PNG, JPG or GIF (max. 5MB)
                </span>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the silhouette..."
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              outline: 'none',
              minHeight: '120px',
              resize: 'vertical'
            }}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button type="submit" variant="primary" leftIcon={<Save size={16} />}>
            Save Draft
          </Button>
        </div>
      </form>
    </div>
  );
}
