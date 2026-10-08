'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
  Star,
  Info,
} from 'lucide-react';
import { api } from '@/lib/api';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export const CELEBRATION_CATEGORIES = [
  'Trip',
  'Office',
  'Launch',
  'Milestone',
  'Festival',
  'Meeting',
  'General',
];

interface CelebrationFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function CelebrationForm({ initialData, isEdit = false }: CelebrationFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingMultiple, setIsUploadingMultiple] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Initial gallery extraction
  const initialGallery: string[] = Array.isArray(initialData?.gallery)
    ? initialData.gallery
    : initialData?.image
    ? [initialData.image]
    : [];

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subheading: initialData?.subheading || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
    gallery: initialGallery,
    date: initialData?.date || '',
    year: initialData?.year || '2025',
    category: initialData?.category || 'Meeting',
    order: initialData?.order ?? 0,
    status: (initialData?.status || 'Published') as 'Published' | 'Draft',
  });

  const isMeetingCategory = formData.category === 'Meeting';

  // Single file upload (standard for trips, offices, etc.)
  const handleSingleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await api.upload(file, 'celebrations');
      if (res.url) {
        setFormData((prev) => ({
          ...prev,
          image: res.url,
          gallery: prev.gallery.length > 0 ? [res.url, ...prev.gallery.slice(1)] : [res.url],
        }));
      }
    } catch (err: any) {
      alert(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const [uploadProgressText, setUploadProgressText] = useState('');

  // Multiple files upload (for Meeting gallery)
  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setIsUploadingMultiple(true);
    setUploadProgressText(`Optimizing & Uploading ${fileList.length} photos...`);

    const successfulUrls: string[] = [];
    const failedNames: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setUploadProgressText(`Uploading ${i + 1} of ${fileList.length}: ${file.name.slice(0, 20)}...`);
      try {
        const res = await api.upload(file, 'celebrations');
        if (res && res.url) {
          successfulUrls.push(res.url);
        }
      } catch (err: any) {
        console.error(`Failed to upload ${file.name}:`, err);
        failedNames.push(file.name);
      }
    }

    if (successfulUrls.length > 0) {
      setFormData((prev) => {
        const currentGallery = prev.gallery.filter(
          (url) => url !== '/images/celebrations/year_end_meeting_2023.jpeg' || prev.gallery.length > 1
        );
        const updatedGallery = [...currentGallery, ...successfulUrls];
        return {
          ...prev,
          gallery: updatedGallery,
          image: prev.image || updatedGallery[0] || successfulUrls[0],
        };
      });
    }

    if (failedNames.length > 0) {
      alert(`Uploaded ${successfulUrls.length} photos. ${failedNames.length} photo(s) could not be uploaded.`);
    }

    setIsUploadingMultiple(false);
    setUploadProgressText('');
    e.target.value = ''; // Reset input so same files can be re-selected if needed
  };

  // Add image URL to gallery
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => {
      const updated = [...prev.gallery, newImageUrl.trim()];
      return {
        ...prev,
        gallery: updated,
        image: prev.image || updated[0],
      };
    });
    setNewImageUrl('');
  };

  // Remove photo from gallery
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const updated = prev.gallery.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        gallery: updated,
        image: updated.length > 0 ? (prev.image === prev.gallery[indexToRemove] ? updated[0] : prev.image) : '',
      };
    });
  };

  // Set photo as primary cover
  const handleSetPrimaryImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    if (isMeetingCategory && formData.gallery.length === 0 && !formData.image) {
      setErrorMessage('Please upload at least one photo for this meeting.');
      setIsSaving(false);
      return;
    }

    if (!isMeetingCategory && !formData.image) {
      setErrorMessage('Please choose or upload a photo.');
      setIsSaving(false);
      return;
    }

    const primaryImage = formData.image || formData.gallery[0];
    const galleryPayload = isMeetingCategory
      ? formData.gallery.length > 0
        ? formData.gallery
        : [primaryImage]
      : [primaryImage];

    const payload = {
      ...formData,
      image: primaryImage,
      gallery: galleryPayload,
    };

    try {
      if (isEdit && initialData?._id) {
        await api.put(`/celebrations/${initialData._id}`, payload);
      } else if (isEdit && initialData?.id) {
        await api.put(`/celebrations/${initialData.id}`, payload);
      } else {
        await api.post('/celebrations', payload);
      }
      router.push('/admin/celebrations');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save celebration record');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/celebrations"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#29247c]/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#29247c]">
                {formData.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">•</span>
              <span className="text-xs text-slate-500 font-bold">
                {isEdit ? 'Edit Mode' : 'New Entry'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#29247c] mt-0.5">
              {isEdit ? `Edit: ${formData.title || 'Celebration'}` : isMeetingCategory ? 'Add New Meeting Details' : 'Add New Celebration Moment'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Link
            href="/admin/celebrations"
            className="h-11 px-5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-6 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : isEdit ? 'Update Details' : 'Publish Celebration'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-center gap-2">
          <span>⚠️ {errorMessage}</span>
        </div>
      )}

      {/* Main Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Core Info Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#29247c] flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="h-4 w-4 text-[#f12131]" />
              <span>Event & Heading Details</span>
            </h2>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                {isMeetingCategory ? 'Meeting Heading / Title*' : 'Event Heading / Title*'}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={isMeetingCategory ? 'e.g. Annual Strategic Growth & Leadership Meet' : 'e.g. Munnar Team Retreat 2025'}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#29247c] focus:outline-none focus:ring-2 focus:ring-[#29247c]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                {isMeetingCategory ? 'Meeting Sub-Heading / Tagline*' : 'Catchy Subheading / Tagline*'}
              </label>
              <input
                type="text"
                required
                value={formData.subheading}
                onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                placeholder={isMeetingCategory ? 'e.g. Envisioning the Next Frontier — Driving Growth & Excellence' : 'e.g. Breathe the clouds, live the moments.'}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#29247c] focus:outline-none focus:ring-2 focus:ring-[#29247c]/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category*
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 shadow-none cursor-pointer">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl">
                    {CELEBRATION_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-xs font-bold py-2.5 rounded-xl cursor-pointer">
                        {cat} {cat === 'Meeting' ? '✨ (Multi-Photo Carousel)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isMeetingCategory && (
                  <p className="mt-1.5 text-[11px] font-bold text-[#29247c] flex items-center gap-1">
                    <Info className="h-3 w-3" /> Multi-photo auto-sliding carousel enabled
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  Year / Period*
                </label>
                <input
                  type="text"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2025"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 focus:bg-white focus:border-[#29247c] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Display Date (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g. March 2025 or March 15, 2025"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Detailed Story / Description (Optional)
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Share key highlights, accomplishments, discussions, or celebratory moments..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#29247c] focus:outline-none focus:ring-2 focus:ring-[#29247c]/20"
              />
            </div>
          </div>

          {/* Photos Management Card */}
          {isMeetingCategory ? (
            /* Meeting: MULTIPLE PHOTOS CAROUSEL MANAGER */
            <div className="rounded-3xl border border-[#29247c]/30 bg-gradient-to-br from-white via-indigo-50/20 to-white p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-[#29247c] flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#f12131]" />
                    <span>Meeting Photos — Auto-Sliding Carousel</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Add multiple high-resolution photos. They will automatically slide in an animated carousel on the website.
                  </p>
                </div>
                <span className="self-start sm:self-auto rounded-full bg-[#29247c] px-3 py-1 text-[11px] font-black text-white">
                  {formData.gallery.length} Photo{formData.gallery.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Multi-upload buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#29247c]/30 bg-white px-4 text-xs font-extrabold text-[#29247c] shadow-2xs hover:bg-indigo-50/50 hover:border-[#29247c] transition-all">
                  <Upload className="h-4 w-4 text-[#f12131]" />
                  <span className="truncate max-w-[220px]">
                    {uploadProgressText || (isUploadingMultiple ? 'Uploading Photos...' : 'Upload Multiple Photos')}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultipleFilesUpload}
                    className="hidden"
                    disabled={isUploadingMultiple}
                  />
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="or paste image URL..."
                    className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#29247c]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="h-12 px-4 rounded-2xl bg-[#29247c] text-xs font-bold text-white hover:bg-[#1f1a63] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Gallery Grid Preview */}
              {formData.gallery.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-white/60">
                  <ImageIcon className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-600">No photos added yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload photos above to preview carousel slides.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
                  {formData.gallery.map((imgUrl, index) => {
                    const isCover = formData.image === imgUrl || index === 0;
                    return (
                      <div
                        key={index}
                        className={`group relative aspect-[4/3] overflow-hidden rounded-2xl border bg-slate-100 transition-all ${
                          isCover ? 'border-[#29247c] ring-2 ring-[#29247c]/30 shadow-md' : 'border-slate-200'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Slide ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        {/* Top index badge */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className="rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-black text-white backdrop-blur-xs">
                            Slide #{index + 1}
                          </span>
                          {isCover && (
                            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-black text-white flex items-center gap-0.5">
                              <Star className="h-2.5 w-2.5 fill-white" /> Cover
                            </span>
                          )}
                        </div>

                        {/* Action buttons overlay */}
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(imgUrl)}
                              title="Set as Cover Photo"
                              className="h-8 px-2.5 rounded-xl bg-white text-[10px] font-extrabold text-[#29247c] shadow-xs hover:bg-slate-100"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(index)}
                            title="Remove Photo"
                            className="h-8 w-8 rounded-xl bg-red-600 text-white flex items-center justify-center hover:bg-red-700 shadow-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Standard Single Image Uploader for Other Categories */
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#29247c] flex items-center gap-2 border-b border-slate-100 pb-3">
                <ImageIcon className="h-4 w-4 text-[#f12131]" />
                <span>Featured Photo / Image</span>
              </h2>

              <div className="space-y-3">
                <label className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 text-xs font-extrabold text-[#29247c] shadow-2xs hover:bg-slate-100 hover:border-[#29247c]/40 transition-all">
                  <Upload className="h-4 w-4 text-[#f12131]" />
                  <span>{isUploading ? 'Uploading Device Photo...' : 'Choose Device Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSingleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    Or Direct Image URL
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/celebrations/sample.jpeg or https://..."
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {formData.image && (
                <div className="mt-4 relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Column: Publication, Order & Preview */}
        <div className="space-y-6">
          {/* Status & Display Order */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#29247c] border-b border-slate-100 pb-2">
              Publishing Settings
            </h3>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Publication Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData({ ...formData, status: val as any })}
              >
                <SelectTrigger className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 shadow-none cursor-pointer">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl">
                  <SelectItem value="Published" className="text-xs font-bold py-2 text-emerald-600">
                    🟢 Published (Visible)
                  </SelectItem>
                  <SelectItem value="Draft" className="text-xs font-bold py-2 text-amber-600">
                    🟡 Draft (Hidden)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                Display Order Priority
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Lower numbers appear first.</p>
            </div>
          </div>

          {/* Quick Preview Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#29247c] border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Card Live Preview</span>
              <span className="text-[10px] text-[#f12131] lowercase">live</span>
            </h3>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-xs">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-200">
                <img
                  src={formData.image || formData.gallery[0] || '/images/celebrations/goa_trip_2025.jpeg'}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="rounded-full bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[9px] font-black uppercase text-white">
                    {formData.category}
                  </span>
                  {formData.year && (
                    <span className="rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-black text-slate-800">
                      {formData.year}
                    </span>
                  )}
                </div>
                {isMeetingCategory && formData.gallery.length > 1 && (
                  <div className="absolute bottom-2 right-2 rounded-full bg-[#29247c]/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-black text-white flex items-center gap-1">
                    <Layers className="h-2.5 w-2.5" />
                    <span>{formData.gallery.length} Photos</span>
                  </div>
                )}
              </div>

              <h4 className="mt-3 text-sm font-black text-[#29247c] line-clamp-1">
                {formData.title || 'Event Heading Title'}
              </h4>
              <p className="text-[11px] font-bold text-[#f12131] line-clamp-1 mt-0.5">
                {formData.subheading || 'Catchy Subheading / Tagline'}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
