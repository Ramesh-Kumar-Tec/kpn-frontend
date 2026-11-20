import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import AboutIntroSection from '@/components/sections/about/AboutIntroSection';
import TimelineSection from '@/components/sections/about/TimelineSection';
import VisionMissionSection from '@/components/sections/about/VisionMissionSection';
import LearnMoreSection from '@/components/sections/about/LearnMoreSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';

export default function AboutUsPage() {
  return (
    <div className="w-full">
      <Navbar variant="hero" />

      <InnerPageHero
        breadcrumbAtTop={true}
        tagline="BUILDING TRUST & FUTURES"
        title="About KPN Promoters"
        subtitle="25+ Years of Real Estate Excellence in Chennai"
        breadcrumb="Home / About KPN / About Us"
        description="Whether you're building, buying, or investing, we bring seamless project execution, transparent legal clarity, and 100% approved communities under one roof."
        image="/images/about/about-bc.jpg"
      />

      <AboutIntroSection />

      <TimelineSection />

      <VisionMissionSection />

      <LearnMoreSection />

      <TestimonialsSection />
    </div>
  );
}