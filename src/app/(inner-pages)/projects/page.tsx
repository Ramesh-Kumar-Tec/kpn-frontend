'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import { projectsData, ProjectItem } from '@/data/siteData';
import { getProjects } from '@/lib/cmsClient';
import { MapPin, ChevronDown, Heart, Scale, Check } from 'lucide-react';
import FadeIn from '@/components/animation/FadeIn';
import { useWishlistCompare } from '@/context/WishlistCompareContext';

// Budget parser helper to match diverse price formats like "₹ 19L Onwards", "₹ 58L Onwards", "₹ 2799/Sq.Ft"
function matchesBudget(projectBudget: string | undefined, filterValue: string): boolean {
  if (!filterValue || filterValue === 'All') return true;
  if (!projectBudget) return false;

  const clean = projectBudget.replace(/,/g, '').trim();

  // Sq.Ft / Plots matching
  if (filterValue.toLowerCase().includes('sq') || filterValue.toLowerCase().includes('plot')) {
    return clean.toLowerCase().includes('sq.ft') || clean.toLowerCase().includes('sqft');
  }

  // Extract Lakh value (e.g., "₹ 19L Onwards" -> 19)
  const lakhMatch = clean.match(/(\d+(?:\.\d+)?)\s*L/i);
  if (lakhMatch) {
    const lakh = parseFloat(lakhMatch[1]);
    if (filterValue === 'Under 30L' || filterValue === '< 30L') {
      return lakh < 30;
    }
    if (filterValue === '20L - 40L' || filterValue === '20L-40L') {
      return lakh >= 18 && lakh <= 40;
    }
    if (filterValue === '40L - 60L' || filterValue === '40L-60L') {
      return lakh >= 40 && lakh <= 60;
    }
    if (filterValue === '60L - 80L' || filterValue === '60L-80L') {
      return lakh >= 60 && lakh <= 80;
    }
    if (filterValue === 'Above 50L' || filterValue === '> 50L') {
      return lakh >= 50;
    }
  }

  // Rate per Sq.Ft matching against approximate overall price
  const sqftMatch = clean.match(/(\d+)\s*\/?\s*sq/i);
  if (sqftMatch) {
    const rate = parseInt(sqftMatch[1], 10);
    const approxLakhs = rate / 100;
    if (filterValue === '20L - 40L') {
      return approxLakhs >= 18 && approxLakhs <= 40;
    }
    if (filterValue === 'Under 30L') {
      return approxLakhs < 30;
    }
  }

  return clean.toLowerCase().includes(filterValue.toLowerCase());
}

// Static filter options
const STATUS_OPTIONS = [
  { value: 'All', label: 'Project Status' },
  { value: 'Ongoing', label: 'Ongoing' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Completed', label: 'Completed' },
];

const TYPE_OPTIONS = [
  { value: 'All', label: 'Project Type' },
  { value: 'Apartments', label: 'Apartments' },
  { value: 'Plots', label: 'Plots' },
  { value: 'Villas', label: 'Villas' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Industrial', label: 'Industrial' },
];

const LOCATION_OPTIONS = [
  { value: 'All', label: 'Project Location' },
  { value: 'Urapakkam', label: 'Urapakkam, Chennai' },
  { value: 'Guduvanchery', label: 'Guduvanchery, Chennai' },
  { value: 'Karanaipuducheri', label: 'Karanaipuducheri, Chennai' },
  { value: 'Nenmeli', label: 'Nenmeli, Chennai' },
  { value: 'S.P. Kovil', label: 'S.P. Kovil, Chennai' },
  { value: 'Maraimalai Nagar', label: 'Maraimalai Nagar, Chennai' },
];

const BUDGET_OPTIONS = [
  { value: 'All', label: 'Project Budget' },
  { value: 'Under 30L', label: 'Under ₹30 Lakhs' },
  { value: '20L - 40L', label: '₹20L - ₹40 Lakhs' },
  { value: '40L - 60L', label: '₹40L - ₹60 Lakhs' },
  { value: 'Above 50L', label: 'Above ₹50 Lakhs' },
  { value: 'Plots', label: 'Plots (₹999 - ₹4999/Sq.Ft)' },
];

function FilterDropdown({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = value === 'All' ? placeholder : selectedOption?.label || value;

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="h-14 w-full rounded-full border border-slate-200 bg-white px-7 text-sm font-bold text-slate-700 outline-none transition focus:border-[#f12131] focus:ring-2 focus:ring-[#f12131]/20 shadow-none cursor-pointer flex items-center justify-between"
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={`h-4 w-4 opacity-50 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-72 overflow-y-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl space-y-1">
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <div
                key={opt.value}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`relative flex w-full cursor-pointer select-none items-center rounded-xl py-3 pl-8 pr-3 text-sm font-bold transition-colors ${
                  isSelected
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {isSelected && (
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4 text-[#f12131]" />
                  </span>
                )}
                <span className="truncate">{opt.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const { toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useWishlistCompare();
  const [allProjects, setAllProjects] = useState<ProjectItem[]>(projectsData);

  useEffect(() => {
    async function loadDynamic() {
      const data = await getProjects();
      if (data && data.length > 0) {
        setAllProjects(data);
      }
    }
    loadDynamic();
  }, []);

  // Category tabs state: 'All' | 'Apartments' | 'Plots' | 'Commercial' | 'Industrial' | 'Villas'
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 4;

  // Filter dropdown state
  const [filters, setFilters] = useState({
    status: 'All',
    type: 'All',
    location: 'All',
    budget: 'All',
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  // Restore category and filters from URL or sessionStorage on mount and back navigation
  useEffect(() => {
    const restoreState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlType = params.get('type') || params.get('category');
        const urlBudget = params.get('budget');
        const urlLocation = params.get('location');
        const urlStatus = params.get('status');
        const savedCategory = urlType || sessionStorage.getItem('kpn_project_category');
        const savedFiltersStr = sessionStorage.getItem('kpn_project_filters');

        let restored = {
          status: urlStatus || 'All',
          type: savedCategory || 'All',
          location: urlLocation || 'All',
          budget: urlBudget || 'All',
        };

        if (savedFiltersStr && !urlBudget && !urlLocation && !urlStatus) {
          try {
            const parsed = JSON.parse(savedFiltersStr);
            restored = { ...parsed, type: savedCategory || parsed.type || 'All' };
          } catch {}
        }

        if (savedCategory && savedCategory !== 'All') {
          setSelectedCategory(savedCategory);
        }
        setFilters(restored);
        setAppliedFilters(restored);

        if (!urlType && savedCategory && savedCategory !== 'All') {
          window.history.replaceState(null, '', `/projects?type=${encodeURIComponent(savedCategory)}`);
        }
      } catch {}
    };

    restoreState();
    window.addEventListener('popstate', restoreState);
    return () => {
      window.removeEventListener('popstate', restoreState);
    };
  }, []);

  const updateFilter = (key: 'status' | 'type' | 'location' | 'budget', val: string) => {
    const next = { ...filters, [key]: val };
    setFilters(next);
    setAppliedFilters(next);
    setCurrentPage(1);
    if (key === 'type') {
      setSelectedCategory(val);
      try {
        if (val !== 'All') {
          sessionStorage.setItem('kpn_project_category', val);
          window.history.replaceState(null, '', `/projects?type=${encodeURIComponent(val)}`);
        } else {
          sessionStorage.removeItem('kpn_project_category');
          window.history.replaceState(null, '', '/projects');
        }
      } catch {}
    }
    try {
      sessionStorage.setItem('kpn_project_filters', JSON.stringify(next));
    } catch {}
  };

  const selectTab = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    const reset = {
      status: 'All',
      type: cat,
      location: 'All',
      budget: 'All',
    };
    setFilters(reset);
    setAppliedFilters(reset);

    try {
      if (cat === 'All') {
        sessionStorage.removeItem('kpn_project_category');
        sessionStorage.removeItem('kpn_project_filters');
        window.history.replaceState(null, '', '/projects');
      } else {
        sessionStorage.setItem('kpn_project_category', cat);
        sessionStorage.setItem('kpn_project_filters', JSON.stringify(reset));
        window.history.replaceState(null, '', `/projects?type=${encodeURIComponent(cat)}`);
      }
    } catch {}
  };

  const resetFilters = () => {
    const initial = { status: 'All', type: 'All', location: 'All', budget: 'All' };
    setSelectedCategory('All');
    setFilters(initial);
    setAppliedFilters(initial);
    setCurrentPage(1);
    try {
      sessionStorage.removeItem('kpn_project_category');
      sessionStorage.removeItem('kpn_project_filters');
      window.history.replaceState(null, '', '/projects');
    } catch {}
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedFilters(filters);
    setCurrentPage(1);
    try {
      sessionStorage.setItem('kpn_project_filters', JSON.stringify(filters));
      if (filters.type !== 'All') {
        sessionStorage.setItem('kpn_project_category', filters.type);
        window.history.replaceState(null, '', `/projects?type=${encodeURIComponent(filters.type)}`);
      }
    } catch {}
  };

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      // 1. Type & Category tab filter (kept synchronized)
      const targetType = appliedFilters.type !== 'All' ? appliedFilters.type : selectedCategory;
      if (targetType !== 'All') {
        const pType = (project.type || (project as any).propertyType || '').toLowerCase();
        const tTerm = targetType.toLowerCase();
        if (!pType.includes(tTerm) && !tTerm.includes(pType)) {
          return false;
        }
      }

      // 2. Status filter
      if (appliedFilters.status !== 'All') {
        const statTerm = appliedFilters.status.toLowerCase();
        const projStat = (project.status || '').toLowerCase();
        if (statTerm === 'ongoing') {
          if (projStat !== 'ongoing' && projStat !== 'available') return false;
        } else if (statTerm === 'upcoming') {
          if (projStat !== 'upcoming') return false;
        } else if (statTerm === 'completed') {
          if (projStat !== 'completed' && projStat !== 'sold') return false;
        } else if (projStat !== statTerm) {
          return false;
        }
      }

      // 3. Location filter
      if (appliedFilters.location !== 'All') {
        const locTerm = appliedFilters.location.toLowerCase();
        const projLoc = (project.location || '').toLowerCase();
        const projAddr = (project.address || '').toLowerCase();
        if (!projLoc.includes(locTerm) && !projAddr.includes(locTerm)) {
          return false;
        }
      }

      // 4. Budget filter
      if (appliedFilters.budget !== 'All') {
        if (!matchesBudget(project.budget, appliedFilters.budget)) {
          return false;
        }
      }

      return true;
    });
  }, [allProjects, selectedCategory, appliedFilters]);

  // Paginated Projects slice for current page
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage, ITEMS_PER_PAGE]);

  return (
    <>
      <Navbar variant="hero" />
      <InnerPageHero
        title="Our Projects"
        breadcrumb="Projects"
        description="Explore landmark real estate developments engineered for modern luxury living and lasting value."
        image="/images/projects/apt_royal_oak.jpg"
      />

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          
          {/* =========================================================
              CATEGORY TOGGLE TABS (APARTMENTS & PLOTS)
          ========================================================= */}
          <FadeIn direction="up" className="mb-12 flex flex-wrap items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="flex flex-wrap items-center gap-3">
              {['All', 'Apartments', 'Plots', 'Commercial', 'Industrial', 'Villas'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => selectTab(cat)}
                  className={`h-12 px-7 rounded-full text-sm font-extrabold transition-all duration-300 ${
                    (appliedFilters.type !== 'All' ? appliedFilters.type : selectedCategory) === cat
                      ? 'bg-[#f12131] text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat === 'All' ? 'All Projects' : cat}
                </button>
              ))}
            </div>

            <p className="text-sm font-semibold text-slate-500">
              Showing <span className="text-slate-900 font-bold">{paginatedProjects.length}</span> of {filteredProjects.length} Projects (Page {currentPage} of {totalPages})
            </p>
          </FadeIn>

          {/* =========================================================
              MAIN TWO-COLUMN GRID (PROJECT CARDS + STICKY FILTER)
          ========================================================= */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">

            {/* -----------------------------------------------------
                LEFT COLUMN: PROJECT CARDS LIST
            ----------------------------------------------------- */}
            <div id="projects-list" className="space-y-8 lg:col-span-8 min-h-[500px]">
              {filteredProjects.length === 0 ? (
                <div className="rounded-[32px] border border-dashed border-slate-300 p-16 text-center">
                  <h3 className="text-xl font-bold text-slate-800">
                    No projects found matching your criteria
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Try clearing filters to see more properties.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-6 rounded-full bg-[#f12131] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md cursor-pointer hover:bg-red-600 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                paginatedProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="
                      group
                      relative
                      block
                      h-[390px]
                      w-full
                      overflow-hidden
                      rounded-[32px]
                      bg-slate-200
                      shadow-lg
                      transition-all
                      duration-500
                      hover:shadow-2xl
                      sm:h-[520px]
                      lg:h-[625px]
                    "
                  >
                    {/* Main project image */}
                    <img
                      src={project.image}
                      alt={project.name}
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        object-center
                        transition-transform
                        duration-700
                        group-hover:scale-[1.03]
                      "
                    />

                    {/* =====================================================
                        RIGHT FLOATING PANEL
                    ====================================================== */}
                    <div
                      className="
                        absolute
                        bottom-3
                        right-3
                        top-3
                        z-10
                        w-[48%]
                        overflow-hidden
                        rounded-[30px]
                        border
                        border-white/30
                        shadow-xl
                        sm:bottom-4
                        sm:right-4
                        sm:top-4
                        sm:w-[48%]
                      "
                    >
                      {/* =================================================
                          NORMAL STATE - BLURRED IMAGE
                      ================================================= */}
                      <img
                        src={project.image}
                        alt=""
                        aria-hidden="true"
                        className="
                          absolute
                          inset-0
                          h-full
                          w-full
                          scale-110
                          object-cover
                          object-center
                          blur-[18px]
                          transition-opacity
                          duration-500
                          group-hover:opacity-0
                        "
                      />

                      {/* Normal glass background */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-white/20
                          backdrop-blur-[3px]
                          transition-opacity
                          duration-500
                          group-hover:opacity-0
                        "
                      />

                      {/* =================================================
                          HOVER RED BACKGROUND
                      ================================================= */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-[#f12131]
                          opacity-0
                          transition-opacity
                          duration-500
                          group-hover:opacity-100
                        "
                      />

                      {/* =================================================
                          CONTENT
                      ================================================= */}
                      <div
                        className="
                          relative
                          flex
                          h-full
                          flex-col
                          justify-between
                          p-6
                          sm:p-8
                          lg:p-10
                        "
                      >
                        {/* TOP BADGE & ACTION BUTTONS */}
                        <div className="flex items-center justify-between">
                          <span
                            className="
                              inline-flex
                              items-center
                              rounded-full
                              bg-[#f12131]
                              px-6
                              py-3
                              text-xs
                              font-black
                              tracking-wide
                              text-white
                              shadow-md
                              transition-all
                              duration-500
                              group-hover:bg-white
                              group-hover:text-black
                            "
                          >
                            {project.bhk}
                          </span>

                          {/* Wishlist & Compare Buttons */}
                          <div className="flex items-center gap-2 z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(project.id);
                              }}
                              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 ${
                                isInWishlist(project.id)
                                  ? 'bg-[#f12131] text-white scale-110'
                                  : 'bg-white/80 text-slate-800 hover:bg-white hover:text-[#f12131]'
                              }`}
                              title={isInWishlist(project.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            >
                              <Heart className={`h-5 w-5 ${isInWishlist(project.id) ? 'fill-white' : ''}`} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleCompare(project.id);
                              }}
                              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 ${
                                isInCompare(project.id)
                                  ? 'bg-[#382b88] text-white scale-110'
                                  : 'bg-white/80 text-slate-800 hover:bg-white hover:text-[#382b88]'
                              }`}
                              title={isInCompare(project.id) ? 'Remove from Compare' : 'Add to Compare'}
                            >
                              <Scale className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        {/* BOTTOM CONTENT */}
                        <div className="space-y-6">
                          {/* Location */}
                          <div className="flex items-center gap-3">
                            <MapPin
                              className="
                                h-5
                                w-5
                                shrink-0
                                text-[#f12131]
                                transition-colors
                                duration-500
                                group-hover:text-black
                              "
                            />
                            <span
                              className="
                                text-base
                                font-bold
                                text-white
                                drop-shadow-md
                                transition-colors
                                duration-500
                                sm:text-lg
                                group-hover:text-black
                                group-hover:drop-shadow-none
                              "
                            >
                              {project.location}
                            </span>
                          </div>

                          {/* Divider */}
                          <div
                            className="
                              h-px
                              w-full
                              bg-white/60
                              transition-colors
                              duration-500
                              group-hover:bg-black
                            "
                          />

                          {/* Project name */}
                          <h3
                            className="
                              text-3xl
                              font-extrabold
                              tracking-tight
                              text-white
                              drop-shadow-lg
                              transition-colors
                              duration-500
                              sm:text-4xl
                              lg:text-[44px]
                              lg:leading-tight
                              group-hover:text-black
                              group-hover:drop-shadow-none
                            "
                          >
                            {project.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}

              {/* Dynamic Pagination Controls */}
              {filteredProjects.length > 0 && (
                <div className="flex items-center gap-3 pt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => {
                        setCurrentPage(page);
                        const listEl = document.getElementById('projects-list');
                        if (listEl && window.scrollY > listEl.offsetTop) {
                          window.scrollTo({ top: Math.max(0, listEl.offsetTop - 100), behavior: 'smooth' });
                        }
                      }}
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold shadow-md transition-all ${
                        currentPage === page
                          ? 'bg-[#f12131] text-white scale-105'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {currentPage < totalPages && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage((prev) => prev + 1);
                        const listEl = document.getElementById('projects-list');
                        if (listEl && window.scrollY > listEl.offsetTop) {
                          window.scrollTo({ top: Math.max(0, listEl.offsetTop - 100), behavior: 'smooth' });
                        }
                      }}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-extrabold text-slate-700 shadow-md border border-slate-200 transition-all hover:bg-slate-100"
                    >
                      &gt;
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* -----------------------------------------------------
                RIGHT COLUMN: STICKY FILTER SIDEBAR
            ----------------------------------------------------- */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
              <div className="space-y-6 rounded-[32px] border border-slate-100 bg-slate-50/90 p-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-extrabold tracking-tight text-[#29247c]">
                    Filter
                  </h3>
                  {(filters.status !== 'All' || filters.type !== 'All' || filters.location !== 'All' || filters.budget !== 'All' || selectedCategory !== 'All') && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs font-bold text-[#f12131] hover:underline cursor-pointer transition"
                    >
                      Reset all
                    </button>
                  )}
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                  {/* Status Dropdown */}
                  <FilterDropdown
                    value={filters.status}
                    placeholder="Project Status"
                    options={STATUS_OPTIONS}
                    onChange={(val) => updateFilter('status', val)}
                  />

                  {/* Type Dropdown */}
                  <FilterDropdown
                    value={filters.type}
                    placeholder="Project Type"
                    options={TYPE_OPTIONS}
                    onChange={(val) => updateFilter('type', val)}
                  />

                  {/* Location Dropdown */}
                  <FilterDropdown
                    value={filters.location}
                    placeholder="Project Location"
                    options={LOCATION_OPTIONS}
                    onChange={(val) => updateFilter('location', val)}
                  />

                  {/* Budget Dropdown */}
                  <FilterDropdown
                    value={filters.budget}
                    placeholder="Project Budget"
                    options={BUDGET_OPTIONS}
                    onChange={(val) => updateFilter('budget', val)}
                  />

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="h-14 w-full rounded-full bg-[#f12131] text-base font-extrabold text-white shadow-md transition-all hover:bg-red-600 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
