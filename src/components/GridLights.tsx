'use client';

import React, { useEffect, useState } from 'react';

interface Light {
  id: number;
  isVertical: boolean;
  position: number;
  duration: number;
}

export default function GridLights() {
  const [light, setLight] = useState<Light | null>(null);

  useEffect(() => {
    const generateLight = () => {
      const id = Date.now();
      const isVertical = Math.random() > 0.5;
      
      // Calculate grid positions (40px grid)
      const maxLines = isVertical ? Math.ceil(window.innerWidth / 40) : Math.ceil(window.innerHeight / 40);
      const position = Math.floor(Math.random() * maxLines) * 40;
      
      const duration = 4 + Math.random() * 2; // 4-6s (slower)
      
      return {
        id,
        isVertical,
        position,
        duration,
      };
    };

    const spawnNewLight = () => {
      const newLight = generateLight();
      setLight(newLight);
      
      // Clear light after animation completes
      setTimeout(() => {
        setLight(null);
        // Wait a bit before spawning next light
        setTimeout(() => {
          spawnNewLight();
        }, 500 + Math.random() * 1500); // 0.5-2s wait
      }, newLight.duration * 1000);
    };

    // Start the cycle
    spawnNewLight();

    return () => setLight(null);
  }, []);

  if (!light) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        className={`absolute ${
          light.isVertical ? 'w-[2px] h-full' : 'w-full h-[2px]'
        }`}
        style={{
          [light.isVertical ? 'left' : 'top']: `${light.position}px`,
          [light.isVertical ? 'top' : 'left']: light.isVertical ? '0' : `${light.position}px`,
        }}
      >
        {/* Comet tail (tapering, behind the head) */}
        <div
          className={`absolute ${
            light.isVertical
              ? 'w-full h-[300px]'
              : 'w-[300px] h-full'
          }`}
          style={{
            animation: light.isVertical
              ? `slideDown ${light.duration}s linear`
              : `slideRight ${light.duration}s linear`,
            background: light.isVertical
              ? 'linear-gradient(to top, rgba(34, 211, 238, 0.12), rgba(34, 211, 238, 0.03), transparent)'
              : 'linear-gradient(to left, rgba(34, 211, 238, 0.12), rgba(34, 211, 238, 0.03), transparent)',
            filter: 'blur(2px)',
          }}
        />
        {/* Comet head (bright) */}
        <div
          className={`absolute ${
            light.isVertical
              ? 'w-full h-[30px]'
              : 'w-[30px] h-full'
          }`}
          style={{
            animation: light.isVertical
              ? `slideDown ${light.duration}s linear`
              : `slideRight ${light.duration}s linear`,
            background: light.isVertical
              ? 'linear-gradient(to bottom, rgba(34, 211, 238, 0.25), rgba(34, 211, 238, 0.12))'
              : 'linear-gradient(to right, rgba(34, 211, 238, 0.25), rgba(34, 211, 238, 0.12))',
            filter: 'blur(1px)',
            boxShadow: light.isVertical
              ? '0 0 10px rgba(34, 211, 238, 0.2)'
              : '0 0 10px rgba(34, 211, 238, 0.2)',
          }}
        />
      </div>
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-300px);
          }
          to {
            transform: translateY(calc(100vh + 100px));
          }
        }
        
        @keyframes slideRight {
          from {
            transform: translateX(-300px);
          }
          to {
            transform: translateX(calc(100vw + 100px));
          }
        }
      `}</style>
    </div>
  );
}
