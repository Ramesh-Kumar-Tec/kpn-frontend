'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import RunningPillBadge from '@/components/ui/RunningPillBadge';
import FadeIn from '@/components/animation/FadeIn';
import MeetingMultiPhotoCarousel from '@/components/ui/MeetingMultiPhotoCarousel';
import { getCelebrations, CelebrationItem, fallbackCelebrations } from '@/lib/cmsClient';
import {
  Sparkles,
  Calendar,
  Maximize2,
  X,
  ChevronRight,
  ChevronLeft,
  PartyPopper,
  Compass,
  ArrowRight,
  Layers,
  Users,
} from 'lucide-react';

const CATEGORIES = ['All', 'Trip', 'Office', 'Launch', 'Milestone', 'Festival', 'Meeting'];

export default function CelebrationsPage() {
  const [celebrations, setCelebrations] = useState<CelebrationItem[]>(fallbackCelebrations);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState<{ item: CelebrationItem; activeIndex: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCelebrations();
        if (data && data.length > 0) {
          setCelebrations(data);
        } else {
          setCelebrations(fallbackCelebrations);
        }
      } catch (err) {
        console.warn('Using fallback celebrations data');
        setCelebrations(fallbackCelebrations);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Close lightbox on Escape key & arrow keys for gallery navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
      if (lightboxItem) {
        const gallery =
          lightboxItem.item.gallery && lightboxItem.item.gallery.length > 0
            ? lightboxItem.item.gallery
            : [lightboxItem.item.image];
        if (e.key === 'ArrowRight' && gallery.length > 1) {
          setLightboxItem((prev) =>
            prev ? { ...prev, activeIndex: (prev.activeIndex + 1) % gallery.length } : null
          );
        }
        if (e.key === 'ArrowLeft' && gallery.length > 1) {
          setLightboxItem((prev) =>
            prev ? { ...prev, activeIndex: (prev.activeIndex - 1 + gallery.length) % gallery.length } : null
          );
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem]);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (lightboxItem) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [lightboxItem]);

  const filteredItems = useMemo(() => {
    let items = celebrations;
    if (selectedCategory !== 'All') {
      items = celebrations.filter((item) => {
        const cat = (item.category || '').toLowerCase().trim();
        const selected = selectedCategory.toLowerCase().trim();
        if (selected === 'meeting') {
          return cat === 'meeting' || item.title.toLowerCase().includes('meeting');
        }
        return cat === selected;
      });
    }
    // Sort by order asc, then year/date
    return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [celebrations, selectedCategory]);

  const isMeetingsTab = selectedCategory === 'Meeting';

  return (
    <>
      <Navbar variant="hero" />

      {/* Hero Section */}
      <InnerPageHero
        title="Ceremonies & Celebrations"
        breadcrumb="Ceremonies & Celebrations"
        description="A vibrant tribute to the milestones, annual strategic meetings, joyful retreats, and team accomplishments that fuel the spirit of KPN Promoters."
        image="/images/celebrations/goa_trip_2025.jpeg"
      />

      {/* Main Content Section */}
      <section className="relative bg-gradient-to-b from-white via-slate-50/50 to-white px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1450px]">
          {/* Section Intro */}
          <FadeIn direction="up" className="mx-auto max-w-[900px] text-center">
            <RunningPillBadge text="MOMENTS, MEETINGS & MILESTONES" />

            <h1 className="mt-8 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-[#29247c] sm:text-5xl lg:text-6xl">
              Celebrating Memories,
              <br />
              <span className="text-[#f12131]">Together as One Family</span>
            </h1>

            <p className="mx-auto mt-6 max-w-[720px] text-base sm:text-lg font-medium leading-relaxed text-slate-600">
              Beyond engineering top residential communities, KPN Promoters thrives on the bonds of
              our team, associates, and homeowners. Explore our annual meetings, travel adventures, office inaugurations,
              and festive gatherings.
            </p>

            {/* Filter Pills */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const label =
                  cat === 'All'
                    ? 'All Celebrations'
                    : cat === 'Meeting'
                    ? 'Meetings'
                    : cat === 'Office'
                    ? 'Offices'
                    : `${cat}s`;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-5 py-2 text-xs font-black transition-all shadow-xs cursor-pointer ${
                      isActive
                        ? 'bg-[#29247c] text-white shadow-md shadow-[#29247c]/25 scale-105'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-[#29247c]/40 hover:text-[#29247c]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </FadeIn>

          {/* Main Content: Meetings View vs Standard Category View */}
          <div className="mt-16 sm:mt-20">
            {isLoading ? (
              <div className="py-20 text-center text-sm font-bold text-slate-400 animate-pulse">
                Loading moments & memories...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-20 text-center">
                <PartyPopper className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p className="text-base font-extrabold text-slate-700">No moments found in this category</p>
                <p className="text-xs text-slate-400 mt-1">Please explore our other categories above.</p>
              </div>
            ) : isMeetingsTab ? (
              /* DEDICATED MEETINGS MULTI-PHOTO AUTO-SLIDING CAROUSEL VIEW (Matching Screenshot Reference) */
              <div className="space-y-12">
                {filteredItems.map((meetingItem, meetingIdx) => (
                  <MeetingMultiPhotoCarousel
                    key={meetingItem._id || meetingItem.id || meetingIdx}
                    meeting={meetingItem}
                    onImageClick={(imgUrl, photoIdx) =>
                      setLightboxItem({ item: meetingItem, activeIndex: photoIdx })
                    }
                  />
                ))}
              </div>
            ) : (
              /* STANDARD 3-COLUMN CARD GRID VIEW FOR ALL OTHER CATEGORIES */
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item, idx) => (
                  <div
                    key={item._id || item.id || idx}
                    onClick={() => setLightboxItem({ item, activeIndex: 0 })}
                    className="group relative flex flex-col h-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[20px] bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Top floating badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                          {item.category || 'Event'}
                        </span>
                        {item.year && (
                          <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-black text-slate-800 shadow-xs">
                            {item.year}
                          </span>
                        )}
                      </div>

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#29247c] shadow-lg backdrop-blur-xs group-hover:scale-110 transition-transform">
                          <Maximize2 className="h-5 w-5" />
                        </div>
                      </div>
                    </div>

                    {/* Content Card Body */}
                    <div className="flex flex-1 flex-col justify-between p-3 pt-5">
                      <div>
                        {item.date && (
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1.5">
                            <Calendar className="h-3 w-3 text-[#f12131]" />
                            <span>{item.date}</span>
                          </div>
                        )}

                        <h3 className="text-xl font-black tracking-tight text-[#29247c] group-hover:text-[#f12131] transition-colors leading-snug">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-xs sm:text-sm font-semibold text-[#f12131] leading-relaxed">
                          {item.subheading}
                        </p>

                        {item.description && (
                          <p className="mt-2.5 text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#29247c]">
                        <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          View Moment <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">
                          KPN Memories
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* High-Res Lightbox Modal with Multi-Photo Navigation */}
      {lightboxItem && (() => {
        const item = lightboxItem.item;
        const gallery = item.gallery && item.gallery.length > 0 ? item.gallery : [item.image];
        const activeIdx = lightboxItem.activeIndex % gallery.length;
        const currentPhoto = gallery[activeIdx];

        return (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
              onClick={() => setLightboxItem(null)}
            />

            {/* Modal Container */}
            <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[32px] bg-slate-900 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all shadow-lg cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* High Res Image with Gallery Controls */}
              <div className="relative max-h-[70vh] min-h-[300px] w-full overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={currentPhoto}
                  alt={`${item.title} - ${activeIdx + 1}`}
                  className="max-h-[70vh] w-auto max-w-full object-contain transition-all duration-300"
                />

                {/* Lightbox Prev / Next for Multi-Photo */}
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxItem({
                          item,
                          activeIndex: (activeIdx - 1 + gallery.length) % gallery.length,
                        });
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-all shadow-lg cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxItem({
                          item,
                          activeIndex: (activeIdx + 1) % gallery.length,
                        });
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-all shadow-lg cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Photo Counter Pill */}
                    <div className="absolute top-5 left-5 z-20 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-bold text-white">
                      <Layers className="h-3.5 w-3.5 text-[#f12131]" />
                      <span>
                        Photo {activeIdx + 1} of {gallery.length}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Caption Footer */}
              <div className="p-6 sm:p-8 bg-slate-950/90 text-white border-t border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="rounded-full bg-[#f12131] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    {item.category || 'Celebration'}
                  </span>
                  {item.date && (
                    <span className="text-xs text-slate-400 font-bold">
                      {item.date} {item.year ? `(${item.year})` : ''}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm font-bold text-red-400">
                  {item.subheading}
                </p>

                {item.description && (
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-3xl">
                    {item.description}
                  </p>
                )}

                {/* Gallery Thumbnail Strip in Lightbox */}
                {gallery.length > 1 && (
                  <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
                    {gallery.map((thumb, tIdx) => (
                      <button
                        key={tIdx}
                        type="button"
                        onClick={() => setLightboxItem({ item, activeIndex: tIdx })}
                        className={`relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                          tIdx === activeIdx
                            ? 'border-[#f12131] scale-105 ring-2 ring-[#f12131]/40'
                            : 'border-white/20 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={thumb} alt="thumbnail" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
