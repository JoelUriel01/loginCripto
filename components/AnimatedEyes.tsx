'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedEyesProps {
  isPasswordFocused?: boolean;
}

export default function AnimatedEyes({ isPasswordFocused = false }: AnimatedEyesProps) {
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(isPasswordFocused);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isFocused) return;

      const eyes = [leftEyeRef.current, rightEyeRef.current];
      
      eyes.forEach((eye) => {
        if (!eye) return;
        
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(
          e.clientY - eyeCenterY,
          e.clientX - eyeCenterX
        );
        
        const distance = Math.min(
          Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 10,
          12
        );
        
        const pupil = eye.querySelector('.pupil') as HTMLDivElement;
        if (pupil) {
          pupil.style.transform = `translate(${
            Math.cos(angle) * distance
          }px, ${Math.sin(angle) * distance}px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isFocused]);

  return (
    <div className="flex justify-center gap-8 mb-8">
      {/* Ojo izquierdo */}
      <div 
        ref={leftEyeRef}
        className="relative w-24 h-24 bg-white rounded-full border-4 border-gray-300 overflow-hidden"
      >
        <div className="pupil absolute top-1/2 left-1/2 w-10 h-10 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out">
          <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div 
          className={`absolute inset-0 bg-pink-100 transition-all duration-300 ${
            isFocused ? 'h-full' : 'h-0'
          }`}
        ></div>
      </div>

      {/* Ojo derecho */}
      <div 
        ref={rightEyeRef}
        className="relative w-24 h-24 bg-white rounded-full border-4 border-gray-300 overflow-hidden"
      >
        <div className="pupil absolute top-1/2 left-1/2 w-10 h-10 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out">
          <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div 
          className={`absolute inset-0 bg-pink-100 transition-all duration-300 ${
            isFocused ? 'h-full' : 'h-0'
          }`}
        ></div>
      </div>
    </div>
  );
}
