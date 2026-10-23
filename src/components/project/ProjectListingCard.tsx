'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Scale, Building2, BedDouble, Ruler, Navigation, ArrowRight } from 'lucide-react';
import { ProjectItem } from '@/data/siteData';
import { useWishlistCompare } from '@/context/WishlistCompareContext';

interface ProjectListingCardProps {
  project: ProjectItem;
  onBookSiteVisit: (project: ProjectItem) => void;
}

// Helper to extract clean nearby serving locations
function getServingLocations(project: ProjectItem): string {
  if (project.proximityDetails && project.proximityDetails.length > 0) {
    const landmarks = project.proximityDetails.map((detail) => {
      return detail
        .replace(/^\d+(?:\.\d+)?\s*(?:km|kms|mtrs|meters|mins?|minutes?)\s*(?:to|from)\s*/i, '')
        .replace(/^just\s*\d+\s*mins?\s*from\s*/i, '')
        .trim();
    });
    return landmarks.slice(0, 4).join(', ');
  }

  if (project.address) {
    return project.address;
  }

  return `${project.location}, GST Road, Tambaram, Vandalur, Kilambakkam`;
}

// Clean helper to prevent duplicate words like "Villa Villas" or "Plots Plots"
function formatConfiguration(bhk?: string, type?: string): string {
  const cleanBhk = (bhk || '').trim();
  const cleanType = (type || 'Apartments').trim();

  if (!cleanBhk) return cleanType;
  if (cleanBhk.toLowerCase().includes(cleanType.toLowerCase())) {
    return cleanBhk;
  }
  if (cleanType.toLowerCase() === 'plots' && cleanBhk.toLowerCase().includes('plot')) {
    return cleanBhk;
  }
  if (cleanType.toLowerCase() === 'villas' && cleanBhk.toLowerCase().includes('villa')) {
    return cleanBhk;
  }

  return `${cleanBhk} ${cleanType === 'Plots' ? 'Plots' : cleanType === 'Villas' ? 'Villas' : 'Apts'}`;
}

// Resolve KPN status badge
function getStatusBadge(status?: string) {
  const s = (status || 'Ongoing').toLowerCase();
  if (s === 'completed' || s === 'ready to move') {
    return {
      label: 'Ready to Move',
      className: 'bg-emerald-600 text-white',
      dotColor: 'bg-emerald-300',
    };
  }
  if (s === 'upcoming' || s === 'new launch') {
    return {
      label: 'Upcoming',
      className: 'bg-[#29247c] text-white',
      dotColor: 'bg-indigo-300',
    };
  }
  return {
    label: 'Ongoing',
    className: 'bg-gradient-to-r from-[#f12131] to-red-600 text-white',
    dotColor: 'bg-white',
  };
}

export default function ProjectListingCard({ project, onBookSiteVisit }: ProjectListingCardProps) {
  const { toggleCompare, isInCompare } = useWishlistCompare();
  const statusInfo = getStatusBadge(project.status);
  const servingLocations = getServingLocations(project);
  const configurationText = formatConfiguration(project.bhk, project.type);

  // Derived values for area & units
  const projectArea =
    project.projectArea ||
    project.plotSizes ||
    (project.type === 'Plots' ? 'Plots (600 - 2400 Sq.Ft)' : '2.5 Acres');

  const totalUnitsText = project.totalUnits
    ? `Total Units - ${project.totalUnits} Units`
    : project.type === 'Plots'
    ? 'Total Units - 48 Plots'
    : 'Total Units - 36 Units';

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-[26px] sm:rounded-[28px] border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:shadow-[0_20px_50px_rgba(41,36,124,0.14)] hover:-translate-y-1.5">
      {/* =========================================================
          TOP MEDIA SECTION (16:10 Unobstructed Elevation Image)
      ========================================================= */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Link href={`/projects/${project.slug}`} className="block h-full w-full">
          <img
            src={project.image}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Pinned KPN Pill Status Badge (Top-Left) */}
        <div
          className={`absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-md ${statusInfo.className}`}
        >
          <span className={`h-2 w-2 rounded-full ${statusInfo.dotColor} animate-pulse`} />
          <span>{statusInfo.label}</span>
        </div>

        {/* Compare Button (Top-Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(project.id);
          }}
          className={`absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 ${
            isInCompare(project.id)
              ? 'bg-[#29247c] text-white scale-110 shadow-lg'
              : 'bg-white/95 text-slate-700 hover:bg-[#f12131] hover:text-white'
          }`}
          title={isInCompare(project.id) ? 'Remove from Compare' : 'Add to Compare'}
          aria-label="Compare property"
        >
          <Scale className="h-4 w-4" />
        </button>
      </div>

      {/* =========================================================
          CARD BODY CONTENT (KPN Theme Typography & Colors)
      ========================================================= */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          {/* Project Title (KPN Royal Navy) */}
          <Link href={`/projects/${project.slug}`} className="block">
            <h3 className="text-xl font-bold text-[#29247c] transition-colors group-hover:text-[#f12131] line-clamp-1 font-heading">
              {project.name}
            </h3>
          </Link>

          {/* Pricing / Budget (Signature KPN Red) */}
          <div className="mt-1">
            <span className="text-lg font-black text-[#f12131] tracking-tight">
              {project.budget}
            </span>
          </div>

          {/* Primary Location */}
          <div className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700">
            <MapPin className="h-4 w-4 shrink-0 text-[#f12131]" />
            <span className="truncate">{project.location}</span>
          </div>

          {/* Serving Locations */}
          <div className="mt-2.5 flex items-start gap-1.5 text-[11px] sm:text-xs text-slate-500 leading-snug">
            <Navigation className="h-3.5 w-3.5 shrink-0 text-[#29247c] mt-0.5" />
            <p className="line-clamp-2">
              <span className="font-bold text-[#29247c]">Serving Location:</span> {servingLocations}
            </p>
          </div>

          {/* Key Specifications Grid with Icons (KPN Theme Box) */}
          <div className="mt-4 space-y-2 rounded-xl bg-slate-50/80 p-3 border border-slate-100 text-xs font-semibold text-slate-700">
            {/* Land Area */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center text-[#29247c]">
                <Ruler className="h-4 w-4" />
              </div>
              <span className="truncate">{projectArea}</span>
            </div>

            {/* Total Units */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center text-[#29247c]">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="truncate">{totalUnitsText}</span>
            </div>

            {/* Configuration / Typology */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center text-[#29247c]">
                <BedDouble className="h-4 w-4" />
              </div>
              <span className="truncate">{configurationText}</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            CARD FOOTER ACTION BUTTONS (KPN Theme CTAs)
        ========================================================= */}
        <div className="mt-5 flex items-center gap-2.5 border-t border-slate-100 pt-4">
          {/* Button 1: Book a site visit (KPN Navy Outline) */}
          <button
            type="button"
            onClick={() => onBookSiteVisit(project)}
            className="flex-1 rounded-full border-2 border-[#29247c] bg-white py-2.5 px-2 text-center text-xs font-bold text-[#29247c] transition-all hover:bg-[#29247c] hover:text-white active:scale-95 cursor-pointer truncate shadow-2xs"
          >
            Book a site visit
          </button>

          {/* Button 2: View Details (KPN Signature Red CTA) */}
          <Link
            href={`/projects/${project.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#f12131] py-2.5 px-2 text-center text-xs font-extrabold uppercase tracking-wider text-white shadow-md shadow-red-500/20 transition-all hover:bg-[#d01927] hover:scale-[1.02] active:scale-95 cursor-pointer truncate"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
