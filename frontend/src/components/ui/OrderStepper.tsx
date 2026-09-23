"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Package, Truck, Home } from 'lucide-react';

export interface Step {
  id: string;
  label: string;
  date: string;
  icon: React.ElementType;
}

const defaultSteps: Step[] = [
  { id: 'placed', label: 'Placed', date: '22 Sept, 12:48 pm', icon: Clock },
  { id: 'confirmed', label: 'Confirmed', date: '22 Sept, 12:50 pm', icon: CheckCircle },
  { id: 'packed', label: 'Packed', date: '22 Sept, 12:50 pm', icon: Package },
  { id: 'shipped', label: 'Shipped', date: '22 Sept, 12:50 pm', icon: Truck },
  { id: 'delivered', label: 'Delivered', date: '22 Sept, 12:50 pm', icon: Home },
];

const customEase = [0.16, 1, 0.3, 1];
const segmentDuration = 0.5;

interface OrderStepperProps {
  currentStepIndex?: number;
  steps?: Step[];
}

export const OrderStepper: React.FC<OrderStepperProps> = ({ 
  currentStepIndex = 4, 
  steps = defaultSteps 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-8 font-sans">
      <div className="relative flex justify-between items-start w-full">
        
        {/* Background inactive line */}
        <div className="absolute top-[20px] left-[10%] right-[10%] h-[2px] bg-[#E5E2DC] z-0" />

        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const delay = index * segmentDuration;

          return (
            <div key={step.id} className="relative flex flex-col items-center flex-1">
              
              {/* Connecting line to the left of the current node */}
              {index > 0 && (
                <div className="absolute top-[20px] left-[-50%] right-[50%] h-[2px] overflow-hidden z-10">
                  <motion.div 
                    className="w-full h-full bg-[#E88D4D]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ 
                      duration: segmentDuration, 
                      delay: (index - 1) * segmentDuration,
                      ease: "linear" // Linear works better for continuous connecting lines
                    }}
                    style={{ originX: 0 }}
                  />
                </div>
              )}

              {/* Node container */}
              <div className="relative flex items-center justify-center mb-3">
                {/* Pulse ring for active step */}
                {isCurrent && (
                  <motion.div
                    className="absolute rounded-full bg-[#E88D4D] opacity-20"
                    style={{ width: '60px', height: '60px' }}
                    initial={{ scale: 0.8, opacity: 0.4 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: delay + 0.2
                    }}
                  />
                )}

                {/* Circle */}
                <motion.div
                  className="flex items-center justify-center w-[40px] h-[40px] rounded-full z-20 relative"
                  initial={{ 
                    scale: 0.8,
                    backgroundColor: '#E5E2DC'
                  }}
                  animate={{
                    scale: isCompleted ? [0.8, 1.1, 1.0] : 1,
                    backgroundColor: isCompleted ? '#E88D4D' : '#E5E2DC',
                  }}
                  transition={{
                    duration: 0.6,
                    delay: isCompleted ? delay : 0,
                    ease: customEase
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: isCompleted ? 1 : 0,
                      opacity: isCompleted ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: isCompleted ? delay + 0.1 : 0,
                      ease: customEase
                    }}
                  >
                    <step.icon 
                      size={20} 
                      className={isCompleted ? "text-white" : "text-gray-400"} 
                      strokeWidth={2}
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Labels */}
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ y: 6, opacity: 0 }}
                animate={{
                  y: isCompleted ? 0 : 6,
                  opacity: isCompleted ? 1 : 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: isCompleted ? delay + 0.2 : 0,
                  ease: customEase
                }}
              >
                <span className={`text-sm font-semibold mb-1 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </span>
                <span className={`text-xs ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                  {step.date.split(',')[0]},
                </span>
                <span className={`text-xs ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                  {step.date.split(',')[1]?.trim()}
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
