'use client';

import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Plus,
  Trash2,
  Edit,
  Upload,
  Calendar,
  Building,
  X,
  ExternalLink,
  Award,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { awardsData, AwardItem } from '@/data/siteData';
import ConfirmModal from '@/components/admin/ConfirmModal';

const AWARD_IMAGE_PRESETS = [
  { name: 'FPA Home Expo 2024', url: '/images/awards/FPA-Home-Expo-2024.png' },
  { name: 'Best Builder 2012', url: '/images/awards/Best-Builder-2017.png' },
  { name: 'LIC Business Meet 2024', url: '/images/awards/LIC-Business-Meet-2024.png' },
  { name: 'Tamil Nadu Icon Award 2024', url: '/images/awards/Township-Developers-2024.png' },
  { name: 'HDFC Business Growth 2018-19', url: '/images/awards/Business-Growth-2019.png' },
  { name: 'HDFC Business Growth 2021-22', url: '/images/awards/Business-Growth-2021.png' },
  { name: 'Life Membership Certificate', url: '/images/awards/Life-Membership-Certificate.png' },
  { name: 'FPA Home Expo 2023', url: '/images/awards/FPA-Home-Expo-2023.png' },
  { name: 'Trusted Developer 2025', url: '/images/awards/Trusted-Developer-2025.png' },
];

export default function AdminAwardsPage() {
  const [awards, setAwards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    year: '2024',
    description: '',
    image: '/images/awards/FPA-Home-Expo-2024.png',
    status: 'Published',
  });

  const loadAwards = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/awards');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAwards(res.data);
      } else {
        // Fallback to static siteData awards
        setAwards(awardsData);
      }
    } catch (err) {
      console.warn('Failed to load awards from API, using fallback data:', err);
      setAwards(awardsData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAwards();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await api.upload(file, 'awards');
      if (res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveAward = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        try {
          const res = await api.put(`/awards/${editingId}`, formData);
          if (res.success) {
            setAwards((prev) => prev.map((a) => (a._id === editingId || a.id === editingId ? res.data : a)));
          }
        } catch {
          // Update locally
          setAwards((prev) =>
            prev.map((a) =>
              a._id === editingId || a.id === editingId
                ? { ...a, ...formData, _id: editingId, id: editingId }
                : a
            )
          );
        }
      } else {
        const newAward = {
          ...formData,
          id: `award-${Date.now()}`,
          _id: `award-${Date.now()}`,
        };
        try {
          const res = await api.post('/awards', formData);
          if (res.success) {
            setAwards((prev) => [res.data, ...prev]);
          }
        } catch {
          // Add locally
          setAwards((prev) => [newAward, ...prev]);
        }
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        title: '',
        organization: '',
        year: '2024',
        description: '',
        image: '/images/awards/FPA-Home-Expo-2024.png',
        status: 'Published',
      });
    } catch (err: any) {
      alert(err.message || 'Failed to save award');
    }
  };

  const handleEdit = (award: any) => {
    setEditingId(award._id || award.id);
    setFormData({
      title: award.title,
      organization: award.organization,
      year: award.year,
      description: award.description || '',
      image: award.image || '/images/awards/FPA-Home-Expo-2024.png',
      status: award.status || 'Published',
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      try {
        await api.delete(`/awards/${deleteTarget.id}`);
      } catch (e) {
        console.warn('API delete error, updating local state:', e);
      }
      setAwards((prev) => prev.filter((a) => a._id !== deleteTarget.id && a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete award');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
            Awards & Recognitions CMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage industry honors, participant awards, builder awards, and verified certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/our-awards"
            target="_blank"
            className="flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Public Page</span>
          </Link>

          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: '',
                organization: '',
                year: '2024',
                description: '',
                image: '/images/awards/FPA-Home-Expo-2024.png',
                status: 'Published',
              });
              setIsModalOpen(true);
            }}
            className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Award</span>
          </button>
        </div>
      </div>

      {/* Awards Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
          Loading awards repository...
        </div>
      ) : awards.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-xs">
          <Trophy className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p className="text-base font-extrabold text-slate-700">No awards in repository</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((award, index) => (
            <div
              key={award._id || award.id || index}
              className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="flex h-36 w-full items-center justify-center rounded-2xl bg-slate-50 p-3 border border-slate-100">
                  <img
                    src={award.image}
                    alt={award.title}
                    className="max-h-28 max-w-[150px] object-contain transition-transform group-hover:scale-105"
                    onError={(e: any) => {
                      e.target.src = '/images/awards/Trusted-Developer-2025.png';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold text-[#f12131]">
                      {award.year}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-bold text-slate-500 truncate">
                      {award.organization}
                    </span>
                  </div>

                  <h3 className="text-base font-black tracking-tight text-[#29247c] line-clamp-2">
                    {award.title}
                  </h3>

                  {award.description && (
                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-3 pt-1">
                      {award.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-[10px] font-extrabold uppercase rounded-full bg-emerald-50 px-2.5 py-0.5 text-emerald-700">
                  {award.status || 'Published'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(award)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-[#29247c] hover:text-[#29247c] transition-colors cursor-pointer"
                    title="Edit Award"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: award._id || award.id, title: award.title })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Award"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-[28px] sm:rounded-[32px] border border-slate-200 bg-white p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-[#29247c]">
                {editingId ? 'Edit Award / Recognition' : 'Add Award / Recognition'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAward} className="space-y-4">
              {/* Award Title */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Award Title*
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Home Expo 2024 Participant Award"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#29247c]/20"
                />
              </div>

              {/* Organization & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Organization / Awarded By*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Flat Promoters Association, Chennai South"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#29247c]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Year / Period*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g. 2024 or 2021-2022"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#29247c]/20"
                  />
                </div>
              </div>

              {/* Full Description / Content */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Award Description & Citation Text*
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Home Expo 2024 Participant Award presented to KPN Promoters Pvt. Ltd. by Flat Promoters Association, Chennai South."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#29247c]/20"
                />
              </div>

              {/* Image Selection / Upload */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                  Award Trophy / Certificate Image*
                </label>
                
                {/* Image Presets */}
                <div className="mb-2">
                  <p className="text-[10px] font-semibold text-slate-400 mb-1">Select from standard award images:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {AWARD_IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                          formData.image === preset.url
                            ? 'bg-[#29247c] text-white border-[#29247c]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Award preview"
                        className="h-12 w-16 shrink-0 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shadow-2xs"
                      />
                    ) : (
                      <div className="h-12 w-16 shrink-0 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-[10px] font-black">
                        PHOTO
                      </div>
                    )}
                    <label className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-[#29247c] shadow-2xs hover:bg-slate-50 hover:border-[#29247c]/40 transition-all">
                      <Upload className="h-4 w-4 text-[#f12131]" />
                      <span>{isUploading ? 'Uploading Image...' : 'Upload Device Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="or enter image path / URL"
                    className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-medium text-slate-700"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Publication Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800"
                >
                  <option value="Published">Published (Visible on Website)</option>
                  <option value="Draft">Draft (Hidden)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-full bg-[#f12131] text-xs font-bold text-white shadow-md hover:bg-[#d81928] cursor-pointer transition-all"
                >
                  {editingId ? 'Update Award' : 'Save Award'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Award?"
        itemName={deleteTarget?.title}
        message="Are you sure you want to delete this award? This action cannot be undone and will remove it from the website."
        confirmText="Delete Award"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
