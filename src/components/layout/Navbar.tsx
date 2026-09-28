'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Heart,
  Scale,
  Search,
} from 'lucide-react';
import { getMenu } from '@/lib/cmsClient';
import { navigationLinks } from '@/data/siteData';
import { useWishlistCompare } from '@/context/WishlistCompareContext';
import SmartSearchModal from '@/components/ui/SmartSearchModal';

interface NavbarProps {
  variant?: 'default' | 'hero';
}

export default function Navbar({
  variant = 'default',
}: NavbarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [links, setLinks] = useState(navigationLinks);

  useEffect(() => {
    let isMounted = true;
    async function loadDynamicMenu() {
      try {
        const dynamicMenu = await getMenu();
        if (isMounted && dynamicMenu && dynamicMenu.length > 0) {
          setLinks(dynamicMenu);
        }
      } catch (err) {
        console.warn('Could not load dynamic menu, using static siteData');
      }
    }
    loadDynamicMenu();
    return () => {
      isMounted = false;
    };
  }, []);
  const { wishlistIds, compareIds } = useWishlistCompare();

  const [searchOpen, setSearchOpen] = useState(false);

  const pathname = usePathname();

  const isHero = variant === 'hero';

  const isActive = (href?: string) => {
    if (!href) return false;

    if (href.startsWith('#')) {
      return false;
    }

    if (href === '/') {
      return pathname === '/';
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileDropdown(null);
  };

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdown((current) =>
      current === label ? null : label
    );
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`
        z-[100]
        w-full
        px-3
        pt-3
        sm:px-4
        sm:pt-4
        lg:px-7
        lg:pt-3
        ${
          isHero
            ? 'absolute left-0 right-0 top-0'
            : 'relative'
        }
      `}
    >
      <div
        className="
          relative
          mx-auto
          flex
          min-h-[68px]
          w-full
          max-w-[1728px]
          items-center
          rounded-[28px]
          bg-white
          px-4
          shadow-xl
          sm:min-h-[72px]
          sm:px-5
          lg:h-[82px]
          lg:rounded-full
          lg:px-7
        "
      >

        {/* =====================================================
            LOGO
        ====================================================== */}

        <Link
          href="/"
          onClick={closeMobileMenu}
          className="
            flex
            h-full
            shrink-0
            items-center
            border-r
            border-gray-200
            pr-5
            sm:pr-6
            lg:pr-8
          "
        >
          <Image
            src="/images/newlogoo.jpeg"
            alt="KPN Promoters Logo"
            width={200}
            height={131}
            className="
              h-[52px]
              w-auto
              object-contain
              sm:h-[62px]
              lg:h-[74px]
            "
            priority
          />
        </Link>


        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <nav
          className="
            hidden
            flex-1
            items-center
            justify-start
            lg:flex
          "
        >
          {links.map((link) => {
            const hasChildren =
              Array.isArray(link.children) &&
              link.children.length > 0;

            const childIsActive = hasChildren
              ? link.children?.some((child) =>
                  isActive(child.href)
                )
              : false;

            const active =
              isActive(link.href) || childIsActive;

            /* ===============================
               DESKTOP DROPDOWN
            =============================== */

            if (hasChildren) {
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() =>
                    setOpenMenu(link.label)
                  }
                  onMouseLeave={() =>
                    setOpenMenu(null)
                  }
                >
                  <Link
                    href={link.href ?? '#'}
                    className={`
                      relative
                      flex
                      h-[82px]
                      items-center
                      px-[15px]
                      text-[15px]
                      font-bold
                      transition-colors
                      ${
                        active ||
                        openMenu === link.label
                          ? 'text-[#f12131]'
                          : 'text-black hover:text-[#f12131]'
                      }
                    `}
                  >
                    {link.label}

                    {active && (
                      <span
                        className="
                          absolute
                          bottom-[12px]
                          left-[15px]
                          right-[15px]
                          h-[2px]
                          rounded-full
                          bg-[#f12131]
                        "
                      />
                    )}
                  </Link>

                  <AnimatePresence>
                    {openMenu === link.label && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: 5,
                        }}
                        transition={{
                          duration: 0.15,
                        }}
                        className="
                          absolute
                          left-0
                          top-full
                          z-[200]
                          w-[245px]
                          pt-1
                        "
                      >
                        <div
                          className="
                            overflow-hidden
                            rounded-[20px]
                            bg-white
                            px-4
                            py-5
                            shadow-2xl
                            ring-1
                            ring-black/5
                          "
                        >
                          {link.children?.map(
                            (child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                className={`
                                  block
                                  rounded-md
                                  px-4
                                  py-2.5
                                  text-[14px]
                                  font-semibold
                                  transition-colors
                                  ${
                                    isActive(
                                      child.href
                                    )
                                      ? 'text-[#29247c]'
                                      : 'text-black hover:text-[#f12131]'
                                  }
                                `}
                              >
                                {child.label}
                              </Link>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            /* ===============================
               DESKTOP NORMAL LINK
            =============================== */

            return (
              <Link
                key={link.label}
                href={link.href ?? '#'}
                className={`
                  relative
                  flex
                  h-[82px]
                  items-center
                  px-[15px]
                  text-[15px]
                  font-bold
                  transition-colors
                  ${
                    active
                      ? 'text-[#f12131]'
                      : 'text-black hover:text-[#f12131]'
                  }
                `}
              >
                {link.label}

                {active && (
                  <span
                    className="
                      absolute
                      bottom-[12px]
                      left-[15px]
                      right-[15px]
                      h-[2px]
                      rounded-full
                      bg-[#f12131]
                    "
                  />
                )}
              </Link>
            );
          })}
        </nav>


        {/* =====================================================
            DESKTOP RIGHT SIDE
        ====================================================== */}

        <div
          className="
            ml-auto
            hidden
            shrink-0
            items-center
            gap-5
            lg:flex
          "
        >
          <div
            className="
              hidden
              items-center
              gap-2
              text-sm
              font-bold
              xl:flex
            "
          >
            <span className="text-[#29247c]">
              Call Us:
            </span>

            <a
              href="tel:+917338834233"
              className="
                text-[#f12131]
                underline
                decoration-1
                underline-offset-4
                hover:opacity-70
              "
            >
              +91 7338834233
            </a>
          </div>

          {/* Search, Wishlist & Compare Buttons with Custom Hover Tooltips */}
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <div className="relative group">
              <button
                id="smart-search-trigger"
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition duration-200 hover:bg-red-50 hover:text-[#f12131] hover:scale-105 active:scale-95"
                type="button"
                suppressHydrationWarning
              >
                <Search className="h-5 w-5" />
              </button>
              <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-y-1 z-50 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xl">
                Search
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900" />
              </div>
            </div>

            {/* Wishlist Icon */}
            <div className="relative group">
              <Link
                href="/wishlist"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition duration-200 hover:bg-red-50 hover:text-[#f12131] hover:scale-105 active:scale-95"
              >
                <Heart className="h-5 w-5" />
                {wishlistIds.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f12131] text-[10px] font-bold text-white shadow-sm">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>
              <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-y-1 z-50 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xl">
                Wishlist
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900" />
              </div>
            </div>

            {/* Compare Icon */}
            <div className="relative group">
              <Link
                href="/compare"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition duration-200 hover:bg-red-50 hover:text-[#f12131] hover:scale-105 active:scale-95"
              >
                <Scale className="h-5 w-5" />
                {compareIds.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#382b88] text-[10px] font-bold text-white shadow-sm">
                    {compareIds.length}
                  </span>
                )}
              </Link>
              <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-y-1 z-50 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xl">
                Compare Projects
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900" />
              </div>
            </div>
          </div>

          <Link
            href="/contact-us"
            className="
              flex
              h-[52px]
              items-center
              justify-center
              rounded-full
              bg-[#f12131]
              px-7
              text-[14px]
              font-bold
              text-white
              shadow-md
              shadow-red-600/20
              transition-all
              hover:bg-[#d91d2c]
              hover:shadow-lg
              active:scale-95
            "
          >
            Get In Touch
          </Link>
        </div>


        {/* =====================================================
            MOBILE RIGHT SIDE
        ====================================================== */}

        <div
          className="
            ml-auto
            flex
            items-center
            gap-2
            lg:hidden
          "
        >
          {/* Mobile Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-red-50 hover:text-[#f12131]"
            title="Search Projects"
            type="button"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Mobile CTA */}

          <Link
            href="/contact-us"
            onClick={closeMobileMenu}
            className="
              hidden
              rounded-full
              bg-[#f12131]
              px-4
              py-2.5
              text-xs
              font-bold
              text-white
              sm:block
              md:px-5
              md:py-3
              md:text-sm
            "
          >
            Get In Touch
          </Link>

          {/* Hamburger */}

          <button
            type="button"
            aria-label={
              mobileOpen
                ? 'Close navigation'
                : 'Open navigation'
            }
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen((current) => !current)
            }
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-[#f12131]
              text-white
              transition-transform
              active:scale-95
              sm:h-12
              sm:w-12
            "
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>


        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                absolute
                left-0
                right-0
                top-[calc(100%+10px)]
                z-[200]
                overflow-hidden
                rounded-[24px]
                bg-white
                p-4
                shadow-2xl
                ring-1
                ring-black/5
                lg:hidden
              "
            >

              <nav className="flex flex-col">

                {links.map((link) => {
                  const hasChildren =
                    Array.isArray(link.children) &&
                    link.children.length > 0;

                  const childIsActive =
                    hasChildren
                      ? link.children?.some(
                          (child) =>
                            isActive(child.href)
                        )
                      : false;

                  const active =
                    isActive(link.href) ||
                    childIsActive;

                  /* ===============================
                     MOBILE DROPDOWN
                  =============================== */

                  if (hasChildren) {
                    return (
                      <div
                        key={link.label}
                        className="
                          border-b
                          border-gray-100
                        "
                      >
                        <button
                          type="button"
                          onClick={() =>
                            toggleMobileDropdown(
                              link.label
                            )
                          }
                          className={`
                            flex
                            w-full
                            items-center
                            justify-between
                            px-3
                            py-4
                            text-left
                            text-[15px]
                            font-bold
                            ${
                              active
                                ? 'text-[#f12131]'
                                : 'text-black'
                            }
                          `}
                        >
                          <span>
                            {link.label}
                          </span>

                          <ChevronDown
                            className={`
                              h-4
                              w-4
                              transition-transform
                              ${
                                mobileDropdown ===
                                link.label
                                  ? 'rotate-180'
                                  : ''
                              }
                            `}
                          />
                        </button>

                        <AnimatePresence>
                          {mobileDropdown ===
                            link.label && (
                            <motion.div
                              initial={{
                                height: 0,
                                opacity: 0,
                              }}
                              animate={{
                                height: 'auto',
                                opacity: 1,
                              }}
                              exit={{
                                height: 0,
                                opacity: 0,
                              }}
                              className="overflow-hidden"
                            >
                              <div className="pb-2 pl-4">
                                {link.children?.map(
                                  (child) => (
                                    <Link
                                      key={
                                        child.label
                                      }
                                      href={
                                        child.href
                                      }
                                      onClick={
                                        closeMobileMenu
                                      }
                                      className={`
                                        block
                                        border-l-2
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        ${
                                          isActive(
                                            child.href
                                          )
                                            ? 'border-[#f12131] text-[#f12131]'
                                            : 'border-transparent text-slate-600 hover:text-[#f12131]'
                                        }
                                      `}
                                    >
                                      {
                                        child.label
                                      }
                                    </Link>
                                  )
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  /* ===============================
                     MOBILE NORMAL LINK
                  =============================== */

                  return (
                    <Link
                      key={link.label}
                      href={link.href ?? '#'}
                      onClick={closeMobileMenu}
                      className={`
                        relative
                        border-b
                        border-gray-100
                        px-3
                        py-4
                        text-[15px]
                        font-bold
                        ${
                          active
                            ? 'text-[#f12131]'
                            : 'text-black hover:text-[#f12131]'
                        }
                      `}
                    >
                      {link.label}

                      {active && (
                        <span
                          className="
                            absolute
                            bottom-2
                            left-3
                            h-[2px]
                            w-8
                            rounded-full
                            bg-[#f12131]
                          "
                        />
                      )}
                    </Link>
                  );
                })}

              </nav>


              {/* MOBILE WISHLIST & COMPARE */}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                <Link
                  href="/wishlist"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-[#f12131] transition-colors"
                >
                  <Heart className="h-4 w-4 text-[#f12131]" />
                  <span>Wishlist</span>
                  {wishlistIds.length > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f12131] text-[10px] font-black text-white">
                      {wishlistIds.length}
                    </span>
                  )}
                </Link>

                <Link
                  href="/compare"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-[#f12131] transition-colors"
                >
                  <Scale className="h-4 w-4 text-[#29247c]" />
                  <span>Compare</span>
                  {compareIds.length > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#29247c] text-[10px] font-black text-white">
                      {compareIds.length}
                    </span>
                  )}
                </Link>
              </div>

              {/* MOBILE CONTACT AREA */}
              <div className="mt-3 border-t border-gray-100 pt-3">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                  <span className="text-[#29247c]">Call Us:</span>
                  <a href="tel:+917338834233" className="text-[#f12131]">
                    +91 7338834233
                  </a>
                </div>

                <Link
                  href="/contact-us"
                  onClick={closeMobileMenu}
                  className="flex w-full items-center justify-center rounded-full bg-[#f12131] px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#d91d2c] transition-colors"
                >
                  Get In Touch
                </Link>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <SmartSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </motion.header>
  );
}