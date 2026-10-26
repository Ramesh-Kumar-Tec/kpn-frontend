import InnerPageHero from '@/components/sections/InnerPageHero';
import Navbar from '@/components/layout/Navbar';
import AssociatePageTemplate from '@/components/templates/AssociatePageTemplate';

export default function InvestorsPage() {
  return (
    <>
      <div className="relative">
        <Navbar variant="hero" />
      </div>
      <InnerPageHero
        title="Investors"
        breadcrumb="Investors"
        description="Partner with KPN Promoters for high-yield real estate investments and strategic wealth creation across Chennai's prime growth corridors."
        image="/images/banners/investors_banner.jpg"
      />

      <AssociatePageTemplate
        title="Investors"
        email="md@kpnpromoters.in"
        phone="+91 99419 92132"
      />

    </>
  );
}