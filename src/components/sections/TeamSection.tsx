'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { teamData } from '@/data/siteData';
import FadeIn from '../animation/FadeIn';
import RunningPillBadge from '../ui/RunningPillBadge';

// Custom focus positions so portraits are perfectly framed without cutting off faces/chins
const memberImagePositions: Record<string, string> = {
  'Mr. V.Kanniyappan': 'object-[center_10%]',
  'Ms.Krishma': 'object-[center_5%]',
  'Mr.Amarnath': 'object-[center_32%]',
};

export default function TeamSection() {
  // Show only the first three leadership team members matching the client mockup
  const leadershipMembers = teamData.slice(0, 3);

  return (
    <section id="team" className="relative w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================
            HEADER SECTION (Matches Client Mockup)
        ========================================================== */}
        <FadeIn direction="up">
          <div className="max-w-3xl mb-10 sm:mb-12">
            {/* Running Pill Badge */}
            <div className="mb-2">
              <RunningPillBadge text="OUR LEADERSHIP" />
            </div>

            {/* Main Heading */}
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#29247c] sm:text-4xl lg:text-[42px] leading-[1.1]">
              Meet the people behind KPN.
            </h2>

            {/* Subtitle */}
            <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base leading-relaxed">
              Leadership that brings vision, experience and commitment to every milestone.
            </p>
          </div>
        </FadeIn>

        {/* =========================================================
            LEADERSHIP CARDS (Compact 3-Column Layout Matching Client Mockup)
        ========================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {leadershipMembers.map((member, index) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -6 }}
              transition={{
                duration: 0.45,
                delay: index * 0.12,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:shadow-lg hover:border-slate-300/80"
            >
              {/* Top Photo Container - Controlled compact height */}
              <div className="relative h-[250px] sm:h-[270px] lg:h-[280px] w-full overflow-hidden bg-slate-100">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                  className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                    memberImagePositions[member.name] || 'object-center'
                  }`}
                />
              </div>

              {/* Leader Info Body */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  {/* Name (Heading) */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#29247c] transition-colors group-hover:text-[#f12131]">
                    {member.name}
                  </h3>

                  {/* Role / Designation (Red Subtitle) */}
                  <p className="mt-1 text-xs sm:text-[13px] font-extrabold text-[#f12131] uppercase tracking-wider">
                    {member.role}
                  </p>

                  {/* Leadership Vertical Tag */}
                  {member.tag && (
                    <span className="mt-0.5 block text-xs font-semibold text-slate-400">
                      {member.tag}
                    </span>
                  )}

                  {/* Profile Description */}
                  {member.bio && (
                    <p className="mt-3 border-t border-slate-100 pt-2.5 text-xs sm:text-[13px] font-normal text-slate-500 leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* =========================================================
            BOTTOM ACTION BUTTON (More About Our Team)
        ========================================================== */}
        <FadeIn direction="up" delay={0.25}>
          <div className="mt-10 sm:mt-12">
            <Link
              href="/about-us"
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-6 py-3 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs transition-all hover:border-[#29247c] hover:text-[#29247c] hover:shadow-xs active:scale-95"
            >
              <span>More About Our Team</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 text-slate-400 group-hover:text-[#29247c]" />
            </Link>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
