'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

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

  // We manage the handles' internal x positions
  const xLeft = useMotionValue(0);
  const xRight = useMotionValue(0);

  // State to manage tooltips
  const [activeThumb, setActiveThumb] = useState<'left' | 'right' | null>(null);
  const [liveValues, setLiveValues] = useState<[number, number]>(value);
  const [isClose, setIsClose] = useState(false);
  const activeTimerRef = useRef<NodeJS.Timeout>();

  const [minInput, setMinInput] = useState(value[0].toString());
  const [maxInput, setMaxInput] = useState(value[1].toString());
  const [isMinFocused, setIsMinFocused] = useState(false);
  const [isMaxFocused, setIsMaxFocused] = useState(false);

  useEffect(() => {
    if (!isMinFocused) setMinInput(liveValues[0].toString());
  }, [liveValues[0], isMinFocused]);

  useEffect(() => {
    if (!isMaxFocused) setMaxInput(liveValues[1].toString());
  }, [liveValues[1], isMaxFocused]);

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

    onChange([newMin, newMax]);
  };

  const mergedX = useTransform([xLeft, xRight], ([l, r]) => ((l as number) + (r as number)) / 2);
  const mergedTooltipTransform = useTransform(mergedX, (x) => {
    const halfWidth = 75; 
    if (x > trackWidth - halfWidth) {
      return `translateX(calc(-50% - ${x - (trackWidth - halfWidth)}px))`;
    }
    if (x < halfWidth) {
      return `translateX(calc(-50% + ${halfWidth - x}px))`;
    }
    return 'translateX(-50%)';
  });
  const mergedCaretTransform = useTransform(mergedX, (x) => {
    const halfWidth = 75;
    if (x > trackWidth - halfWidth) {
      return `translateX(calc(-50% + ${x - (trackWidth - halfWidth)}px))`;
    }
    if (x < halfWidth) {
      return `translateX(calc(-50% - ${halfWidth - x}px))`;
    }
    return 'translateX(-50%)';
  });

  // Measure track on mount and resize
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

  // Update positions when external value or trackWidth changes
  useEffect(() => {
    if (trackWidth > 0) {
      const leftRatio = (value[0] - min) / (max - min);
      const rightRatio = (value[1] - min) / (max - min);
      // animate to position
      animate(xLeft, leftRatio * trackWidth, { type: 'spring', stiffness: 400, damping: 40 });
      animate(xRight, rightRatio * trackWidth, { type: 'spring', stiffness: 400, damping: 40 });
    }
  }, [value, min, max, trackWidth, xLeft, xRight]);

  const valueToPx = useCallback((val: number) => {
    return ((val - min) / (max - min)) * trackWidth;
  }, [min, max, trackWidth]);

  const pxToValue = useCallback((px: number) => {
    if (trackWidth === 0) return 0;
    const rawVal = (px / trackWidth) * (max - min) + min;
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
  }, [min, max, step, trackWidth, milestones]);

  useEffect(() => {
    const unsubL = xLeft.on("change", (x) => {
      const nextVal = pxToValue(x);
      setLiveValues(prev => prev[0] === nextVal ? prev : [nextVal, prev[1]]);
      setIsClose(prev => {
        const nextClose = xRight.get() - x < 85;
        return prev === nextClose ? prev : nextClose;
      });
    });
    const unsubR = xRight.on("change", (x) => {
      const nextVal = pxToValue(x);
      setLiveValues(prev => prev[1] === nextVal ? prev : [prev[0], nextVal]);
      setIsClose(prev => {
        const nextClose = x - xLeft.get() < 85;
        return prev === nextClose ? prev : nextClose;
      });
    });
    return () => { unsubL(); unsubR(); };
  }, [xLeft, xRight, pxToValue]);

  useEffect(() => {
    setLiveValues(value);
    if (trackWidth > 0) {
       setIsClose(valueToPx(value[1]) - valueToPx(value[0]) < 85);
    }
  }, [value, trackWidth, valueToPx]);

  const handleDragStartLeft = () => {
    if (activeTimerRef.current) clearTimeout(activeTimerRef.current);
    setActiveThumb('left');
  };

  const handleDragEndLeft = () => {
    activeTimerRef.current = setTimeout(() => setActiveThumb(null), 350);
    const px = xLeft.get();
    let newVal = pxToValue(px);
    if (newVal > value[1]) newVal = value[1]; // limit
    onChange([newVal, value[1]]);
  };

  const handleDragStartRight = () => {
    if (activeTimerRef.current) clearTimeout(activeTimerRef.current);
    setActiveThumb('right');
  };

  const handleDragEndRight = () => {
    activeTimerRef.current = setTimeout(() => setActiveThumb(null), 350);
    const px = xRight.get();
    let newVal = pxToValue(px);
    if (newVal < value[0]) newVal = value[0]; // limit
    onChange([value[0], newVal]);
  };

  // Derived styling for the active track
  const activeLeft = useTransform(xLeft, (x) => `${Math.max(0, x)}px`);
  const activeWidth = useTransform([xLeft, xRight], ([l, r]) => `${Math.max(0, (r as number) - (l as number))}px`);

  // Ticks calculation
  const tickCount = Math.floor((max - min) / step);
  const ticks = Array.from({ length: tickCount + 1 }).map((_, i) => min + i * step);

  return (
    <div style={{ padding: '44px 10px 24px 10px', width: '100%', userSelect: 'none', position: 'relative' }}>
      <div 
        ref={trackRef} 
        style={{ 
          height: '4px', 
          backgroundColor: 'rgba(0,0,0,0.1)', 
          borderRadius: '2px', 
          position: 'relative',
          width: '100%' 
        }}
      >
        {/* Ticks removed */}

        {/* Milestone Labels */}
        {trackWidth > 0 && milestones && milestones.map((m, i) => {
          const leftPx = valueToPx(m.value);
          return (
            <div 
              key={`m-${i}`}
              style={{
                position: 'absolute',
                left: `${leftPx}px`,
                top: '14px',
                transform: 'translateX(-50%)',
                color: '#8a8782',
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.05em'
              }}
            >
              {m.label}
            </div>
          );
        })}

        {/* Active Track Highlight */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: activeLeft,
            width: activeWidth,
            backgroundColor: '#758b85', // Matches active radio color
            borderRadius: '2px',
          }}
        />

        {/* Left Thumb */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: xRight.get() }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleDragStartLeft}
          onDragEnd={handleDragEndLeft}
          style={{
            x: xLeft,
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '20px',
            height: '20px',
            backgroundColor: '#fff', 
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '50%',
            boxShadow: activeThumb === 'left' ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 5px rgba(0,0,0,0.1)',
            transform: 'translate(-50%, -50%)',
            cursor: 'grab',
            zIndex: activeThumb === 'left' ? 10 : 1,
            touchAction: 'none'
          }}
          whileHover={{ scale: 1.1 }}
          whileDrag={{ cursor: 'grabbing', scale: 1.15 }}
        >
           {/* Left Tooltip */}
           <motion.div
             initial={{ opacity: 0, scale: 0.85, y: -15 }}
             animate={{ 
               opacity: activeThumb === 'left' && !isClose ? 1 : 0, 
               scale: activeThumb === 'left' && !isClose ? 1 : 0.85,
               y: activeThumb === 'left' && !isClose ? -35 : -15 
             }}
             transition={{ type: 'spring', stiffness: 500, damping: 30 }}
             style={{
               position: 'absolute',
               top: 0,
               left: '50%',
               transform: 'translateX(-50%)',
               backgroundColor: '#1a1a1a',
               color: '#fff',
               padding: '4px 10px',
               borderRadius: '6px',
               fontSize: '0.8rem',
               fontWeight: 600,
               whiteSpace: 'nowrap',
               pointerEvents: 'none',
               boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
             }}
           >
             {formatLabel(liveValues[0])}
             {/* Tooltip caret */}
             <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #1a1a1a' }} />
           </motion.div>
        </motion.div>

        {/* Right Thumb */}
        <motion.div
          drag="x"
          dragConstraints={{ left: xLeft.get(), right: trackWidth }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleDragStartRight}
          onDragEnd={handleDragEndRight}
          style={{
            x: xRight,
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '20px',
            height: '20px',
            backgroundColor: '#fff',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '50%',
            boxShadow: activeThumb === 'right' ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 5px rgba(0,0,0,0.1)',
            transform: 'translate(-50%, -50%)',
            cursor: 'grab',
            zIndex: activeThumb === 'right' ? 10 : 1,
            touchAction: 'none'
          }}
          whileHover={{ scale: 1.1 }}
          whileDrag={{ cursor: 'grabbing', scale: 1.15 }}
        >
          {/* Right Tooltip */}
          <motion.div
             initial={{ opacity: 0, scale: 0.85, y: -15 }}
             animate={{ 
               opacity: activeThumb === 'right' && !isClose ? 1 : 0, 
               scale: activeThumb === 'right' && !isClose ? 1 : 0.85,
               y: activeThumb === 'right' && !isClose ? -35 : -15 
             }}
             transition={{ type: 'spring', stiffness: 500, damping: 30 }}
             style={{
               position: 'absolute',
               top: 0,
               left: '50%',
               transform: 'translateX(-50%)',
               backgroundColor: '#1a1a1a',
               color: '#fff',
               padding: '4px 10px',
               borderRadius: '6px',
               fontSize: '0.8rem',
               fontWeight: 600,
               whiteSpace: 'nowrap',
               pointerEvents: 'none',
               boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
             }}
           >
             {formatLabel(liveValues[1])}
             <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #1a1a1a' }} />
           </motion.div>
        </motion.div>

        {/* Merged Dual Tooltip */}
        <motion.div
           style={{
             position: 'absolute',
             top: '-35px',
             left: mergedX,
             pointerEvents: 'none',
             zIndex: 20
           }}
           initial={{ opacity: 0, scale: 0.85, y: 20 }}
           animate={{ 
             opacity: activeThumb !== null && isClose ? 1 : 0, 
             scale: activeThumb !== null && isClose ? 1 : 0.85,
             y: activeThumb !== null && isClose ? 0 : 20
           }}
           transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
           <motion.div style={{
             transform: mergedTooltipTransform,
             backgroundColor: '#1a1a1a',
             color: '#fff',
             padding: '4px 12px',
             borderRadius: '6px',
             fontSize: '0.8rem',
             fontWeight: 600,
             whiteSpace: 'nowrap',
             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
             display: 'flex',
             alignItems: 'center',
             gap: '6px'
           }}>
             <span>{formatLabel(liveValues[0])}</span>
             <span style={{ color: 'rgba(255,255,255,0.5)' }}>—</span>
             <span>{formatLabel(liveValues[1])}</span>
             <motion.div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: mergedCaretTransform, width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #1a1a1a' }} />
           </motion.div>
        </motion.div>

      </div>

      {/* Editable Inputs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #e0ddd8', borderRadius: '24px', padding: '6px 12px', gap: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
           <span style={{ fontSize: '0.85rem', color: '#8a8782', fontWeight: 500 }}>Min: ₹</span>
           <input
             value={minInput}
             onChange={(e) => setMinInput(e.target.value)}
             onFocus={() => setIsMinFocused(true)}
             onBlur={() => {
               setIsMinFocused(false);
               handleInputCommit('min', minInput);
             }}
             onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.blur(); } }}
             style={{ border: 'none', outline: 'none', width: '50px', fontSize: '0.85rem', color: '#1a1a1a', fontWeight: 600, background: 'transparent', padding: 0 }}
           />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #e0ddd8', borderRadius: '24px', padding: '6px 12px', gap: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
           <span style={{ fontSize: '0.85rem', color: '#8a8782', fontWeight: 500 }}>Max: ₹</span>
           <input
             value={maxInput}
             onChange={(e) => setMaxInput(e.target.value)}
             onFocus={() => setIsMaxFocused(true)}
             onBlur={() => {
               setIsMaxFocused(false);
               handleInputCommit('max', maxInput);
             }}
             onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.blur(); } }}
             style={{ border: 'none', outline: 'none', width: '60px', fontSize: '0.85rem', color: '#1a1a1a', fontWeight: 600, background: 'transparent', padding: 0 }}
           />
        </div>
      </div>
    </div>
  );
};
