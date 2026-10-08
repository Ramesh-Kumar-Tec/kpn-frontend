'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Calendar, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { CelebrationItem } from '@/lib/cmsClient';

interface MeetingMultiPhotoCarouselProps {
  meeting: CelebrationItem;
  onImageClick?: (imageUrl: string, index: number) => void;
}

export default function MeetingMultiPhotoCarousel({
  meeting,
  onImageClick,
}: MeetingMultiPhotoCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract all gallery photos or fallback to main image
  const photos =
    Array.isArray(meeting.gallery) && meeting.gallery.length > 0
      ? meeting.gallery
      : meeting.image
      ? [meeting.image]
      : [];

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cardWidth = 320; // approximate card width + gap
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(Math.min(Math.max(index, 0), photos.length - 1));
  };

  const scrollNext = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    
    // If reached the end, loop back to start
    if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 20) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    if (container.scrollLeft <= 20) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  // Auto moving effect
  useEffect(() => {
    if (photos.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      scrollNext();
    }, 3200);

    return () => clearInterval(interval);
  }, [isHovered, photos.length]);

  useEffect(() => {
    checkScroll();
  }, [photos]);

  return (
    <div className="relative overflow-hidden rounded-[36px] border border-slate-200/90 bg-white p-6 sm:p-10 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#29247c]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-72 w-72 rounded-full bg-gradient-to-tr from-[#f12131]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Meeting Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
        <div className="max-w-3xl space-y-2">
          {/* Top Tag Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#29247c] px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-xs">
              <Sparkles className="h-3 w-3 text-[#f12131]" />
              <span>{meeting.category || 'Meeting'}</span>
            </span>

            {meeting.year && (
              <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-[11px] font-black text-slate-800">
                {meeting.year}
              </span>
            )}

            {meeting.date && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-100 px-3 py-1 text-[11px] font-bold text-[#f12131]">
                <Calendar className="h-3 w-3" />
                <span>{meeting.date}</span>
              </span>
            )}

            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold text-slate-600 flex items-center gap-1">
              <Layers className="h-3 w-3 text-[#29247c]" />
              <span>{photos.length} Photos in Carousel</span>
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#29247c] leading-tight pt-1">
            {meeting.title}
          </h2>

          {/* Subheading */}
          <p className="text-base sm:text-lg font-bold text-[#f12131] leading-relaxed">
            {meeting.subheading}
          </p>

          {/* Description */}
          {meeting.description && (
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
              {meeting.description}
            </p>
          )}
        </div>

        {/* Desktop Quick Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400">
          <span>Auto-moving carousel</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Multi-Photo Carousel Container with Left/Right Buttons */}
      <div
        className="relative group/carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Navigation Circular Button */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f12131] text-white shadow-xl hover:bg-[#d81928] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Previous photos"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
          </button>
        )}

        {/* Right Navigation Circular Button */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={scrollNext}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#f12131] text-white shadow-xl hover:bg-[#d81928] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Next photos"
          >
            <ChevronRight className="h-6 w-6 stroke-[2.5]" />
          </button>
        )}

        {/* Scrollable Track of Photos (Cards Row matching reference!) */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar py-2 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {photos.map((imgUrl, index) => (
            <div
              key={index}
              onClick={() => onImageClick?.(imgUrl, index)}
              className="group/card relative flex-shrink-0 w-[260px] sm:w-[300px] md:w-[320px] lg:w-[340px] overflow-hidden rounded-[24px] border border-slate-200/90 bg-slate-50 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer select-none"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src={imgUrl}
                  alt={`${meeting.title} - Photo ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-108"
                  loading="lazy"
                />

                {/* Photo Index Badge */}
                <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-white">
                  #{index + 1}
                </div>

                {/* Hover Zoom Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#29247c] shadow-lg">
                    <Maximize2 className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-4 bg-white flex items-center justify-between border-t border-slate-100 text-xs">
                <div>
                  <span className="font-extrabold text-[#29247c] line-clamp-1">
                    {meeting.title}
                  </span>
                  <span className="text-[10px] font-bold text-[#f12131]">
                    Moment {index + 1} of {photos.length}
                  </span>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 group-hover/card:bg-[#f12131] group-hover/card:text-white transition-colors">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Dots / Progress Strip */}
      {photos.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {photos.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => {
                if (!scrollContainerRef.current) return;
                const cardWidth = 320;
                scrollContainerRef.current.scrollTo({
                  left: dotIdx * cardWidth,
                  behavior: 'smooth',
                });
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                dotIdx === currentIndex
                  ? 'w-8 bg-[#f12131]'
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
              aria-label={`Jump to photo ${dotIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
