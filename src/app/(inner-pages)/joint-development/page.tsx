import InnerPageHero from '@/components/sections/InnerPageHero';
import Navbar from '@/components/layout/Navbar';
import AssociatePageTemplate from '@/components/templates/AssociatePageTemplate';

export default function JointDevelopmentPage() {
  return (
    <>
      <div className="relative">
        <Navbar variant="hero" />
      </div>
      <InnerPageHero
        title="Joint Development"
        breadcrumb="Joint Development"
        description="Unlock the maximum potential of your land with transparent joint ventures, superior construction quality, and maximized returns."
        image="/images/banners/joint_dev_banner.jpg"
      />

      <AssociatePageTemplate
        title="Joint Development"
        phone="+91 73580 38425 / +91 73580 38421"
      />

    </>
  );
}