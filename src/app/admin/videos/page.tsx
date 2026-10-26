'use client';

import React, { useEffect, useState } from 'react';
import { Video, Plus, Trash2, Edit, Play, X, ExternalLink, Upload, ImageIcon } from 'lucide-react';
import { api } from '@/lib/api';
import ConfirmModal from '@/components/admin/ConfirmModal';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    project: '',
    projectName: '',
    videoUrl: '',
    videoType: 'YouTube',
    thumbnailUrl: '',
    description: '',
    status: 'Published',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [vRes, pRes] = await Promise.all([
        api.get('/videos?all=true'),
        api.get('/projects'),
      ]);
      if (vRes.success) setVideos(vRes.data || []);
      if (pRes.success) setProjects(pRes.data || []);
    } catch (err) {
      console.warn('Failed to load videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      project: '',
      projectName: '',
      videoUrl: '',
      videoType: 'YouTube',
      thumbnailUrl: '',
      description: '',
      status: 'Published',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item._id || item.id);
    setFormData({
      title: item.title || '',
      project: item.projectId || item.project || '',
      projectName: item.projectName || '',
      videoUrl: item.videoUrl || '',
      videoType: item.videoType || 'YouTube',
      thumbnailUrl: item.thumbnailUrl || '',
      description: item.description || '',
      status: item.status || 'Published',
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await api.upload(file, 'videos');
      if (res.url) {
        setFormData((prev) => ({ ...prev, thumbnailUrl: res.url }));
      }
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUrlChange = (url: string) => {
    let type = formData.videoType;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      type = 'YouTube';
    } else if (url.includes('vimeo.com')) {
      type = 'Vimeo';
    } else {
      type = 'External';
    }

    // Auto set thumbnail if it's YouTube and user hasn't uploaded custom thumbnail
    let thumb = formData.thumbnailUrl;
    if (!thumb || thumb.includes('img.youtube.com')) {
      const ytId = extractYouTubeId(url);
      if (ytId) {
        thumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    }

    setFormData({
      ...formData,
      videoUrl: url,
      videoType: type,
      thumbnailUrl: thumb,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedProj = projects.find((p) => p._id === formData.project || p.id === formData.project);
      
      let finalThumb = formData.thumbnailUrl;
      if (!finalThumb && formData.videoType === 'YouTube') {
        const ytId = extractYouTubeId(formData.videoUrl);
        if (ytId) finalThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }

      const payload = {
        ...formData,
        thumbnailUrl: finalThumb,
        projectName: selectedProj ? selectedProj.name : formData.projectName,
      };

      if (editingId) {
        const res = await api.put(`/videos/${editingId}`, payload);
        if (res.success) {
          setVideos((prev) =>
            prev.map((v) => ((v._id || v.id) === editingId ? (res.data || { ...v, ...payload }) : v))
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await api.post('/videos', payload);
        if (res.success) {
          setVideos((prev) => [res.data, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save video');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/videos/${deleteTarget.id}`);
      if (res.success) {
        setVideos((prev) => prev.filter((v) => (v._id || v.id) !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
            Video Center & Testimonials CMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage customer video testimonials, aerial walkthroughs, and project tours displayed on the website.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Video Tour</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
          Loading video walkthroughs...
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-16 text-center shadow-xs">
          <Video className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p className="text-base font-extrabold text-slate-700">No videos published yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Click &quot;Add Video Tour&quot; above to link YouTube, Vimeo, or MP4 customer testimonials.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((item) => {
            const vidId = item._id || item.id;
            const ytId = extractYouTubeId(item.videoUrl);
            const thumb = item.thumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null);

            return (
              <div
                key={vidId}
                className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-xs transition-all hover:border-slate-300 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Video className="h-10 w-10 text-slate-600" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f12131] text-white shadow-lg">
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="rounded-md bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
                        {item.videoType || 'YouTube'}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase text-white ${
                          item.status === 'Published' ? 'bg-emerald-600' : 'bg-amber-600'
                        }`}
                      >
                        {item.status || 'Published'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] font-extrabold text-[#f12131]">
                      {item.projectName || 'General Video'}
                    </span>
                    <h3 className="text-sm font-black text-[#29247c] line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        &ldquo;{item.description}&rdquo;
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No description provided</p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-[#29247c] hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Watch</span>
                  </a>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title="Edit Video"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: vidId, title: item.title })}
                      className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete Video"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-black tracking-tight text-[#29247c]">
                {editingId ? 'Edit Video Tour / Testimonial' : 'Add Video Tour / Testimonial'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Video / Testimonial Title*
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. From Dream to Key Handover: Our Journey with KPN"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Associated Project
                </label>
                <Select
                  value={formData.project || 'general'}
                  onValueChange={(val) => setFormData({ ...formData, project: val === 'general' ? '' : val })}
                >
                  <SelectTrigger className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 shadow-none cursor-pointer">
                    <SelectValue placeholder="General Video Tour" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
                    <SelectItem value="general" className="text-xs font-bold py-2">General Video Tour</SelectItem>
                    {projects.map((p) => {
                      const pid = p._id || p.id;
                      return (
                        <SelectItem key={pid} value={pid} className="text-xs font-bold py-2">{p.name}</SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Video URL (YouTube or Direct MP4)*
                </label>
                <input
                  type="text"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Platform Type
                  </label>
                  <Select
                    value={formData.videoType}
                    onValueChange={(val) => setFormData({ ...formData, videoType: val as any })}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 shadow-none cursor-pointer">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
                      <SelectItem value="YouTube" className="text-xs font-bold py-2">YouTube</SelectItem>
                      <SelectItem value="Vimeo" className="text-xs font-bold py-2">Vimeo</SelectItem>
                      <SelectItem value="External" className="text-xs font-bold py-2">Self-Hosted / MP4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => setFormData({ ...formData, status: val as any })}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 shadow-none cursor-pointer">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
                      <SelectItem value="Published" className="text-xs font-bold py-2">Published</SelectItem>
                      <SelectItem value="Draft" className="text-xs font-bold py-2">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Custom Thumbnail Upload or Preview */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Thumbnail Image (Auto-detected from YouTube or Upload Custom)
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    {formData.thumbnailUrl ? (
                      <img src={formData.thumbnailUrl} alt="Thumbnail preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      placeholder="Paste thumbnail image URL or upload below"
                      className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-bold"
                    />
                    <label className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#29247c] hover:underline cursor-pointer">
                      <Upload className="h-3 w-3" />
                      <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Description / Customer Quote */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Customer Quote / Story Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. The craftsmanship, transparent documentation, and on-schedule handover gave our family absolute peace of mind."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-relaxed resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-full bg-[#f12131] text-xs font-bold text-white shadow-md hover:bg-[#d81928] cursor-pointer"
                >
                  {editingId ? 'Update Video' : 'Save Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Video?"
        itemName={deleteTarget?.title}
        message="Are you sure you want to delete this video walkthrough? This action cannot be undone."
        confirmText="Delete Video"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
