'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { learnMoreCards } from '@/data/learnMoreCards';
import RunningPillBadge from '@/components/ui/RunningPillBadge';
import FadeIn from '@/components/animation/FadeIn';
import StaggerContainer from '@/components/animation/StaggerContainer';
import StaggerItem from '@/components/animation/StaggerItem';

export default function LearnMoreSection() {
  return (
    <section className="bg-white py-24 sm:py-28 lg:py-32">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">

        {/* =========================
            SECTION HEADER
        ========================== */}
        <FadeIn direction="up" className="mb-12 sm:mb-16">

          <RunningPillBadge text="EXPLORE COMPANY" />

          <h2 className="max-w-[600px] text-[48px] font-bold leading-[0.95] tracking-[-2px] text-[#392b8f] sm:text-[60px] lg:text-[72px]">
            Learn more
            <br />
            about us
          </h2>

        </FadeIn>


        {/* =========================
            CARDS
        ========================== */}
        <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {learnMoreCards.map((card) => {

            const isImageCard = Boolean(card.image);

            return (
              <StaggerItem key={card.num}>
              <Link
                href={card.href || '#'}
                className={`
                  group
                  relative
                  min-h-[430px]
                  overflow-hidden
                  rounded-[26px]
                  ${card.bg}
                  transition-transform
                  duration-500
                  hover:-translate-y-1
                  block
                `}
              >

                {/* =========================
                    BACKGROUND IMAGE
                ========================== */}
                {isImageCard && (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: `url('${card.image}')`,
                      }}
                    />

                    {/* Image dark overlay */}
                    <div className="absolute inset-0 bg-black/45" />
                  </>
                )}


                {/* =========================
                    CARD CONTENT
                ========================== */}
                <div className="relative z-10 flex h-full min-h-[430px] flex-col p-8 sm:p-9">

                  {/* NUMBER */}
                  <div className="text-xs font-medium text-red-500">
                    {card.num}
                  </div>

                  {/* TOP LINE */}
                  <div className="mt-4 h-px w-full bg-white/50" />


                  {/* CONTENT AT BOTTOM */}
                  <div className="mt-auto">

                    <h3
                      className={`
                        mb-3
                        max-w-[280px]
                        text-[30px]
                        font-bold
                        leading-[1]
                        tracking-[-1px]
                        ${
                          card.textColor ||
                          (isImageCard
                            ? 'text-white'
                            : 'text-white')
                        }
                      `}
                    >
                      {card.title}
                    </h3>

                    <p
                      className={`
                        max-w-[290px]
                        text-sm
                        leading-relaxed
                        ${
                          isImageCard
                            ? 'text-white/80'
                            : 'text-white/80'
                        }
                      `}
                    >
                      {card.description}
                    </p>


                    {/* BUTTON */}
                    <div className="mt-6 flex items-center">

                      <span className="border-b border-red-500 pb-1 text-xs font-semibold text-red-500 transition-colors group-hover:text-red-400">
                        {card.btnText}
                      </span>

                    </div>

                  </div>

                </div>


                {/* =========================
                    BOTTOM RIGHT CIRCLE
                ========================== */}
                <div className="absolute bottom-0 right-0 z-20 flex h-14 w-14 translate-x-1/4 translate-y-1/4 items-center justify-center rounded-full bg-[#f52235] ring-[10px] ring-white">

                  <ArrowUpRight
                    className="h-5 w-5 text-white"
                    strokeWidth={2}
                  />

                </div>

              </Link>
              </StaggerItem>
            );
          })}

        </StaggerContainer>

      </div>
    </section>
  );
}