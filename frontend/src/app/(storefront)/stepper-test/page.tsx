"use client";

import React, { useState, useEffect } from 'react';
import { OrderStepper } from '@/components/ui/OrderStepper';

export default function StepperTestPage() {
  const [step, setStep] = useState(-1);

  useEffect(() => {
    // Auto-play to step 4 on load to demonstrate the animation
    const timer = setTimeout(() => {
      setStep(4);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-5xl bg-white p-8 rounded-xl shadow-sm border border-[var(--border-light)]">
        <h1 className="text-2xl font-bold mb-8 text-center text-[var(--text-primary)]">Order Tracking Test</h1>
        
        <OrderStepper currentStepIndex={step} />

        <div className="mt-12 flex justify-center gap-4">
          <button 
            onClick={() => setStep(Math.max(0, step - 1))}
            className="px-4 py-2 bg-[var(--border-color)] text-[var(--text-primary)] rounded-md hover:opacity-85"
          >
            Previous Step
          </button>
          <button 
            onClick={() => setStep(Math.min(4, step + 1))}
            className="px-4 py-2 bg-[var(--color-golden-500)] text-[var(--color-diamond)] rounded-md hover:bg-[var(--color-golden-600)]"
          >
            Next Step
          </button>
          <button 
            onClick={() => setStep(-1)}
            className="px-4 py-2 bg-[var(--color-error-bg)] text-[var(--color-error)] rounded-md hover:opacity-85"
          >
            Reset
          </button>
          <button 
            onClick={() => setStep(4)}
            className="px-4 py-2 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-md hover:opacity-85"
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}
