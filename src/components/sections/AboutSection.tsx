'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Counter from '../ui/Counter';
import RunningPillBadge from '../ui/RunningPillBadge';
import FadeIn from '../animation/FadeIn';
import StaggerContainer from '../animation/StaggerContainer';
import StaggerItem from '../animation/StaggerItem';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-20 -mt-8 w-full rounded-t-[36px] bg-white pb-16 pt-16 md:rounded-t-[50px] lg:pb-24 lg:pt-20 shadow-2xl shadow-slate-900/5"
    >
      <div className="mx-auto max-w-[1520px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          
          {/* =========================================
              LEFT COLUMN: Header, Counters & Details
             ========================================= */}
          <StaggerContainer staggerDelay={0.12} className="space-y-7 lg:col-span-7 xl:col-span-7">
            
            <StaggerItem>
              <div className="inline-flex items-center gap-2">
                <RunningPillBadge text="ABOUT KPN PROMOTERS" />
              </div>
            </StaggerItem>

            {/* Main Title */}
            <StaggerItem>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#221e68] sm:text-4xl lg:text-[42px] lg:leading-[1.2]">
                KPN PROMOTERS: TRUSTED
                <br className="hidden sm:inline" />
                {' '}HOME BUILDERS IN CHENNAI
              </h2>
            </StaggerItem>

            {/* 3 Interactive Stat Counters */}
            <StaggerItem>
              <div className="grid grid-cols-3 gap-4 border-y border-slate-100 py-6 sm:gap-6">
                
                {/* Stat 1 */}
                <div className="flex flex-col">
                  <div className="text-3xl font-black tracking-tight text-[#221e68] sm:text-4xl lg:text-5xl">
                    <Counter value={20} suffix="+" />
                  </div>
                  <span className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">
                    Years Of Experience
                  </span>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col border-x border-slate-100 px-3 sm:px-6">
                  <div className="text-3xl font-black tracking-tight text-[#221e68] sm:text-4xl lg:text-5xl">
                    <Counter value={120} suffix="+" />
                  </div>
                  <span className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">
                    Completed Projects
                  </span>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col">
                  <div className="text-3xl font-black tracking-tight text-[#221e68] sm:text-4xl lg:text-5xl">
                    <Counter value={2} suffix="k+" />
                  </div>
                  <span className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">
                    Happy Customers
                  </span>
                </div>
              </div>
            </StaggerItem>

            {/* Paragraph Content */}
            <StaggerItem>
              <div className="space-y-4 text-base font-normal leading-relaxed text-slate-600 sm:text-lg">
                <p>
                  At <strong className="font-semibold text-slate-900">KPN Promoters Pvt Ltd</strong>,
                  we&apos;re dedicated to building high-quality homes in and around Chennai, combining thoughtful design,
                  lasting construction, and customer-focused service. From well-planned plots to modern residential
                  spaces, each project reflects our commitment to excellence, transparency, and value.
                </p>
                <p>
                  With a legacy of trust and over a decade of experience, we focus on timely delivery,
                  sustainable practices, and long-term relationships. Whether you&apos;re buying your first home
                  or investing for the future, <strong className="font-semibold text-slate-900">KPN Promoters</strong> is here
                  to turn your vision into reality.
                </p>
              </div>
            </StaggerItem>

            {/* Trust Highlights & CTA */}
            <StaggerItem>
              <div className="flex flex-wrap items-center gap-4 pt-2 sm:gap-6">
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#f12131] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/35 active:scale-95"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/about-us"
                  className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-6 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-100 active:scale-95"
                >
                  <span>About Our Legacy</span>
                </Link>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* =========================================
              RIGHT COLUMN: Chairman Details Card
             ========================================= */}
          <div className="flex justify-center lg:col-span-5 xl:col-span-5">
            <FadeIn direction="up" delay={0.2} className="w-full max-w-[560px]">
              <div className="group relative overflow-hidden rounded-[28px] border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-200/70 transition-all duration-500 hover:shadow-red-500/10 sm:p-3 md:rounded-[36px]">
                
                {/* Background Ambient Glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-blue-600/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                {/* Chairman Visual Graphic */}
                <div className="relative overflow-hidden rounded-[22px] bg-slate-50 md:rounded-[30px]">
                  <Image
                    src="/images/about/kpn-promoters.png"
                    alt="V Kanniyappan B.Com - Chairman of KPN Promoters Pvt Ltd"
                    width={878}
                    height={711}
                    priority
                    className="h-auto w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </div>

                {/* Subtle verified badge pill on bottom */}
                <div className="mt-3 flex items-center justify-between px-3 py-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Verified Leadership
                  </span>
                  <span className="font-semibold text-[#221e68]">
                    Established 2004
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
