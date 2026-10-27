'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// In-memory session tracking across client-side router navigations
let hasIntroPlayedInClient = false;

// Determine if the current page visit was a direct browser load/reload of the homepage
function isDirectHomepageLoadOrReload(): boolean {
  if (typeof window === 'undefined') return true;

  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0) {
      const nav = navEntries[0] as PerformanceNavigationTiming;
      if (nav && nav.name) {
        const navUrl = new URL(nav.name, window.location.origin);
        const cleanPath = navUrl.pathname.replace(/\/+$/, '') || '/';
        // If the browser was refreshed/loaded on another page (e.g. /projects, /about-us),
        // navigating client-side to '/' must not trigger the intro video
        if (cleanPath !== '/') {
          return false;
        }
      }
    }
  } catch {
    // fallback
  }

  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  return currentPath === '/';
}

function shouldShowIntro(): boolean {
  if (typeof window === 'undefined') return true;
  if (hasIntroPlayedInClient) return false;
  return isDirectHomepageLoadOrReload();
}

export default function FullScreenVideoEntry() {
  const [isVisible, setIsVisible] = useState(() => shouldShowIntro());
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasFinishedRef = useRef(false);

  // If skipped (e.g. navigating to Home from another page), immediately unlock site
  useEffect(() => {
    if (!isVisible && typeof window !== 'undefined') {
      (window as any).__kpnPortalFaded = true;
      window.dispatchEvent(new CustomEvent('kpn-portal-fade', { detail: { faded: true } }));
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [isVisible]);

  // Synchronously prepare flag if skipped so HeroSection starts immediately
  if (typeof window !== 'undefined' && !isVisible) {
    (window as any).__kpnPortalFaded = true;
  }

  // Lock body scroll while video is playing
  useEffect(() => {
    if (!isVisible) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isVisible]);

  // Safety fallback: if video is blocked or fails, reveal website after timeout
  useEffect(() => {
    if (!isVisible) return;

    const safetyTimer = setTimeout(() => {
      if (!hasFinishedRef.current) {
        finishAndRevealWebsite();
      }
    }, 6000);

    return () => clearTimeout(safetyTimer);
  }, [isVisible]);

  // Attempt Autoplay on mount + user gesture fallback
  useEffect(() => {
    if (!isVisible) return;

    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    const playVideo = () => {
      if (video.paused && !hasFinishedRef.current) {
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch(() => {
            // Browser autoplay policy retry on interaction
          });
        }
      }
    };

    playVideo();

    // Fallback if mobile browser requires a touch gesture to start playback
    const handleGesture = () => {
      playVideo();
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };

    window.addEventListener('pointerdown', handleGesture, { passive: true });
    window.addEventListener('touchstart', handleGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, [isVisible]);

  // Complete video intro and smoothly transition to website opening page
  const finishAndRevealWebsite = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    hasIntroPlayedInClient = true;
    setIsFading(true);

    // Notify HeroSection and site components that portal has finished
    if (typeof window !== 'undefined') {
      (window as any).__kpnPortalFaded = true;
      window.dispatchEvent(new CustomEvent('kpn-portal-fade', { detail: { faded: true } }));
      sessionStorage.setItem('kpn_logo_intro_completed', 'true');
    }

    // Unlock scroll
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    // Remove from DOM after smooth fade animation
    setTimeout(() => {
      setIsVisible(false);
    }, 850);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="fullscreen-logo-entry"
        initial={{ opacity: 1 }}
        animate={{ opacity: isFading ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[9999] h-[100dvh] w-[100dvw] bg-white overflow-hidden flex items-center justify-center select-none"
        onClick={() => {
          // If video was paused by browser policy, clicking screen resumes it
          const video = videoRef.current;
          if (video && video.paused) {
            video.play().catch(() => {});
          }
        }}
      >
        {/* Fullscreen Video Player - Clean & Pure with 0 Overlay Icons */}
        <div className="relative h-full w-full flex items-center justify-center bg-white overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            preload="auto"
            disablePictureInPicture
            controls={false}
            onError={finishAndRevealWebsite}
            onEnded={finishAndRevealWebsite}
            className="h-full w-full object-contain sm:object-cover bg-white scale-[1.38] sm:scale-100 transition-transform duration-300"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
          >
            <source src="/entry/logo-loader.webm" type="video/webm" />
            <source src="/entry/logo-loader.webm" type="video/webm" />
            Your browser does not support video playback.
          </video>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
