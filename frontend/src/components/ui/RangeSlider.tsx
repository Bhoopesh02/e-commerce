'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string;
  milestones?: { value: number; label: string }[];
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  formatLabel = (val) => `₹${val.toLocaleString()}`,
  milestones,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [internalValue, setInternalValue] = useState<[number, number]>(value);
  const internalValueRef = useRef(internalValue);
  useEffect(() => {
    internalValueRef.current = internalValue;
  }, [internalValue]);
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);
  const [hovered, setHovered] = useState<'min' | 'max' | null>(null);
  const [showTooltipFor, setShowTooltipFor] = useState<'min' | 'max' | null>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [minInput, setMinInput] = useState(value[0].toString());
  const [maxInput, setMaxInput] = useState(value[1].toString());
  const [isMinFocused, setIsMinFocused] = useState(false);
  const [isMaxFocused, setIsMaxFocused] = useState(false);

  useEffect(() => {
    if (!dragging) {
      setInternalValue(value);
    }
  }, [value, dragging]);

  useEffect(() => {
    if (!isMinFocused) setMinInput(internalValue[0].toString());
  }, [internalValue[0], isMinFocused]);

  useEffect(() => {
    if (!isMaxFocused) setMaxInput(internalValue[1].toString());
  }, [internalValue[1], isMaxFocused]);

  const handleInputCommit = (type: 'min' | 'max', valStr: string) => {
    let parsed = parseInt(valStr.replace(/,/g, ''), 10);
    if (isNaN(parsed)) {
      if (type === 'min') setMinInput(value[0].toString());
      else setMaxInput(value[1].toString());
      return;
    }

    let newMin = type === 'min' ? parsed : value[0];
    let newMax = type === 'max' ? parsed : value[1];

    if (newMin < min) newMin = min;
    if (newMax > max) newMax = max;
    if (newMin > newMax) {
      if (type === 'min') newMin = newMax;
      else newMax = newMin;
    }

    setInternalValue([newMin, newMax]);
    onChange([newMin, newMax]);
  };

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.getBoundingClientRect().width);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const getValFromPointer = useCallback((clientX: number) => {
    if (!trackRef.current || trackWidth === 0) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(trackWidth, clientX - rect.left));
    let rawVal = (x / trackWidth) * (max - min) + min;
    let steppedVal = Math.round(rawVal / step) * step;

    if (milestones) {
      const MAGNETIC_THRESHOLD = 2500;
      for (const m of milestones) {
        if (Math.abs(rawVal - m.value) <= MAGNETIC_THRESHOLD) {
          steppedVal = m.value;
          break;
        }
      }
    }
    return Math.max(min, Math.min(max, steppedVal));
  }, [trackWidth, max, min, step, milestones]);

  const onPointerDownTrack = (e: React.PointerEvent) => {
    const val = getValFromPointer(e.clientX);
    const distMin = Math.abs(val - internalValue[0]);
    const distMax = Math.abs(val - internalValue[1]);
    const target = distMin <= distMax ? 'min' : 'max';
    
    setDragging(target);
    setShowTooltipFor(target);
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    
    if (target === 'min') {
      setInternalValue([Math.min(val, internalValue[1]), internalValue[1]]);
    } else {
      setInternalValue([internalValue[0], Math.max(val, internalValue[0])]);
    }
    
    // Capture pointer on the document or track so drag works everywhere
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragging) return;
    const val = getValFromPointer(e.clientX);
    setInternalValue(prev => {
      if (dragging === 'min') {
        return [Math.min(val, prev[1]), prev[1]];
      } else {
        return [prev[0], Math.max(val, prev[0])];
      }
    });
  }, [dragging, getValFromPointer]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (dragging) {
      setDragging(null);
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltipFor(null);
      }, 150);
      onChange(internalValueRef.current);
    }
  }, [dragging, onChange]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragging, handlePointerMove, handlePointerUp]);

  const handleThumbPointerDown = (e: React.PointerEvent, type: 'min' | 'max') => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(type);
    setShowTooltipFor(type);
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
  };

  const handleThumbKeyDown = (e: React.KeyboardEvent, type: 'min' | 'max') => {
    let nextVal = type === 'min' ? internalValue[0] : internalValue[1];
    const amount = e.shiftKey ? step * 10 : step;
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      nextVal += amount;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      nextVal -= amount;
      e.preventDefault();
    } else if (e.key === 'PageUp') {
      nextVal += step * 10;
      e.preventDefault();
    } else if (e.key === 'PageDown') {
      nextVal -= step * 10;
      e.preventDefault();
    } else if (e.key === 'Home') {
      nextVal = min;
      e.preventDefault();
    } else if (e.key === 'End') {
      nextVal = max;
      e.preventDefault();
    } else {
      return;
    }

    let nextInternal: [number, number];
    if (type === 'min') {
      nextInternal = [Math.max(min, Math.min(nextVal, internalValue[1])), internalValue[1]];
    } else {
      nextInternal = [internalValue[0], Math.min(max, Math.max(nextVal, internalValue[0]))];
    }
    setInternalValue(nextInternal);
    onChange(nextInternal);
  };

  const leftPct = ((internalValue[0] - min) / (max - min)) * 100;
  const rightPct = ((internalValue[1] - min) / (max - min)) * 100;

  // Tooltip clamping
  const tooltipWidth = 70; // estimated pixels
  
  const getTooltipStyle = (pct: number) => {
    const thumbX = (pct / 100) * trackWidth;
    const center = Math.max(tooltipWidth / 2, Math.min(trackWidth - tooltipWidth / 2, thumbX));
    const offset = thumbX - center; // arrow offset
    return { center, offset };
  };

  const minTooltip = getTooltipStyle(leftPct);
  const maxTooltip = getTooltipStyle(rightPct);
  
  // Decide which tooltip to show. If both are hovered/dragged, show both unless they overlap.
  // For simplicity, just show the active one.
  const activeTooltip = showTooltipFor || hovered;

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <style>{`
        .range-thumb {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background-color: #FFFFFF;
          border: 2px solid #244B57;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(20, 20, 20, 0.25);
          touch-action: none;
          outline: none;
          transition: transform 0.1s ease, border-color 0.1s ease;
        }
        .range-thumb::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
        }
        .range-thumb:focus-visible {
          outline: 2px solid #C29B4C;
          outline-offset: 2px;
        }
        .range-thumb.is-active, .range-thumb:hover {
          transform: translate(-50%, -50%) scale(1.08);
        }
        .range-thumb.is-active {
          transform: translate(-50%, -50%) scale(1.1);
          border-color: #C29B4C;
        }
        .range-tooltip {
          position: absolute;
          bottom: calc(100% + 10px);
          transform: translateX(-50%);
          background-color: #141414;
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.15s ease, visibility 0.15s ease;
          z-index: 20;
        }
        .range-tooltip.show {
          opacity: 1;
          visibility: visible;
        }
        .range-tooltip-arrow {
          position: absolute;
          bottom: -4px;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid #141414;
        }
        .price-input-wrapper {
          display: flex;
          align-items: center;
          background-color: #fff;
          border: 1px solid #e0ddd8;
          border-radius: 24px;
          padding: 10px 12px;
          gap: 4px;
          flex: 1;
          min-width: 0;
          flex-wrap: nowrap;
        }
        .price-input-wrapper span {
          font-size: 0.85rem;
          color: #8a8782;
          font-weight: 500;
          white-space: nowrap;
        }
        .price-input-wrapper input {
          border: none;
          outline: none;
          width: 100%;
          min-width: 0;
          font-size: 0.95rem;
          color: #1a1a1a;
          font-weight: 600;
          background: transparent;
          padding: 0;
        }
        .price-input-wrapper:focus-within {
          border-color: #C29B4C;
        }
      `}</style>

      {/* Slider Visual Container */}
      <div style={{ padding: '44px 12px 24px 12px', width: '100%', boxSizing: 'border-box', position: 'relative', touchAction: 'none', userSelect: 'none' }}>
        <div 
          ref={trackRef} 
          style={{ 
            height: '4px', 
            backgroundColor: '#E0E0E0', 
            borderRadius: '2px', 
            position: 'relative',
            width: '100%',
            cursor: 'pointer'
          }}
          onPointerDown={onPointerDownTrack}
        >
          {/* Active Track Highlight */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${leftPct}%`,
              right: `${100 - rightPct}%`,
              backgroundColor: '#244B57', // Sapphire
              borderRadius: '2px',
            }}
          />

          {/* Left Thumb */}
          <div
            className={`range-thumb ${dragging === 'min' ? 'is-active' : ''}`}
            style={{
              left: `${leftPct}%`,
              cursor: dragging === 'min' ? 'grabbing' : 'grab',
              zIndex: dragging === 'min' ? 10 : 1,
            }}
            tabIndex={0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={internalValue[0]}
            aria-label="Minimum price"
            onPointerDown={(e) => handleThumbPointerDown(e, 'min')}
            onPointerEnter={() => { setHovered('min'); if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current); setShowTooltipFor('min'); }}
            onPointerLeave={() => { setHovered(null); tooltipTimeoutRef.current = setTimeout(() => setShowTooltipFor(null), 150); }}
            onKeyDown={(e) => handleThumbKeyDown(e, 'min')}
          />

          {/* Right Thumb */}
          <div
            className={`range-thumb ${dragging === 'max' ? 'is-active' : ''}`}
            style={{
              left: `${rightPct}%`,
              cursor: dragging === 'max' ? 'grabbing' : 'grab',
              zIndex: dragging === 'max' ? 10 : 1,
            }}
            tabIndex={0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={internalValue[1]}
            aria-label="Maximum price"
            onPointerDown={(e) => handleThumbPointerDown(e, 'max')}
            onPointerEnter={() => { setHovered('max'); if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current); setShowTooltipFor('max'); }}
            onPointerLeave={() => { setHovered(null); tooltipTimeoutRef.current = setTimeout(() => setShowTooltipFor(null), 150); }}
            onKeyDown={(e) => handleThumbKeyDown(e, 'max')}
          />

          {/* Tooltip for Min */}
          <div 
            className={`range-tooltip ${activeTooltip === 'min' ? 'show' : ''}`}
            style={{ left: `${minTooltip.center}px` }}
          >
            {formatLabel(internalValue[0])}
            <div className="range-tooltip-arrow" style={{ left: `calc(50% + ${minTooltip.offset}px)` }} />
          </div>

          {/* Tooltip for Max */}
          <div 
            className={`range-tooltip ${activeTooltip === 'max' ? 'show' : ''}`}
            style={{ left: `${maxTooltip.center}px` }}
          >
            {formatLabel(internalValue[1])}
            <div className="range-tooltip-arrow" style={{ left: `calc(50% + ${maxTooltip.offset}px)` }} />
          </div>

          {/* Milestone Labels */}
          {milestones && milestones.map((m, i) => {
            const mPct = ((m.value - min) / (max - min)) * 100;
            return (
              <div 
                key={`m-${i}`}
                style={{
                  position: 'absolute',
                  left: `${mPct}%`,
                  top: '20px',
                  transform: i === 0 ? 'translateX(0)' : i === milestones.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
                  color: 'rgba(36, 75, 87, 0.7)', // Sapphire at 70%
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em'
                }}
              >
                {m.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editable Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', minWidth: 0, marginTop: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', width: '100%', minWidth: 0 }}>
          <div className="price-input-wrapper">
             <span>Min: ₹</span>
             <input
               value={minInput}
               onChange={(e) => setMinInput(e.target.value)}
               onFocus={() => setIsMinFocused(true)}
               onBlur={() => {
                 setIsMinFocused(false);
                 handleInputCommit('min', minInput);
               }}
               onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.blur(); } }}
             />
          </div>
          <div className="price-input-wrapper">
             <span>Max: ₹</span>
             <input
               value={maxInput}
               onChange={(e) => setMaxInput(e.target.value)}
               onFocus={() => setIsMaxFocused(true)}
               onBlur={() => {
                 setIsMaxFocused(false);
                 handleInputCommit('max', maxInput);
               }}
               onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.blur(); } }}
             />
          </div>
        </div>
      </div>
    </div>
  );
};
