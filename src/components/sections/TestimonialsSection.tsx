'use client';

import { useEffect, useMemo, useState } from 'react';
import { Star, Play, X, CheckCircle, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  videoTestimonialsData,
  VideoTestimonial,
  formatVideoEmbedUrl,
  getYouTubeThumbnail,
} from '@/components/sections/VideoTestimonialsSection';
import { getVideos } from '@/lib/cmsClient';
import RunningPillBadge from '@/components/ui/RunningPillBadge';

interface BankingPartner {
  id: string;
  name: string;
  component: () => React.JSX.Element;
}

const bankingPartners: BankingPartner[] = [
  {
    id: 'lic-hfl',
    name: 'LIC Housing Finance Ltd',
    component: function LicHflLogo() {
      return (
        <div className="flex flex-col items-center justify-center select-none">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 60 50" className="h-8 w-10 fill-[#0e3e7e]" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 2 L56 22 H48 V46 H12 V22 H4 Z" fill="#0e3e7e" />
                <path d="M30 14 C32 18 34 22 30 27 C26 22 28 18 30 14 Z" fill="#ffffff" />
                <path d="M22 28 C24 35 36 35 38 28 C36 38 24 38 22 28 Z" fill="#ffffff" />
                <path d="M18 24 C16 32 24 40 30 42 C36 40 44 32 42 24 C38 32 32 35 30 35 C28 35 22 32 18 24 Z" fill="#ffffff" />
              </svg>
              <span className="text-[6px] font-bold text-[#0e3e7e] leading-none mt-0.5 tracking-tight">योगक्षेमं वहाम्यहम्</span>
            </div>
            <div className="bg-[#fcd206] px-2.5 py-1 rounded-sm border border-[#0e3e7e]/20 shadow-xs flex items-center justify-center">
              <span className="text-[17px] font-black tracking-tight text-[#0e3e7e]">LIC HFL</span>
            </div>
          </div>
          <span className="text-[7.5px] font-bold text-[#0e3e7e] tracking-wider mt-1 uppercase whitespace-nowrap">
            LIC HOUSING FINANCE LTD
          </span>
        </div>
      );
    },
  },
  {
    id: 'tata-capital',
    name: 'Tata Capital Housing Finance',
    component: function TataCapitalLogo() {
      return (
        <div className="bg-[#0b5fa5] px-3.5 py-2 rounded-md shadow-xs flex flex-col justify-center min-w-[150px] select-none">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-white text-[14px] font-black tracking-wider uppercase">TATA</span>
            <span className="text-white text-[14px] font-extrabold tracking-wide uppercase">CAPITAL</span>
          </div>
          <div className="h-[2px] w-full bg-[#fed100] my-1 rounded-full" />
          <span className="text-white text-[10.5px] font-medium tracking-tight whitespace-nowrap">
            Housing Finance
          </span>
        </div>
      );
    },
  },
  {
    id: 'sbi',
    name: 'SBI Home Loans',
    component: function SbiHomeLoansLogo() {
      return (
        <div className="flex items-center gap-2 px-1 select-none">
          <svg viewBox="0 0 100 100" className="h-9 w-9 shrink-0">
            <circle cx="50" cy="50" r="48" fill="#00a5db" />
            <circle cx="50" cy="40" r="14" fill="#ffffff" />
            <rect x="45" y="40" width="10" height="40" fill="#ffffff" />
          </svg>
          <span className="text-[23px] font-black tracking-tight text-[#1b2559]">SBI</span>
          <div className="h-8 w-[1.5px] bg-[#1b2559]/70 mx-0.5" />
          <div className="flex flex-col text-[#1b2559] leading-[1.05]">
            <span className="text-[12px] font-black tracking-wide">HOME</span>
            <span className="text-[12px] font-black tracking-wide">LOANS</span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'piramal',
    name: 'Piramal Finance',
    component: function PiramalFinanceLogo() {
      return (
        <div className="bg-[#0f3d63] px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-2.5 min-w-[145px] select-none">
          <svg viewBox="0 0 40 40" className="h-7 w-7 shrink-0 fill-none stroke-white stroke-[2.5]" strokeLinecap="round">
            <path d="M20 20 C20 10 28 8 30 8 C30 16 24 19 20 20" />
            <path d="M20 20 C30 20 32 28 32 30 C24 30 21 24 20 20" />
            <path d="M20 20 C20 30 12 32 10 32 C10 24 16 21 20 20" />
            <path d="M20 20 C10 20 8 12 8 10 C16 10 19 16 20 20" />
          </svg>
          <div className="flex flex-col text-white leading-tight">
            <span className="text-[15px] font-bold tracking-tight font-serif">Piramal</span>
            <span className="text-[10.5px] font-normal tracking-wide text-slate-200">Finance</span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'idbi',
    name: 'IDBI Bank',
    component: function IdbiBankLogo() {
      return (
        <div className="bg-[#00875a] px-3 py-2 rounded-sm shadow-xs flex items-center gap-2 min-w-[145px] select-none">
          <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0">
            <div className="h-full w-full rounded-full bg-[#f47920] flex items-center justify-center">
              <svg viewBox="0 0 30 30" className="h-4 w-4 fill-white">
                <circle cx="15" cy="8" r="3.5" />
                <path d="M8 24 C8 17 12 14 15 14 C18 14 22 17 22 24 H18 C18 19 16 18 15 18 C14 18 12 19 12 24 H8 Z" />
              </svg>
            </div>
          </div>
          <span className="text-white text-[15px] font-black tracking-wider uppercase whitespace-nowrap">IDBI BANK</span>
        </div>
      );
    },
  },
  {
    id: 'pnb-housing',
    name: 'PNB Housing Finance Limited',
    component: function PnbHousingLogo() {
      return (
        <div className="bg-[#dc242c] rounded-md shadow-xs overflow-hidden flex flex-col min-w-[150px] select-none">
          <div className="px-3 pt-1.5 pb-1 flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-full bg-[#fed100] flex items-center justify-center">
              <span className="text-[#dc242c] font-black text-[10px] leading-none">pn</span>
            </div>
            <div className="text-white font-black text-[13px] leading-none tracking-tight">
              <span className="lowercase">pnb</span> <span className="capitalize font-bold">Housing</span>
            </div>
          </div>
          <div className="bg-[#fed100] py-0.5 px-2 text-center">
            <span className="text-[#dc242c] text-[8px] font-black tracking-widest uppercase whitespace-nowrap">Finance Limited</span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'aditya-birla',
    name: 'Aditya Birla Capital Home Loans',
    component: function AdityaBirlaCapitalLogo() {
      return (
        <div className="flex items-center gap-2 px-1 select-none">
          <div className="h-8 w-8 grid grid-cols-3 grid-rows-3 gap-[1px] shrink-0 transform -rotate-45 overflow-hidden rounded-xs bg-gradient-to-br from-[#df2027] via-[#f37023] to-[#fdb813] p-[2px]">
            <div className="bg-[#8b1d24]" />
            <div className="bg-[#df2027]" />
            <div className="bg-[#f37023]" />
            <div className="bg-[#df2027]" />
            <div className="bg-[#fdb813]" />
            <div className="bg-[#f37023]" />
            <div className="bg-[#f37023]" />
            <div className="bg-[#df2027]" />
            <div className="bg-[#8b1d24]" />
          </div>
          <div className="flex flex-col text-[#8b1d24] leading-[1.05]">
            <span className="text-[9.5px] font-black tracking-tight">ADITYA BIRLA</span>
            <span className="text-[13px] font-black tracking-tight">CAPITAL</span>
            <div className="h-[1px] w-full bg-[#8b1d24]/40 my-0.5" />
            <span className="text-[7.5px] font-extrabold tracking-wider text-[#8b1d24] uppercase whitespace-nowrap">HOME LOANS</span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    component: function AxisBankLogo() {
      return (
        <div className="flex items-center gap-2 px-1 select-none">
          <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0 fill-[#861f41]">
            <path d="M20 4 L4 36 H14 L20 22 L26 36 H36 Z" />
            <path d="M20 12 L14 26 H26 Z" fill="#ffffff" />
          </svg>
          <span className="text-[#861f41] text-[18px] font-black tracking-tight whitespace-nowrap">AXIS BANK</span>
        </div>
      );
    },
  },
  {
    id: 'sundaram',
    name: 'Sundaram Home',
    component: function SundaramHomeLogo() {
      return (
        <div className="flex items-center gap-1.5 px-1 select-none">
          <div className="flex items-center justify-center">
            <span className="text-[#0f4c81] text-[24px] font-black lowercase tracking-tighter italic leading-none">sf</span>
          </div>
          <div className="h-7 w-[1.5px] bg-slate-300 mx-0.5" />
          <div className="flex flex-col text-slate-800 leading-tight">
            <span className="text-[12px] font-black tracking-tight uppercase text-[#0f4c81] whitespace-nowrap">SUNDARAM HOME</span>
            <span className="text-[7.5px] font-medium tracking-tight text-slate-500 whitespace-nowrap">— Sundaram Finance Group —</span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    component: function HdfcBankLogo() {
      return (
        <div className="flex items-center gap-0 rounded-sm overflow-hidden shadow-xs select-none">
          <div className="h-9 w-9 bg-white border border-slate-200 flex items-center justify-center p-1 relative shrink-0">
            <div className="absolute inset-1 border-[1.5px] border-[#ed232a]" />
            <div className="h-3.5 w-3.5 bg-[#004c8f] relative z-10" />
          </div>
          <div className="h-9 bg-[#004c8f] px-3 flex items-center justify-center">
            <span className="text-white text-[14px] font-black tracking-wide whitespace-nowrap">HDFC BANK</span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'icici-hfc',
    name: 'ICICI Home Finance',
    component: function IciciHomeFinanceLogo() {
      return (
        <div className="flex items-center gap-2 px-1 select-none">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#9b2226] to-[#e35205] flex items-center justify-center text-white font-serif font-black italic text-base shadow-xs shrink-0">
            i
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13.5px] font-black italic text-[#0f356d] tracking-tight whitespace-nowrap">
              ICICI Home Finance
            </span>
            <span className="text-[8px] font-medium text-slate-500 tracking-tight whitespace-nowrap">
              www.icicihfc.com
            </span>
          </div>
        </div>
      );
    },
  },
];

interface TestimonialsSectionProps {
  showBankingPartners?: boolean;
}

export default function TestimonialsSection({
  showBankingPartners = true,
}: TestimonialsSectionProps = {}) {
  const [items, setItems] = useState<VideoTestimonial[]>(videoTestimonialsData);
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCMS() {
      try {
        const liveVideos = await getVideos();
        if (isMounted && Array.isArray(liveVideos) && liveVideos.length > 0) {
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
            setItems(mapped);
          }
        }
      } catch (err) {
        console.warn('Fallback to sample videoTestimonialsData:', err);
      }
    }
    loadCMS();
    return () => {
      isMounted = false;
    };
  }, []);

  // Ensure enough cards for a continuous, seamless, gapless running loop on all screen sizes
  const repeatFactor = Math.max(2, Math.ceil(6 / (items.length || 1)));
  const baseList = Array(repeatFactor).fill(items).flat();
  const duplicatedData = [...baseList, ...baseList];

  const duplicatedBankingPartners = useMemo(
    () => [...bankingPartners, ...bankingPartners, ...bankingPartners],
    []
  );

  return (
    <section className="relative z-20 w-full overflow-hidden bg-white">
      {/* =========================================================
          TESTIMONIAL AREA
      ========================================================= */}

      <div className="relative overflow-hidden bg-white">

        {/* Large light-gray curved background */}
        <div
          className="
            absolute
            left-0
            right-0
            top-[95px]
            bottom-0
            rounded-t-[90px]
            bg-slate-50/70
          "
        />

        {/* Center white curve / badge area */}
        <div
          className="
            absolute
            left-1/2
            top-[95px]
            z-10
            h-[125px]
            w-[260px]
            -translate-x-1/2
            rounded-b-full
            bg-white
          "
        />

        {/* =====================================================
            ROTATING BADGE
        ===================================================== */}

        <div className="relative z-30 mx-auto flex h-[230px] w-[230px] items-center justify-center">

          {/* Rotating text */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg
              viewBox="0 0 230 230"
              className="h-full w-full overflow-visible"
            >
              <defs>
                <path
                  id="testimonialCirclePath"
                  d="M 115, 39 a 76,76 0 1,1 0,152 a 76,76 0 1,1 0,-152"
                />
              </defs>

              <text
                className="
                  fill-black
                  text-[11px]
                  font-black
                  uppercase
                  tracking-[0.115em]
                "
              >
                <textPath href="#testimonialCirclePath" startOffset="0%">
                  YOU'RE IN SAFE HANDS • YOU'RE IN SAFE HANDS • YOU'RE IN SAFE HANDS • 
                </textPath>
              </text>
            </svg>
          </motion.div>

          {/* Center image with white border & quotation overlay */}
          <div
            className="
              relative
              z-20
              h-[132px]
              w-[132px]
              overflow-hidden
              rounded-full
              border-[4px]
              border-white
              bg-slate-900
              shadow-xl
            "
          >
            <img
              src="/images/features/t4.png"
              alt="Building"
              className="h-full w-full object-cover"
            />

            {/* Quote Icon Overlay matching reference design */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <svg
                viewBox="0 0 100 100"
                className="h-14 w-14 fill-white drop-shadow-md"
              >
                <path d="M 38,35 C 30,35 22,42 22,54 C 22,66 30,72 40,72 C 48,72 55,66 55,57 C 55,48 48,42 40,42 C 38,42 36,43 35,44 C 36,39 42,37 47,36 L 44,28 C 39,29 38,35 38,35 Z M 73,35 C 65,35 57,42 57,54 C 57,66 65,72 75,72 C 83,72 90,66 90,57 C 90,48 83,42 75,42 C 73,42 71,43 70,44 C 71,39 77,37 82,36 L 79,28 C 74,29 73,35 73,35 Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* =====================================================
            HEADING & CLIENT TESTIMONIAL CARDS RUNWAY
        ===================================================== */}

        <div className="relative z-20 text-center pt-4 pb-6 space-y-3 flex flex-col items-center">
          <RunningPillBadge text="CUSTOMER VIDEO TESTIMONIALS" />
          <h2 className="text-3xl font-extrabold text-[#29247c] sm:text-4xl lg:text-5xl tracking-tight">
            What our clients say
          </h2>
          <p className="max-w-xl text-sm sm:text-base text-slate-500 font-medium px-4">
            Hear directly from homeowners and investors who built their dreams with KPN Promoters.
          </p>
        </div>

        {/* Continuous Smooth Running Marquee with Stars & Hover Pause */}
        <div className="relative z-20 w-full overflow-hidden pb-16 pt-2">
          <div
            className="flex w-max gap-6 sm:gap-7 px-4 animate-marquee hover:[animation-play-state:paused]"
            style={{
              animationDuration: `${Math.max(30, baseList.length * 6)}s`,
            }}
          >
            {duplicatedData.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => setActiveVideo(item)}
                className="shrink-0 w-[340px] sm:w-[380px] lg:w-[400px] flex flex-col group cursor-pointer"
              >
                {/* Video Card Box matching why-choose-us design */}
                <div className="relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-slate-200/90 bg-white p-3 shadow-md transition-all duration-300 hover:shadow-2xl hover:border-slate-300 hover:-translate-y-1.5 h-full">
                  {/* 16:10 Thumbnail Container with Play Overlay */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[22px] bg-slate-900">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-108"
                    />

                    {/* Dark subtle gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                    {/* Play Button Icon with Ping Animation on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#f12131] text-white shadow-xl shadow-red-500/40 transition-transform duration-300 group-hover:scale-115">
                        <span className="absolute inset-0 rounded-full bg-[#f12131] opacity-75 group-hover:animate-ping" />
                        <Play className="relative z-10 h-6 w-6 sm:h-7 sm:w-7 fill-white translate-x-0.5" />
                      </div>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between text-xs font-bold text-white">
                      <span className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 shadow-xs border border-white/10 text-[11px]">
                        <Clock className="h-3.5 w-3.5 text-red-400" />
                        {item.duration}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md px-3 py-1 shadow-xs border border-white/10 text-[11px]">
                        <CheckCircle className="h-3 w-3" />
                        {item.verifiedYear}
                      </span>
                    </div>

                    {/* Project Tag at bottom of thumbnail */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1.5 text-white/95 text-xs font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                      <span className="truncate">{item.project} • {item.location}</span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                    <div>
                      {/* Golden Stars Rating */}
                      <div className="flex items-center gap-1 text-amber-400 mb-2.5">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      {/* Video Title */}
                      <h3 className="text-base sm:text-lg font-bold text-[#29247c] leading-snug group-hover:text-[#f12131] transition-colors duration-300 line-clamp-2">
                        “{item.title}”
                      </h3>

                      {/* Customer Quote */}
                      <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>

                    {/* Homeowner Info & Watch Story Link */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#f12131] transition-colors">
                          {item.customerName}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {item.role}
                        </p>
                      </div>

                      <span className="text-xs font-bold text-[#f12131] flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                        Watch Story →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          BANKING PARTNER SECTION
      ========================================================= */}

      {showBankingPartners && (
        <div className="relative bg-white pb-16 pt-8">

          {/* Divider */}
          <div className="mx-auto max-w-[1120px] px-6">
            <div className="border-t border-slate-200/80" />
          </div>

          {/* Banking Partners heading matching user reference image */}
          <div className="pt-16 pb-4 text-center px-4">
            <h3
              className="
                text-3xl
                sm:text-4xl
                md:text-[42px]
                font-bold
                tracking-tight
                text-[#1f2462]
                font-serif
              "
            >
              Our Banking Partners
            </h3>
            <p className="mt-3 text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto">
              Approved by leading banks and financial institutions for hassle-free home loan approvals
            </p>
          </div>

          {/* =====================================================
              CONTINUOUS LOGO MARQUEE
              RIGHT → LEFT
          ===================================================== */}

          <div className="mt-10 w-full overflow-hidden py-4">

            <motion.div
              className="flex w-max items-center gap-12 pr-12 md:gap-16 md:pr-16"
              animate={{
                x: ['0%', '-33.333%'],
              }}
              transition={{
                duration: 32,
                ease: 'linear',
                repeat: Infinity,
                repeatType: 'loop',
              }}
            >
              {duplicatedBankingPartners.map((bank, index) => {
                const LogoComponent = bank.component;
                return (
                  <div
                    key={`${bank.id}-${index}`}
                    className="flex h-20 min-w-[180px] shrink-0 items-center justify-center transition-transform duration-300 hover:scale-105"
                    title={bank.name}
                  >
                    <LogoComponent />
                  </div>
                );
              })}
            </motion.div>

          </div>

          {/* Bottom spacing */}
          <div className="h-16" />
        </div>
      )}

      {/* =========================================================
          ROUNDED END OF WHITE SECTION
      ========================================================= */}

      <div
        className="
          h-10
          rounded-b-[42px]
          bg-white
        "
      />

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