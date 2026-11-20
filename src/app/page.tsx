import FullScreenVideoEntry from '@/components/sections/FullScreenVideoEntry';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import TeamSection from '@/components/sections/TeamSection';
import AwardsSection from '@/components/sections/AwardsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BankingPartnersSection from '@/components/sections/BankingPartnersSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactFormSection from '@/components/sections/ContactFormSection';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-800 antialiased selection:bg-red-500 selection:text-white">
      <FullScreenVideoEntry />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ServicesSection />
      {/* 4. Testimonials Section: Google reviews scrolling text + 1 video testimonial */}
      <TestimonialsSection />
      {/* 5. Our Leadership: Immediately after Testimonials */}
      <TeamSection />
      {/* 6. Awards & Recognition: After Our Leadership */}
      <AwardsSection />
      {/* 7. Banking Partners: Standalone section after Awards */}
      <BankingPartnersSection />
      {/* 8. Blog Section: Latest blogs after Banking Partners */}
      <BlogSection />
      <ContactFormSection />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
