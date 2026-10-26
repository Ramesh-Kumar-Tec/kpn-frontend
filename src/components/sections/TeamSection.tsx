'use client';

import Link from 'next/link';
import { teamData } from '@/data/siteData';
import RunningPillBadge from '../ui/RunningPillBadge';
import StaggerContainer from '../animation/StaggerContainer';
import StaggerItem from '../animation/StaggerItem';

export default function TeamSection() {
  return (
    <section id="team" className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Title Grid */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start"
        >
          <StaggerItem className="space-y-4 pr-6">
            <RunningPillBadge text="MEET THE TEAM" />
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#29247c] tracking-tight leading-[1.15]">
              Global executive leadership
            </h2>
          </StaggerItem>

          {/* Member 1 & 2 */}
          {teamData.slice(0, 2).map((member) => (
            <StaggerItem
              key={member.name}
              className="group relative rounded-[36px] overflow-hidden bg-white shadow-lg border border-slate-100/60 aspect-[3/4] cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={member.image}
                alt={member.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Bottom gradient info panel matching reference design */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/90 via-slate-800/60 to-transparent pt-12 pb-6 px-6 text-center">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300/90 block">
                  {member.role}
                </span>
                <h3 className="text-2xl font-black text-white mt-1 leading-tight tracking-tight">
                  {member.name}
                </h3>
              </div>
              {/* Red arrow button top right */}
              <div className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#f12131] text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M18 6H8M18 6V16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </StaggerItem>
          ))}

          {/* Member 3 & 4 */}
          {teamData.slice(2, 4).map((member) => (
            <StaggerItem
              key={member.name}
              className="group relative rounded-[36px] overflow-hidden bg-white shadow-lg border border-slate-100/60 aspect-[3/4] cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={member.image}
                alt={member.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Bottom gradient info panel matching reference design */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/90 via-slate-800/60 to-transparent pt-12 pb-6 px-6 text-center">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300/90 block">
                  {member.role}
                </span>
                <h3 className="text-2xl font-black text-white mt-1 leading-tight tracking-tight">
                  {member.name}
                </h3>
              </div>
              {/* Red arrow button top right */}
              <div className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#f12131] text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M18 6H8M18 6V16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </StaggerItem>
          ))}

          {/* Career CTA Card matching reference design */}
          <StaggerItem className="rounded-[36px] bg-white p-8 border border-slate-100/90 shadow-lg aspect-[3/4] flex flex-col justify-between relative group cursor-pointer hover:shadow-2xl transition-all duration-300">
            <div>
              {/* Overlapping Employee Avatars + Red Badge */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex -space-x-3 items-center">
                  <img
                    className="h-15 w-15 rounded-full border-2 border-white object-cover shadow-sm"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                    alt="Avatar 1"
                  />
                  <img
                    className="h-15 w-15 rounded-full border-2 border-white object-cover shadow-sm"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                    alt="Avatar 2"
                  />
                  <img
                    className="h-15 w-15 rounded-full border-2 border-white object-cover shadow-sm"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                    alt="Avatar 3"
                  />
                  <img
                    className="h-15 w-15 rounded-full border-2 border-white object-cover shadow-sm"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80"
                    alt="Avatar 4"
                  />
                </div>

                <Link
                  href="/careers"
                  aria-label="View career opportunities"
                  className="h-15 w-15 rounded-full bg-[#f12131] flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path
                      d="M6 18L18 6M18 6H8M18 6V16"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </Link>
              </div>

              <span className="text-xs font-bold text-[#29247c] uppercase tracking-widest block">
                JOIN OUR TEAM
              </span>
              <h3 className="text-4xl font-black text-[#29247c] mt-16 leading-tight tracking-tight">
                Start a career with KPN Promoters.
              </h3>
            </div>

            <Link
              href="/careers"
              className="w-full rounded-full bg-[#f12131] py-3.5 px-6 flex items-center justify-between text-white font-bold text-sm shadow-md transition-all hover:bg-red-600 active:scale-98"
            >
              <span>Current Openings</span>
              <span className="h-8 w-8 rounded-full border border-white/40 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 18L18 6M18 6H8M18 6V16"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}