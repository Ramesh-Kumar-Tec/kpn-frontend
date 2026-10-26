'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInViewRef = useRef<boolean>(true);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video) return;

    // Start unmuted by default when in view
    video.defaultMuted = false;
    video.muted = false;

    const playVideo = async () => {
      if (!video) return;
      try {
        if (isInViewRef.current) {
          video.muted = false;
        } else {
          video.muted = true;
        }
        const promise = video.play();
        if (promise !== undefined) {
          await promise;
        }
      } catch {
        // Fallback if browser autoplay policy blocks unmuted audio on cold start:
        // play muted initially and unmute upon first user interaction
        video.muted = true;
        try {
          await video.play();
        } catch {
          // Browser policy catch
        }
      }
    };

    const pauseVideo = () => {
      if (!video.paused) {
        video.pause();
      }
    };

    // When intro portal completes fading, begin hero playback
    const handlePortalFade = (e: Event) => {
      const customEvent = e as CustomEvent<{ faded: boolean }>;
      if (customEvent.detail?.faded) {
        playVideo();
      } else {
        pauseVideo();
      }
    };
    window.addEventListener('kpn-portal-fade', handlePortalFade);

    // Pause/mute when tab is in background, resume when active and in view
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.muted = true;
        pauseVideo();
      } else if (isInViewRef.current && (typeof window !== 'undefined' && (window as any).__kpnPortalFaded)) {
        playVideo();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Any user gesture unlocks unmuted playback if it was previously blocked by browser autoplay policy
    const handleGesture = () => {
      const vid = videoRef.current;
      if (!vid) return;

      if (typeof window !== 'undefined' && (window as any).__kpnPortalFaded) {
        if (isInViewRef.current && vid.muted) {
          vid.muted = false;
        }
        playVideo();
      }
    };
    window.addEventListener('pointerdown', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture, { passive: true });
    window.addEventListener('touchstart', handleGesture, { passive: true });

    // IntersectionObserver to auto-mute when hero video is scrolled up / out of view
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
        isInViewRef.current = isVisible;

        const vid = videoRef.current;
        if (!vid) return;

        if (isVisible) {
          // Hero section is back in view: play unmuted
          if (typeof window !== 'undefined' && (window as any).__kpnPortalFaded) {
            vid.muted = false;
            if (vid.paused) {
              vid.play().catch(() => {});
            }
          }
        } else {
          // Hero section has scrolled up out of view: auto-mute audio immediately
          vid.muted = true;
        }
      },
      {
        threshold: [0, 0.2, 0.5],
      }
    );

    if (section) {
      observer.observe(section);
    }

    // Scroll listener as an instant fallback for rapid scrolling
    const handleScroll = () => {
      const sec = sectionRef.current;
      const vid = videoRef.current;
      if (!sec || !vid) return;

      const rect = sec.getBoundingClientRect();
      // If hero section has scrolled past the top of the viewport
      if (rect.bottom <= 120) {
        if (!vid.muted) vid.muted = true;
        isInViewRef.current = false;
      } else if (rect.top >= -100 && rect.bottom > 200) {
        isInViewRef.current = true;
        if (typeof window !== 'undefined' && (window as any).__kpnPortalFaded) {
          if (vid.muted) vid.muted = false;
          if (vid.paused) vid.play().catch(() => {});
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial state trigger
    if (typeof window !== 'undefined' && (window as any).__kpnPortalFaded) {
      playVideo();
    } else {
      pauseVideo();
    }

    return () => {
      // Immediately silence and pause video on component unmount (e.g. navigating to other pages)
      if (video) {
        video.muted = true;
        video.pause();
      }
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('kpn-portal-fade', handlePortalFade);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, []);

  return (
    <section ref={sectionRef} id="main-content" className="relative z-10 min-h-[100vh] w-full overflow-hidden bg-slate-800">
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        <source src="/images/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Subtle overlay for clear daytime video visibility while keeping white text readable */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/40 via-black/10 to-transparent" />

      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-[1728px] px-4 pt-20 md:px-6 lg:px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[430px]"
        >
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-[22px] font-bold leading-[1.45] text-white drop-shadow-sm md:text-[24px]"
          >
            We are a developer invested in our customers&apos; success and improving
            the communities we serve.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/about-us"
              className="group inline-flex items-center gap-5 rounded-full bg-white py-1.5 pl-8 pr-1.5 text-sm font-bold text-black shadow-lg transition-all hover:text-[#f12131] hover:shadow-xl active:scale-98"
            >
              <span>More About Us</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f12131] text-white transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5 -rotate-45 transition-colors duration-300 group-hover:rotate-0 group-hover:text-black" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}