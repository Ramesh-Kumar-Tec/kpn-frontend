'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';

// Storage key to persist user's explicit mute choice across page navigations in this session
const MUTE_STORAGE_KEY = 'kpn_hero_muted_by_user';

function getIsMutedPreference(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = sessionStorage.getItem(MUTE_STORAGE_KEY);
    // If the user has explicitly muted ('true'), return true
    if (stored === 'true') return true;
    // If the user has explicitly unmuted ('false'), return false
    if (stored === 'false') return false;
  } catch {}
  // Default on initial website opening: unmuted (plays audio)
  return false;
}

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Default to false (unmuted) on both server and client during initial render to eliminate hydration mismatch
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);

  useEffect(() => {
    // Check if user previously muted in this browser session
    const shouldBeMuted = getIsMutedPreference();
    setIsMuted(shouldBeMuted);
    isMutedRef.current = shouldBeMuted;

    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = shouldBeMuted;
    video.muted = shouldBeMuted;

    const playVideo = async () => {
      if (!video) return;
      try {
        video.muted = isMutedRef.current;
        const promise = video.play();
        if (promise !== undefined) {
          await promise;
        }
      } catch {
        // If browser autoplay policy blocks unmuted playback on cold open:
        // fallback to muted so video plays visually, and auto-unmute on first user gesture
        if (!isMutedRef.current) {
          video.muted = true;
          try {
            await video.play();
          } catch {
            // Browser policy catch
          }
        }
      }
    };

    const pauseVideo = () => {
      if (!video.paused) {
        video.pause();
      }
    };

    const handlePortalFade = (e: Event) => {
      const customEvent = e as CustomEvent<{ faded: boolean }>;
      if (customEvent.detail?.faded) {
        playVideo();
      } else {
        pauseVideo();
      }
    };

    window.addEventListener('kpn-portal-fade', handlePortalFade);

    const handleVisibilityChange = () => {
      if (!document.hidden && (typeof window !== 'undefined' && (window as any).__kpnPortalFaded)) {
        playVideo();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial gesture unlock: ONLY auto-unmute if the user did NOT mute the video!
    const handleGesture = () => {
      const vid = videoRef.current;
      if (!vid) return;

      if (typeof window !== 'undefined' && (window as any).__kpnPortalFaded) {
        if (!isMutedRef.current && vid.muted) {
          vid.muted = false;
          setIsMuted(false);
        }
        playVideo();
      }
    };
    window.addEventListener('pointerdown', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture, { passive: true });
    window.addEventListener('touchstart', handleGesture, { passive: true });

    // Initial state: play only if portal has already faded, otherwise keep paused to preserve GPU decoder
    if (typeof window !== 'undefined' && (window as any).__kpnPortalFaded) {
      playVideo();
    } else {
      pauseVideo();
    }

    return () => {
      window.removeEventListener('kpn-portal-fade', handlePortalFade);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      // User is unmuting
      video.muted = false;
      setIsMuted(false);
      isMutedRef.current = false;
      try {
        sessionStorage.setItem(MUTE_STORAGE_KEY, 'false');
      } catch {}
      video.play().catch(() => {});
    } else {
      // User is muting
      video.muted = true;
      setIsMuted(true);
      isMutedRef.current = true;
      try {
        sessionStorage.setItem(MUTE_STORAGE_KEY, 'true');
      } catch {}
    }
  };

  return (
    <section id="main-content" className="relative z-10 min-h-[100vh] w-full overflow-hidden bg-slate-800">
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

      {/* Floating Speaker Mute/Unmute Audio Control */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute top-38 right-6 z-20"
      >
        <button
          onClick={toggleMute}
          type="button"
          suppressHydrationWarning
          aria-label={isMuted ? 'Unmute hero video audio' : 'Mute hero video audio'}
          className="group flex items-center gap-2 rounded-full bg-black/60 hover:bg-black/85 px-3.5 py-2.5 sm:px-4 sm:py-2 text-xs font-semibold text-white backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.35)] transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {isMuted ? (
            <>
              <VolumeX className="h-4 w-4 text-red-400 transition-transform group-hover:scale-110" />
            </>
          ) : (
            <>

              <Volume2 className="h-4 w-4 text-emerald-400 transition-transform group-hover:scale-110" />
            </>
          )}
        </button>
      </motion.div>
    </section>
  );
}