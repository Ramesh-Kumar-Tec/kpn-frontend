"use client";

import Navbar from "@/components/layout/Navbar";
import InnerPageHero from "@/components/sections/InnerPageHero";
import FadeIn from "@/components/animation/FadeIn";
import RunningPillBadge from "@/components/ui/RunningPillBadge";
import VideoTestimonialsSection from "@/components/sections/VideoTestimonialsSection";
export default function WhyChooseUs() {
  const values = [
    {
      title: "High quality",
      description:
        "Our goal is zero incidents and our lost time frequency rate is industry leading.",
    },
    {
      title: "Community",
      description:
        "We work with both investors and developers to create landmarks that make an impact.",
    },
    {
      title: "Environmental",
      description:
        "Our multi-skilled team provides innovative, forward-thinking solutions.",
    },
    {
      title: "Innovation",
      description:
        "We maintain this by ensuring transparency and professional conduct in every aspect.",
    },
    {
      title: "Free Consultation",
      description:
        "We work with both investors and developers to create landmarks that make an impact.",
    },
    {
      title: "Timeline",
      description:
        "We maintain this by ensuring transparency and professional conduct in every aspect.",
    },
    {
      title: "Integrity & Fairness",
      description:
        "Our goal is zero incidents and our lost time frequency rate is industry leading.",
    },
    {
      title: "Real Partnership",
      description:
        "Our multi-skilled team provides innovative, forward-thinking solutions.",
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-white">
      <Navbar variant="hero" />

      <InnerPageHero
        title="Why Choose Us"
        breadcrumb="Home / Why Choose Us"
        description="Whether you’re building, remodeling, buying, or selling, we bring seamless project execution under one roof."
        image="/images/core-bc.jpg"
      />

      {/* Core Values */}
      <section className="w-full bg-white py-24 md:py-28 lg:py-[100px]">
        <div className="mx-auto w-[calc(100%-40px)] max-w-[1440px] md:w-[calc(100%-100px)] lg:w-[calc(100%-240px)]">

          {/* Label + Heading */}
          <div className="mb-12 grid items-start md:mb-16 lg:grid-cols-[32%_68%]">
            
            {/* Label */}
            <FadeIn direction="right" distance={30} delay={0.1} className="mb-8 lg:mb-0">
              <RunningPillBadge text="WHAT MAKES US DIFFERENT" />
            </FadeIn>

            {/* Heading */}
            <FadeIn direction="up" distance={30} delay={0.2}>
              <h2 className="m-0 text-[43px] font-semibold leading-[1] tracking-[-2px] text-[#382b88] sm:text-[48px] md:text-[58px] lg:text-[clamp(52px,5vw,78px)] lg:leading-[0.98] lg:tracking-[-3.5px]">
                An exceptional quality
                <br />
                that can’t be beaten
              </h2>
            </FadeIn>
          </div>

          {/* Main Image */}
          <FadeIn direction="up" distance={40} delay={0.15}>
            <div className="mb-20 h-[300px] w-full overflow-hidden rounded-[0_22px_22px_22px] sm:h-[380px] md:mb-28 md:h-[520px] md:rounded-[28px_28px_28px_28px] lg:mb-[165px] lg:h-[640px]">
              <img
                src="/images/core-img.jpg"
                alt="Core Values"
                className="block h-full w-full object-cover object-center"
              />
            </div>
          </FadeIn>

          {/* Values Grid */}
          <div className="grid grid-cols-1 gap-y-14 md:grid-cols-2 md:gap-x-7 md:gap-y-20 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-[145px]">
            {values.map((value, index) => (
              <FadeIn
                key={index}
                direction="up"
                distance={30}
                delay={0.05 * (index % 4)}
              >
                <div className="min-w-0">
                  {/* Top Line */}
                  <div className="mb-6 h-px w-full bg-[#dedede]" />

                  {/* Title */}
                  <h3 className="mb-3 text-[22px] font-semibold leading-[1.1] tracking-[-1px] text-[#382b88] md:text-[23px] lg:text-[27px] lg:tracking-[-1.1px]">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="m-0 max-w-[310px] text-[16px] font-normal leading-[1.45] text-[#303030] md:text-[17px] lg:text-[18px]">
                    {value.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

        </div>
      </section>

      {/* Customer Video Testimonials */}
      <VideoTestimonialsSection />
    </div>
  );
}