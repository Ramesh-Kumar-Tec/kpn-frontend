'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Ruler, CheckCircle2 } from 'lucide-react';
import { projectsData, ProjectItem } from '@/data/siteData';
import { getHomepageCMS, getProjects } from '@/lib/cmsClient';
import FadeIn from '../animation/FadeIn';
import RunningPillBadge from '../ui/RunningPillBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Filter constants matching the client's mockup
const TYPE_OPTIONS = ['All property types', 'Plots', 'Apartments', 'Villas'];
const LOCATION_OPTIONS = [
  'All locations',
  'Guduvanchery',
  'Urapakkam',
  'Chengalpattu',
  'Maraimalai Nagar',
  'Tambaram',
];
const STATUS_OPTIONS = ['Any status', 'Ongoing', 'Upcoming', 'Completed'];
const BUDGET_OPTIONS = [
  'Any budget',
  'Under ₹25 lakh',
  '₹25–50 lakh',
  '₹50 lakh+',
];

// Helper to match budget filters cleanly
function matchesBudget(projectBudget: string | undefined, filterValue: string): boolean {
  if (!filterValue || filterValue === 'Any budget') return true;
  if (!projectBudget) return true;

  const clean = projectBudget.replace(/,/g, '').trim();

  // Extract Lakh value (e.g., "₹ 19L Onwards" -> 19)
  const lakhMatch = clean.match(/(\d+(?:\.\d+)?)\s*L/i);
  if (lakhMatch) {
    const lakh = parseFloat(lakhMatch[1]);
    if (filterValue.includes('25') && (filterValue.includes('Under') || filterValue.includes('<'))) return lakh < 25;
    if (filterValue.includes('25') && filterValue.includes('50')) return lakh >= 25 && lakh <= 50;
    if (filterValue.includes('50') && (filterValue.includes('1') || filterValue.includes('Cr') || filterValue.includes('+') || filterValue.includes('Above'))) return lakh >= 50;
  }

  // Extract Crore value (e.g., "₹ 1.2 Cr" -> 1.2)
  const crMatch = clean.match(/(\d+(?:\.\d+)?)\s*Cr/i);
  if (crMatch) {
    if (filterValue.includes('Under') && filterValue.includes('25')) return false;
    if (filterValue.includes('25–50') || filterValue.includes('25L')) return false;
    return true;
  }

  // Sq.Ft / Plots pricing (e.g. ₹ 2799/Sq.Ft)
  if (clean.toLowerCase().includes('sq')) {
    if (filterValue.includes('Under') || filterValue.includes('25–50') || filterValue.includes('25L')) return true;
  }

  return true;
}

// Helper to determine the top badge on the card
function getCardBadge(project: any, index: number) {
  if (index === 0) {
    return {
      label: 'FEATURED',
      className: 'bg-[#0284c7] text-white shadow-md',
    };
  }

  const type = (project.type || project.propertyType || '').toLowerCase();
  if (type === 'plots' || (project.bhk && project.bhk.toLowerCase().includes('plot'))) {
    return {
      label: 'RESIDENTIAL PLOTS',
      className: 'bg-white/95 text-[#f12131] border border-red-200/80 shadow-md backdrop-blur-xs',
    };
  }

  const status = (project.status || '').toLowerCase();
  if (status === 'completed' || status === 'ready to move') {
    return {
      label: 'READY TO MOVE',
      className: 'bg-emerald-600 text-white shadow-md',
    };
  }

  return {
    label: 'LIMITED AVAILABILITY',
    className: 'bg-white/95 text-[#29247c] border border-slate-200 shadow-md backdrop-blur-xs',
  };
}

export default function ProjectsSection() {
  const [allProjects, setAllProjects] = useState<any[]>(projectsData);
  const [filters, setFilters] = useState({
    type: 'All property types',
    location: 'All locations',
    status: 'Any status',
    budget: 'Any budget',
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

  useEffect(() => {
    let isMounted = true;
    async function loadProjects() {
      try {
        const [cms, liveProjects] = await Promise.all([
          getHomepageCMS().catch(() => null),
          getProjects().catch(() => []),
        ]);

        if (!isMounted) return;

        let list: any[] = [];

        // 1. Prioritize CMS featured projects if configured
        if (cms?.featuredProjectIds && Array.isArray(cms.featuredProjectIds) && cms.featuredProjectIds.length > 0) {
          list = cms.featuredProjectIds.filter((p: any) => p && (p.name || p.slug || p._id));
        }

        // 2. Append live projects from API
        if (Array.isArray(liveProjects) && liveProjects.length > 0) {
          const existingSlugs = new Set(list.map((p) => p.slug).filter(Boolean));
          for (const proj of liveProjects) {
            if (proj && proj.slug && !existingSlugs.has(proj.slug)) {
              list.push(proj);
              existingSlugs.add(proj.slug);
            }
          }
        }

        // 3. Fallback to static projectsData if empty
        if (list.length === 0) {
          list = projectsData;
        }

        setAllProjects(list);
      } catch (err) {
        console.warn('Using static projectsData fallback for ProjectsSection', err);
      }
    }

    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    setAppliedFilters(updated);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({ ...filters });
    // Smooth scroll to projects grid if on mobile
    const el = document.getElementById('project-grid-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetFilters = () => {
    const reset = {
      type: 'All property types',
      location: 'All locations',
      status: 'Any status',
      budget: 'Any budget',
    };
    setFilters(reset);
    setAppliedFilters(reset);
  };

  // Filter projects based on appliedFilters
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      // Type match
      if (appliedFilters.type !== 'All property types') {
        const pType = (p.type || p.propertyType || '').toLowerCase();
        const targetType = appliedFilters.type.toLowerCase();
        if (!pType.includes(targetType) && !targetType.includes(pType)) {
          return false;
        }
      }

      // Location match
      if (appliedFilters.location !== 'All locations') {
        const pLoc = `${p.location || ''} ${p.address || ''}`.toLowerCase();
        const targetLoc = appliedFilters.location.toLowerCase();
        if (!pLoc.includes(targetLoc)) {
          return false;
        }
      }

      // Status match
      if (appliedFilters.status !== 'Any status') {
        const pStatus = (p.status || 'Ongoing').toLowerCase();
        const targetStatus = appliedFilters.status.toLowerCase();
        if (targetStatus === 'completed' && !pStatus.includes('complete') && !pStatus.includes('ready')) {
          return false;
        }
        if (targetStatus === 'ongoing' && !pStatus.includes('ongoing')) {
          return false;
        }
        if (targetStatus === 'upcoming' && !pStatus.includes('upcoming') && !pStatus.includes('launch')) {
          return false;
        }
      }

      // Budget match
      if (!matchesBudget(p.budget, appliedFilters.budget)) {
        return false;
      }

      return true;
    });
  }, [allProjects, appliedFilters]);

  // Open WhatsApp with Price Sheet enquiry
  const handleOpenPriceSheet = (project: any) => {
    const phone = '917338834233';
    const message = `Hello KPN Team, I am interested in ${project.name}${
      project.location ? ` in ${project.location}` : ''
    }. Please share the latest Price Sheet and pricing details.`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const isFiltered =
    appliedFilters.type !== 'All property types' ||
    appliedFilters.location !== 'All locations' ||
    appliedFilters.status !== 'Any status' ||
    appliedFilters.budget !== 'Any budget';

  return (
    <section id="projects" className="relative w-full bg-gradient-to-b from-white via-slate-50/40 to-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================
            HEADER SECTION (Matches Client Mockup)
        ========================================================== */}
        <FadeIn direction="up">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 sm:mb-10">
            <div>
              {/* Running Pill Badge */}
              <div className="mb-2">
                <RunningPillBadge text="FEATURED PROJECTS" />
              </div>

              {/* Main Heading */}
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#29247c] sm:text-4xl lg:text-[44px] leading-[1.1]">
                Explore our projects
              </h2>

              {/* Subtitle */}
              <p className="mt-2.5 max-w-2xl text-sm font-medium text-slate-500 sm:text-base leading-relaxed">
                Discover residential developments, compare locations and find a place that fits your plans.
              </p>
            </div>

            {/* View All Projects Top Right Link Button */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="shrink-0">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs transition-all hover:border-[#29247c] hover:text-[#29247c] hover:shadow-xs active:scale-95"
              >
                <span>View All Projects</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </FadeIn>

        {/* =========================================================
            SEARCH & FILTER BAR CARD (5-Column Desktop Grid)
        ========================================================== */}
        <FadeIn direction="up" delay={0.1}>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm mb-10">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 items-end">
              
              {/* 1. Property Type Dropdown */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1.5">
                  PROPERTY TYPE
                </label>
                <Select
                  value={filters.type}
                  onValueChange={(val) => handleFilterChange('type', val)}
                >
                  <SelectTrigger className="h-[46px] sm:h-[48px] w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 transition hover:bg-white hover:border-slate-300 focus:border-[#29247c] focus:bg-white focus:ring-1 focus:ring-[#29247c] cursor-pointer shadow-2xs">
                    <SelectValue placeholder="All property types" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200/90 rounded-xl shadow-xl z-50">
                    {TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt} className="cursor-pointer text-xs sm:text-sm font-medium">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 2. Preferred Location Dropdown */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1.5">
                  PREFERRED LOCATION
                </label>
                <Select
                  value={filters.location}
                  onValueChange={(val) => handleFilterChange('location', val)}
                >
                  <SelectTrigger className="h-[46px] sm:h-[48px] w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 transition hover:bg-white hover:border-slate-300 focus:border-[#29247c] focus:bg-white focus:ring-1 focus:ring-[#29247c] cursor-pointer shadow-2xs">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200/90 rounded-xl shadow-xl z-50">
                    {LOCATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt} className="cursor-pointer text-xs sm:text-sm font-medium">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 3. Project Status Dropdown */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1.5">
                  PROJECT STATUS
                </label>
                <Select
                  value={filters.status}
                  onValueChange={(val) => handleFilterChange('status', val)}
                >
                  <SelectTrigger className="h-[46px] sm:h-[48px] w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 transition hover:bg-white hover:border-slate-300 focus:border-[#29247c] focus:bg-white focus:ring-1 focus:ring-[#29247c] cursor-pointer shadow-2xs">
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200/90 rounded-xl shadow-xl z-50">
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt} className="cursor-pointer text-xs sm:text-sm font-medium">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 4. Budget Dropdown */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1.5">
                  BUDGET
                </label>
                <Select
                  value={filters.budget}
                  onValueChange={(val) => handleFilterChange('budget', val)}
                >
                  <SelectTrigger className="h-[46px] sm:h-[48px] w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 transition hover:bg-white hover:border-slate-300 focus:border-[#29247c] focus:bg-white focus:ring-1 focus:ring-[#29247c] cursor-pointer shadow-2xs">
                    <SelectValue placeholder="Any budget" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200/90 rounded-xl shadow-xl z-50">
                    {BUDGET_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt} className="cursor-pointer text-xs sm:text-sm font-medium">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 5. Find Projects CTA Button */}
              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="h-[46px] sm:h-[48px] w-full rounded-full bg-[#f12131] hover:bg-[#d01927] text-white font-extrabold text-sm shadow-md shadow-red-500/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Find Projects</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>

            </form>

            {/* Filter stats & Reset link with smooth animation */}
            <AnimatePresence>
              {isFiltered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      Showing <strong className="text-slate-900">{filteredProjects.length}</strong> matching projects
                    </span>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="font-bold text-[#f12131] hover:underline cursor-pointer transition-colors"
                    >
                      Reset all filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>

        {/* =========================================================
            PROJECT CARDS GRID (3-Column Layout Matching Mockup)
        ========================================================== */}
        <div id="project-grid-container">
          <AnimatePresence mode="wait">
            {filteredProjects.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="rounded-[28px] border border-dashed border-slate-300 p-12 text-center bg-white shadow-xs"
              >
                <h3 className="text-lg font-bold text-slate-800">No projects match your current filters</h3>
                <p className="mt-1 text-sm text-slate-500">Try adjusting your location, status, or budget criteria.</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#29247c] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#1e1a5a] cursor-pointer"
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                layout
                key="projects-grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8"
              >
                {filteredProjects.slice(0, 6).map((project, index) => {
                  const badge = getCardBadge(project, index);
                  const projectArea =
                    project.projectArea ||
                    project.plotSizes ||
                    (project.type === 'Plots' || project.propertyType === 'Plots'
                      ? 'Plots (600 - 2400 Sq.Ft)'
                      : '2.5 Acres');

                  return (
                    <motion.div
                      layout
                      key={project.id || project._id || project.slug || index}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      whileHover={{ y: -7 }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.08,
                        ease: [0.21, 0.47, 0.32, 0.98],
                      }}
                      className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200/90 bg-white shadow-xs transition-shadow duration-300 hover:shadow-[0_20px_45px_rgba(41,36,124,0.12)]"
                    >
                      {/* Card Media Header */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Link href={`/projects/${project.slug}`} className="block h-full w-full">
                          <img
                            src={project.image}
                            alt={project.name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                          />
                        </Link>

                        {/* Floating Pill Badge (Top Left) */}
                        <div className="absolute top-3.5 left-3.5 z-10">
                          <span className={`inline-block px-3 py-1 text-[10px] font-extrabold tracking-wider uppercase rounded-full ${badge.className}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                        <div>
                          {/* Project Title */}
                          <Link href={`/projects/${project.slug}`} className="block">
                            <h3 className="text-xl font-bold text-[#29247c] transition-colors group-hover:text-[#f12131] line-clamp-1">
                              {project.name}
                            </h3>
                          </Link>

                          {/* Location & Property Type */}
                          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#f12131]" />
                            <span className="truncate">
                              {project.location} • {project.type || project.propertyType || 'Plots'}
                            </span>
                          </div>

                          {/* Specs Row */}
                          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <Ruler className="h-3.5 w-3.5 shrink-0 text-[#29247c]" />
                            <span className="truncate">{projectArea}</span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1 text-emerald-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>{project.status || 'Ongoing'}</span>
                            </span>
                          </div>

                          {/* Price / Budget */}
                          <div className="mt-3.5 pt-3 border-t border-slate-100">
                            <span className="text-lg font-black text-[#f12131] tracking-tight">
                              {project.budget || 'Price on request'}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="mt-5 flex items-center gap-3">
                          {/* Button 1: View Details */}
                          <Link
                            href={`/projects/${project.slug}`}
                            className="flex-1 rounded-full bg-[#29247c] hover:bg-[#1f1a63] py-2.5 px-3 text-center text-xs font-bold text-white shadow-2xs transition-all active:scale-95 truncate hover:shadow-md hover:shadow-indigo-900/20"
                          >
                            View Details
                          </Link>

                          {/* Button 2: Price Sheet (Direct WhatsApp Enquiry) */}
                          <a
                            href={`https://wa.me/917338834233?text=${encodeURIComponent(
                              `Hello KPN Team, I am interested in ${project.name}${
                                project.location ? ` in ${project.location}` : ''
                              }. Please share the latest Price Sheet and pricing details.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded-full border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 py-2.5 px-3 text-center text-xs font-bold text-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer truncate hover:text-[#29247c]"
                          >
                            Price Sheet
                          </a>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
