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
  companyDescription: 'KPN Promoters has earned the trust of over 10,000 satisfied families across Chennai and Tamil Nadu.',
  copyright: '© 2026 KPN Promoters. All Rights Reserved.',
  socialLinks: {
    facebook: 'https://facebook.com/kpnpromoters',
    instagram: 'https://instagram.com/kpnpromoters',
    youtube: 'https://youtube.com/@kpnpromoters',
    linkedin: 'https://linkedin.com/company/kpnpromoters',
  },
  quickLinks: [
    { label: 'About Us', href: '/about-us' },
    { label: 'Why Choose Us', href: '/why-choose-us' },
    { label: 'Our Team', href: '/our-team' },
    { label: 'Solutions', href: '/our-solutions' },
    { label: 'Partners', href: '/partners' },
    { label: 'Core Values', href: '/core-values' },
  ],
  importantLinks: [
    { label: 'Celebrations', href: '/celebrations' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Blog', href: '/blogs' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact Us', href: '/contact-us' },
  ],
};

export default function Footer() {
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
        console.warn('Could not load dynamic footer CMS, using default');
      }
    }
    loadCMSFooter();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="relative z-0 -mt-16 bg-neutral-950 text-white pt-28 pb-12">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Main Columns */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16"
        >
          {/* Brand & Sales Contact */}
          <StaggerItem className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              GET IN TOUCH
            </span>
            <div className="text-3xl font-black text-[#f12131] tracking-tight leading-none mt-4">
              <a href={`tel:${data.phone.replace(/[^0-9+]/g, '')}`}>
                {data.phone}
              </a>
            </div>
            <div className="block pt-2">
              <a
                href={`mailto:${data.email}`}
                className="text-2xl font-black text-[#f12131] tracking-tight border-b-2 border-[#f12131] pb-1 inline-block hover:opacity-80 transition-all"
              >
                {data.email}
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 pt-6">
              {data.socialLinks?.facebook && (
                <Link href={data.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</Link>
              )}
              {data.socialLinks?.instagram && (
                <>
                  <span className="text-slate-700">•</span>
                  <Link href={data.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</Link>
                </>
              )}
              {data.socialLinks?.youtube && (
                <>
                  <span className="text-slate-700">•</span>
                  <Link href={data.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Youtube</Link>
                </>
              )}
              {data.socialLinks?.linkedin && (
                <>
                  <span className="text-slate-700">•</span>
                  <Link href={data.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</Link>
                </>
              )}
            </div>
          </StaggerItem>

          {/* Company / Quick Links Column */}
          <StaggerItem>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              COMPANY
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-300">
              {data.quickLinks.map((link: any, idx: number) => (
                <li key={idx}>
                  <Link href={link.href || '#'} className="hover:text-[#f12131] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Pages / Important Links Column */}
          <StaggerItem>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              PAGES
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-300">
              {data.importantLinks.map((link: any, idx: number) => (
                <li key={idx}>
                  <Link href={link.href || '#'} className="hover:text-[#f12131] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>
        </StaggerContainer>

        {/* Bottom Bar: Centered Logo and Centered Copyright */}
        <FadeIn delay={0.2} direction="up">
          <div className="pt-12 flex flex-col items-center justify-center gap-6">
            <Link href="/" className="flex items-center justify-center transition-transform duration-300 hover:scale-105">
              <img
                src="/images/newlogoo.jpeg"
                alt="KPN Promoters"
                className="h-[80px] sm:h-[96px] lg:h-[105px] w-auto object-contain"
              />
            </Link>
            <p className="text-sm font-bold text-white text-center">
              {data.copyright}
            </p>
          </div>
        </FadeIn>

      </div>
    </footer>
  );
}