'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useWeatherStore } from '../store';
import LocationCard from './LocationCard';

export default function WeatherCarousel() {
  const { savedLocations, activeLocationId, setActiveLocation } = useWeatherStore();
  const [direction, setDirection] = useState(0);
  
  const currentIndex = savedLocations.findIndex(loc => loc.id === activeLocationId);
  const [showAddLocation, setShowAddLocation] = useState(false);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= 0 && newIndex < savedLocations.length) {
      setDirection(newDirection);
      setActiveLocation(savedLocations[newIndex].id);
    }
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < savedLocations.length - 1;

  return (
    <div className="relative h-full overflow-hidden">
      {/* Main Carousel Container */}
      <div className="relative h-full flex items-center justify-center">
        {/* Left Gradient Fade */}
        {canGoPrev && (
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black/30 to-transparent z-10 pointer-events-none" />
        )}

        {/* Right Gradient Fade */}
        {canGoNext && (
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black/30 to-transparent z-10 pointer-events-none" />
        )}

        {/* Previous Location Preview (Faded) */}
        {canGoPrev && (
          <div className="absolute left-4 opacity-30 scale-75 pointer-events-none z-0">
            <div className="w-64 h-96 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10" />
          </div>
        )}

        {/* Next Location Preview (Faded) */}
        {canGoNext && (
          <div className="absolute right-4 opacity-30 scale-75 pointer-events-none z-0">
            <div className="w-64 h-96 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10" />
          </div>
        )}

        {/* Current Location Card */}
        <div className="relative w-full max-w-md h-full flex items-center justify-center px-6">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeLocationId}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="absolute w-full"
            >
              <LocationCard location={savedLocations[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {canGoPrev && (
          <button
            onClick={() => paginate(-1)}
            className="absolute left-2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/20 transition-all"
            aria-label="Previous location"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
        )}

        {canGoNext && (
          <button
            onClick={() => paginate(1)}
            className="absolute right-2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/20 transition-all"
            aria-label="Next location"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        )}
      </div>

      {/* Location Indicator Dots */}
      {savedLocations.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {savedLocations.map((location, index) => (
            <button
              key={location.id}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setActiveLocation(location.id);
              }}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-8 h-2 bg-white rounded-full'
                  : 'w-2 h-2 bg-white/40 rounded-full hover:bg-white/60'
              }`}
              aria-label={`Go to ${location.city}`}
            />
          ))}
        </div>
      )}

      {/* Add Location Button */}
      <button
        onClick={() => setShowAddLocation(true)}
        className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/20 transition-all"
        aria-label="Add location"
      >
        <Plus size={18} className="text-white" />
      </button>
    </div>
  );
}
