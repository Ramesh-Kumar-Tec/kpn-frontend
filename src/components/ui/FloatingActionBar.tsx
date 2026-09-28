'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWishlistCompare } from '@/context/WishlistCompareContext';
import { Scale, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingActionBar() {
  const { compareIds, clearCompare } = useWishlistCompare();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (pathname === '/compare') return null;

  return (
    <AnimatePresence>
      {compareIds.length > 0 && (
        <motion.div
          key="floating-compare-bar"
          initial={{ opacity: 0, y: 40, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 40, x: '-50%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed bottom-6 left-1/2 z-[999] flex max-w-[calc(100vw-32px)] items-center gap-3 sm:gap-4 rounded-full border border-slate-700/80 bg-slate-900/95 px-4 sm:px-6 py-3 sm:py-3.5 text-white shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f12131] text-xs font-bold text-white shadow-md">
              <Scale className="h-4 w-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
              {compareIds.length} {compareIds.length === 1 ? 'project' : 'projects'} selected to compare
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href="/compare"
              className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#f12131] px-4 sm:px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition hover:bg-red-600 hover:scale-105 active:scale-95"
            >
              <span>Compare Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={clearCompare}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="Clear all"
              aria-label="Clear all compared projects"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
