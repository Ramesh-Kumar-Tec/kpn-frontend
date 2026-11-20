'use client';

import { Eye, Target } from 'lucide-react';
import RunningPillBadge from '@/components/ui/RunningPillBadge';
import FadeIn from '@/components/animation/FadeIn';

export default function VisionMissionSection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50/50 to-white px-6 py-20 sm:py-24 lg:px-10 lg:py-32">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">

        {/* Section Header */}
        <FadeIn direction="up" className="mx-auto max-w-3xl text-center">
          <RunningPillBadge text="VISION & MISSION" />

          <h2 className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.03em] text-[#342987] sm:text-5xl lg:text-[54px]">
            Driven by Vision. <br className="hidden sm:inline" />
            <span className="text-[#f12131]">Committed to Mission.</span>
          </h2>

          <p className="mt-5 text-base font-medium leading-relaxed text-gray-600 sm:text-lg">
            The enduring pillars that guide our journey toward delivering quality homes, transforming communities, and building lifelong trust.
          </p>
        </FadeIn>

        {/* Vision & Mission Cards Grid */}
        <FadeIn direction="up" delay={0.2} className="mt-14 sm:mt-16 lg:mt-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">

            {/* =========================
                VISION CARD
            ========================== */}
            <div className="group relative overflow-hidden rounded-[32px] border border-gray-100 bg-gradient-to-br from-white via-indigo-50/25 to-white p-8 sm:p-11 shadow-xl shadow-indigo-950/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#342987] to-indigo-500" />

              {/* Decorative Watermark */}
              <div className="pointer-events-none absolute -bottom-6 -right-6 text-8xl font-black text-indigo-900/[0.03] select-none">
                VISION
              </div>

              {/* Icon & Tag */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#342987]/10 text-[#342987] transition-transform duration-300 group-hover:scale-110">
                  <Eye className="h-7 w-7" />
                </div>
                <span className="rounded-full bg-[#342987]/10 px-4 py-1.5 text-xs font-black tracking-widest text-[#342987] uppercase">
                  VISION
                </span>
              </div>

              <h3 className="mt-7 text-2xl sm:text-3xl font-black tracking-tight text-[#342987]">
                Shaping Future-Ready Spaces
              </h3>

              <div className="mt-6 space-y-4 text-base font-medium leading-[1.75] text-gray-600 sm:text-lg">
                <p>
                  At <strong className="font-bold text-[#342987]">KPN Promoters Pvt Ltd</strong>, our vision is to be a trusted leader in the real estate industry by delivering <span className="font-semibold text-gray-900">quality-driven, future-ready spaces</span> that enhance lives & communities.
                </p>
                <p>
                  We aspire to expand across multiple states & diversify into industries like <span className="font-semibold text-gray-900">software, online trading, food, and e-commerce</span> — all while upholding our core values of trust, transparency, & customer satisfaction. Our goal is to create not just structures, but lifestyles that inspire comfort, pride, & long-term value.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="mt-8 flex flex-wrap gap-2.5 pt-6 border-t border-gray-100">
                <span className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
                  Future-Ready Spaces
                </span>
                <span className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
                  Multi-State Expansion
                </span>
                <span className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
                  Long-Term Value
                </span>
              </div>
            </div>

            {/* =========================
                MISSION CARD
            ========================== */}
            <div className="group relative overflow-hidden rounded-[32px] border border-gray-100 bg-gradient-to-br from-white via-red-50/25 to-white p-8 sm:p-11 shadow-xl shadow-red-950/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#f12131] to-rose-500" />

              {/* Decorative Watermark */}
              <div className="pointer-events-none absolute -bottom-6 -right-6 text-8xl font-black text-red-900/[0.03] select-none">
                MISSION
              </div>

              {/* Icon & Tag */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f12131]/10 text-[#f12131] transition-transform duration-300 group-hover:scale-110">
                  <Target className="h-7 w-7" />
                </div>
                <span className="rounded-full bg-[#f12131]/10 px-4 py-1.5 text-xs font-black tracking-widest text-[#f12131] uppercase">
                  MISSION
                </span>
              </div>

              <h3 className="mt-7 text-2xl sm:text-3xl font-black tracking-tight text-[#f12131]">
                Delivering Excellence & Trust
              </h3>

              <div className="mt-6 space-y-4 text-base font-medium leading-[1.75] text-gray-600 sm:text-lg">
                <p>
                  Our mission is to provide <span className="font-semibold text-gray-900">exceptional real estate solutions that exceed expectations</span> — through quality construction, clear communication, and timely delivery.
                </p>
                <p>
                  We are committed to guiding every customer with <span className="font-semibold text-gray-900">integrity and personalized support</span> from start to finish. By fostering innovation, continuous learning, and a customer-first culture, we strive to build lasting relationships, strong communities, and a brighter future for all.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="mt-8 flex flex-wrap gap-2.5 pt-6 border-t border-gray-100">
                <span className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
                  Quality Construction
                </span>
                <span className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
                  Clear Communication
                </span>
                <span className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
                  Timely Delivery
                </span>
              </div>
            </div>

          </div>
        </FadeIn>

      </div>
    </section>
  );
}
