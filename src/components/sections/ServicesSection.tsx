'use client';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { servicesData } from '@/data/siteData';
import RunningPillBadge from '../ui/RunningPillBadge';
import FadeIn from '../animation/FadeIn';

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative z-10 w-full overflow-visible bg-slate-50/60 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-6 lg:px-12">

        {/* =========================
            HEADER
        ========================= */}
        <FadeIn direction="up" className="mb-14 space-y-4 text-center sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center rounded-full px-5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <RunningPillBadge text="Our Services" />
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-[#29247c] sm:text-5xl lg:text-6xl">
            Our services
          </h2>
        </FadeIn>

        {/* =========================
            STACKING CONTAINER
        ========================= */}
        <div className="relative pb-8 lg:pb-16">
          {servicesData.map((service, index) => {
            const isImageLeft = index % 2 === 0;

            return (
              <div
                key={service.id}
                className="sticky top-24 sm:top-28 lg:top-32 mb-12 sm:mb-16 lg:mb-20 last:mb-0"
                style={{
                  zIndex: index + 1,
                }}
              >
                {/* =========================
                    SERVICE CARD
                ========================= */}
                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[28px]
                    p-6
                    bg-white
                    text-slate-900
                    border
                    border-slate-200/90
                    shadow-[0_15px_45px_rgba(15,23,42,0.08)]
                    hover:bg-[#29247c]
                    hover:border-[#29247c]
                    hover:shadow-[0_25px_65px_rgba(41,36,124,0.38)]
                    transition-all
                    duration-500
                    sm:rounded-[34px]
                    sm:p-8
                    lg:rounded-[40px]
                    lg:p-10
                    xl:p-12
                  "
                >
                  <div
                    className="
                      grid
                      grid-cols-1
                      items-center
                      gap-7
                      md:gap-8
                      lg:grid-cols-12
                      lg:gap-10
                      xl:gap-14
                    "
                  >
                    {/* =========================
                        IMAGE
                    ========================= */}
                    <div
                      className={`
                        lg:col-span-6
                        ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}
                      `}
                    >
                      <div
                        className="
                          relative
                          h-[260px]
                          w-full
                          overflow-hidden
                          rounded-[20px]
                          bg-slate-100
                          sm:h-[320px]
                          sm:rounded-[24px]
                          lg:h-[360px]
                          xl:h-[400px]
                        "
                      >
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          priority={index === 0}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                          className="
                            object-cover
                            transition-transform
                            duration-700
                            ease-out
                            group-hover:scale-105
                          "
                        />
                      </div>
                    </div>

                    {/* =========================
                        CONTENT
                    ========================= */}
                    <div
                      className={`
                        flex
                        min-h-[260px]
                        flex-col
                        justify-center
                        items-center
                        text-center
                        relative
                        px-4 sm:px-8
                        lg:col-span-6
                        ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}
                        sm:min-h-[300px]
                        lg:min-h-[360px]
                        xl:min-h-[400px]
                      `}
                    >
                      {/* CENTERED CONTENT */}
                      <div className="space-y-4 sm:space-y-6 my-auto max-w-[500px]">
                        <h3 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[52px] xl:text-[56px] text-slate-900 group-hover:text-white transition-colors duration-500">
                          {service.title}
                        </h3>

                        <div className="h-px w-full max-w-[400px] mx-auto bg-slate-200 group-hover:bg-white/20 transition-colors duration-500" />

                        <p className="text-base font-normal leading-relaxed sm:text-lg lg:text-lg text-slate-600 group-hover:text-slate-200 transition-colors duration-500">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}