'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import { projectsData, ProjectItem } from '@/data/siteData';
import { getProjects } from '@/lib/cmsClient';
import { MapPin, ChevronDown, Scale, Check } from 'lucide-react';
import FadeIn from '@/components/animation/FadeIn';
import { useWishlistCompare } from '@/context/WishlistCompareContext';
import ProjectListingCard from '@/components/project/ProjectListingCard';
import SiteVisitModal from '@/components/project/SiteVisitModal';

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
  { value: 'All', label: 'All' },
  { value: 'Ongoing', label: 'Ongoing' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Completed', label: 'Completed' },
];

const TYPE_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Apartments', label: 'Apartments' },
  { value: 'Plots', label: 'Plots' },
  { value: 'Villas', label: 'Villas' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Industrial', label: 'Industrial' },
];

const LOCATION_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Urapakkam', label: 'Urapakkam, Chennai' },
  { value: 'Guduvanchery', label: 'Guduvanchery, Chennai' },
  { value: 'Karanaipuducheri', label: 'Karanaipuducheri, Chennai' },
  { value: 'Nenmeli', label: 'Nenmeli, Chennai' },
  { value: 'S.P. Kovil', label: 'S.P. Kovil, Chennai' },
  { value: 'Maraimalai Nagar', label: 'Maraimalai Nagar, Chennai' },
];

const BUDGET_OPTIONS = [
  { value: 'All', label: 'All' },
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
  const { toggleCompare, isInCompare } = useWishlistCompare();
  const [allProjects, setAllProjects] = useState<ProjectItem[]>(projectsData);
  const [siteVisitProject, setSiteVisitProject] = useState<ProjectItem | null>(null);

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
  const ITEMS_PER_PAGE = 6;

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
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const resetFilters = () => {
    const initial = { status: 'All', type: 'All', location: 'All', budget: 'All' };
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
        window.history.replaceState(null, '', `/projects?type=${encodeURIComponent(filters.type)}`);
      } else {
        window.history.replaceState(null, '', '/projects');
      }
    } catch {}
  };

  const filteredProjects = useMemo(() => {
    const list = allProjects.filter((project) => {
      // 1. Type filter
      if (appliedFilters.type !== 'All') {
        const pType = (project.type || (project as any).propertyType || '').toLowerCase();
        const tTerm = appliedFilters.type.toLowerCase();
        if (!pType.includes(tTerm) && !tTerm.includes(pType)) {
          return false;
        }
      }

      // 2. Status filter
      if (appliedFilters.status !== 'All') {
        const statTerm = appliedFilters.status.toLowerCase().trim();
        const projStat = (project.status || '').toLowerCase().trim();
        if (statTerm === 'ongoing') {
          if (projStat !== 'ongoing' && projStat !== 'available') return false;
        } else if (statTerm === 'upcoming') {
          if (projStat !== 'upcoming' && !projStat.includes('launch')) return false;
        } else if (statTerm === 'completed' || statTerm === 'sold out') {
          if (projStat !== 'completed' && !projStat.includes('sold') && projStat !== 'ready to move') return false;
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

    // Task 2: Order projects by Ongoing first, Upcoming next, and Completed (including Sold Out) last
    const getStatusPriority = (status?: string) => {
      const s = (status || '').toLowerCase().trim();
      if (s === 'ongoing' || s === 'available') return 1;
      if (s === 'upcoming' || s.includes('launch')) return 2;
      if (s === 'completed' || s.includes('sold') || s === 'ready to move') return 3;
      return 1;
    };

    return [...list].sort((a, b) => getStatusPriority(a.status) - getStatusPriority(b.status));
  }, [allProjects, appliedFilters]);

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
              TOP HORIZONTAL FILTER BAR (ROW MODEL)
          ========================================================= */}
          <FadeIn direction="up" className="mb-12">
            <div className="rounded-[32px] border border-slate-100 bg-slate-50/90 p-6 sm:p-8 shadow-sm">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#29247c]">
                    Filter
                  </h3>
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-400">
                    Find by status, type, location or budget
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    Showing <span className="text-slate-900 font-bold">{paginatedProjects.length}</span> of {filteredProjects.length} Projects (Page {currentPage} of {totalPages})
                  </p>
                  {(filters.status !== 'All' || filters.type !== 'All' || filters.location !== 'All' || filters.budget !== 'All' || appliedFilters.status !== 'All' || appliedFilters.type !== 'All' || appliedFilters.location !== 'All' || appliedFilters.budget !== 'All') && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs font-bold text-[#f12131] hover:underline cursor-pointer transition"
                    >
                      Reset all
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                {/* Type Dropdown (FIRST) */}
                <FilterDropdown
                  value={filters.type}
                  placeholder="Project Type"
                  options={TYPE_OPTIONS}
                  onChange={(val) => updateFilter('type', val)}
                />

                {/* Status Dropdown */}
                <FilterDropdown
                  value={filters.status}
                  placeholder="Project Status"
                  options={STATUS_OPTIONS}
                  onChange={(val) => updateFilter('status', val)}
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
          </FadeIn>

          {/* =========================================================
              PROJECT CARDS GRID (TWO PROJECTS IN A ROW)
          ========================================================= */}
          <div id="projects-list" className="min-h-[500px]">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {paginatedProjects.map((project) => (
                  <ProjectListingCard
                    key={project.id}
                    project={project}
                    onBookSiteVisit={(p) => setSiteVisitProject(p)}
                  />
                ))}
              </div>
            )}

            {/* Dynamic Pagination Controls */}
            {filteredProjects.length > 0 && (
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-10">
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

        </div>
      </section>

      {/* Complimentary Guided Site Visit Booking Modal */}
      <SiteVisitModal
        project={siteVisitProject}
        isOpen={Boolean(siteVisitProject)}
        onClose={() => setSiteVisitProject(null)}
      />
    </>
  );
}
