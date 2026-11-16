'use client';

import Link from 'next/link';
import { featuresData } from '@/data/siteData';
import RunningPillBadge from '../ui/RunningPillBadge';
import FadeIn from '../animation/FadeIn';
import StaggerContainer from '../animation/StaggerContainer';
import StaggerItem from '../animation/StaggerItem';

export default function FeaturesSection() {
  return (
    <section className="relative z-10 bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Header */}
        <FadeIn direction="up" className="mx-auto mb-20 max-w-3xl space-y-4 text-center">
          <RunningPillBadge text="WHAT MAKES US DIFFERENT" />
          <h2 className="text-4xl font-extrabold leading-[1.15] text-[#29247c] sm:text-5xl lg:text-6xl tracking-tight">
            An exceptional quality that can&apos;t be beaten
          </h2>
        </FadeIn>

        {/* 4 Feature Columns */}
        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12"
        >
          {featuresData.map((item) => (
            <StaggerItem
              key={item.num}
              className="group flex flex-col justify-between p-2 transition-all duration-300 h-full"
            >
              <div className="flex flex-col flex-1 justify-between">
                {/* Top Section: Number & Title */}
                <div>
                  <span className="block text-6xl font-extrabold text-[#f12131] tracking-tighter sm:text-7xl lg:text-8xl">
                    {item.num}
                  </span>

                  <h3 className="mb-4 mt-2 min-h-[64px] text-xl font-bold leading-snug text-[#29247c] sm:text-2xl">
                    {item.title}
                  </h3>

                  <hr className="mb-6 border-t border-slate-200/80" />
                </div>

                {/* Feature Image */}
                <div className="relative my-6 flex flex-col items-center justify-center">
                  <div className="relative h-52 sm:h-60 w-full overflow-hidden rounded-xl bg-slate-100 shadow-xs">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm font-normal leading-relaxed text-slate-500 mt-auto">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom Link Banner */}
        <FadeIn direction="up" delay={0.2} className="mt-20 text-center text-sm font-bold text-[#29247c]">
          Defining the standards of real estate development.{' '}
          <Link
            href="#contact"
            className="text-[#f12131] underline underline-offset-4 decoration-[#f12131] transition-colors hover:text-red-700 hover:scale-[1.02] inline-block transform"
          >
            Ask for a quote
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}