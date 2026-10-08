'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Layers } from 'lucide-react';

interface MeetingCarouselProps {
  images: string[];
  title: string;
  category?: string;
  year?: string;
  onImageClick?: (imageUrl: string, index: number) => void;
  autoSlideInterval?: number; // ms
}

export default function MeetingCarousel({
  images,
  title,
  category = 'Meeting',
  year,
  onImageClick,
  autoSlideInterval = 3500,
}: MeetingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const validImages = images && images.length > 0 ? images : ['/images/celebrations/year_end_meeting_2023.jpeg'];
  const totalSlides = validImages.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto sliding effect
  useEffect(() => {
    if (totalSlides <= 1 || isHovered) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isHovered, totalSlides, autoSlideInterval]);

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-[22px] bg-slate-900 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="relative h-full w-full overflow-hidden">
        {validImages.map((img, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={idx}
              className={`absolute inset-0 h-full w-full transition-all duration-700 ease-in-out transform ${
                isActive
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-105 pointer-events-none z-0'
              }`}
            >
              <img
                src={img}
                alt={`${title} - Photo ${idx + 1}`}
                className="h-full w-full object-cover cursor-pointer"
                onClick={() => onImageClick?.(img, idx)}
              />
            </div>
          );
        })}
      </div>

      {/* Floating Category & Year Badges */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <span className="rounded-full bg-[#29247c]/90 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs">
          {category}
        </span>
        {year && (
          <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-black text-slate-800 shadow-xs">
            {year}
          </span>
        )}
      </div>

      {/* Floating Photo Count Badge */}
      {totalSlides > 1 && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-black text-white shadow-xs">
          <Layers className="h-3 w-3 text-[#f12131]" />
          <span>
            {currentIndex + 1} / {totalSlides}
          </span>
        </div>
      )}

      {/* Zoom / Lightbox Trigger Button */}
      <button
        onClick={() => onImageClick?.(validImages[currentIndex], currentIndex)}
        className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#29247c] shadow-lg backdrop-blur-xs opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200 cursor-pointer"
        title="View Full Size"
        aria-label="View Full Size"
      >
        <Maximize2 className="h-4 w-4" />
      </button>

      {/* Prev / Next Navigation Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/80 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/80 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Bottom Dot Indicators */}
      {totalSlides > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5">
          {validImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-5 bg-[#f12131]'
                  : 'w-1.5 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
