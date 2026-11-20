// components/sections/InnerPageHero.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface InnerPageHeroProps {
  title: string;
  breadcrumb: string;
  description?: string;
  image: string;
  tagline?: string;
  subtitle?: string;
  breadcrumbAtTop?: boolean;
  actions?: React.ReactNode;
}

export default function InnerPageHero({
  title,
  breadcrumb,
  description,
  image,
  tagline,
  subtitle,
  breadcrumbAtTop = false,
  actions,
}: InnerPageHeroProps) {
  const renderBreadcrumb = (isTop = false) => {
    // Strip redundant "Home - ", "Home / ", or "Home • " prefix if present
    const clean = breadcrumb.replace(/^Home\s*[-/•]\s*/i, '');
    const parts = clean.split(/\s*[-/•]\s*/).filter(Boolean);

    return (
      <div
        className={`flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] ${
          isTop ? 'text-white/70 mb-3' : 'mt-32 text-sm font-medium text-white/90 gap-2.5'
        }`}
      >
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>

        {parts.map((part, index) => {
          const isLast = index === parts.length - 1;
          const lower = part.toLowerCase();

          // Map links for known route sections
          const href =
            lower === 'projects'
              ? '/projects'
              : lower === 'news' || lower === 'blog grid' || lower === 'blogs'
              ? '/blogs'
              : undefined;

          return (
            <span key={index} className={`flex items-center ${isTop ? 'gap-2' : 'gap-2.5'}`}>
              <span className="text-white/50">{isTop ? '/' : '•'}</span>
              {isLast ? (
                <span className="text-white font-semibold">{part}</span>
              ) : href ? (
                <Link href={href} className="hover:text-white transition-colors">
                  {part}
                </Link>
              ) : (
                <span>{part}</span>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <section className="relative min-h-[580px] overflow-hidden bg-slate-900">

      {/* Serve the static hero directly from the CDN. */}
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title || 'Page Header'}
            fill
            unoptimized
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/50 backdrop-brightness-95" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-12 pb-24 pt-32">

        <div className="grid min-h-[430px] grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Breadcrumb at Top if specified */}
            {breadcrumbAtTop && renderBreadcrumb(true)}

            {/* Tagline / Badge */}
            {tagline && (
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold tracking-widest text-[#f12131] uppercase mb-3">
                <span className="inline-block w-5 h-0.5 bg-[#f12131]" />
                <span>{tagline}</span>
              </div>
            )}

            {/* Title */}
            <h1 className={`font-bold text-white tracking-tight ${
              title.length > 25
                ? 'text-4xl sm:text-5xl lg:text-[54px] leading-[1.15]'
                : 'text-5xl leading-none sm:text-6xl lg:text-[76px]'
            }`}>
              {title}
            </h1>

            {/* Subtitle / Details (Location • Type • Status) */}
            {subtitle && (
              <p className="mt-3 text-sm sm:text-base font-semibold text-white/85">
                {subtitle}
              </p>
            )}

            {/* Action buttons (e.g. Book Site Visit, WhatsApp Brochure) */}
            {actions && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {actions}
              </div>
            )}

            {/* Breadcrumb at Bottom (original default) */}
            {!breadcrumbAtTop && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderBreadcrumb(false)}
              </motion.div>
            )}

          </motion.div>


          {/* RIGHT */}
          {description && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-end"
            >
              <p className="max-w-[380px] border-l-2 border-red-500 pl-5 text-lg font-semibold leading-relaxed text-white">
                {description}
              </p>
            </motion.div>
          )}

        </div>

      </div>

      {/* Rounded bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 rounded-t-[40px] bg-white" />

    </section>
  );
}
