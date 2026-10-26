'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import Counter from '@/components/ui/Counter';
import RunningPillBadge from '@/components/ui/RunningPillBadge';
import FadeIn from '@/components/animation/FadeIn';
import StaggerContainer from '@/components/animation/StaggerContainer';
import StaggerItem from '@/components/animation/StaggerItem';

export default function AboutIntroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const reelRef = useRef<HTMLVideoElement>(null);
  const [isReelMuted, setIsReelMuted] = useState(true);
  const [isReelPlaying, setIsReelPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {});
    }

    const reel = reelRef.current;
    if (reel) {
      reel.defaultMuted = true;
      reel.muted = true;
      reel.play().catch(() => {});
    }
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !video.muted;
    video.muted = newMuted;
    setIsMuted(newMuted);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleReelMute = () => {
    const reel = reelRef.current;
    if (!reel) return;
    const newMuted = !reel.muted;
    reel.muted = newMuted;
    setIsReelMuted(newMuted);
  };

  const toggleReelPlay = () => {
    const reel = reelRef.current;
    if (!reel) return;
    if (reel.paused) {
      reel.play().catch(() => {});
      setIsReelPlaying(true);
    } else {
      reel.pause();
      setIsReelPlaying(false);
    }
  };

  return (
    <section className="bg-white px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">

        {/* Top content */}
        <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left */}
          <StaggerItem>
            <RunningPillBadge text="ABOUT US" />
            <h2
              className="
                mt-7
                max-w-[600px]
                text-5xl
                font-black
                leading-[0.95]
                tracking-[-0.04em]
                text-[#342987]
                sm:text-6xl
                lg:text-[68px]
              "
            >
              Shaping the
              <br />
              world of things
              <br />
              to come
            </h2>
          </StaggerItem>

          {/* Right */}
          <StaggerItem className="pt-2 lg:pt-10">

            <h3
              className="
                max-w-[620px]
                text-xl
                font-bold
                leading-[1.35]
                text-[#342987]
                lg:text-2xl
              "
            >
              We’d love to share more with you, please complete this form
              and our dedicated team will get back to you shortly.
            </h3>

            <p
              className="
                mt-6
                max-w-[650px]
                text-base
                leading-[1.6]
                text-gray-600
              "
            >
              In markets from renewable energy, sports and entertainment,
              to data centers and healthcare, we work to ensure the built
              environment leaves a lasting positive impact. Together, we
              strive to make your project better than you imagined possible.
            </p>

            <Link
              href="/contact-us"
              className="
                mt-8
                inline-flex
                items-center
                gap-5
                rounded-full
                border
                border-gray-200
                py-1
                pl-6
                pr-1
                text-sm
                font-bold
                text-black
                transition-all
                hover:border-[#f12131]
              "
            >
              Meet The Team

              <span
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f12131]
                  text-white
                "
              >
                →
              </span>
            </Link>

          </StaggerItem>

        </StaggerContainer>


        {/* =========================
            VIDEO + STAT CARDS
        ========================== */}
        <FadeIn direction="up" delay={0.2} className="relative mt-16 lg:mt-20">

          <div
            className="
              relative
              mx-auto
              h-[280px]
              sm:h-[380px]
              w-full
              overflow-hidden
              rounded-[24px]
              sm:rounded-[32px]
              bg-slate-900
              shadow-2xl
              lg:h-[560px]
            "
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
            >
              <source src="/images/about/cp-meet-oct-2025.mp4" type="video/mp4" />
            </video>

            {/* Subtle dark gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />

            {/* Audio & Play Controls */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2">
              <button
                onClick={togglePlay}
                type="button"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/85 hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                type="button"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="flex h-9 sm:h-11 items-center gap-1.5 sm:gap-2 rounded-full bg-black/60 px-3 sm:px-4 text-[11px] sm:text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-black/85 hover:scale-105 active:scale-95"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                    <span>Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    <span>Mute</span>
                  </>
                )}
              </button>
            </div>

          </div>


          {/* =========================
              STAT CARDS - Fully Responsive on Mobile & Desktop
          ========================== */}

          <div
            className="
              relative
              mt-4
              grid
              w-full
              grid-cols-2
              gap-3
              sm:mt-6
              sm:gap-4
              lg:absolute
              lg:bottom-8
              lg:right-8
              lg:mt-0
              lg:w-[520px]
            "
          >

            {/* 40+ */}
            <div
              className="
                col-span-2
                rounded-[20px]
                sm:rounded-[24px]
                bg-white
                p-5
                sm:p-7
                shadow-xl
                border
                border-slate-100/80
                lg:p-9
              "
            >
              <div className="flex items-start justify-between">

                <div>
                  <div
                    className="
                      text-4xl
                      sm:text-5xl
                      lg:text-6xl
                      font-black
                      leading-none
                      tracking-tight
                      text-[#342987]
                    "
                  >
                    <Counter value={40} /><span className="text-[#f12131]">+</span>
                  </div>

                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500 font-medium">
                    projects in development
                  </p>
                </div>

                <span className="text-2xl sm:text-3xl text-slate-400">▥</span>

              </div>
            </div>


            {/* 18m+ */}
            <div
              className="
                rounded-[20px]
                sm:rounded-[24px]
                bg-white
                p-5
                sm:p-7
                shadow-xl
                border
                border-slate-100/80
                lg:p-8
              "
            >
              <div
                className="
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-black
                  leading-none
                  text-[#342987]
                "
              >
                <Counter value={18} suffix="m" /><span className="text-[#f12131]">+</span>
              </div>

              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500 font-medium leading-snug">
                square feet of property
              </p>
            </div>


            {/* 2.5b+ */}
            <div
              className="
                rounded-[20px]
                sm:rounded-[24px]
                bg-white
                p-5
                sm:p-7
                shadow-xl
                border
                border-slate-100/80
                lg:p-8
              "
            >
              <div
                className="
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-black
                  leading-none
                  text-[#342987]
                "
              >
                <Counter value={2.5} decimals={1} suffix="b" /><span className="text-[#f12131]">+</span>
              </div>

              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500 font-medium leading-snug">
                total projects cost
              </p>
            </div>

          </div>

        </FadeIn>


        {/* =========================
            MISSION & REEL SECTION
        ========================== */}
        <FadeIn direction="up" delay={0.2} className="mt-20 lg:mt-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16">

            {/* Left Column: Word Content with KPN Brand UI */}
            <div className="lg:col-span-7 xl:col-span-7">
              <RunningPillBadge text="OUR STORY" />

              <h2 className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.03em] text-[#342987] sm:text-5xl lg:text-[54px]">
                Mission: Affordable Home <br className="hidden sm:inline" />
                <span className="text-[#f12131]">for Everyone!</span>
              </h2>

              <div className="mt-7 space-y-5 text-base font-medium leading-[1.7] text-gray-600 sm:text-lg">
                <p>
                  The foundation of <strong className="font-bold text-[#342987]">KPN Promoters Pvt Ltd</strong> was laid in 2004 by <strong className="font-bold text-[#342987]">Mr. Kanniyappan</strong>, a visionary entrepreneur passionate about innovation. The company initially focused on finance services and real estate investments, building a reputation for trust and reliability.
                </p>

                <p>
                  In <strong className="font-bold text-[#342987]">2011</strong>, recognizing the growing demand for quality housing, we transitioned into the construction industry under the name KPN Promoters. Since then, we’ve been committed to delivering affordable, high-quality homes and transparent real estate solutions.
                </p>

                <p>
                  With a legacy of over two decades in business and more than a decade in construction, <strong className="font-bold text-[#342987]">KPN Promoters Pvt Ltd</strong> continues to build not just homes, but lasting relationships rooted in trust and quality.
                </p>
              </div>

              {/* Highlight chips */}
              <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-bold text-gray-700">
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#342987]" />
                  <span>Established in 2004</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#f12131]" />
                  <span>20+ Years Trust</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Quality Housing</span>
                </div>
              </div>

              {/* Signature KPN Pill Button */}
              <Link
                href="/contact-us"
                className="
                  group
                  mt-8
                  inline-flex
                  items-center
                  gap-5
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                  py-1
                  pl-6
                  pr-1
                  text-sm
                  font-bold
                  text-black
                  shadow-sm
                  transition-all
                  duration-300
                  hover:border-[#f12131]
                  hover:shadow-md
                  active:scale-95
                "
              >
                Know More
                <span
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-[#f12131]
                    text-white
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </Link>
            </div>

            {/* Right Column: Omega Town Reel Video Showcase */}
            <div className="flex justify-center lg:col-span-5 lg:justify-end xl:col-span-5">
              <div className="group relative w-full max-w-[340px] sm:max-w-[370px] overflow-hidden rounded-[36px] bg-gradient-to-b from-slate-900 via-black to-slate-950 p-2.5 shadow-[0_25px_60px_-15px_rgba(52,41,135,0.25)] ring-1 ring-slate-800 transition-transform duration-500 hover:-translate-y-1">
                {/* Inner video wrapper */}
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[28px] bg-black">
                  <video
                    ref={reelRef}
                    autoPlay
                    loop
                    muted={isReelMuted}
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover"
                  >
                    <source src="/images/about/omega-town-reel.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Subtle gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                  {/* Top Tag Badge */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md ring-1 ring-white/10">
                    <span className="h-2 w-2 rounded-full bg-[#f12131] animate-pulse" />
                    <span>Omega Town • Reel</span>
                  </div>

                  {/* Video Controls (Glassmorphic) */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                    <button
                      onClick={toggleReelPlay}
                      type="button"
                      aria-label={isReelPlaying ? 'Pause reel' : 'Play reel'}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/90 hover:scale-105 active:scale-95 ring-1 ring-white/10"
                    >
                      {isReelPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                    </button>

                    <button
                      onClick={toggleReelMute}
                      type="button"
                      aria-label={isReelMuted ? 'Unmute reel' : 'Mute reel'}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/90 hover:scale-105 active:scale-95 ring-1 ring-white/10"
                    >
                      {isReelMuted ? (
                        <VolumeX className="h-4 w-4 text-red-400" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-green-400" />
                      )}
                    </button>
                  </div>

                  {/* Bottom Booking Hotline banner inside reel card */}
                  <div className="absolute bottom-4 inset-x-4 z-20 rounded-2xl bg-black/75 p-3.5 text-center text-white backdrop-blur-md border border-white/15 shadow-lg">
                    <p className="text-[11px] font-bold tracking-wider text-gray-300 uppercase">
                      For Bookings & Site Visit
                    </p>
                    <a
                      href="tel:7338834233"
                      className="mt-0.5 inline-block text-xl font-black tracking-wider text-[#ffcc00] transition-colors hover:text-white"
                    >
                      733 88 34 233
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </FadeIn>

      </div>
    </section>
  );
}