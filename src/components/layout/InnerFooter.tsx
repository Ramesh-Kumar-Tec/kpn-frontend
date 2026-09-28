'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FadeIn from '../animation/FadeIn';
import StaggerContainer from '../animation/StaggerContainer';
import StaggerItem from '../animation/StaggerItem';
import { getFooter } from '@/lib/cmsClient';

const DEFAULT_FOOTER = {
  phone: '+91 7338834233',
  email: 'kpnsalesteam@gmail.com',
  companyDescription: 'We are creators of transformative spaces that inspire, innovate, and endure.',
  copyright: '© 2026 KPN Promoters Pvt Ltd. All Rights Reserved.',
  socialLinks: {
    facebook: 'https://www.facebook.com/kpnpromoters.in',
    instagram: 'https://www.instagram.com/kpnpromotersofficial/',
    youtube: 'https://www.youtube.com/@KPNPROMOTERSPVTLTD',
    linkedin: 'https://x.com/PromotersKpn',
  },
  quickLinks: [
    { label: 'About Us', href: '/about-us' },
    { label: 'Why Choose Us', href: '/why-choose-us' },
    { label: 'Careers', href: '/careers' },
    { label: 'Our Awards', href: '/our-awards' },
    { label: 'Investors', href: '/investors' },
    { label: 'Our Ventures', href: '/our-ventures' },
  ],
  importantLinks: [
    { label: 'Celebrations', href: '/celebrations' },
    { label: 'Our Projects', href: '/projects' },
    { label: 'News & Updates', href: '/blogs' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Support Center', href: '/support' },
    { label: 'Contact', href: '/contact-us' },
  ],
};

export default function InnerFooter() {
  const [data, setData] = useState(DEFAULT_FOOTER);

  useEffect(() => {
    let isMounted = true;
    async function loadCMSFooter() {
      try {
        const cmsData = await getFooter();
        if (isMounted && cmsData) {
          setData({
            phone: cmsData.phone || DEFAULT_FOOTER.phone,
            email: cmsData.email || DEFAULT_FOOTER.email,
            companyDescription: cmsData.companyDescription || DEFAULT_FOOTER.companyDescription,
            copyright: cmsData.copyright || DEFAULT_FOOTER.copyright,
            socialLinks: {
              ...DEFAULT_FOOTER.socialLinks,
              ...(cmsData.socialLinks || {}),
            },
            quickLinks: cmsData.quickLinks && cmsData.quickLinks.length > 0
              ? cmsData.quickLinks
              : DEFAULT_FOOTER.quickLinks,
            importantLinks: cmsData.importantLinks && cmsData.importantLinks.length > 0
              ? cmsData.importantLinks
              : DEFAULT_FOOTER.importantLinks,
          });
        }
      } catch (err) {
        console.warn('Could not load dynamic inner footer CMS, using default');
      }
    }
    loadCMSFooter();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden -mt-16 sm:-mt-20 z-0">

      {/* =====================================================
          FULL BACKGROUND IMAGE
      ===================================================== */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/about/about-img.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/45" />


      {/* =====================================================
          DREAM HOME CTA
      ===================================================== */}
      <div className="relative z-10 flex min-h-[650px] items-start justify-center px-4 pt-16 sm:px-6 lg:px-8">

        <FadeIn direction="up" className="pt-8 text-center">

          <h2 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[70px]">
            Your dream
            <br />
            home awaits
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-relaxed text-white sm:text-base">
            Whether you&apos;re exploring our homes or envisioning something
            custom, we&apos;re here to bring your dream to life.
          </p>

        </FadeIn>

      </div>


      {/* =====================================================
          FOOTER CARD
      ===================================================== */}
      <footer className="relative z-20 -mt-32 px-4 pb-8 sm:px-6 lg:px-8">

        <FadeIn direction="up" distance={30} className="mx-auto w-full max-w-[1500px] rounded-[38px] bg-white px-8 py-12 shadow-2xl sm:px-12 sm:py-14 lg:px-16 lg:py-16">

          {/* =================================================
              MAIN CONTENT
          ================================================= */}
          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 lg:grid-cols-12">

            {/* LOGO + DESCRIPTION */}
            <StaggerItem className="lg:col-span-4 lg:border-r lg:border-slate-200 lg:pr-12">

              <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
                <img
                  src="/images/newlogoo.jpeg"
                  alt="KPN Promoters Pvt Ltd"
                  className="h-[88px] sm:h-[104px] lg:h-[105px] w-auto object-contain"
                />
              </Link>

              <p className="mt-8 sm:mt-10 max-w-[350px] text-sm leading-relaxed text-slate-400">
                {data.companyDescription}
              </p>

            </StaggerItem>


            {/* NAVIGATION */}
            <StaggerItem className="grid grid-cols-2 gap-x-10 gap-y-6 py-10 lg:col-span-3 lg:px-10 lg:py-0">

              <div className="space-y-6">
                {data.quickLinks.map((link: any, idx: number) => (
                  <Link
                    key={idx}
                    href={link.href || '#'}
                    className="block text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>


              <div className="space-y-6">
                {data.importantLinks.map((link: any, idx: number) => (
                  <Link
                    key={idx}
                    href={link.href || '#'}
                    className="block text-sm font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

            </StaggerItem>


            {/* CONTACT */}
            <StaggerItem className="lg:col-span-5 lg:border-l lg:border-slate-200 lg:pl-10">

              <a
                href={`tel:${data.phone.replace(/[^0-9+]/g, '')}`}
                className="block w-fit border-b border-rose-500 pb-1 text-xl font-bold text-slate-900 sm:text-2xl hover:opacity-80 transition-opacity"
              >
                {data.phone}
              </a>

              <a
                href={`mailto:${data.email}`}
                className="mt-5 block w-fit border-b border-rose-500 pb-1 text-xl font-bold text-slate-900 sm:text-2xl hover:opacity-80 transition-opacity"
              >
                {data.email}
              </a>

              <div className="mt-28 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-400">

                {data.socialLinks?.facebook && (
                  <Link href={data.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors">
                    Facebook
                  </Link>
                )}

                {data.socialLinks?.instagram && (
                  <>
                    <span>·</span>
                    <Link href={data.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors">
                      Instagram
                    </Link>
                  </>
                )}

                {data.socialLinks?.youtube && (
                  <>
                    <span>·</span>
                    <Link href={data.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors">
                      Youtube
                    </Link>
                  </>
                )}

                {(data.socialLinks?.linkedin || (data.socialLinks as any)?.twitter) && (
                  <>
                    <span>·</span>
                    <Link href={data.socialLinks?.linkedin || (data.socialLinks as any)?.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors">
                      Twitter
                    </Link>
                  </>
                )}

              </div>

            </StaggerItem>

          </StaggerContainer>


          {/* DIVIDER */}
          <div className="mt-12 border-t border-slate-200" />

          {/* SECOND DIVIDER */}
          <div className="mt-8 border-t border-slate-200" />

          {/* COPYRIGHT */}
          <div className="pt-6">

            <p className="text-xs text-slate-400">
              {data.copyright}
            </p>

          </div>

        </FadeIn>

      </footer>

    </section>
  );
}