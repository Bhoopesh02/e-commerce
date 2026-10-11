'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search, AlertCircle } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface AdminDropdownProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  errorMessage?: string;
  className?: string;
}

export const AdminDropdown: React.FC<AdminDropdownProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  disabled = false,
  required = false,
  error,
  errorMessage,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [internalError, setInternalError] = useState<string>('');

  const dropdownId = useId();
  const triggerId = `${dropdownId}-trigger`;
  const listboxId = `${dropdownId}-listbox`;
  const labelId = `${dropdownId}-label`;
  const errorId = `${dropdownId}-error`;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const displayError = error || internalError;

  // Clear internal error when a value is selected
  useEffect(() => {
    if (value) {
      setInternalError('');
    }
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form submission intercept for required validation
  useEffect(() => {
    const form = dropdownRef.current?.closest('form');
    if (!form) return;

    const handleFormSubmit = (e: SubmitEvent) => {
      if (required && !value) {
        e.preventDefault();
        e.stopPropagation();
        setInternalError(errorMessage || 'Please select an option from the list');
        triggerRef.current?.focus();
      }
    };

    form.addEventListener('submit', handleFormSubmit, true);
    return () => form.removeEventListener('submit', handleFormSubmit, true);
  }, [required, value, errorMessage]);

  // Initialize highlighted index when opening
  useEffect(() => {
    if (isOpen) {
      const currentIndex = filteredOptions.findIndex((opt) => opt.value === value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      if (options.length > 5 && searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // Keep highlighted item in view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setInternalError('');
    setIsOpen(false);
    setSearch('');
    triggerRef.current?.focus();
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        setSearch('');
        break;
      case 'Home':
        if (document.activeElement !== searchInputRef.current) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      case 'End':
        if (document.activeElement !== searchInputRef.current) {
          e.preventDefault();
          setHighlightedIndex(filteredOptions.length - 1);
        }
        break;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={className}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        position: 'relative',
        width: '100%',
        zIndex: isOpen ? 50 : 1,
      }}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={triggerId}
          style={{
            fontSize: '0.8rem',
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          {label} {required && <span style={{ color: 'var(--color-error, #dc2626)' }}>*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          border: displayError
            ? '1px solid var(--color-error, #dc2626)'
            : `1px solid ${isOpen ? 'var(--brand-primary)' : 'var(--border-color)'}`,
          backgroundColor: 'var(--bg-surface)',
          color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)',
          fontSize: '0.92rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          boxShadow: displayError
            ? '0 0 0 1px var(--color-error, #dc2626)'
            : isOpen
            ? '0 0 0 1px var(--brand-primary)'
            : 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          outline: 'none',
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-labelledby={label ? `${labelId} ${triggerId}` : triggerId}
        aria-activedescendant={
          isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]
            ? `${dropdownId}-opt-${filteredOptions[highlightedIndex].value}`
            : undefined
        }
        aria-invalid={Boolean(displayError)}
        aria-describedby={displayError ? errorId : undefined}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          style={{
            color: 'var(--admin-text-secondary)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            opacity: 0.7,
            flexShrink: 0,
            marginLeft: '8px',
          }}
        />
      </button>

      {/* Explicit Accessible Error Display */}
      {displayError && (
        <p
          id={errorId}
          role="alert"
          style={{
            fontSize: '0.78rem',
            color: 'var(--color-error, #dc2626)',
            margin: '2px 0 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <AlertCircle size={13} style={{ flexShrink: 0 }} />
          <span>{displayError}</span>
        </p>
      )}

      {/* Hidden input for form data serialization */}
      {name && <input type="hidden" name={name} value={value} />}

      {/* Animated Dropdown Menu with Filter size logic */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '8px',
              backgroundColor: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 20px var(--overlay-black-15)',
              zIndex: 100,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '12px', backgroundColor: 'var(--admin-surface)' }}>
              {options.length > 5 && (
                <div style={{ marginBottom: '12px', position: 'relative' }}>
                  <Search
                    size={14}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--admin-text-secondary)',
                    }}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setHighlightedIndex(0);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '100%',
                      padding: '8px 10px 8px 32px',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--admin-border)',
                      backgroundColor: 'var(--admin-background)',
                      color: 'var(--admin-text-primary)',
                      outline: 'none',
                    }}
                    aria-label={searchPlaceholder}
                  />
                </div>
              )}

              {/* Scrollable Listbox Container with data-lenis-prevent */}
              <div
                ref={listboxRef}
                id={listboxId}
                role="listbox"
                aria-labelledby={label ? labelId : undefined}
                tabIndex={-1}
                data-lenis-prevent="true"
                style={{
                  maxHeight: '220px',
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {filteredOptions.map((opt, index) => {
                  const isSelected = value === opt.value;
                  const isHighlighted = highlightedIndex === index;

                  return (
                    <button
                      key={opt.value}
                      ref={(el) => {
                        optionRefs.current[index] = el;
                      }}
                      id={`${dropdownId}-opt-${opt.value}`}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        backgroundColor: isSelected
                          ? 'var(--admin-background)'
                          : isHighlighted
                          ? 'var(--overlay-black-5)'
                          : 'transparent',
                        color: 'var(--admin-text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.85rem',
                        transition: 'background-color 0.15s ease',
                        width: '100%',
                        outline: isHighlighted ? '1px solid var(--admin-border)' : 'none',
                      }}
                    >
                      <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt.label}</span>
                      {isSelected && (
                        <Check
                          size={16}
                          style={{ color: 'var(--brand-primary)', flexShrink: 0 }}
                        />
                      )}
                    </button>
                  );
                })}

                {filteredOptions.length === 0 && (
                  <div
                    style={{
                      padding: '20px 10px',
                      textAlign: 'center',
                      color: 'var(--admin-text-secondary)',
                      fontSize: '0.85rem',
                    }}
                  >
                    No options found.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
