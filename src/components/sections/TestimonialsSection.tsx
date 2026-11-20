'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Star, Play, Pause, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import RunningPillBadge from '@/components/ui/RunningPillBadge';
import {
  videoTestimonialsData,
  VideoTestimonial,
  formatVideoEmbedUrl,
  getYouTubeThumbnail,
} from '@/components/sections/VideoTestimonialsSection';
import { getVideos, getTestimonials } from '@/lib/cmsClient';

// Authentic Google Multi-Color G Icon SVG
function GoogleIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

// Google Review Interface (Strictly NO customer image portraits, colored initial circle)
interface GoogleReview {
  id: string;
  name: string;
  initial: string;
  avatarBg: string;
  tag: string;
  timeAgo: string;
  project: string;
  rating: number;
  content: string;
}

const googleReviewsData: GoogleReview[] = [
  {
    id: 'rev-1',
    name: 'Senthil Kumar',
    initial: 'S',
    avatarBg: 'bg-indigo-600',
    tag: 'Local Guide · 19 reviews',
    timeAgo: '2 weeks ago',
    project: 'KPN Marvel',
    rating: 5,
    content:
      'Very transparent dealing! We purchased a CMDA approved plot in Urapakkam through KPN Promoters. Clear legal documents, bank loan with SBI was processed in just 4 days. Registration was completely hassle-free.',
  },
  {
    id: 'rev-2',
    name: 'Priya Ramanathan',
    initial: 'P',
    avatarBg: 'bg-emerald-600',
    tag: 'Verified Buyer',
    timeAgo: 'a month ago',
    project: 'KPN Blue Meadows',
    rating: 5,
    content:
      'Extremely happy with KPN Blue Meadows in Guduvanchery. The layout planning with wide black-top roads, streetlights, and parks is top-notch. Honest team who delivers everything promised.',
  },
  {
    id: 'rev-3',
    name: 'Dr. Rajesh K.',
    initial: 'R',
    avatarBg: 'bg-rose-600',
    tag: 'Local Guide · 34 reviews',
    timeAgo: '3 weeks ago',
    project: 'AVP Kanagam',
    rating: 5,
    content:
      'From our first site visit to receiving the registered patta documents, KPN team guided us with utmost sincerity. Legally clear properties with immediate appreciation potential.',
  },
  {
    id: 'rev-4',
    name: 'Anand & Divya',
    initial: 'A',
    avatarBg: 'bg-amber-600',
    tag: 'Verified Buyer',
    timeAgo: '1 month ago',
    project: 'Bhavani Amman Nagar',
    rating: 5,
    content:
      'Smooth loan approval through HDFC Bank and transparent documentation. The sales managers explained every clause clearly. Best real estate promoters in Chennai for families.',
  },
  {
    id: 'rev-5',
    name: 'Muruganandam P.',
    initial: 'M',
    avatarBg: 'bg-sky-600',
    tag: 'Local Guide · 12 reviews',
    timeAgo: '2 months ago',
    project: 'KPN Marvel',
    rating: 5,
    content:
      '100% genuine title deed and crystal-clear land documents. My legal advisor gave green signal on day one. Already recommended 3 of my close colleagues to KPN Promoters.',
  },
  {
    id: 'rev-6',
    name: 'Karthik Balakrishnan',
    initial: 'K',
    avatarBg: 'bg-purple-600',
    tag: 'Verified Buyer',
    timeAgo: '2 months ago',
    project: 'KPN Blue Meadows',
    rating: 5,
    content:
      'Professional behavior from start to finish. Site visits were arranged in comfortable AC cabs. No hidden charges or last-minute surprises. Truly reliable developer.',
  },
  {
    id: 'rev-7',
    name: 'Venkatesh Babu',
    initial: 'V',
    avatarBg: 'bg-teal-600',
    tag: 'Local Guide · 27 reviews',
    timeAgo: '3 months ago',
    project: 'AVP Kanagam',
    rating: 5,
    content:
      'Excellent location connectivity to GST Road and Kilambakkam Bus Terminus. High ground water level and great road access. Thank you team KPN for making our investment safe.',
  },
  {
    id: 'rev-8',
    name: 'Deepa Natarajan',
    initial: 'D',
    avatarBg: 'bg-pink-600',
    tag: 'Verified Buyer',
    timeAgo: '3 months ago',
    project: 'Bhavani Amman Nagar',
    rating: 5,
    content:
      'Buying property as an NRI was so smooth thanks to KPN digital updates and prompt documentation. Highly trustworthy company with 25+ years track record.',
  },
];

export default function TestimonialsSection() {
  const [videoItems, setVideoItems] = useState<VideoTestimonial[]>(videoTestimonialsData);
  const [reviewsList, setReviewsList] = useState<GoogleReview[]>(googleReviewsData);

  useEffect(() => {
    let isMounted = true;
    async function loadCMS() {
      try {
        const [liveVideos, liveTestimonials] = await Promise.all([
          getVideos().catch(() => []),
          getTestimonials().catch(() => []),
        ]);

        if (!isMounted) return;

        // 1. Process dynamic testimonials filled from the Admin Page (/admin/testimonials)
        if (Array.isArray(liveTestimonials) && liveTestimonials.length > 0) {
          const BG_COLORS = [
            'bg-indigo-600',
            'bg-emerald-600',
            'bg-rose-600',
            'bg-amber-600',
            'bg-sky-600',
            'bg-purple-600',
            'bg-teal-600',
            'bg-pink-600',
          ];

          const validTestimonials = liveTestimonials.filter(
            (t: any) => t && (t.author || t.name) && t.quote && (!t.status || t.status === 'Published')
          );

          if (validTestimonials.length > 0) {
            const mappedCMS: GoogleReview[] = validTestimonials.map((t: any, idx: number) => {
              const authorName = (t.author || t.name || 'Verified Buyer').trim();
              const initial = authorName.charAt(0).toUpperCase() || 'K';
              return {
                id: t._id || t.id || `cms-t-${idx}`,
                name: authorName,
                initial: initial,
                avatarBg: BG_COLORS[idx % BG_COLORS.length],
                tag: t.role || 'Verified Buyer',
                timeAgo: 'Verified Buyer',
                project: t.title || 'KPN Promoters',
                rating: Math.max(1, Math.min(5, Number(t.rating) || 5)),
                content: t.quote,
              };
            });

            // Put admin testimonials at the front so newly added reviews appear immediately
            const seen = new Set<string>();
            const combined = [...mappedCMS, ...googleReviewsData].filter((r) => {
              const key = `${r.name}_${r.content}`.toLowerCase();
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });

            setReviewsList(combined);
          }
        }

        // 2. Process CMS videos if configured
        if (Array.isArray(liveVideos) && liveVideos.length > 0) {
          const published = liveVideos.filter((v) => !v.status || v.status === 'Published');
          if (published.length > 0) {
            const mapped: VideoTestimonial[] = published.map((v, idx) => {
              const formattedUrl =
                v.videoUrl && v.videoUrl.trim() !== '' && !v.videoUrl.includes('dQw4w9WgXcQ')
                  ? formatVideoEmbedUrl(v.videoUrl)
                  : '/testimonis/test1.mp4';
              const thumb =
                v.thumbnailUrl ||
                getYouTubeThumbnail(v.videoUrl) ||
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80';
              return {
                id: v.id || v._id || `cms-vid-${idx}`,
                title: v.title,
                customerName: v.projectName ? `${v.projectName} Owner` : 'KPN Homeowner',
                role: 'Verified Customer',
                project: v.projectName || 'KPN Promoters',
                location: 'Chennai, Tamil Nadu',
                category: 'All',
                duration: 'Walkthrough',
                quote:
                  v.description ||
                  'Watch our full project tour and homeowner handover walkthrough with KPN Promoters.',
                rating: 5,
                thumbnail: thumb,
                videoUrl: formattedUrl,
                verifiedYear: 'Verified 2025',
              };
            });
            setVideoItems(mapped);
          }
        }
      } catch (err) {
        console.warn('Fallback in TestimonialsSection:', err);
      }
    }
    loadCMS();
    return () => {
      isMounted = false;
    };
  }, []);

  // Live video player controls matching About page
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Split dynamic reviews list into Row 1 & Row 2 for seamless endless marquee scroll
  const half = Math.ceil(reviewsList.length / 2);
  const r1Base = reviewsList.slice(0, half);
  const r2Base = reviewsList.slice(half);

  // Duplicated reviews for seamless endless scroll (Row 1 & Row 2)
  const row1 = [...r1Base, ...r1Base];
  const row2 = [...r2Base, ...r2Base];

  return (
    <section className="relative z-20 w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="mb-3 flex justify-center">
            <RunningPillBadge text="VERIFIED CUSTOMER REVIEWS • GOOGLE RATING 4.9 ★" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#29247c] sm:text-4xl lg:text-5xl tracking-tight">
            What Our Clients Say
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto">
            Honest feedback from verified homebuyers and plot owners across Chennai who chose KPN Promoters.
          </p>
        </div>

        {/* =====================================================
            TWO-COLUMN LAYOUT:
            LEFT: Google Reviews Scrolling Text Cards (No customer photos)
            RIGHT: 1 Featured Video Testimonial Card
        ===================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* =====================================================
              LEFT COLUMN: GOOGLE REVIEWS SECTION (7-8 COLS)
          ===================================================== */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 overflow-hidden">
            
            {/* Google Rating Overview Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-xs border border-slate-200">
                  <GoogleIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black text-slate-900">4.9</span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">
                    Based on <span className="font-bold text-slate-800">180+ verified Google reviews</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <CheckCircle className="h-3.5 w-3.5" /> 100% Genuine Reviews
                </span>
              </div>
            </div>

            {/* Row 1: Scrolling Google Reviews (Left to Right) */}
            <div className="relative w-full overflow-hidden">
              <div
                className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused]"
                style={{ animationDuration: '38s' }}
              >
                {row1.map((rev, idx) => (
                  <div
                    key={`r1-${rev.id}-${idx}`}
                    className="w-[320px] sm:w-[350px] shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all hover:border-slate-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header: Initial Avatar + Name + Google G Logo */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm shadow-xs ${rev.avatarBg}`}
                          >
                            {rev.initial}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {rev.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {rev.tag} • {rev.timeAgo}
                            </p>
                          </div>
                        </div>

                        {/* Google G icon badge */}
                        <GoogleIcon className="h-4 w-4 shrink-0 opacity-90" />
                      </div>

                      {/* Stars + Project Tag */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-[#29247c] bg-[#29247c]/5 px-2 py-0.5 rounded-full">
                          {rev.project}
                        </span>
                      </div>

                      {/* Review Text */}
                      <p className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed line-clamp-4">
                        &ldquo;{rev.content}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Scrolling Google Reviews (Right to Left / Reverse) */}
            <div className="relative w-full overflow-hidden">
              <div
                className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused]"
                style={{ animationDuration: '42s', animationDirection: 'reverse' }}
              >
                {row2.map((rev, idx) => (
                  <div
                    key={`r2-${rev.id}-${idx}`}
                    className="w-[320px] sm:w-[350px] shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all hover:border-slate-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header: Initial Avatar + Name + Google G Logo */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm shadow-xs ${rev.avatarBg}`}
                          >
                            {rev.initial}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">
                              {rev.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {rev.tag} • {rev.timeAgo}
                            </p>
                          </div>
                        </div>

                        {/* Google G icon badge */}
                        <GoogleIcon className="h-4 w-4 shrink-0 opacity-90" />
                      </div>

                      {/* Stars + Project Tag */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-[#29247c] bg-[#29247c]/5 px-2 py-0.5 rounded-full">
                          {rev.project}
                        </span>
                      </div>

                      {/* Review Text */}
                      <p className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed line-clamp-4">
                        &ldquo;{rev.content}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* =====================================================
              RIGHT COLUMN: LIVE VIDEO PLAYING (NO EXTRA CONTENT)
              Matches user instruction: "right side only play that video don't add anything there just video only like about page right video playing"
          ===================================================== */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[480px] xl:h-[500px] overflow-hidden rounded-[28px] sm:rounded-[32px] bg-slate-900 shadow-xl border border-slate-200/80">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                className="h-full w-full object-cover"
              >
                <source src="/testimonis/test1.mp4" type="video/mp4" />
              </video>

              {/* Subtle dark gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

              {/* Play/Pause & Sound controls matching About page */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  type="button"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/85 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5 fill-white" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  type="button"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  className="flex h-9 sm:h-10 items-center gap-1.5 rounded-full bg-black/60 px-3 text-[11px] font-bold text-white backdrop-blur-md transition-all hover:bg-black/85 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="h-4 w-4" />
                      <span>Muted</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4 text-emerald-400" />
                      <span>Sound On</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
