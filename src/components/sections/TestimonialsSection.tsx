'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { testimonialsData } from '@/data/siteData';
import { getTestimonials, TestimonialItem } from '@/lib/cmsClient';

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

export default function TestimonialsSection() {
  const [items, setItems] = useState<TestimonialItem[]>(testimonialsData);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    async function loadCMS() {
      try {
        const fetched = await getTestimonials();
        if (fetched && fetched.length > 0) {
          setItems(fetched);
        }
      } catch (err) {
        console.warn('Fallback testimonials used');
      }
    }
    loadCMS();
  }, []);

  const total = items.length || 1;

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % total);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  // Automatic testimonial rotation
  useEffect(() => {
    const interval = window.setInterval(() => {
      next();
    }, 6000);

    return () => window.clearInterval(interval);
  }, [total]);

  const testimonial = items[current] || items[0] || testimonialsData[0];

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
            h-[620px]
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
                  text-[9.5px]
                  font-black
                  uppercase
                  tracking-[0.115em]
                "
              >
                <textPath href="#testimonialCirclePath" startOffset="0%">
                  WHAT PEOPLE SAYS • WHAT PEOPLE SAYS • WHAT PEOPLE SAYS • WHAT PEOPLE SAYS •
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
              src="/images/roundimg.jpg"
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
            TESTIMONIAL CONTENT
        ===================================================== */}

        <div className="relative z-20 mx-auto max-w-[1200px] px-6 pb-24 pt-10">

          <div className="flex items-center justify-between gap-6">

            {/* LEFT BUTTON */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              suppressHydrationWarning
              className="
                hidden
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-black
                shadow-sm
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-md
                md:flex
              "
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* TEXT */}
            <div className="min-h-[350px] flex-1 overflow-hidden">

              <AnimatePresence
                mode="wait"
                custom={direction}
              >
                <motion.div
                  key={current}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    x: direction > 0 ? 100 : -100,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: direction > 0 ? -100 : 100,
                  }}
                  transition={{
                    duration: 0.45,
                    ease: 'easeInOut',
                  }}
                  className="
                    flex
                    min-h-[350px]
                    flex-col
                    items-center
                    justify-center
                    text-center
                  "
                >
                  <h2
                    className="
                      max-w-[850px]
                      text-3xl
                      font-bold
                      leading-[1.15]
                      tracking-[-0.04em]
                      text-[#29247c]
                      sm:text-4xl
                      md:text-5xl
                      lg:text-[52px]
                    "
                  >
                    “{testimonial.quote}”
                  </h2>

                  <div className="mt-14 text-center">
                    <p className="inline-block border-b-2 border-[#f12131] pb-1 text-lg font-bold text-black">
                      {testimonial.author}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

            {/* RIGHT BUTTON */}
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              suppressHydrationWarning
              className="
                hidden
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-black
                shadow-sm
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-md
                md:flex
              "
            >
              <ChevronRight className="h-5 w-5" />
            </button>

          </div>

          {/* Mobile controls */}
          <div className="mt-2 flex items-center justify-center gap-4 md:hidden">
            <button
              type="button"
              onClick={prev}
              suppressHydrationWarning
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white
                shadow-md
              "
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={next}
              suppressHydrationWarning
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-white
                shadow-md
              "
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          BANKING PARTNER SECTION
      ========================================================= */}

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
    </section>
  );
}