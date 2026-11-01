'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ProductVariant } from '@/types';
import { getLuxuryColorStyle, LUXURY_COLOR_MAP } from '@/lib/colorUtils';
import { Badge } from '@/components/ui/Badge';
import { AnimatedTrashIcon } from '@/components/ui/AnimatedTrashIcon';
import {
  Palette,
  Ruler,
  Plus,
  X,
  Layers,
  Search,
  ChevronDown,
  Check,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';

// Full list of luxury colors from palette
const ALL_LUXURY_COLORS = Object.keys(LUXURY_COLOR_MAP);

// Standard sizing definitions with categories
const ALL_STANDARD_SIZES = [
  { label: 'XS', group: 'Ready-to-Wear' },
  { label: 'S', group: 'Ready-to-Wear' },
  { label: 'M', group: 'Ready-to-Wear' },
  { label: 'L', group: 'Ready-to-Wear' },
  { label: 'XL', group: 'Ready-to-Wear' },
  { label: 'XXL', group: 'Ready-to-Wear' },
  { label: '34 FR', group: 'French Tailoring' },
  { label: '36 FR', group: 'French Tailoring' },
  { label: '38 FR', group: 'French Tailoring' },
  { label: '40 FR', group: 'French Tailoring' },
  { label: '42 FR', group: 'French Tailoring' },
  { label: '44 FR', group: 'French Tailoring' },
  { label: '46 FR', group: 'French Tailoring' },
  { label: '36 EU', group: 'Atelier Footwear' },
  { label: '37 EU', group: 'Atelier Footwear' },
  { label: '38 EU', group: 'Atelier Footwear' },
  { label: '39 EU', group: 'Atelier Footwear' },
  { label: '40 EU', group: 'Atelier Footwear' },
  { label: '41 EU', group: 'Atelier Footwear' },
  { label: '42 EU', group: 'Atelier Footwear' },
  { label: '43 EU', group: 'Atelier Footwear' },
  { label: '44 EU', group: 'Atelier Footwear' },
  { label: '45 EU', group: 'Atelier Footwear' },
  { label: 'Standard', group: 'Accessories' },
  { label: 'One Size', group: 'Accessories' },
  { label: '50ml', group: 'Fragrance' },
  { label: '100ml', group: 'Fragrance' },
];

const SIZING_PRESETS = [
  { name: 'RTW (XS–XL)', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { name: 'Tailoring (36–44 FR)', sizes: ['36 FR', '38 FR', '40 FR', '42 FR', '44 FR'] },
  { name: 'Footwear (38–44 EU)', sizes: ['38 EU', '39 EU', '40 EU', '41 EU', '42 EU', '43 EU', '44 EU'] },
  { name: 'Standard', sizes: ['Standard'] },
];

function generateDefaultSku(productName: string, color: string, size: string): string {
  const words = (productName || 'SLH').trim().split(/\s+/).filter(Boolean);
  let prefix = '';
  if (words.length >= 2) {
    prefix = (words[0].slice(0, 2) + words[1].slice(0, 2)).toUpperCase();
  } else if (words.length === 1 && words[0].length >= 3) {
    prefix = words[0].slice(0, 4).toUpperCase();
  } else {
    prefix = 'SLH';
  }
  prefix = prefix.replace(/[^A-Z0-9]/g, '') || 'SLH';

  const cleanColor = (color || 'CLR')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4);

  const cleanSize = (size || 'STD')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

  return `${prefix}-${cleanColor}-${cleanSize}`;
}

export interface SilhouetteVariantManagerProps {
  productName: string;
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export const SilhouetteVariantManager: React.FC<SilhouetteVariantManagerProps> = ({
  productName,
  variants,
  onChange,
}) => {
  // Explicitly tracked selected colors and sizes without any hardcoded fallbacks
  const [selectedColors, setSelectedColors] = useState<string[]>(() => {
    const list: string[] = [];
    variants.forEach((v) => {
      if (v.color && !list.includes(v.color)) list.push(v.color);
    });
    return list;
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>(() => {
    const list: string[] = [];
    variants.forEach((v) => {
      if (v.size && !list.includes(v.size)) list.push(v.size);
    });
    return list;
  });

  // Keep in sync when variants prop updates (e.g. initial edit load)
  useEffect(() => {
    const vColors: string[] = [];
    const vSizes: string[] = [];
    variants.forEach((v) => {
      if (v.color && !vColors.includes(v.color)) vColors.push(v.color);
      if (v.size && !vSizes.includes(v.size)) vSizes.push(v.size);
    });
    if (vColors.length > 0 && selectedColors.length === 0) {
      setSelectedColors(vColors);
    }
    if (vSizes.length > 0 && selectedSizes.length === 0) {
      setSelectedSizes(vSizes);
    }
  }, [variants]);

  // Dropdown states for Colors
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [colorSearch, setColorSearch] = useState('');
  const colorDropdownRef = useRef<HTMLDivElement>(null);
  const colorSearchInputRef = useRef<HTMLInputElement>(null);

  // Dropdown states for Sizes
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [sizeSearch, setSizeSearch] = useState('');
  const sizeDropdownRef = useRef<HTMLDivElement>(null);
  const sizeSearchInputRef = useRef<HTMLInputElement>(null);

  // Bulk stock value
  const [bulkStockValue, setBulkStockValue] = useState<number>(8);

  const totalStock = useMemo(() => {
    return variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  }, [variants]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target as Node)) {
        setColorDropdownOpen(false);
        setColorSearch('');
      }
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target as Node)) {
        setSizeDropdownOpen(false);
        setSizeSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (colorDropdownOpen) {
      setTimeout(() => colorSearchInputRef.current?.focus(), 50);
    }
  }, [colorDropdownOpen]);

  useEffect(() => {
    if (sizeDropdownOpen) {
      setTimeout(() => sizeSearchInputRef.current?.focus(), 50);
    }
  }, [sizeDropdownOpen]);

  // Color addition
  const handleAddColor = (colorName: string) => {
    const trimmed = colorName.trim();
    if (!trimmed || selectedColors.includes(trimmed)) return;

    const nextColors = [...selectedColors, trimmed];
    setSelectedColors(nextColors);

    // Only generate variants if sizes have also been chosen (no fake standard size!)
    if (selectedSizes.length > 0) {
      const newVariantRows: ProductVariant[] = selectedSizes.map((size) => ({
        sku: generateDefaultSku(productName, trimmed, size),
        color: trimmed,
        size,
        stock: 8,
      }));
      onChange([...variants, ...newVariantRows]);
    }
    setColorSearch('');
  };

  // Color removal
  const handleRemoveColor = (colorName: string) => {
    const nextColors = selectedColors.filter((c) => c !== colorName);
    setSelectedColors(nextColors);
    onChange(variants.filter((v) => v.color !== colorName));
  };

  // Size addition
  const handleAddSize = (sizeName: string) => {
    const trimmed = sizeName.trim();
    if (!trimmed || selectedSizes.includes(trimmed)) return;

    const nextSizes = [...selectedSizes, trimmed];
    setSelectedSizes(nextSizes);

    // Only generate variants if colors have also been chosen (no fake default color!)
    if (selectedColors.length > 0) {
      const newVariantRows: ProductVariant[] = selectedColors.map((color) => ({
        sku: generateDefaultSku(productName, color, trimmed),
        color,
        size: trimmed,
        stock: 8,
      }));
      onChange([...variants, ...newVariantRows]);
    }
    setSizeSearch('');
  };

  // Size removal
  const handleRemoveSize = (sizeName: string) => {
    const nextSizes = selectedSizes.filter((s) => s !== sizeName);
    setSelectedSizes(nextSizes);
    onChange(variants.filter((v) => v.size !== sizeName));
  };

  // Sizing preset applicator
  const handleApplySizingPreset = (presetSizes: string[]) => {
    setSelectedSizes(presetSizes);
    if (selectedColors.length > 0) {
      const newVariants: ProductVariant[] = [];
      selectedColors.forEach((color) => {
        presetSizes.forEach((size) => {
          const existing = variants.find((v) => v.color === color && v.size === size);
          if (existing) {
            newVariants.push(existing);
          } else {
            newVariants.push({
              sku: generateDefaultSku(productName, color, size),
              color,
              size,
              stock: 8,
            });
          }
        });
      });
      onChange(newVariants);
    }
    setSizeDropdownOpen(false);
  };

  // Update a single variant
  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      [field]: field === 'stock' ? Math.max(0, parseInt(value, 10) || 0) : value,
    };
    onChange(updated);
  };

  // Delete a single variant row
  const handleDeleteVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Apply bulk stock to all variants
  const handleApplyBulkStock = () => {
    const val = Math.max(0, bulkStockValue || 0);
    const updated = variants.map((v) => ({ ...v, stock: val }));
    onChange(updated);
  };

  // Add individual custom SKU
  const handleAddIndividualVariant = () => {
    const defaultColor = selectedColors[0] || 'Noir';
    const defaultSize = selectedSizes[0] || 'Standard';
    const newVariant: ProductVariant = {
      sku: generateDefaultSku(productName, defaultColor, `${defaultSize}-${Date.now().toString().slice(-3)}`),
      color: defaultColor,
      size: defaultSize,
      stock: 5,
    };
    if (!selectedColors.includes(defaultColor)) setSelectedColors((prev) => [...prev, defaultColor]);
    if (!selectedSizes.includes(defaultSize)) setSelectedSizes((prev) => [...prev, defaultSize]);
    onChange([...variants, newVariant]);
  };

  // Filtered colors based on search input
  const filteredColors = useMemo(() => {
    const q = colorSearch.toLowerCase().trim();
    if (!q) return ALL_LUXURY_COLORS;
    return ALL_LUXURY_COLORS.filter((c) => c.toLowerCase().includes(q));
  }, [colorSearch]);

  const isExactColorMatch = useMemo(() => {
    const q = colorSearch.toLowerCase().trim();
    return ALL_LUXURY_COLORS.some((c) => c.toLowerCase() === q);
  }, [colorSearch]);

  // Filtered sizes based on search input
  const filteredSizes = useMemo(() => {
    const q = sizeSearch.toLowerCase().trim();
    if (!q) return ALL_STANDARD_SIZES;
    return ALL_STANDARD_SIZES.filter(
      (s) => s.label.toLowerCase().includes(q) || s.group.toLowerCase().includes(q)
    );
  }, [sizeSearch]);

  const isExactSizeMatch = useMemo(() => {
    const q = sizeSearch.toLowerCase().trim();
    return ALL_STANDARD_SIZES.some((s) => s.label.toLowerCase() === q);
  }, [sizeSearch]);

  return (
    <div
      className="admin-variant-manager-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        padding: '24px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--admin-canvas)',
        border: '1px solid var(--admin-border)',
        boxShadow: '0 1px 3px var(--overlay-black-5)',
      }}
    >
      {/* ----------------- SECTION HEADER ----------------- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--brand-primary)',
              display: 'block',
              marginBottom: '2px',
            }}
          >
            Garment Specifications & Stock
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.15rem, 3.5vw, 1.25rem)',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              color: 'var(--admin-text-primary)',
              margin: 0,
            }}
          >
            Silhouette Colors, Sizes & Atelier Inventory
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Badge variant={selectedColors.length > 0 ? 'success' : 'warning'}>
            {selectedColors.length} {selectedColors.length === 1 ? 'Color' : 'Colors'} Selected
          </Badge>
          <Badge variant={selectedSizes.length > 0 ? 'success' : 'warning'}>
            {selectedSizes.length} {selectedSizes.length === 1 ? 'Size' : 'Sizes'} Selected
          </Badge>
        </div>
      </div>

      {/* ----------------- SEARCHABLE DROPDOWNS ROW (FULL WIDTH 2-COL) ----------------- */}
      <div
        className="admin-variant-dropdowns-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '20px',
          width: '100%',
          alignItems: 'start',
        }}
      >
        {/* ===================== 1. SEARCHABLE COLOR DROPDOWN ===================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Palette size={15} color="var(--brand-primary)" />
            Atelier Color Palette
          </label>

          {/* Color Dropdown Bar */}
          <div ref={colorDropdownRef} style={{ position: 'relative', width: '100%' }}>
            <button
              type="button"
              onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: colorDropdownOpen
                  ? '1px solid var(--admin-accent)'
                  : '1px solid var(--admin-border)',
                backgroundColor: 'var(--admin-surface)',
                color: 'var(--admin-text-primary)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: colorDropdownOpen ? '0 0 0 2px var(--overlay-golden-15)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <Search size={16} color="var(--admin-text-secondary)" style={{ flexShrink: 0 }} />
                <span
                  style={{
                    color: selectedColors.length > 0 ? 'var(--admin-text-primary)' : 'var(--text-muted)',
                    fontWeight: selectedColors.length > 0 ? 500 : 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {selectedColors.length > 0
                    ? `${selectedColors.length} selected: ${selectedColors.join(', ')}`
                    : 'Search & select atelier shades...'}
                </span>
              </div>
              <ChevronDown
                size={16}
                color="var(--admin-text-secondary)"
                style={{
                  transform: colorDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0,
                  marginLeft: '8px',
                }}
              />
            </button>

            {/* Dropdown Menu with Search Bar */}
            {colorDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  width: '100%',
                  backgroundColor: 'var(--admin-surface)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 8px 24px var(--overlay-black-15)',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                {/* Search Bar Input inside dropdown */}
                <div
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid var(--admin-border)',
                    backgroundColor: 'var(--admin-canvas)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Search size={15} color="var(--admin-text-secondary)" />
                  <input
                    ref={colorSearchInputRef}
                    type="text"
                    value={colorSearch}
                    onChange={(e) => setColorSearch(e.target.value)}
                    placeholder="Type to filter shades or add bespoke color..."
                    style={{
                      width: '100%',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--admin-text-primary)',
                      fontSize: '0.86rem',
                      outline: 'none',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (colorSearch.trim()) {
                          handleAddColor(colorSearch.trim());
                        }
                      }
                    }}
                  />
                  {colorSearch && (
                    <button
                      type="button"
                      onClick={() => setColorSearch('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Color Options List */}
                <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '6px' }}>
                  {filteredColors.map((colorName) => {
                    const isSelected = selectedColors.includes(colorName);
                    const { background, isLight } = getLuxuryColorStyle(colorName);
                    return (
                      <button
                        key={colorName}
                        type="button"
                        onClick={() =>
                          isSelected ? handleRemoveColor(colorName) : handleAddColor(colorName)
                        }
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: isSelected ? 'var(--overlay-golden-10)' : 'transparent',
                          color: isSelected ? 'var(--brand-primary)' : 'var(--admin-text-primary)',
                          fontWeight: isSelected ? 600 : 400,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--overlay-black-5)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              background,
                              border: isLight ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(255,255,255,0.25)',
                              flexShrink: 0,
                            }}
                          />
                          <span>{colorName}</span>
                        </div>
                        {isSelected && <Check size={15} color="var(--brand-primary)" />}
                      </button>
                    );
                  })}

                  {/* Add Bespoke Option if not in list */}
                  {colorSearch.trim() && !isExactColorMatch && (
                    <button
                      type="button"
                      onClick={() => handleAddColor(colorSearch.trim())}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        marginTop: '4px',
                        borderRadius: '4px',
                        border: '1px dashed var(--admin-border)',
                        backgroundColor: 'var(--admin-canvas)',
                        color: 'var(--brand-primary)',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <Plus size={14} />
                      <span>Add bespoke shade "{colorSearch.trim()}"</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Active Colors Removable Tag Pills */}
          {selectedColors.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
              {selectedColors.map((col) => {
                const { background, isLight } = getLuxuryColorStyle(col);
                return (
                  <div
                    key={col}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-pill, 9999px)',
                      backgroundColor: 'var(--admin-surface)',
                      border: '1px solid var(--admin-border)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--admin-text-primary)',
                      boxShadow: '0 1px 2px var(--overlay-black-5)',
                    }}
                  >
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background,
                        border: isLight ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(255,255,255,0.2)',
                      }}
                    />
                    <span>{col}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(col)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        color: 'var(--admin-text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '3px',
                      }}
                      title={`Remove ${col}`}
                    >
                      <X size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===================== 2. SEARCHABLE SIZE DROPDOWN ===================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Ruler size={15} color="var(--brand-primary)" />
            Sizing Architecture
          </label>

          {/* Size Dropdown Bar */}
          <div ref={sizeDropdownRef} style={{ position: 'relative', width: '100%' }}>
            <button
              type="button"
              onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: sizeDropdownOpen
                  ? '1px solid var(--admin-accent)'
                  : '1px solid var(--admin-border)',
                backgroundColor: 'var(--admin-surface)',
                color: 'var(--admin-text-primary)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: sizeDropdownOpen ? '0 0 0 2px var(--overlay-golden-15)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <Search size={16} color="var(--admin-text-secondary)" style={{ flexShrink: 0 }} />
                <span
                  style={{
                    color: selectedSizes.length > 0 ? 'var(--admin-text-primary)' : 'var(--text-muted)',
                    fontWeight: selectedSizes.length > 0 ? 500 : 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {selectedSizes.length > 0
                    ? `${selectedSizes.length} selected: ${selectedSizes.join(', ')}`
                    : 'Search & select sizing standards...'}
                </span>
              </div>
              <ChevronDown
                size={16}
                color="var(--admin-text-secondary)"
                style={{
                  transform: sizeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0,
                  marginLeft: '8px',
                }}
              />
            </button>

            {/* Dropdown Menu with Search Bar & Presets */}
            {sizeDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  width: '100%',
                  backgroundColor: 'var(--admin-surface)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 8px 24px var(--overlay-black-15)',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                {/* Search Bar Input inside dropdown */}
                <div
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid var(--admin-border)',
                    backgroundColor: 'var(--admin-canvas)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Search size={15} color="var(--admin-text-secondary)" />
                  <input
                    ref={sizeSearchInputRef}
                    type="text"
                    value={sizeSearch}
                    onChange={(e) => setSizeSearch(e.target.value)}
                    placeholder="Type to search sizes (e.g. S, 38 FR, 42 EU)..."
                    style={{
                      width: '100%',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--admin-text-primary)',
                      fontSize: '0.86rem',
                      outline: 'none',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (sizeSearch.trim()) {
                          handleAddSize(sizeSearch.trim());
                        }
                      }
                    }}
                  />
                  {sizeSearch && (
                    <button
                      type="button"
                      onClick={() => setSizeSearch('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Quick Collection Presets inside dropdown */}
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--admin-surface)',
                    borderBottom: '1px solid var(--admin-border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--admin-text-secondary)', textTransform: 'uppercase' }}>
                    Presets:
                  </span>
                  {SIZING_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleApplySizingPreset(p.sizes)}
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        padding: '4px 9px',
                        borderRadius: '4px',
                        border: '1px solid var(--admin-border)',
                        backgroundColor: 'var(--admin-canvas)',
                        color: 'var(--admin-text-primary)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                {/* Size Options List */}
                <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '6px' }}>
                  {filteredSizes.map((sizeItem) => {
                    const isSelected = selectedSizes.includes(sizeItem.label);
                    return (
                      <button
                        key={sizeItem.label}
                        type="button"
                        onClick={() =>
                          isSelected ? handleRemoveSize(sizeItem.label) : handleAddSize(sizeItem.label)
                        }
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: isSelected ? 'var(--overlay-golden-10)' : 'transparent',
                          color: isSelected ? 'var(--brand-primary)' : 'var(--admin-text-primary)',
                          fontWeight: isSelected ? 600 : 400,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--overlay-black-5)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600 }}>{sizeItem.label}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-secondary)', backgroundColor: 'var(--admin-canvas)', padding: '1px 6px', borderRadius: '3px' }}>
                            {sizeItem.group}
                          </span>
                        </div>
                        {isSelected && <Check size={15} color="var(--brand-primary)" />}
                      </button>
                    );
                  })}

                  {/* Add Bespoke Option if not in list */}
                  {sizeSearch.trim() && !isExactSizeMatch && (
                    <button
                      type="button"
                      onClick={() => handleAddSize(sizeSearch.trim())}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        marginTop: '4px',
                        borderRadius: '4px',
                        border: '1px dashed var(--admin-border)',
                        backgroundColor: 'var(--admin-canvas)',
                        color: 'var(--brand-primary)',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <Plus size={14} />
                      <span>Add bespoke size "{sizeSearch.trim()}"</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Active Sizes Removable Tag Pills */}
          {selectedSizes.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
              {selectedSizes.map((sz) => (
                <div
                  key={sz}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--admin-surface)',
                    border: '1px solid var(--admin-border)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--admin-text-primary)',
                    boxShadow: '0 1px 2px var(--overlay-black-5)',
                  }}
                >
                  <span>{sz}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(sz)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: 'var(--admin-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: '2px',
                    }}
                    title={`Remove ${sz}`}
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--admin-border)', margin: 0 }} />

      {/* ----------------- 3. FULL WIDTH INVENTORY MATRIX TABLE ----------------- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--brand-primary)" />
              <h3
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--admin-text-primary)',
                  margin: 0,
                }}
              >
                Atelier Inventory Matrix
              </h3>
              <Badge variant={variants.length > 0 ? 'success' : 'warning'}>
                {variants.length} SKUs ({totalStock} units total)
              </Badge>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)', margin: '4px 0 0 0' }}>
              Individual SKU codes and reserve stock quantities per color and size combination.
            </p>
          </div>

          {/* Quick Bulk Stock Setter & Add custom SKU */}
          {variants.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--admin-surface)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--admin-border)',
                }}
              >
                <SlidersHorizontal size={14} color="var(--admin-text-secondary)" />
                <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
                  Bulk Stock:
                </span>
                <input
                  type="number"
                  min="0"
                  value={bulkStockValue}
                  onChange={(e) => setBulkStockValue(parseInt(e.target.value, 10) || 0)}
                  style={{
                    width: '56px',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--admin-border)',
                    backgroundColor: 'var(--admin-canvas)',
                    color: 'var(--admin-text-primary)',
                    fontSize: '0.82rem',
                    textAlign: 'center',
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyBulkStock}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: 'var(--admin-accent)',
                    color: 'var(--admin-accent-text)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Apply to All
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddIndividualVariant}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--admin-border)',
                  backgroundColor: 'var(--admin-surface)',
                  color: 'var(--admin-text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Plus size={13} /> Add Single SKU
              </button>
            </div>
          )}
        </div>

        {/* Matrix Table or Clean Dynamic Empty Guidance */}
        {variants.length === 0 ? (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--admin-surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--admin-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={28} color="var(--brand-accent)" />
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
              No Variants Configured
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)', maxWidth: '480px' }}>
              {selectedColors.length === 0 && selectedSizes.length === 0
                ? 'Select at least 1 Color and 1 Size using the searchable dropdown bars above to generate the inventory matrix.'
                : selectedColors.length === 0
                ? `Sizes selected (${selectedSizes.join(', ')}). Please select at least 1 color above to generate the matrix.`
                : `Colors selected (${selectedColors.join(', ')}). Please select at least 1 size above to generate the matrix.`}
            </span>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div
              className="admin-variant-desktop-view"
              style={{
                width: '100%',
                overflowX: 'auto',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--admin-border)',
                backgroundColor: 'var(--admin-surface)',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '0.84rem',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'var(--admin-canvas)',
                      borderBottom: '1px solid var(--admin-border)',
                      color: 'var(--admin-text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontSize: '0.72rem',
                    }}
                  >
                    <th style={{ padding: '12px 16px', width: '25%' }}>Color Shade</th>
                    <th style={{ padding: '12px 16px', width: '15%' }}>Size</th>
                    <th style={{ padding: '12px 16px', width: '25%' }}>SKU Code</th>
                    <th style={{ padding: '12px 16px', width: '15%' }}>Reserve Stock</th>
                    <th style={{ padding: '12px 16px', width: '12%' }}>Status</th>
                    <th style={{ padding: '12px 16px', width: '8%', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, idx) => {
                    const { background, isLight } = getLuxuryColorStyle(variant.color);
                    const isDepleted = variant.stock === 0;
                    const isLow = variant.stock > 0 && variant.stock <= 5;

                    return (
                      <tr
                        key={`${variant.sku || idx}_${variant.color}_${variant.size}`}
                        style={{
                          borderBottom: '1px solid var(--admin-border-light)',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        {/* Color */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                width: '15px',
                                height: '15px',
                                borderRadius: '50%',
                                background,
                                border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.2)',
                                display: 'inline-block',
                                flexShrink: 0,
                              }}
                            />
                            <input
                              type="text"
                              value={variant.color}
                              onChange={(e) => handleUpdateVariant(idx, 'color', e.target.value)}
                              style={{
                                border: '1px solid transparent',
                                backgroundColor: 'transparent',
                                color: 'var(--admin-text-primary)',
                                fontSize: '0.84rem',
                                fontWeight: 600,
                                width: '100%',
                                maxWidth: '180px',
                                padding: '2px 4px',
                                borderRadius: '3px',
                              }}
                            />
                          </div>
                        </td>

                        {/* Size */}
                        <td style={{ padding: '12px 16px' }}>
                          <input
                            type="text"
                            value={variant.size}
                            onChange={(e) => handleUpdateVariant(idx, 'size', e.target.value)}
                            style={{
                              border: '1px solid var(--admin-border)',
                              backgroundColor: 'var(--admin-canvas)',
                              color: 'var(--admin-text-primary)',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              width: '90px',
                              padding: '4px 8px',
                              borderRadius: '4px',
                            }}
                          />
                        </td>

                        {/* SKU */}
                        <td style={{ padding: '12px 16px' }}>
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value.toUpperCase())}
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.82rem',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--admin-border)',
                              backgroundColor: 'var(--admin-canvas)',
                              color: 'var(--admin-text-primary)',
                              width: '100%',
                              maxWidth: '200px',
                            }}
                          />
                        </td>

                        {/* Reserve Units */}
                        <td style={{ padding: '12px 16px' }}>
                          <input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) => handleUpdateVariant(idx, 'stock', e.target.value)}
                            style={{
                              width: '90px',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--admin-border)',
                              backgroundColor: 'var(--admin-canvas)',
                              color: 'var(--admin-text-primary)',
                              fontSize: '0.84rem',
                              fontWeight: 600,
                              textAlign: 'center',
                            }}
                          />
                        </td>

                        {/* Status */}
                        <td style={{ padding: '12px 16px' }}>
                          {isDepleted ? (
                            <Badge variant="danger">Depleted</Badge>
                          ) : isLow ? (
                            <Badge variant="warning">Low ({variant.stock})</Badge>
                          ) : (
                            <Badge variant="success">In Stock ({variant.stock})</Badge>
                          )}
                        </td>

                        {/* Action */}
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteVariant(idx)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--text-muted)',
                              padding: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '4px',
                            }}
                            title="Remove variant combination"
                          >
                            <AnimatedTrashIcon size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Touch-Optimized Cards */}
            <div className="admin-variant-mobile-view">
              {variants.map((variant, idx) => {
                const { background, isLight } = getLuxuryColorStyle(variant.color);
                const isDepleted = variant.stock === 0;
                const isLow = variant.stock > 0 && variant.stock <= 5;

                return (
                  <div
                    key={`mobile_${variant.sku || idx}_${variant.color}_${variant.size}`}
                    style={{
                      backgroundColor: 'var(--admin-surface)',
                      border: '1px solid var(--admin-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: '0 1px 3px var(--overlay-black-5)',
                    }}
                  >
                    {/* Top Line: Color Swatch + Name, Size Badge, Trash Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background,
                            border: isLight ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(255,255,255,0.25)',
                            flexShrink: 0,
                          }}
                        />
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => handleUpdateVariant(idx, 'color', e.target.value)}
                          style={{
                            border: '1px solid transparent',
                            backgroundColor: 'transparent',
                            color: 'var(--admin-text-primary)',
                            fontSize: '0.86rem',
                            fontWeight: 600,
                            width: '100%',
                            padding: '2px 4px',
                            borderRadius: '3px',
                          }}
                          placeholder="Color shade"
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="text"
                          value={variant.size}
                          onChange={(e) => handleUpdateVariant(idx, 'size', e.target.value)}
                          style={{
                            border: '1px solid var(--admin-border)',
                            backgroundColor: 'var(--admin-canvas)',
                            color: 'var(--admin-text-primary)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            width: '64px',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            textAlign: 'center',
                          }}
                          placeholder="Size"
                        />

                        <button
                          type="button"
                          onClick={() => handleDeleteVariant(idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            minWidth: '32px',
                            minHeight: '32px',
                          }}
                          title="Remove variant"
                        >
                          <AnimatedTrashIcon size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Line: SKU Code, Reserve Stock & Status */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '130px' }}>
                        <label style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '3px' }}>
                          SKU Code
                        </label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value.toUpperCase())}
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--admin-border)',
                            backgroundColor: 'var(--admin-canvas)',
                            color: 'var(--admin-text-primary)',
                            width: '100%',
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '3px' }}>
                            Reserve
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) => handleUpdateVariant(idx, 'stock', e.target.value)}
                            style={{
                              width: '60px',
                              padding: '6px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--admin-border)',
                              backgroundColor: 'var(--admin-canvas)',
                              color: 'var(--admin-text-primary)',
                              fontSize: '0.84rem',
                              fontWeight: 600,
                              textAlign: 'center',
                            }}
                          />
                        </div>

                        <div style={{ paddingBottom: '3px' }}>
                          {isDepleted ? (
                            <Badge variant="danger">Depleted</Badge>
                          ) : isLow ? (
                            <Badge variant="warning">Low ({variant.stock})</Badge>
                          ) : (
                            <Badge variant="success">In Stock</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
