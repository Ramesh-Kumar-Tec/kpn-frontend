'use client';

import { useState, useEffect } from 'react';
import { Trophy, Calendar, Award, ZoomIn, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import { awardsData, AwardItem } from '@/data/siteData';
import { getAwards } from '@/lib/cmsClient';
import RunningPillBadge from '@/components/ui/RunningPillBadge';
import FadeIn from '@/components/animation/FadeIn';
import StaggerContainer from '@/components/animation/StaggerContainer';
import StaggerItem from '@/components/animation/StaggerItem';

export default function OurAwardsPage() {
  const [awards, setAwards] = useState<AwardItem[]>(awardsData);
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    async function loadAwards() {
      try {
        const fetched = await getAwards();
        if (fetched && fetched.length > 0) {
          setAwards(fetched);
        }
      } catch (err) {
        console.warn('Failed to fetch awards, using fallback');
      }
    }
    loadAwards();
  }, []);

  return (
    <>
      <Navbar variant="hero" />

      <InnerPageHero
        title="Our Awards"
        breadcrumb="Our Awards"
        description="A showcase of the milestones, honors, and achievements that define our journey of excellence."
        image="/images/projects/project_4.jpg"
      />

      {/* =========================================================
          AWARDS SECTION
      ========================================================== */}
      <section className="bg-gradient-to-b from-white via-slate-50/50 to-white px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1450px]">

          {/* =====================================================
              SECTION INTRO
          ====================================================== */}
          <FadeIn direction="up" className="mx-auto max-w-[850px] text-center">

            {/* Small label */}
            <RunningPillBadge text="HONORS & RECOGNITION" />

            {/* Main heading */}
            <h1
              className="
                mt-8
                text-4xl
                font-extrabold
                leading-[1.05]
                tracking-[-0.04em]
                text-[#29247c]
                sm:text-5xl
                lg:text-[68px]
              "
            >
              Celebrating Our
              <br />
              Milestones of Excellence
            </h1>

            {/* Description */}
            <p
              className="
                mx-auto
                mt-6
                max-w-[760px]
                text-base
                font-medium
                leading-relaxed
                text-slate-600
                sm:text-lg
              "
            >
              For over two decades, KPN Promoters has been honored by leading industry bodies,
              financial institutions, and developer associations for unwavering commitment to quality and transparency.
            </p>

          </FadeIn>


          {/* =====================================================
              AWARDS SHOWCASE - DIVIDER GRID (3x3 Layout)
          ====================================================== */}
          <div className="mt-16 lg:mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {(awards || []).map((award, index) => {
                const total = (awards || []).length;
                const lastRowStartIndex = Math.floor((total - 1) / 3) * 3;
                const showHorizontalLine = index < lastRowStartIndex;
                
                // Explicit desktop & tablet border right rules
                const hasDesktopBorder = index % 3 !== 2;
                const hasTabletBorder = index % 2 === 0;

                return (
                  <div
                    key={award.id || award._id || index}
                    className="
                      relative
                      flex
                      flex-col
                      items-center
                      text-center
                      justify-between
                      p-6
                      sm:p-8
                      lg:p-10
                      transition-colors
                      duration-300
                      hover:bg-slate-50/40
                      group
                    "
                  >
                    {/* Vertical cut divider line on the right */}
                    {hasDesktopBorder && (
                      <div className="hidden lg:block absolute right-0 top-10 bottom-10 w-[1px] bg-slate-200" />
                    )}
                    {hasTabletBorder && (
                      <div className="hidden md:block lg:hidden absolute right-0 top-10 bottom-10 w-[1px] bg-slate-200" />
                    )}

                    <div className="flex flex-col items-center w-full">
                      {/* Award Trophy / Certificate Image */}
                      <div
                        onClick={() => setSelectedImage({ src: award.image, title: award.title })}
                        className="
                          relative
                          flex
                          h-[220px]
                          w-full
                          cursor-pointer
                          items-center
                          justify-center
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                        title="Click to view full image"
                      >
                        <img
                          src={award.image}
                          alt={award.title}
                          className="
                            max-h-[200px]
                            max-w-[200px]
                            object-contain
                            drop-shadow-md
                            transition-transform
                            duration-300
                          "
                          onError={(e: any) => {
                            e.target.src = '/images/awards/Trusted-Developer-2025.png';
                          }}
                        />

                        {/* Subtle zoom indicator on hover */}
                        <div className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-400 opacity-0 shadow-xs transition-opacity group-hover:opacity-100 hover:text-[#29247c]">
                          <ZoomIn className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Award Info */}
                      <div className="mt-6 flex flex-col items-center space-y-2 max-w-[340px]">
                        {/* Year */}
                        <span className="text-xs sm:text-sm font-black tracking-widest text-[#29247c]/70">
                          {award.year}
                        </span>

                        {/* Title */}
                        <h2 className="text-xl sm:text-[22px] font-black tracking-tight text-[#29247c] leading-snug group-hover:text-[#f12131] transition-colors">
                          {award.title}
                        </h2>

                        {/* Organization */}
                        <p className="text-xs sm:text-sm font-semibold text-slate-500">
                          {award.organization}
                        </p>

                        {/* Description */}
                        <p className="pt-2 text-xs sm:text-[13px] font-medium leading-relaxed text-slate-600">
                          {award.description || `${award.title} presented to KPN Promoters Pvt. Ltd. by ${award.organization}.`}
                        </p>
                      </div>
                    </div>

                    {/* Centered horizontal cut divider line under card */}
                    <div className="w-full pt-8 sm:pt-10">
                      {showHorizontalLine && (
                        <div className="w-[70%] max-w-[260px] h-[1px] bg-slate-200 mx-auto" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          IMAGE PREVIEW MODAL
      ========================================================== */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[65vh] w-auto object-contain drop-shadow-xl"
              />
              <h3 className="mt-4 text-center text-lg font-bold text-[#29247c]">
                {selectedImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TESTIMONIALS
      ========================================================== */}
      <TestimonialsSection />
    </>
  );
}