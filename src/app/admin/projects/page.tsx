'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Grid,
  CheckCircle,
  XCircle,
  Eye,
  Layers,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/lib/api';
import ConfirmModal from '@/components/admin/ConfirmModal';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/projects?includeUnpublished=true');
      if (res.success) {
        setProjects(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await api.patch(`/projects/${id}/publish`);
      if (res.success) {
        setProjects((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, isPublished: res.isPublished } : p
          )
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/projects/${deleteTarget.id}`);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p._id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (typeFilter !== 'All' && p.propertyType !== typeFilter) return false;
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      if (search) {
        const query = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.bhk.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [projects, typeFilter, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* Top Header & New Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
            Project & Property CMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage official apartments, DTCP approved plots, units, and media assets.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Project</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project name, location, or BHK..."
            className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-10 min-w-[160px] rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 outline-none shadow-none cursor-pointer">
              <SelectValue placeholder="All Property Types" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
              <SelectItem value="All" className="text-xs font-bold">All Property Types</SelectItem>
              <SelectItem value="Apartments" className="text-xs font-bold">Apartments</SelectItem>
              <SelectItem value="Plots" className="text-xs font-bold">Plots</SelectItem>
              <SelectItem value="Villas" className="text-xs font-bold">Villas</SelectItem>
              <SelectItem value="Commercial" className="text-xs font-bold">Commercial</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 min-w-[140px] rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 outline-none shadow-none cursor-pointer">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
              <SelectItem value="All" className="text-xs font-bold">All Statuses</SelectItem>
              <SelectItem value="Ongoing" className="text-xs font-bold">Ongoing</SelectItem>
              <SelectItem value="Upcoming" className="text-xs font-bold">Upcoming</SelectItem>
              <SelectItem value="Completed" className="text-xs font-bold">Completed</SelectItem>
              <SelectItem value="Sold Out" className="text-xs font-bold">Sold Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-xs">
        {isLoading ? (
          <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
            Loading KPN real estate projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-16 text-center">
            <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-base font-extrabold text-slate-700">No projects found</p>
            <p className="text-xs text-slate-400 mt-1">Try modifying your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-4 py-4">Type & BHK</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Pricing</th>
                  <th className="px-4 py-4">Units</th>
                  <th className="px-4 py-4">Visibility</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Project Image & Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                          <img
                            src={project.image}
                            alt={project.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-extrabold text-[#29247c] text-sm block">
                            {project.name}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-[#f12131]" />
                            {project.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Type & BHK */}
                    <td className="px-4 py-4">
                      <span className="font-bold text-slate-900 block">{project.propertyType}</span>
                      <span className="text-[11px] text-slate-500">{project.bhk}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                        project.status === 'Ongoing'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : project.status === 'Upcoming'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : project.status === 'Completed' || project.status === 'Sold Out'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {project.status}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="px-4 py-4">
                      <span className="font-extrabold text-slate-900">{project.budget}</span>
                    </td>

                    {/* Units / Plots / Villas */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-[#29247c] font-heading">
                          {project.availableUnits ?? 0}{' '}
                          <span className="text-slate-400 font-medium text-[11px]">
                            / {project.totalUnits ?? 0}{' '}
                            {project.propertyType === 'Plots'
                              ? 'plots'
                              : project.propertyType === 'Villas'
                              ? 'villas'
                              : 'avail'}
                          </span>
                        </span>
                        <Link
                          href={`/admin/projects/${project.slug || project._id}/units`}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-extrabold text-[#29247c] hover:border-[#f12131] hover:text-[#f12131] hover:bg-rose-50 transition-all w-fit"
                        >
                          <Layers className="h-3 w-3 text-[#f12131]" />
                          <span>
                            Manage{' '}
                            {project.propertyType === 'Plots'
                              ? 'Plots'
                              : project.propertyType === 'Villas'
                              ? 'Villas'
                              : 'Units'}
                          </span>
                        </Link>
                      </div>
                    </td>

                    {/* Visibility / Published */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleTogglePublish(project._id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold transition-all ${
                          project.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {project.isPublished ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-amber-600" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Live Website Preview Link */}
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview on Public Website"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        {/* Edit Project */}
                        <Link
                          href={`/admin/projects/${project.slug || project._id}/edit`}
                          title="Edit Project"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-[#29247c] hover:bg-[#29247c] hover:text-white transition-all"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget({ id: project._id, title: project.title })}
                          title="Delete Project"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project?"
        itemName={deleteTarget?.title}
        message="Are you sure you want to permanently delete this project and all its unit configurations? This action cannot be undone."
        confirmText="Delete Project"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
