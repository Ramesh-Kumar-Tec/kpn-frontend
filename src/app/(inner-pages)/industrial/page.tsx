import InnerPageHero from '@/components/sections/InnerPageHero';
import Navbar from '@/components/layout/Navbar';
import AssociatePageTemplate from '@/components/templates/AssociatePageTemplate';

export default function IndustrialPage() {
  return (
    <>
      <div className="relative">
        <Navbar variant="hero" />
      </div>
      <InnerPageHero
        title="Industrial"
        breadcrumb="Industrial"
        description="State-of-the-art industrial layouts, warehousing infrastructure, and manufacturing spaces designed for operational excellence."
        image="/images/banners/industrial_banner.jpg"
      />

      <AssociatePageTemplate title="Industrial" />

    </>
  );
}