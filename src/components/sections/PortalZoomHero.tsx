"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function KPNEntryHero() {
  const [entered, setEntered] = useState(false);
  const [faded, setFaded] = useState(false);
  const enteredRef = useRef(false);
  const fadedRef = useRef(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lockRef = useRef(false);
  const fadeTimerRef = useRef<number | null>(null);
  const unlockTimerRef = useRef<number | null>(null);
  const lockUntilRef = useRef(0);

  /* =========================================================
     PORTAL POSITION
  ========================================================= */
  const PORTAL_X = "49.6%";
  const PORTAL_Y = "39.9%";

  /* =========================================================
     INITIAL VIDEO BOX SIZE
  ========================================================= */
  const INITIAL_VIDEO_WIDTH = "400px";
  const INITIAL_VIDEO_HEIGHT = "400px";

  /* =========================================================
     KEEP REFS IN SYNC & NOTIFY HERO SECTION
  ========================================================= */
  useEffect(() => {
    enteredRef.current = entered;
  }, [entered]);

  useEffect(() => {
    fadedRef.current = faded;
    if (typeof window !== 'undefined') {
      (window as any).__kpnPortalFaded = faded;
      window.dispatchEvent(new CustomEvent('kpn-portal-fade', { detail: { faded } }));
    }

    const video = videoRef.current;
    if (video) {
      if (faded) {
        // Pause portal video after fade completes so it plays during the zoom-fade and then frees GPU
        const timer = window.setTimeout(() => {
          if (fadedRef.current && video && !video.paused) {
            video.pause();
          }
        }, 1500);
        return () => window.clearTimeout(timer);
      } else {
        // Resume portal video when portal is shown
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
    }
  }, [faded]);

  /* =========================================================
     INITIAL PORTAL VIDEO AUTOPLAY
  ========================================================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    const playPortalVideo = () => {
      if (video.paused && !fadedRef.current) {
        video.play().catch(() => {});
      }
    };

    playPortalVideo();

    // Fallback if browser requires initial user gesture
    const handleGesture = () => {
      playPortalVideo();
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
    window.addEventListener('pointerdown', handleGesture, { passive: true });
    window.addEventListener('keydown', handleGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, []);

  /* =========================================================
     LOCK SCROLL
     Locks scroll briefly (600ms) to absorb initial momentum flick,
     then unlocks immediately so user can scroll earlier without delay.
  ========================================================= */
  const lockScroll = (duration: number = 600) => {
    lockRef.current = true;
    lockUntilRef.current = Date.now() + duration;
    if (unlockTimerRef.current) {
      window.clearTimeout(unlockTimerRef.current);
    }
    unlockTimerRef.current = window.setTimeout(() => {
      lockRef.current = false;
    }, duration);
  };

  /* =========================================================
     TRIGGER ZOOM IN & SIMULTANEOUS FADE
  ========================================================= */
  const triggerZoomIn = () => {
    if (enteredRef.current) return;
    // Lock scroll briefly to absorb initial gesture
    lockScroll(600);
    window.scrollTo({ top: 0, behavior: "instant" });
    enteredRef.current = true;
    fadedRef.current = true;
    setEntered(true);
    setFaded(true);
  };

  /* =========================================================
     TRIGGER ZOOM OUT (REVERSE ANIMATION)
  ========================================================= */
  const triggerZoomOut = () => {
    lockScroll(600);
    window.scrollTo({ top: 0, behavior: "instant" });
    fadedRef.current = false;
    enteredRef.current = false;
    setFaded(false);
    setEntered(false);
  };

  /* =========================================================
     WHEEL & TOUCH CONTROL
  ========================================================= */
  useEffect(() => {
    // Keep window at top while on portal
    if (!enteredRef.current && !fadedRef.current) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 5) {
        return;
      }

      // While transition is locked, absorb the initial momentum scroll
      if (lockRef.current) {
        event.preventDefault();

        // Release lock as soon as the initial wheel flick settles (180ms pause)
        // so the user can scroll earlier without having to wait
        if (unlockTimerRef.current) {
          window.clearTimeout(unlockTimerRef.current);
        }

        const remaining = Math.max(0, lockUntilRef.current - Date.now());
        const settleDelay = Math.min(180, remaining);

        if (settleDelay <= 0) {
          lockRef.current = false;
        } else {
          unlockTimerRef.current = window.setTimeout(() => {
            lockRef.current = false;
          }, settleDelay);
        }
        return;
      }

      /* =====================================================
         INITIAL PORTAL SCREEN (NOT ENTERED / NOT FADED):
         Always prevent page scroll and trigger zoom-in on scroll down
      ===================================================== */
      if (!enteredRef.current && !fadedRef.current) {
        event.preventDefault();
        if (event.deltaY > 0) {
          triggerZoomIn();
        }
        return;
      }

      /* =====================================================
         SCROLL UP AT TOP OF HERO:
         REVERSE ZOOM OUT TO PORTAL IMAGE
      ===================================================== */
      if (event.deltaY < 0) {
        // If at top of the page (scrollY <= 5) and faded/entered: reverse zoom out
        if ((fadedRef.current || enteredRef.current) && window.scrollY <= 5) {
          event.preventDefault();
          triggerZoomOut();
          return;
        }
      }

      // After transition completes, normal page scrolling works naturally
    };

    // Touch support for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (lockRef.current || (!enteredRef.current && !fadedRef.current)) {
        e.preventDefault();
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 30) return;
      handleWheel({ deltaY, preventDefault: () => {} } as any);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
    };
  }, []);

  return (
    <motion.div
      ref={heroRef}
      initial={{ opacity: 1 }}
      animate={{ opacity: (entered || faded) ? 0 : 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      style={{
        pointerEvents: (entered || faded) ? "none" : "auto",
        visibility: (entered || faded) ? "hidden" : "visible",
        transition: (entered || faded) ? "visibility 0s 0.6s" : "visibility 0s 0s",
      }}
      className="fixed inset-0 z-[200] h-screen w-full overflow-hidden bg-white"
      onClick={() => {
        if (lockRef.current) return;
        if (!enteredRef.current && !fadedRef.current) {
          triggerZoomIn();
        }
      }}
    >
        {/* ===================================================
            VIDEO BOX
            INITIAL:
            480px × 480px
            SCROLL:
            480px × 480px
                 ↓
            100vw × 100vh
        =================================================== */}
        <motion.div
          initial={{
            width: INITIAL_VIDEO_WIDTH,
            height: INITIAL_VIDEO_HEIGHT,
            left: PORTAL_X,
            top: PORTAL_Y,
            x: "-50%",
            y: "-50%",
            borderRadius: "18px",
          }}
          animate={{
            width: entered
              ? "100vw"
              : INITIAL_VIDEO_WIDTH,
            height: entered
              ? "100vh"
              : INITIAL_VIDEO_HEIGHT,
            left: entered
              ? "50%"
              : PORTAL_X,
            top: entered
              ? "50%"
              : PORTAL_Y,
            x: "-50%",
            y: "-50%",
            borderRadius: entered
              ? "0px"
              : "18px",
          }}
          transition={{
            duration: 1.6,
            ease: [0.16, 0.9, 0.3, 1],
          }}
          style={{
            position: "absolute",
            zIndex: 0,
            overflow: "hidden",
            background: "white",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
            boxShadow: "none",
          }}
          className="
            will-change-[width,height,left,top,border-radius]
          "
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            controls={false}
            className="
              absolute
              inset-0
              block
              h-full
              w-full
              object-cover
            "
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              backgroundColor: "white",
            }}
          >
            <source
              src="/entry/entryvideo.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>
        {/* ===================================================
            PORTAL IMAGE
            IMPORTANT FIX:
            The portal image NEVER fades while zooming.
            OLD:
              opacity: entered ? 0 : 1
            NEW:
              opacity: 1
            This keeps the original portal colors during
            the entire zoom animation.
        =================================================== */}
        <motion.div
          initial={{
            scale: 1,
            opacity: 1,
          }}
          animate={{
            scale: entered ? 9 : 1,
            // IMPORTANT:
            // Never fade the portal while zooming.
            opacity: 1,
          }}
          transition={{
            scale: {
              duration: 1.6,
              ease: [0.16, 0.9, 0.3, 1],
            },
            opacity: {
              duration: 0,
            },
          }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            transformOrigin: `${PORTAL_X} ${PORTAL_Y}`,
            // Prevent color fading
            filter: "none",
            opacity: 1,
            mixBlendMode: "normal",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform",
            pointerEvents: "none",
          }}
          className="
            absolute
            inset-0
            z-30
            h-full
            w-full
            pointer-events-none
          "
        >
          <img
            src="/entry/testtry.png"
            alt="KPN Architecture Portal"
            draggable={false}
            className="
              block
              h-full
              w-full
              object-cover
            "
            style={{
              // Keep original image colors
              filter: "none",
              opacity: 1,
              mixBlendMode: "normal",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          />
        </motion.div>
        {/* ===================================================
            KPN LOGO
        =================================================== */}
        <motion.div
          initial={{
            opacity: 1,
            x: 0,
          }}
          animate={{
            opacity: entered ? 0 : 1,
            x: entered ? -80 : 0,
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            absolute
            left-[3%]
            top-[4%]
            z-50
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              rounded-xl
              bg-white
              px-4
              py-2
              shadow-lg
              md:px-5
              md:py-3
            "
          >
            <img
              src="/images/newlogoo.jpeg"
              alt="KPN Promoters"
              draggable={false}
              className="
                w-[90px]
                object-contain
                md:w-[105px]
                lg:w-[120px]
              "
            />
          </div>
        </motion.div>
        {/* ===================================================
            LEFT TEXT
        =================================================== */}
{/* 
        <motion.div
          initial={{
            x: 0,
            opacity: 1,
          }}
          animate={{
            x: entered ? "-120%" : "0%",
            opacity: entered ? 0 : 1,
          }}
          transition={{
            duration: 2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            absolute
            left-[20%]
            top-[30%]
            z-40
            -translate-y-1/2
          "
        >
          <div className="flex flex-col">
            <span
              className="
                text-[4vw]
                font-light
                leading-[0.9]
                tracking-[-0.04em]
                text-white
                md:text-[3.5vw]
                lg:text-[3vw]
              "
            >
              We
            </span>
            <span
              className="
                text-[7vw]
                font-bold
                uppercase
                leading-[0.9]
                tracking-[-0.06em]
                text-white
                md:text-[6vw]
                lg:text-[5vw]
              "
            >
              BUILD
            </span>
          </div>
        </motion.div> */}
        {/* ===================================================
            RIGHT TEXT
        =================================================== */}
{/* 
        <motion.div
          initial={{
            x: 0,
            opacity: 1,
          }}
          animate={{
            x: entered ? "120%" : "0%",
            opacity: entered ? 0 : 1,
          }}
          transition={{
            duration: 2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            absolute
            right-[20%]
            top-[30%]
            z-40
            -translate-y-1/2
            text-right
          "
        >
          <div className="flex flex-col">
            <span
              className="
                text-[4vw]
                font-light
                leading-[0.9]
                tracking-[-0.04em]
                text-white
                md:text-[3.5vw]
                lg:text-[3vw]
              "
            >
              Your
            </span>
            <span
              className="
                text-[7vw]
                font-bold
                leading-[0.9]
                tracking-[-0.06em]
                text-white
                md:text-[6vw]
                lg:text-[5vw]
              "
            >
              Future
            </span>
          </div>
        </motion.div> */}

      </motion.div>
  );
}