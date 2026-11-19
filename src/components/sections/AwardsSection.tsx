'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy } from 'lucide-react';
import { awardsData, AwardItem } from '@/data/siteData';
import { getAwards } from '@/lib/cmsClient';
import FadeIn from '../animation/FadeIn';
import RunningPillBadge from '../ui/RunningPillBadge';

export default function AwardsSection() {
  const [awards, setAwards] = useState<AwardItem[]>([]);

  useEffect(() => {
    async function loadAwards() {
      try {
        const fetched = await getAwards();
        if (fetched && fetched.length > 0) {
          // Sort to prioritize the most prestigious & latest awards (2025, 2024)
          const sorted = [...fetched].sort((a, b) => {
            const yA = parseInt(a.year) || 0;
            const yB = parseInt(b.year) || 0;
            return yB - yA;
          });
          setAwards(sorted);
          return;
        }
      } catch (err) {
        console.warn('Failed to load awards, using fallback');
      }

      // Default fallback sorted latest first
      const defaultSorted = [...awardsData].sort((a, b) => {
        const yA = parseInt(a.year) || 0;
        const yB = parseInt(b.year) || 0;
        return yB - yA;
      });
      setAwards(defaultSorted);
    }

    loadAwards();
  }, []);

  // Show the top 3 latest awards matching the client mockup's 3-column milestone grid
  const displayAwards = awards.length > 0 ? awards.slice(0, 3) : awardsData.slice(0, 3);

  return (
    <section id="awards" className="relative w-full bg-slate-50/60 py-16 sm:py-20 lg:py-24 border-t border-slate-100">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================
            HEADER SECTION (Matches Client Mockup)
        ========================================================== */}
        <FadeIn direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-3xl">
              {/* Running Pill Badge */}
              <div className="mb-2">
                <RunningPillBadge text="AWARDS & HONORS" />
              </div>

              {/* Main Heading */}
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#29247c] sm:text-4xl lg:text-[42px] leading-[1.1]">
                Milestones worth celebrating.
              </h2>

              {/* Subtitle */}
              <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base leading-relaxed">
                Recognition that reflects our work, our people and our commitment.
              </p>
            </div>

            {/* Right Action Button (View All Awards) */}
            <div className="shrink-0">
              <Link
                href="/our-awards"
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-5 py-2 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs transition-all hover:border-[#29247c] hover:text-[#29247c] hover:shadow-xs active:scale-95"
              >
                <span>View All Awards</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 text-slate-400 group-hover:text-[#29247c]" />
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* =========================================================
            AWARDS MILESTONE CARDS (Compact 3-Column Layout Matching Mockup)
        ========================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {displayAwards.map((award, index) => (
            <motion.article
              key={award.id || award.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -6 }}
              transition={{
                duration: 0.45,
                delay: index * 0.12,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-slate-200/90 bg-white p-5 sm:p-5.5 shadow-xs transition-all duration-300 hover:shadow-lg hover:border-slate-300/80"
            >
              {/* Top Trophy Showcase Box */}
              <div className="relative flex h-[180px] sm:h-[195px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-gradient-to-b from-slate-50 via-slate-50/70 to-white p-3">
                {/* Floating Year Pill on Top-Right */}
                {award.year && (
                  <span className="absolute top-3 right-3 rounded-full bg-[#f12131]/10 px-3 py-1 text-[11px] font-extrabold text-[#f12131] border border-[#f12131]/20">
                    {award.year}
                  </span>
                )}

                {/* Real Trophy / Shield Photograph */}
                {award.image ? (
                  <div className="relative h-full w-full flex items-center justify-center">
                    <img
                      src={award.image}
                      alt={award.title}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-108 group-hover:drop-shadow-xl"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500 border border-amber-200">
                    <Trophy className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Award Details (Title & Organization Matching Client Format) */}
              <div className="mt-5 flex flex-1 flex-col justify-between text-center sm:text-left">
                <div>
                  {/* Award Name (Heading) */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#29247c] transition-colors group-hover:text-[#f12131] leading-snug line-clamp-2">
                    {award.title}
                  </h3>

                  {/* Awarding Organization & Metadata (Client Mockup Subtitle format) */}
                  <p className="mt-2 text-xs sm:text-sm font-medium text-slate-500 line-clamp-2">
                    {award.organization}
                    {award.year && (
                      <span className="text-slate-400"> • {award.year}</span>
                    )}
                  </p>
                </div>

                {/* View Details Link */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Verified Award
                  </span>
                  <Link
                    href="/our-awards"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#29247c] transition-colors group-hover:text-[#f12131]"
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
