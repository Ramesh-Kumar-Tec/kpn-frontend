import AssociatePageTemplate from '@/components/templates/AssociatePageTemplate';
import InnerPageHero from '@/components/sections/InnerPageHero';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Channel Partners - KPN Promoters',
};

export default function ChannelPartnersPage() {
  return (
    <>
      <div className="relative">
        <Navbar variant="hero" />
      </div>
      <InnerPageHero
        title="Channel Partners"
        breadcrumb="Channel Partners"
        description="Join a network of trusted partners bringing innovative solutions to more markets. Let's achieve success together."
        image="/images/banners/channel_partners_banner.jpg"
      />

      <AssociatePageTemplate
        title="Channel Partners"
        email="kpnsalesteam@gmail.com"
        phone="+91 73580 38425 / +91 73580 38421"
      />

    </>
  );
}