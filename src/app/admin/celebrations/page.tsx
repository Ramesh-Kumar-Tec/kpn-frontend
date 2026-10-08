'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  PartyPopper,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Search,
  Calendar,
  Layers,
  Sparkles,
  Eye,
} from 'lucide-react';
import { api } from '@/lib/api';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { fallbackCelebrations } from '@/lib/cmsClient';

interface Celebration {
  _id: string;
  id?: string;
  title: string;
  subheading: string;
  description?: string;
  image: string;
  gallery?: string[];
  date?: string;
  year?: string;
  category?: string;
  order?: number;
  status: 'Published' | 'Draft';
}

const CATEGORIES = ['Trip', 'Office', 'Launch', 'Milestone', 'Festival', 'Meeting', 'General'];

export default function AdminCelebrationsPage() {
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Custom Delete Modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCelebrations = async () => {
    setIsLoading(true);
    try {
      let res;
      try {
        res = await api.get('/celebrations/admin/all');
      } catch {
        res = await api.get('/celebrations');
      }
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setCelebrations(res.data);
      } else {
        // Use fallback if API returns empty
        setCelebrations(fallbackCelebrations as any[]);
      }
    } catch (err) {
      console.warn('Failed to load celebrations from API, using fallback data');
      setCelebrations(fallbackCelebrations as any[]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCelebrations();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/celebrations/${deleteTarget.id}`);
      if (res.success) {
        setCelebrations((prev) => prev.filter((c) => (c._id || c.id) !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        // Local removal
        setCelebrations((prev) => prev.filter((c) => (c._id || c.id) !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err: any) {
      // Local fallback removal
      setCelebrations((prev) => prev.filter((c) => (c._id || c.id) !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCelebrations = useMemo(() => {
    return celebrations.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (search) {
        const query = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.subheading.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [celebrations, categoryFilter, search]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
            Ceremonies & Celebrations CMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage company trips, office openings, milestones, meetings, and celebration moments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/celebrations"
            target="_blank"
            className="flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Public Page</span>
          </Link>

          <Link
            href="/admin/celebrations/new"
            className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Celebration</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search celebrations & meetings..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#29247c]/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              categoryFilter === 'All'
                ? 'bg-[#29247c] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({celebrations.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = celebrations.filter((c) => c.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#29247c] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Celebrations */}
      {isLoading ? (
        <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
          Loading celebration entries...
        </div>
      ) : filteredCelebrations.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 p-12 text-center bg-white">
          <PartyPopper className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-sm font-extrabold text-slate-700">No celebrations found</h3>
          <p className="text-xs text-slate-400 mt-1">Add your first celebration to showcase on the website.</p>
          <div className="mt-4">
            <Link
              href="/admin/celebrations/new"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-[#29247c] px-4 text-xs font-bold text-white hover:bg-[#1f1a63] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Entry</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCelebrations.map((item, idx) => {
            const itemId = item._id || item.id || `celebration-${idx}`;
            const photoCount = item.gallery && item.gallery.length > 0 ? item.gallery.length : 1;
            const isMeeting = item.category === 'Meeting';

            return (
              <div
                key={itemId}
                className="flex flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-xs hover:shadow-md transition-all"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 mb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`rounded-full backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black uppercase text-white ${
                        isMeeting ? 'bg-[#29247c]/90' : 'bg-black/60'
                      }`}>
                        {item.category || 'General'}
                      </span>
                      {item.year && (
                        <span className="rounded-full bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-black text-slate-800">
                          {item.year}
                        </span>
                      )}
                    </div>

                    {photoCount > 1 && (
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-white">
                        <Layers className="h-3 w-3 text-[#f12131]" />
                        <span>{photoCount} Photos Carousel</span>
                      </div>
                    )}
                  </div>

                  {/* Text info */}
                  <h3 className="text-base font-black text-[#29247c] line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold text-[#f12131] mt-0.5 line-clamp-1">
                    {item.subheading}
                  </p>
                  {item.description && (
                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Bottom actions */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span
                    className={`text-[10px] font-extrabold uppercase rounded-full px-2.5 py-0.5 ${
                      item.status === 'Published'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {item.status || 'Published'}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/celebrations/${itemId}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-[#29247c] hover:text-[#29247c] transition-colors"
                      title="Edit Celebration"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget({ id: itemId, title: item.title })}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Celebration"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reusable ConfirmModal for Deleting */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Celebration?"
        itemName={deleteTarget?.title}
        message="Are you sure you want to delete this celebration moment? It will be permanently removed from the website."
        confirmText="Delete Celebration"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
