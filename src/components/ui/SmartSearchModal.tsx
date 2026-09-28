'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  X,
  MapPin,
  Building,
  ArrowRight,
  CornerDownLeft,
  FileText,
  Users,
  Award,
  BookOpen,
  Briefcase,
  Globe,
  Compass,
} from 'lucide-react';
import { projectsData, navigationLinks, blogData, BlogPostItem } from '@/data/siteData';

// Unified search result item type across the entire site
export interface UnifiedSearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'Projects' | 'Pages' | 'Associate' | 'Blogs';
  badge?: string;
  href: string;
  image?: string;
  tag?: string;
}

export default function SmartSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const router = useRouter();

  const filterCategories = ['All', 'Projects', 'Pages', 'Associate', 'Blogs'];

  // Flatten all site pages from navigationLinks
  const sitePages = useMemo(() => {
    const list: { label: string; href: string; group: string; description: string }[] = [
      { label: 'Home Page', href: '/', group: 'Pages', description: 'KPN Promoters Official Real Estate Portal' },
      { label: 'Wishlist & Shortlist', href: '/wishlist', group: 'Pages', description: 'Your saved favorite properties' },
      { label: 'Project Comparison Matrix', href: '/compare', group: 'Pages', description: 'Side-by-side analysis of key property features' },
    ];

    navigationLinks.forEach((item) => {
      if (item.href && item.href !== '#') {
        list.push({
          label: item.label,
          href: item.href,
          group: item.label === 'Blogs' || item.label === 'News' ? 'Blogs' : item.label === 'Contact' ? 'Pages' : 'Pages',
          description: `Navigate to ${item.label}`,
        });
      }
      if (Array.isArray(item.children)) {
        item.children.forEach((child) => {
          list.push({
            label: child.label,
            href: child.href,
            group: item.label === 'Associate' ? 'Associate' : 'Pages',
            description: `${item.label} - ${child.label}`,
          });
        });
      }
    });

    return list;
  }, []);

  // Build unified search index
  const allResults = useMemo<UnifiedSearchResult[]>(() => {
    const results: UnifiedSearchResult[] = [];

    // 1. Add all Projects
    projectsData.forEach((project) => {
      results.push({
        id: `project-${project.id}`,
        title: project.name,
        subtitle: project.address || `${project.location} • ${project.bhk}`,
        category: 'Projects',
        badge: project.budget,
        href: `/projects/${project.slug}`,
        image: project.image,
        tag: project.type,
      });
    });

    // 2. Add Site Pages
    sitePages.forEach((page, idx) => {
      results.push({
        id: `page-${idx}`,
        title: page.label,
        subtitle: page.description,
        category: page.group as 'Pages' | 'Associate' | 'Blogs',
        badge: 'Page',
        href: page.href,
      });
    });

    // 3. Add Blogs
    blogData.forEach((blog: BlogPostItem) => {
      results.push({
        id: `blog-${blog.id}`,
        title: blog.title,
        subtitle: blog.excerpt,
        category: 'Blogs',
        badge: blog.category,
        href: `/blogs/${blog.slug}`,
        image: blog.image,
        tag: blog.date,
      });
    });

    return results;
  }, [sitePages]);

  // Filter unified search results
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allResults.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      if (!q) return matchesCategory;

      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesSubtitle = item.subtitle.toLowerCase().includes(q);
      const matchesBadge = item.badge?.toLowerCase().includes(q);
      const matchesTag = item.tag?.toLowerCase().includes(q);

      return matchesCategory && (matchesTitle || matchesSubtitle || matchesBadge || matchesTag);
    });
  }, [allResults, query, selectedCategory]);

  // Focus input on modal open & lock body scrolling completely
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 80);

      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
      };
    }
  }, [isOpen]);

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Scroll active item into view during arrow key navigation
  useEffect(() => {
    if (isOpen && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex, isOpen]);

  // Global shortcut listener (Ctrl+J or Cmd+J to open search modal)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          const searchBtn = document.getElementById('smart-search-trigger');
          if (searchBtn) {
            searchBtn.click();
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  // Keyboard Navigation when modal is open (ArrowUp, ArrowDown, Enter, Esc)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredResults.length ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          router.push(filteredResults[selectedIndex].href);
          onClose();
        } else if (query.trim()) {
          router.push(`/projects?search=${encodeURIComponent(query.trim())}`);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, query, router, onClose]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Projects':
        return <Building className="h-5 w-5 text-[#f12131]" />;
      case 'Associate':
        return <Users className="h-5 w-5 text-[#29247c]" />;
      case 'Blogs':
      case 'News':
        return <BookOpen className="h-5 w-5 text-amber-600" />;
      default:
        return <Compass className="h-5 w-5 text-indigo-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-start justify-center bg-slate-900/60 p-4 pt-16 sm:pt-24 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Search Input */}
          <div className="relative flex items-center border-b border-slate-100 px-6 py-5">
            <Search className="h-6 w-6 text-[#29247c] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, pages, NRI, investors, blogs..."
              className="ml-4 w-full bg-transparent text-base sm:text-lg font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none pr-8"
            />
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition shrink-0 ml-2"
              >
                <X className="h-5 w-5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 border border-slate-200 shrink-0 ml-2 shadow-sm">
                ESC
              </kbd>
            )}
          </div>

          {/* Quick Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 bg-slate-50/50 px-6 py-3 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">
              Category:
            </span>
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#f12131] text-white shadow-md shadow-red-600/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-red-200 hover:text-[#f12131]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="max-h-[420px] overflow-y-auto p-4 space-y-2">
            {filteredResults.length === 0 ? (
              <div className="py-12 text-center">
                <Compass className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-extrabold text-[#29247c]">No results found</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Try searching for "About Us", "Urapakkam", "NRI", "Awards", or "Investors"
                </p>
              </div>
            ) : (
              filteredResults.map((result, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <Link
                    key={result.id}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    href={result.href}
                    onClick={onClose}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between gap-4 rounded-2xl p-3.5 transition-all ${
                      isSelected
                        ? 'bg-red-50/80 border border-red-200 shadow-sm'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {result.image ? (
                        <div className="relative h-14 w-18 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                          <Image
                            src={result.image}
                            alt={result.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
                          {getCategoryIcon(result.category)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-extrabold text-[#29247c] truncate">
                            {result.title}
                          </h4>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-extrabold text-slate-600 shrink-0">
                            {result.category}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1 truncate">
                          {result.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {result.badge && (
                        <span className="hidden sm:inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200">
                          {result.badge}
                        </span>
                      )}
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                          isSelected ? 'bg-[#f12131] text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold border border-slate-200">↑</kbd>
                <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold border border-slate-200">↓</kbd> to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="flex items-center rounded bg-white px-1.5 py-0.5 text-[10px] font-bold border border-slate-200">
                  <CornerDownLeft className="h-3 w-3 mr-0.5" /> enter
                </kbd> to select
              </span>
            </div>
            <span className="font-bold text-slate-600">
              Showing {filteredResults.length} item{filteredResults.length !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
