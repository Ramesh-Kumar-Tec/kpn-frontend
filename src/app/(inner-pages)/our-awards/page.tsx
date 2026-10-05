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
              AWARDS SHOWCASE GRID
          ====================================================== */}
          <StaggerContainer staggerDelay={0.08} className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-20">

            {(awards || []).map((award, index) => (
              <StaggerItem key={award.id || award._id || index}>
                <article
                  className="
                    group
                    relative
                    flex
                    h-full
                    flex-col
                    sm:flex-row
                    items-center
                    gap-6
                    rounded-3xl
                    border
                    border-slate-200/80
                    bg-white
                    p-6
                    shadow-[0_4px_24px_rgba(0,0,0,0.04)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-slate-300
                    hover:shadow-[0_12px_36px_rgba(41,36,124,0.08)]
                    sm:p-8
                  "
                >

                  {/* =================================================
                      AWARD IMAGE BOX
                  ================================================== */}
                  <div
                    onClick={() => setSelectedImage({ src: award.image, title: award.title })}
                    className="
                      relative
                      flex
                      h-[200px]
                      w-full
                      sm:w-[170px]
                      shrink-0
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-2xl
                      bg-slate-50
                      p-4
                      border
                      border-slate-100
                      transition-all
                      duration-300
                      group-hover:bg-amber-50/40
                      group-hover:border-amber-200/60
                    "
                    title="Click to view full image"
                  >
                    <img
                      src={award.image}
                      alt={award.title}
                      className="
                        max-h-[170px]
                        max-w-full
                        object-contain
                        drop-shadow-md
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                      onError={(e: any) => {
                        e.target.src = '/images/awards/Trusted-Developer-2025.png';
                      }}
                    />

                    {/* Quick zoom icon */}
                    <div className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-400 opacity-0 shadow-xs transition-opacity group-hover:opacity-100 hover:text-[#29247c]">
                      <ZoomIn className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* =================================================
                      AWARD DETAILS & DESCRIPTION
                  ================================================== */}
                  <div className="flex flex-1 flex-col justify-between self-stretch">
                    <div>
                      {/* Year badge & Category */}
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-extrabold text-[#f12131]">
                          <Calendar className="h-3 w-3" />
                          {award.year}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                          <Award className="h-3 w-3 text-[#29247c]" />
                          {award.organization}
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        className="
                          mt-3
                          text-xl
                          font-extrabold
                          leading-snug
                          tracking-tight
                          text-[#29247c]
                          transition-colors
                          duration-300
                          group-hover:text-[#f12131]
                          sm:text-[22px]
                        "
                      >
                        {award.title}
                      </h2>

                      {/* Full Award Description from Reference */}
                      <p
                        className="
                          mt-3
                          text-sm
                          leading-relaxed
                          text-slate-600
                          sm:text-[15px]
                        "
                      >
                        {award.description || `${award.title} presented to KPN Promoters Pvt. Ltd. by ${award.organization}.`}
                      </p>
                    </div>

                    {/* Footer divider and status */}
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
                      <span className="font-semibold text-slate-500">
                        KPN Promoters Pvt. Ltd.
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                        <Trophy className="h-3 w-3 text-amber-500" />
                        Verified Honor
                      </span>
                    </div>

                  </div>

                </article>
              </StaggerItem>
            ))}

          </StaggerContainer>

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