import AssociatePageTemplate from '@/components/templates/AssociatePageTemplate';
import InnerPageHero from '@/components/sections/InnerPageHero';
import Navbar from '@/components/layout/Navbar';
export const metadata = {
  title: 'NRI Services - KPN Promoters',
};

export default function NRIPage() {
  return (
    <>
      <div className="relative">
        <Navbar variant="hero" />
      </div>
      <InnerPageHero
        title="NRI Services"
        breadcrumb="NRI Services"
        description="Seamless end-to-end real estate solutions, hassle-free property management, and premium investments tailored for global Indians."
        image="/images/banners/nri_services_banner.jpg"
      />

      <AssociatePageTemplate title="NRI" />

    </>
  );
}