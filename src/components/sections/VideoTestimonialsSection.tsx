'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Star, CheckCircle, MapPin, Clock } from 'lucide-react';
import RunningPillBadge from '@/components/ui/RunningPillBadge';
import FadeIn from '@/components/animation/FadeIn';

export interface VideoTestimonial {
  id: string;
  title: string;
  customerName: string;
  role: string;
  project: string;
  location: string;
  category: 'All' | 'Villas' | 'Plots' | 'NRI';
  duration: string;
  quote: string;
  rating: number;
  thumbnail: string;
  videoUrl: string;
  verifiedYear: string;
}

export const videoTestimonialsData: VideoTestimonial[] = [
  {
    id: 'vid-1',
    title: 'From Dream to Key Handover: Our Journey with KPN',
    customerName: 'Dr. Senthil Nathan & Dr. Kavitha',
    role: 'Medical Professionals',
    project: 'KPN LeNid',
    location: 'Urapakkam, Chennai',
    category: 'Villas',
    duration: '2:15 min',
    quote: 'The craftsmanship, transparent documentation, and on-schedule handover gave our family absolute peace of mind.',
    rating: 5,
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Clean embed URL (or direct mp4)
    verifiedYear: 'Handover 2024',
  },
  {
    id: 'vid-2',
    title: 'Why We Chose KPN Marvel Township for Our Family Plot',
    customerName: 'Mr. Ramesh Sundaram & Family',
    role: 'IT Director & Architect',
    project: 'KPN Marvel Township',
    location: 'Urapakkam, Chennai',
    category: 'Plots',
    duration: '1:45 min',
    quote: 'Black-top roads, streetlights, and parks were ready before registration. Exceptional infrastructure quality.',
    rating: 5,
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    verifiedYear: 'Registered 2024',
  },
  {
    id: 'vid-3',
    title: 'Investing in Chennai Real Estate from Dubai with Confidence',
    customerName: 'Mr. Karthik Venkatesh',
    role: 'NRI Investor (Dubai)',
    project: 'KPN Hindhu Avenue',
    location: 'Guduvanchery, Chennai',
    category: 'NRI',
    duration: '2:30 min',
    quote: 'As an NRI, remote verification was seamless. The KPN executive team provided weekly photo updates and prompt assistance.',
    rating: 5,
    thumbnail: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    verifiedYear: 'NRI Investor 2025',
  },
  {
    id: 'vid-4',
    title: 'Building Our Retirement Paradise in Sri Bhavani Amman Nagar',
    customerName: 'Mrs. Meenakshi & Mr. Narayanan',
    role: 'Retired Government Officer',
    project: 'Sri Bhavani Amman Nagar Ext-II',
    location: 'Karanai Puducherry, Chennai',
    category: 'Plots',
    duration: '1:55 min',
    quote: 'Clear titles, CMDA & RERA approvals with zero hidden costs. Truly the most reliable developer we have ever worked with.',
    rating: 5,
    thumbnail: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    verifiedYear: 'Verified Owner 2024',
  },
  {
    id: 'vid-5',
    title: 'Our Independent Villa Journey at AVP Kanagam Nagar',
    customerName: 'Mr. Vignesh & Deepa',
    role: 'Software Engineers',
    project: 'AVP Kanagam Nagar',
    location: 'Chengalpattu, Chennai',
    category: 'Villas',
    duration: '2:05 min',
    quote: 'From custom interior suggestions to swift bank loan facilitation, the KPN team stood by us at every single milestone.',
    rating: 5,
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    verifiedYear: 'Handover 2025',
  },
  {
    id: 'vid-6',
    title: 'High-Growth Strategic Land Investment Experience',
    customerName: 'Mr. Arvind Swaminathan',
    role: 'Commercial Portfolio Manager',
    project: 'Blue Meadows',
    location: 'Pandur, Guduvanchery',
    category: 'Plots',
    duration: '1:40 min',
    quote: 'Proximity to Kilambakkam terminus and high appreciation potential made this the smartest land investment for our portfolio.',
    rating: 5,
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    verifiedYear: 'Verified Investor 2025',
  },
];

export default function VideoTestimonialsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);

  const categories = ['All', 'Villas', 'Plots', 'NRI'];

  const filteredVideos = activeCategory === 'All'
    ? videoTestimonialsData
    : videoTestimonialsData.filter((v) => v.category === activeCategory);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-white py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <FadeIn direction="up" className="text-center mb-14 space-y-4 flex flex-col items-center">
          <RunningPillBadge text="CUSTOMER VIDEO TESTIMONIALS" />
          <h2 className="text-4xl font-extrabold text-[#29247c] sm:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
            Real Stories, Real Trust
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-slate-500 font-medium leading-relaxed">
            Watch our proud homeowners and land investors share their authentic experiences
            with KPN Promoters across Chennai.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#f12131] text-white shadow-md shadow-red-500/25 scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {cat === 'All' ? 'All Stories' : `${cat} Stories`}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((item, index) => (
            <FadeIn key={item.id} direction="up" delay={0.08 * (index % 3)}>
              <div
                onClick={() => setActiveVideo(item)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[30px] border border-slate-200/80 bg-white p-3 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                {/* 16:9 Thumbnail Container with Play Overlay */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[24px] bg-slate-900">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108 opacity-90"
                  />

                  {/* Dark subtle gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Play Button Icon with Ping Animation on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#f12131] text-white shadow-xl shadow-red-500/40 transition-transform duration-300 group-hover:scale-115">
                      <span className="absolute inset-0 rounded-full bg-[#f12131] opacity-75 group-hover:animate-ping" />
                      <Play className="relative z-10 h-7 w-7 fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 shadow-xs border border-white/10">
                      <Clock className="h-3.5 w-3.5 text-red-400" />
                      {item.duration}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md px-3 py-1 shadow-xs border border-white/10 text-[11px]">
                      <CheckCircle className="h-3 w-3" />
                      {item.verifiedYear}
                    </span>
                  </div>

                  {/* Project Tag at bottom of thumbnail */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white/95 text-xs font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                    <span className="truncate">{item.project} • {item.location}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    {/* Golden Stars Rating */}
                    <div className="flex items-center gap-1 text-amber-400 mb-2.5">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Video Title */}
                    <h3 className="text-lg font-bold text-[#29247c] leading-snug group-hover:text-[#f12131] transition-colors duration-300 line-clamp-2">
                      “{item.title}”
                    </h3>

                    {/* Customer Quote */}
                    <p className="mt-2.5 text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  {/* Homeowner Info Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {item.customerName}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {item.role}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-[#f12131] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Watch Story →
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* =========================================================
          LIGHTBOX / VIDEO MODAL
      ========================================================= */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 md:p-10"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-[28px] bg-slate-900 border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video"
                className="absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 hover:bg-red-600 text-white transition-all duration-300 shadow-lg hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Video Player (Responsive 16:9) */}
              <div className="relative aspect-video w-full bg-black">
                {activeVideo.videoUrl.includes('youtube.com') || activeVideo.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={`${activeVideo.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                ) : (
                  <video
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* Video Details Footer */}
              <div className="p-6 sm:p-7 bg-slate-900/95 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                    {activeVideo.project} • {activeVideo.location}
                  </span>
                  <h4 className="text-xl font-black text-white">
                    {activeVideo.title}
                  </h4>
                  <p className="text-sm text-slate-300">
                    Shared by <span className="text-white font-bold">{activeVideo.customerName}</span> ({activeVideo.role})
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 text-xs font-extrabold flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {activeVideo.verifiedYear}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
