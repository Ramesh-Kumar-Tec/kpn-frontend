'use client';

import { useRef, useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { timelineData } from '@/data/aboutData';
import RunningPillBadge from '@/components/ui/RunningPillBadge';

const emptySubscribe = () => () => {};

export default function TimelineSection() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    const calculateDistance = () => {
      if (scrollContentRef.current) {
        const totalContentWidth = scrollContentRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        // Ensure the entire track including the final CTA and right padding is 100% reachable
        const paddingOffset = viewportWidth > 1024 ? 300 : 180;
        setScrollDistance(Math.max(0, totalContentWidth - viewportWidth + paddingOffset));
      }
    };

    calculateDistance();
    window.addEventListener('resize', calculateDistance);
    const timer1 = setTimeout(calculateDistance, 200);
    const timer2 = setTimeout(calculateDistance, 700);

    return () => {
      window.removeEventListener('resize', calculateDistance);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  return (
    <section ref={containerRef} className="relative h-[300vh] sm:h-[320vh] lg:h-[350vh] bg-white">
      {/* =========================
          STICKY FULLSCREEN VIEWPORT
      ========================== */}
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-gradient-to-b from-white via-slate-50/40 to-white py-6 sm:py-8 lg:py-10">

        {/* =========================
            TOP: MARQUEE & HEADER
        ========================== */}
        <div className="w-full">
          {/* MARQUEE TICKER */}
          {/* <div className="mb-3 overflow-hidden whitespace-nowrap opacity-30">
            <div className="animate-marquee items-center gap-6 text-xs font-black uppercase tracking-[0.25em] text-[#251c68]">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="inline-flex items-center gap-6">
                  <span>our story</span>
                  <span className="text-[#f12131]">·</span>
                </span>
              ))}
            </div>
          </div> */}

          {/* HEADER */}
          <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
            <div className="mb-2">
              <RunningPillBadge text="OUR STORY" />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#251c68] sm:text-4xl lg:text-5xl">
              20+ years of a remarkable journey
            </h2>
          </div>
        </div>

        {/* =========================
            MIDDLE: HORIZONTAL TIMELINE STREAM
        ========================== */}
        <div className="relative my-auto w-full overflow-hidden py-6">
          {mounted && (
            <motion.div
              ref={scrollContentRef}
              style={{ x }}
              className="relative flex items-center pl-6 pr-32 sm:pl-12 sm:pr-48 lg:pl-[8vw] lg:pr-[20vw] will-change-transform"
            >
              {/* ========================================================
                  SINGLE CONTINUOUS AXIS LINE (Runs across entire track)
              ========================================================= */}
              <div
                className="
                  pointer-events-none
                  absolute
                  left-0
                  right-32
                  sm:right-48
                  lg:right-[-45vw]
                  top-[245px]
                  sm:top-[250px]
                  h-[2px]
                  bg-slate-200
                  z-0
                "
              />

              {/* TIMELINE MILESTONES */}
              {timelineData.map((item, index) => (
                <div
                  key={item.year}
                  className="
                    relative
                    z-10
                    flex
                    w-[280px]
                    flex-shrink-0
                    flex-col
                    items-center
                    px-4
                    sm:w-[340px]
                    sm:px-6
                    lg:w-[380px]
                  "
                >
                  {/* YEAR (BOLD RED) */}
                  <div className="flex h-[60px] sm:h-[70px] items-center justify-center select-none text-5xl font-black tracking-tight text-[#f12131] sm:text-6xl lg:text-7xl">
                    {item.year}
                  </div>

                  {/* 3D BUILDING IMAGE */}
                  <div className="flex h-[130px] sm:h-[150px] w-full items-center justify-center">
                    <img
                      src={item.image}
                      alt={`KPN ${item.year}`}
                      className="
                        max-h-[120px]
                        sm:max-h-[140px]
                        w-auto
                        object-contain
                        drop-shadow-[0_10px_15px_rgba(0,0,0,0.12)]
                        transition-transform
                        duration-300
                        hover:scale-105
                      "
                    />
                  </div>

                  {/* CIRCULAR NODE ON AXIS LINE */}
                  <div className="flex h-[50px] sm:h-[60px] w-full items-center justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-300 bg-white shadow-sm transition-transform duration-300 hover:scale-110 hover:border-[#f12131]">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          index === 0 ? 'bg-[#251c68]' : 'bg-[#251c68]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="flex min-h-[60px] max-w-[260px] sm:max-w-[290px] items-start justify-center text-center">
                    <p className="text-xs sm:text-[13px] leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}

              {/* ========================================================
                  FINAL CTA BUTTON (Get your free quote)
              ========================================================= */}
              <div className="relative z-10 flex w-[260px] sm:w-[300px] flex-shrink-0 flex-col items-center pl-6">
                {/* Spacer matching year + image height */}
                <div className="h-[190px] sm:h-[220px] w-full" />

                {/* Centered CTA Badge intersecting the axis line */}
                <div className="flex h-[50px] sm:h-[60px] w-full items-center justify-center">
                  <Link
                    href="/contact-us"
                    className="
                      relative
                      z-20
                      flex
                      h-[130px]
                      w-[130px]
                      sm:h-[150px]
                      sm:w-[150px]
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f12131]
                      p-4
                      text-center
                      text-sm
                      sm:text-base
                      font-bold
                      leading-tight
                      text-white
                      shadow-[0_15px_30px_rgba(241,33,49,0.35)]
                      transition-all
                      duration-300
                      hover:scale-105
                      hover:bg-[#d81928]
                      hover:shadow-[0_20px_40px_rgba(241,33,49,0.45)]
                    "
                  >
                    <span>
                      Get your
                      <br />
                      free quote
                    </span>
                  </Link>
                </div>

                {/* Bottom spacer matching description */}
                <div className="min-h-[60px] w-full" />
              </div>
            </motion.div>
          )}
        </div>

        {/* BOTTOM ACCENT BAR */}
        {/* <div className="mx-auto w-full max-w-[1400px] px-6 text-center text-xs text-slate-400 sm:px-8 lg:px-12">
          <span>Scroll down to navigate timeline →</span>
        </div> */}
      </div>
    </section>
  );
}