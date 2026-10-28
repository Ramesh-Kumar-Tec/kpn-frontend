// components/sections/InnerPageHero.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface InnerPageHeroProps {
  title: string;
  breadcrumb: string;
  description: string;
  image: string;
}

export default function InnerPageHero({
  title,
  breadcrumb,
  description,
  image,
}: InnerPageHeroProps) {
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
      <div className="relative z-10 mx-auto max-w-[1500px] px-6 pb-24 pt-32 lg:px-16">

        <div className="grid min-h-[430px] grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >

            <h1 className="text-6xl font-bold leading-none tracking-[-3px] text-white sm:text-7xl lg:text-[80px]">
              {title}
            </h1>

            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-32 flex flex-wrap items-center gap-2.5 text-sm font-medium text-white/90"
            >
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>

              {(() => {
                // Strip redundant "Home - ", "Home / ", or "Home • " prefix if present
                const clean = breadcrumb.replace(/^Home\s*[-/•]\s*/i, '');
                const parts = clean.split(/\s*[-/•]\s*/).filter(Boolean);

                return parts.map((part, index) => {
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
                    <span key={index} className="flex items-center gap-2.5">
                      <span className="text-white/60">•</span>
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
                });
              })()}
            </motion.div>

          </motion.div>


          {/* RIGHT */}
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

        </div>

      </div>

      {/* Rounded bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 rounded-t-[40px] bg-white" />

    </section>
  );
}
