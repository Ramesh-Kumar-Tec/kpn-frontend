'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Building2,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  CheckCircle2,
  HelpCircle,
  MapPin,
  Compass,
  Layers,
  Loader2,
  ExternalLink,
  X,
  Video,
  Play,
  Eye,
  Sparkles,
  AlertCircle,
  Check,
  Film,
  Images,
  Camera,
  Maximize2 as PlanIcon,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import InventoryManager from './InventoryManager';

interface ProjectFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function getPropertyTypeConfig(type: string) {
  switch (type) {
    case 'Plots':
      return {
        unitSingular: 'Plot',
        unitPlural: 'Plots',
        showBlocks: false, // Plots have no blocks/towers
        blocksLabel: 'Total Phases / Sectors',
        blocksPlaceholder: 'e.g. 2',
        showFloors: false, // Bare land has NO floors
        floorsLabel: '',
        floorsPlaceholder: '',
        bhkLabel: 'Plot Sizes / Dimensions*',
        bhkPlaceholder: 'e.g. 600 - 2400 Sq.Ft or 30x40 / 40x60',
        structureTitle: 'Layout & Phase Structure',
        structureSubtitle: 'Layout phase and land sizing details for residential / commercial plots',
        inventorySubtitle: 'Track total, available, booked, and blocked plots in this layout',
      };
    case 'Villas':
      return {
        unitSingular: 'Villa',
        unitPlural: 'Villas',
        showBlocks: false, // Individual homes, not towers
        blocksLabel: 'Clusters / Phases',
        blocksPlaceholder: 'e.g. 1',
        showFloors: true, // Villa elevation/floors
        floorsLabel: 'Floors per Villa (Elevation)*',
        floorsPlaceholder: 'e.g. 2 (G + 1 Duplex)',
        bhkLabel: 'Villa Configuration / BHK*',
        bhkPlaceholder: 'e.g. 3 & 4 BHK Luxury Duplex Villas',
        structureTitle: 'Villa Elevation & Phases',
        structureSubtitle: 'Individual villa elevation (Duplex/Triplex) and gated community phases',
        inventorySubtitle: 'Track total, available, booked, and blocked villas in this community',
      };
    case 'Commercial':
      return {
        unitSingular: 'Commercial Unit',
        unitPlural: 'Commercial Units',
        showBlocks: true,
        blocksLabel: 'Total Blocks / Towers*',
        blocksPlaceholder: 'e.g. 1',
        showFloors: true,
        floorsLabel: 'Total Floors*',
        floorsPlaceholder: 'e.g. 6 (G + 5 Floors)',
        bhkLabel: 'Space Type / Configuration*',
        bhkPlaceholder: 'e.g. Retail Shops, Showrooms & Office Suites',
        structureTitle: 'Commercial Building Structure',
        structureSubtitle: 'Number of commercial towers, blocks, and floor elevations',
        inventorySubtitle: 'Track total, available, booked, and blocked commercial spaces',
      };
    case 'Industrial':
      return {
        unitSingular: 'Industrial Unit',
        unitPlural: 'Industrial Units',
        showBlocks: true,
        blocksLabel: 'Total Sheds / Bays / Godowns*',
        blocksPlaceholder: 'e.g. 4',
        showFloors: false, // Single level ground structure with clear height
        floorsLabel: 'Levels / Mezzanine Floors',
        floorsPlaceholder: 'e.g. Ground + Mezzanine',
        bhkLabel: 'Industrial Type / Clear Height*',
        bhkPlaceholder: 'e.g. PEB Warehouse, 30ft Clear Height',
        structureTitle: 'Industrial Shed & Bay Structure',
        structureSubtitle: 'Number of industrial sheds, bays, or warehouse units',
        inventorySubtitle: 'Track total, available, booked, and blocked industrial units',
      };
    case 'Apartments':
    default:
      return {
        unitSingular: 'Apartment',
        unitPlural: 'Units',
        showBlocks: true,
        blocksLabel: 'Total Blocks / Towers*',
        blocksPlaceholder: 'e.g. 2',
        showFloors: true,
        floorsLabel: 'Total Floors*',
        floorsPlaceholder: 'e.g. 4',
        bhkLabel: 'Configuration / BHK Tag*',
        bhkPlaceholder: 'e.g. 1 & 2 BHK',
        structureTitle: 'Building Structure',
        structureSubtitle: 'Number of blocks, towers, and floor elevations',
        inventorySubtitle: 'Track total, available, booked, and blocked units',
      };
  }
}

export default function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'basic' | 'units' | 'media' | 'plans' | 'amenities' | 'specs' | 'nearby' | 'faqs'>('basic');
  const [mediaSubTab, setMediaSubTab] = useState<'photos' | 'plans' | 'video' | 'streetview' | 'brochure'>('photos');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Upload loading states
  const [isUploadingBrochure, setIsUploadingBrochure] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingPlans, setIsUploadingPlans] = useState(false);
  const [uploadingPlanIndex, setUploadingPlanIndex] = useState<number | null>(null);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    propertyType: initialData?.propertyType || 'Apartments',
    status: initialData?.status || 'Ongoing',
    city: initialData?.city || 'Chennai',
    location: initialData?.location || '',
    address: initialData?.address || '',
    bhk: initialData?.bhk || '1 & 2 BHK',
    budget: initialData?.budget || '₹ 25L Onwards',
    pricePerSqFt: initialData?.pricePerSqFt || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    handoverTimeline: initialData?.handoverTimeline || '',
    commencementDate: initialData?.commencementDate || '',
    projectArea: initialData?.projectArea || initialData?.plotSizes || '',
    plotSizes: initialData?.plotSizes || initialData?.projectArea || '',

    // Building Structure & Unit Status Breakdown
    totalBlocks: initialData?.totalBlocks || 1,
    totalFloors: initialData?.totalFloors || 1,
    totalUnits: initialData?.totalUnits || 0,
    availableUnits: initialData?.availableUnits || 0,
    bookedUnits: initialData?.bookedUnits ?? initialData?.soldUnits ?? 0,
    blockedUnits: initialData?.blockedUnits ?? initialData?.reservedUnits ?? 0,
    soldUnits: initialData?.soldUnits ?? initialData?.bookedUnits ?? 0,
    reservedUnits: initialData?.reservedUnits ?? initialData?.blockedUnits ?? 0,

    blocks: Array.isArray(initialData?.blocks) ? initialData.blocks : [],
    plots: Array.isArray(initialData?.plots) ? initialData.plots : [],
    layoutImages: Array.isArray(initialData?.layoutImages) ? initialData.layoutImages : [],

    image: initialData?.image || '/images/projects/apt_lenid.jpg',
    galleryImages: Array.isArray(initialData?.galleryImages) ? initialData.galleryImages : [],
    walkthroughVideoUrl: initialData?.walkthroughVideoUrl || '',
    virtualTourUrl: initialData?.virtualTourUrl || '',
    streetViewUrl: initialData?.streetViewUrl || '',
    brochureUrl: initialData?.brochureUrl || '',
    masterPlanUrl: initialData?.masterPlanUrl || '',
    mapEmbedUrl: initialData?.mapEmbedUrl || '',
    isPublished: initialData ? initialData.isPublished : true,
    isFeatured: initialData ? initialData.isFeatured : false,
    order: initialData?.order || 1,

    // Nested Arrays & Objects
    floorPlans: initialData?.floorPlans || [
      { title: '1 BHK Master Plan', bhk: '1 BHK', sqft: '550 Sq. Ft.', imageUrl: '/images/projects/p1.webp' },
    ],
    amenities: initialData?.amenities || [
      { name: '24x7 Security', icon: 'Shield', description: 'Gated community with CCTV' },
      { name: 'Fitness Center', icon: 'Dumbbell', description: 'Equipped modern gym' },
      { name: "Children's Play Area", icon: 'Gamepad2', description: 'Safe outdoor playground' },
      { name: 'Landscape Garden', icon: 'Trees', description: 'Green park spaces' },
    ],
    specifications: initialData?.specifications || {
      structure: 'RCC Framed Structure designed for seismic compliance.',
      flooring: 'Vitrified tiles 2x2 in living, dining, and bedrooms.',
      doors: 'Teak wood main door with designer laminate.',
      windows: 'UPVC sliding windows with safety grills.',
      electrical: 'Fire-resistant concealed copper wiring.',
      plumbing: 'Branded CP fittings and sanitary ware.',
      kitchen: 'Black granite counter top with stainless steel sink.',
      others: 'Weather-proof exterior paint finish.',
    },
    nearbyLocations: initialData?.nearbyLocations || [
      { name: 'Railway Station', distance: '1.7 km', description: 'Suburban rail network' },
      { name: 'Kilambakkam Bus Terminus', distance: '3.5 km', description: 'State transport hub' },
      { name: 'Airport', distance: '22 km', description: 'Chennai Airport' },
    ],
    faqs: initialData?.faqs || [
      { question: 'Is the project approved by CMDA / DTCP?', answer: 'Yes, 100% legal approval with clear titles.', order: 1 },
      { question: 'Are bank loans available?', answer: 'Yes, pre-approved with SBI, HDFC, LIC HFL, and ICICI.', order: 2 },
    ],
  });

  // Single file upload (Cover image or brochure)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fieldName === 'brochure') {
      setIsUploadingBrochure(true);
    } else if (fieldName === 'image') {
      setIsUploadingCover(true);
    }

    try {
      const res = await api.upload(file, 'projects');
      if (res.url) {
        if (fieldName === 'image') {
          setFormData((prev) => ({ ...prev, image: res.url }));
        } else if (fieldName === 'gallery') {
          setFormData((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, res.url] }));
        } else if (fieldName === 'brochure') {
          setFormData((prev) => ({ ...prev, brochureUrl: res.url }));
        }
      }
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    } finally {
      if (fieldName === 'brochure') {
        setIsUploadingBrochure(false);
      } else if (fieldName === 'image') {
        setIsUploadingCover(false);
      }
      e.target.value = '';
    }
  };

  // Multiple Gallery Photos Upload
  const handleMultipleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingGallery(true);
    try {
      const uploaded = await api.uploadMultiple(files, 'projects/gallery');
      const newUrls = uploaded.map((item) => item.url).filter(Boolean);
      if (newUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          galleryImages: [...prev.galleryImages, ...newUrls],
        }));
      }
    } catch (err: any) {
      alert(err.message || 'Gallery upload failed');
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  // Add Gallery Image from manual URL
  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, newGalleryUrl.trim()],
    }));
    setNewGalleryUrl('');
  };

  // Remove Gallery Image
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_: string, idx: number) => idx !== indexToRemove),
    }));
  };

  // Set Gallery Image as Cover
  const handleSetCoverImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));
  };

  // Walkthrough Video Upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    try {
      const res = await api.upload(file, 'projects/videos');
      if (res.url) {
        setFormData((prev) => ({ ...prev, walkthroughVideoUrl: res.url }));
      }
    } catch (err: any) {
      alert(err.message || 'Video upload failed');
    } finally {
      setIsUploadingVideo(false);
      e.target.value = '';
    }
  };

  // Multiple Floor Plans Upload (Batch)
  const handleMultiplePlansUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingPlans(true);
    try {
      const uploaded = await api.uploadMultiple(files, 'projects/plans');
      const newPlans = uploaded.map((item, idx) => {
        const originalFile = files[idx];
        const rawName = originalFile ? originalFile.name.replace(/\.[^/.]+$/, '') : `Plan ${idx + 1}`;
        const cleanTitle = rawName.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

        return {
          title: cleanTitle || `Floor Plan ${formData.floorPlans.length + idx + 1}`,
          bhk: '2 BHK',
          sqft: '',
          imageUrl: item.url,
        };
      });

      setFormData((prev) => ({
        ...prev,
        floorPlans: [...prev.floorPlans, ...newPlans],
      }));
    } catch (err: any) {
      alert(err.message || 'Floor plans upload failed');
    } finally {
      setIsUploadingPlans(false);
      e.target.value = '';
    }
  };

  // Single Floor Plan Image Upload
  const handleSinglePlanUpload = async (e: React.ChangeEvent<HTMLInputElement>, planIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPlanIndex(planIndex);
    try {
      const res = await api.upload(file, 'projects/plans');
      if (res.url) {
        setFormData((prev) => {
          const copy = [...prev.floorPlans];
          copy[planIndex] = { ...copy[planIndex], imageUrl: res.url };
          return { ...prev, floorPlans: copy };
        });
      }
    } catch (err: any) {
      alert(err.message || 'Plan image upload failed');
    } finally {
      setUploadingPlanIndex(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    try {
      const projectId = initialData?._id || initialData?.id;
      const payload = {
        ...formData,
        plotSizes: formData.projectArea || formData.plotSizes || '',
        version: initialData?.version || 1,
      };
      if (isEdit && projectId) {
        await api.put(`/projects/${projectId}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      router.push('/admin/projects');
    } catch (err: any) {
      if (err.message && (err.message.includes('Conflict') || err.message.includes('VERSION_CONFLICT'))) {
        setErrorMessage('⚠️ Conflict Detected: This project was updated by another administrator or session while you were editing. Please reload the page to review the latest changes before saving.');
      } else {
        setErrorMessage(err.message || 'Failed to save project. Please check required fields.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#29247c]">
              {isEdit ? `Edit: ${initialData?.name}` : 'Create New Project'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Configure real estate specs, inventory status, media gallery, floor plans, and amenities.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="flex h-11 items-center px-5 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="flex h-11 items-center gap-2 rounded-full bg-[#f12131] px-6 text-xs font-extrabold text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : isEdit ? 'Update Project' : 'Publish Project'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Tabs Navigation Bar */}
      <div className="flex flex-wrap gap-2 rounded-[24px] border border-slate-200/80 bg-white p-2 shadow-xs">
        {[
          { id: 'basic', label: '1. Basic Info' },
          { id: 'units', label: '2. Units & Inventory' },
          { id: 'media', label: '3. Media (Photos, Plans, Video, 360)' },
          { id: 'amenities', label: '4. Amenities' },
          { id: 'specs', label: '5. Specifications' },
          { id: 'nearby', label: '6. Nearby Landmarks' },
          { id: 'faqs', label: '7. FAQs & Maps' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeTab === tab.id || (tab.id === 'media' && activeTab === 'plans')
                ? 'bg-[#29247c] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BASIC INFO */}
      {activeTab === 'basic' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Project Name*
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. KPN Marvel Township"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. kpn-marvel-township (auto-generated if blank)"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Property Type*
              </label>
              <Select
                value={formData.propertyType}
                onValueChange={(val) => setFormData({ ...formData, propertyType: val as any })}
              >
                <SelectTrigger className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20 shadow-none cursor-pointer">
                  <SelectValue placeholder="Select Property Type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
                  <SelectItem value="Apartments" className="rounded-xl font-bold py-2.5 text-slate-700">Apartments</SelectItem>
                  <SelectItem value="Plots" className="rounded-xl font-bold py-2.5 text-slate-700">Plots</SelectItem>
                  <SelectItem value="Villas" className="rounded-xl font-bold py-2.5 text-slate-700">Villas</SelectItem>
                  <SelectItem value="Commercial" className="rounded-xl font-bold py-2.5 text-slate-700">Commercial</SelectItem>
                  <SelectItem value="Industrial" className="rounded-xl font-bold py-2.5 text-slate-700">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Project Status*
              </label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData({ ...formData, status: val as any })}
              >
                <SelectTrigger className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20 shadow-none cursor-pointer">
                  <SelectValue placeholder="Select Project Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
                  <SelectItem value="Ongoing" className="rounded-xl font-bold py-2.5 text-slate-700">Ongoing</SelectItem>
                  <SelectItem value="Upcoming" className="rounded-xl font-bold py-2.5 text-slate-700">Upcoming</SelectItem>
                  <SelectItem value="Completed" className="rounded-xl font-bold py-2.5 text-slate-700">Completed</SelectItem>
                  <SelectItem value="Sold Out" className="rounded-xl font-bold py-2.5 text-slate-700">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                City / Region
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Location Headline*
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Urapakkam, Chennai"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Full Physical Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="No. 48, Karanai Puducherry Rd, Urapakkam"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Short Summary Description
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="1-2 sentences summarizing this project"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Full Project Description
            </label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed overview for prospective buyers..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Handover Timeline
              </label>
              <input
                type="text"
                value={formData.handoverTimeline}
                onChange={(e) => setFormData({ ...formData, handoverTimeline: e.target.value })}
                placeholder="e.g. Ready to Construct / Dec 2026"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Commencement Date
              </label>
              <input
                type="text"
                value={formData.commencementDate}
                onChange={(e) => setFormData({ ...formData, commencementDate: e.target.value })}
                placeholder="e.g. 28 Jun, 2021"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>
          </div>

          {/* Key Stat Badges & Pricing Details */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f12131]/10 text-[#f12131] text-xs font-black">
                ★
              </span>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#29247c]">
                Key Stat Badges & Pricing (Feeds Live Project Detail Badges)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Stat Badge 3: Project Area / Apartment Size */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                  {formData.propertyType === 'Apartments'
                    ? 'Apartment Size*'
                    : formData.propertyType === 'Plots'
                    ? 'Project Area / Plot Extents*'
                    : 'Project Area*'}
                </label>
                <input
                  type="text"
                  value={formData.projectArea}
                  onChange={(e) => setFormData({ ...formData, projectArea: e.target.value })}
                  placeholder={
                    formData.propertyType === 'Apartments'
                      ? 'e.g. 550 - 1200 Sq. Ft.'
                      : formData.propertyType === 'Plots'
                      ? 'e.g. 458 - 2171 Sq.Ft.'
                      : 'e.g. 1200 - 3500 Sq.Ft.'
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Feeds the {formData.propertyType === 'Apartments' ? 'Apartment Size' : 'Project Area'} badge.
                </p>
              </div>

              {/* Stat Badge 5: Price Range / Budget */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                  Price Range / Budget*
                </label>
                <input
                  type="text"
                  required
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder={
                    formData.propertyType === 'Plots'
                      ? 'e.g. ₹ 2799/Sq.Ft or ₹ 18L Onwards'
                      : 'e.g. ₹ 19L Onwards or ₹ 58L Onwards'
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Feeds the Price Range badge.
                </p>
              </div>

              {/* Configuration / BHK Tag */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                  {formData.propertyType === 'Plots'
                    ? 'Plot Dimensions / BHK Tag*'
                    : formData.propertyType === 'Villas'
                    ? 'Villa Configuration / BHK*'
                    : 'Configuration / BHK Tag*'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.bhk}
                  onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                  placeholder={
                    formData.propertyType === 'Plots'
                      ? 'e.g. 600 - 2400 Sq.Ft or Plots'
                      : formData.propertyType === 'Villas'
                      ? 'e.g. 2 & 3 BHK Villa'
                      : 'e.g. 1 & 2 BHK'
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Feeds project card & specs configuration.
                </p>
              </div>

              {/* Price per Sq.Ft (Optional) */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                  Price per Sq.Ft (Optional)
                </label>
                <input
                  type="text"
                  value={formData.pricePerSqFt}
                  onChange={(e) => setFormData({ ...formData, pricePerSqFt: e.target.value })}
                  placeholder="e.g. ₹ 2,799 / Sq.Ft"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Optional per sq.ft pricing rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UNITS & PRICING */}
      {activeTab === 'units' && (() => {
        const typeConfig = getPropertyTypeConfig(formData.propertyType);
        return (
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-8">
            {/* Section 1: Structure & Configuration */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-[#29247c]">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c]">
                    {typeConfig.structureTitle}
                  </h3>
                  <p className="text-xs text-slate-500">{typeConfig.structureSubtitle}</p>
                </div>
              </div>

              <div className={`grid grid-cols-1 ${
                typeConfig.showBlocks && typeConfig.showFloors
                  ? 'sm:grid-cols-3'
                  : typeConfig.showBlocks || typeConfig.showFloors
                  ? 'sm:grid-cols-2'
                  : 'sm:grid-cols-1'
              } gap-6`}>
                {/* Blocks / Towers / Sheds (Hidden for Plots and Villas) */}
                {typeConfig.showBlocks && (
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                      {typeConfig.blocksLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={formData.totalBlocks}
                        onChange={(e) => setFormData({ ...formData, totalBlocks: parseInt(e.target.value, 10) || 1 })}
                        placeholder={typeConfig.blocksPlaceholder}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        {formData.propertyType === 'Industrial' ? 'Sheds' : 'Blocks'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Floors (Hidden for Plots and Industrial; customized for Villas) */}
                {typeConfig.showFloors && (
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                      {typeConfig.floorsLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={formData.totalFloors}
                        onChange={(e) => setFormData({ ...formData, totalFloors: parseInt(e.target.value, 10) || 1 })}
                        placeholder={typeConfig.floorsPlaceholder}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        {formData.propertyType === 'Villas' ? 'Floors/Villa' : 'Floors'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Configuration / BHK / Plot Dimensions */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    {typeConfig.bhkLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                    placeholder={typeConfig.bhkPlaceholder}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Interactive Block, Floor & Unit / Plot Blueprint Manager */}
            <div>
              <InventoryManager
                propertyType={formData.propertyType}
                blocks={formData.blocks}
                plots={formData.plots}
                layoutImages={formData.layoutImages}
                onChange={(updates) => {
                  setFormData((prev) => ({
                    ...prev,
                    ...updates,
                  }));
                }}
              />
            </div>

            <hr className="border-slate-100" />

            {/* Section 2: Unit Inventory & Status Breakdown */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c]">
                      {typeConfig.unitPlural} Inventory & Status Breakdown
                    </h3>
                    <p className="text-xs text-slate-500">{typeConfig.inventorySubtitle}</p>
                  </div>
                </div>

                {/* Status balance indicator */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 border border-emerald-200">
                    {formData.availableUnits} Available
                  </span>
                  <span className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 border border-blue-200">
                    {formData.bookedUnits} Booked
                  </span>
                  <span className="rounded-full bg-amber-50 text-amber-700 px-3 py-1 border border-amber-200">
                    {formData.blockedUnits} Blocked
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Total Units */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    Total {typeConfig.unitPlural}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalUnits}
                    onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value, 10) || 0 })}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base font-black text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5 font-medium">All {typeConfig.unitPlural.toLowerCase()} in project</p>
                </div>

                {/* Available Units */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1.5 flex items-center justify-between">
                    <span>Available {typeConfig.unitPlural}</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.availableUnits}
                    onChange={(e) => setFormData({ ...formData, availableUnits: parseInt(e.target.value, 10) || 0 })}
                    className="h-11 w-full rounded-xl border border-emerald-200 bg-white px-3 text-base font-black text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <p className="text-[11px] text-emerald-600/80 mt-1.5 font-medium">Open for immediate booking</p>
                </div>

                {/* Booked Units */}
                <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-blue-700 mb-1.5 flex items-center justify-between">
                    <span>Booked / Sold</span>
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bookedUnits}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setFormData({ ...formData, bookedUnits: val, soldUnits: val });
                    }}
                    className="h-11 w-full rounded-xl border border-blue-200 bg-white px-3 text-base font-black text-blue-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <p className="text-[11px] text-blue-600/80 mt-1.5 font-medium">Confirmed bookings</p>
                </div>

                {/* Blocked Units */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-amber-700 mb-1.5 flex items-center justify-between">
                    <span>Blocked / Reserved</span>
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.blockedUnits}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setFormData({ ...formData, blockedUnits: val, reservedUnits: val });
                    }}
                    className="h-11 w-full rounded-xl border border-amber-200 bg-white px-3 text-base font-black text-amber-700 outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <p className="text-[11px] text-amber-600/80 mt-1.5 font-medium">Temporarily on hold</p>
                </div>
              </div>

              {/* Quick helper calculation banner */}
              {(formData.availableUnits + formData.bookedUnits + formData.blockedUnits) !== formData.totalUnits && formData.totalUnits > 0 && (
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>
                      Count breakdown ({formData.availableUnits} + {formData.bookedUnits} + {formData.blockedUnits} = {formData.availableUnits + formData.bookedUnits + formData.blockedUnits}) differs from Total {typeConfig.unitPlural} ({formData.totalUnits}).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const remaining = Math.max(0, formData.totalUnits - (formData.bookedUnits + formData.blockedUnits));
                      setFormData({ ...formData, availableUnits: remaining });
                    }}
                    className="font-bold text-[#f12131] hover:underline shrink-0"
                  >
                    Auto-balance Available ({Math.max(0, formData.totalUnits - (formData.bookedUnits + formData.blockedUnits))})
                  </button>
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Section 3: Pricing */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c] mb-4">
                Pricing Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    Budget / Price Display*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g. ₹ 19L Onwards or ₹ 2799/Sq.Ft"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    Price per Sq.Ft
                  </label>
                  <input
                    type="text"
                    value={formData.pricePerSqFt}
                    onChange={(e) => setFormData({ ...formData, pricePerSqFt: e.target.value })}
                    placeholder="e.g. ₹ 4,500"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 3: MEDIA & ASSETS (WITH DEDICATED SEPARATE TABS FOR PHOTOS & PLANS) */}
      {(activeTab === 'media' || activeTab === 'plans') && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-8">
          {/* Header with Public-Style Pill Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-100 pb-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#f12131] font-heading">
                MEDIA & VISUAL ASSETS
              </span>
              <h2 className="text-xl font-black text-[#29247c] font-heading mt-0.5">
                {mediaSubTab === 'photos' && 'Project Photos & Cover'}
                {mediaSubTab === 'plans' && 'Floor Plans & Layout Maps'}
                {mediaSubTab === 'video' && 'Walkthrough Video'}
                {mediaSubTab === 'streetview' && '360 Street View & Virtual Tour'}
                {mediaSubTab === 'brochure' && 'Official Brochure PDF'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {mediaSubTab === 'photos' && 'Upload high-resolution exterior and interior photos. Directly feeds the public Media > Photos carousel.'}
                {mediaSubTab === 'plans' && 'Upload 2D/3D floor blueprints, master layouts, and site maps. Directly feeds the public Media > Plans carousel.'}
                {mediaSubTab === 'video' && 'YouTube / Vimeo link or uploaded MP4 video file. Feeds the public Media > Video tab.'}
                {mediaSubTab === 'streetview' && 'Google Maps 360 embed URL. Feeds the public Media > Street View tab.'}
                {mediaSubTab === 'brochure' && 'Attach official project PDF brochure for buyers to download.'}
              </p>
            </div>

            {/* 4 Media Pills + Brochure (Exact match with public site) */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setMediaSubTab('photos')}
                className={`flex h-11 items-center gap-2 rounded-full px-5 text-xs font-black transition-all cursor-pointer ${
                  mediaSubTab === 'photos'
                    ? 'bg-[#f12131] text-white shadow-md shadow-red-500/20'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-[#f12131] hover:text-[#f12131]'
                }`}
              >
                <Camera className="h-4 w-4" />
                <span>Photos ({formData.galleryImages.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaSubTab('plans')}
                className={`flex h-11 items-center gap-2 rounded-full px-5 text-xs font-black transition-all cursor-pointer ${
                  mediaSubTab === 'plans'
                    ? 'bg-[#f12131] text-white shadow-md shadow-red-500/20'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-[#f12131] hover:text-[#f12131]'
                }`}
              >
                <PlanIcon className="h-4 w-4" />
                <span>Plans ({formData.floorPlans.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaSubTab('video')}
                className={`flex h-11 items-center gap-2 rounded-full px-5 text-xs font-black transition-all cursor-pointer ${
                  mediaSubTab === 'video'
                    ? 'bg-[#f12131] text-white shadow-md shadow-red-500/20'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-[#f12131] hover:text-[#f12131]'
                }`}
              >
                <Video className="h-4 w-4" />
                <span>Video {formData.walkthroughVideoUrl ? '✓' : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaSubTab('streetview')}
                className={`flex h-11 items-center gap-2 rounded-full px-5 text-xs font-black transition-all cursor-pointer ${
                  mediaSubTab === 'streetview'
                    ? 'bg-[#f12131] text-white shadow-md shadow-red-500/20'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-[#f12131] hover:text-[#f12131]'
                }`}
              >
                <Compass className="h-4 w-4" />
                <span>Street View {formData.streetViewUrl ? '✓' : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaSubTab('brochure')}
                className={`flex h-11 items-center gap-2 rounded-full px-4 text-xs font-black transition-all ml-auto cursor-pointer ${
                  mediaSubTab === 'brochure'
                    ? 'bg-[#29247c] text-white shadow-md'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-[#29247c] hover:text-[#29247c]'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Brochure</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              SUB-TAB 1: PHOTOS (Cover Image & Batch Gallery Photos)
          ======================================================== */}
          {mediaSubTab === 'photos' && (
            <div className="space-y-8">
              {/* Main Cover Image */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                  Main Cover Image*
                </label>
                <div className="flex flex-col md:flex-row gap-5 items-start">
                  <div className="relative h-28 w-44 shrink-0 rounded-2xl border-2 border-slate-200 bg-slate-100 overflow-hidden shadow-xs">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Cover preview"
                        className="h-full w-full object-cover"
                        onError={(e: any) => {
                          e.target.src = '/images/projects/apt_lenid.jpg';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                    <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                      Cover Photo
                    </span>
                  </div>

                  <div className="flex-1 w-full space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <input
                        type="text"
                        required
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="/images/projects/apt_lenid.jpg or Cloudinary URL"
                        className="h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
                      />
                      <label
                        className={`flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 text-xs font-bold text-white transition-colors ${
                          isUploadingCover ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 cursor-pointer'
                        }`}
                      >
                        {isUploadingCover ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            <span>Upload Cover</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingCover}
                          onChange={(e) => handleFileUpload(e, 'image')}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-slate-400">
                      Primary hero banner and project card preview image.
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Photos Gallery Multi-Upload */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c]">
                        Project Photo Gallery
                      </h3>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                        {formData.galleryImages.length} Photos
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload multiple project photos at once. Click &quot;Set as Cover&quot; on any photo to make it the hero.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      className={`flex h-10 cursor-pointer items-center gap-2 rounded-full px-5 text-xs font-bold text-white shadow-sm transition-all ${
                        isUploadingGallery
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-[#29247c] hover:bg-[#1f1b5c] active:scale-95 cursor-pointer'
                      }`}
                    >
                      {isUploadingGallery ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Uploading Photos...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload Multiple Photos</span>
                        </>
                      )}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={isUploadingGallery}
                        onChange={handleMultipleGalleryUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {formData.galleryImages.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                      <Images className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">No gallery photos added yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Click &quot;Upload Multiple Photos&quot; above to select and upload photos simultaneously.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    {formData.galleryImages.map((imgUrl: string, idx: number) => {
                      const isCurrentCover = formData.image === imgUrl;
                      return (
                        <div
                          key={idx}
                          className="group relative aspect-[4/3] rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden shadow-2xs hover:shadow-md transition-all"
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e: any) => {
                              e.target.src = '/images/projects/apt_lenid.jpg';
                            }}
                          />

                          {isCurrentCover && (
                            <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                              <Check className="h-3 w-3" />
                              Cover
                            </span>
                          )}

                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            <div className="flex justify-end gap-1.5">
                              <a
                                href={imgUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-black transition-colors"
                                title="Open full image"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors cursor-pointer"
                                title="Delete photo"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {!isCurrentCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCoverImage(imgUrl)}
                                className="w-full rounded-lg bg-white/90 py-1.5 text-[10px] font-extrabold text-slate-900 hover:bg-white transition-colors text-center cursor-pointer"
                              >
                                Set as Cover
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Or paste an image URL to add to gallery..."
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddGalleryUrl();
                      }
                    }}
                    className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="flex h-10 items-center gap-1.5 rounded-xl bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add URL</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SUB-TAB 2: PLANS (Floor Plans & Blueprints Upload)
          ======================================================== */}
          {mediaSubTab === 'plans' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c]">
                      Floor Plans & Layout Maps
                    </h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                      {formData.floorPlans.length} Plans
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload 2D/3D floor blueprints and layout images. These render in the public Media &gt; Plans carousel.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Batch Upload Multiple Plan Images */}
                  <label
                    className={`flex h-10 cursor-pointer items-center gap-2 rounded-full px-5 text-xs font-bold text-white transition-all shadow-sm ${
                      isUploadingPlans
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-[#29247c] hover:bg-[#1f1b5c] active:scale-95 cursor-pointer'
                    }`}
                  >
                    {isUploadingPlans ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Uploading Plans...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload Multiple Plans</span>
                      </>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={isUploadingPlans}
                      onChange={handleMultiplePlansUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Add Blank Plan */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        floorPlans: [
                          ...formData.floorPlans,
                          {
                            title: `Plan ${formData.floorPlans.length + 1}`,
                            bhk: '2 BHK',
                            sqft: '850 Sq. Ft.',
                            imageUrl: '/images/projects/p2.webp',
                          },
                        ],
                      })
                    }
                    className="flex h-10 items-center gap-2 rounded-full bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Blank Plan</span>
                  </button>
                </div>
              </div>

              {formData.floorPlans.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                    <PlanIcon className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">No floor plans added yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Click &quot;Upload Multiple Plans&quot; above to select multiple layout/blueprint photos to upload at once.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.floorPlans.map((plan: any, idx: number) => {
                    const isUploadingThis = uploadingPlanIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row items-start md:items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 hover:border-slate-300 transition-all"
                      >
                        {/* Plan Thumbnail & Upload Trigger */}
                        <div className="relative h-24 w-32 shrink-0 rounded-xl border border-slate-200 bg-white overflow-hidden group shadow-2xs">
                          {plan.imageUrl ? (
                            <img
                              src={plan.imageUrl}
                              alt={plan.title}
                              className="h-full w-full object-cover"
                              onError={(e: any) => {
                                e.target.src = '/images/projects/p1.webp';
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                              <ImageIcon className="h-6 w-6" />
                            </div>
                          )}

                          <label
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold gap-1"
                            title="Upload/Replace plan image"
                          >
                            {isUploadingThis ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Upload className="h-3 w-3" />
                                <span>Replace</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingThis}
                              onChange={(e) => handleSinglePlanUpload(e, idx)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Plan Meta Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                              Plan Title*
                            </label>
                            <input
                              type="text"
                              value={plan.title}
                              onChange={(e) => {
                                const copy = [...formData.floorPlans];
                                copy[idx] = { ...copy[idx], title: e.target.value };
                                setFormData({ ...formData, floorPlans: copy });
                              }}
                              placeholder="e.g. 1 BHK Master Plan"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                              BHK / Layout Type
                            </label>
                            <input
                              type="text"
                              value={plan.bhk}
                              onChange={(e) => {
                                const copy = [...formData.floorPlans];
                                copy[idx] = { ...copy[idx], bhk: e.target.value };
                                setFormData({ ...formData, floorPlans: copy });
                              }}
                              placeholder="e.g. 2 BHK / Villa"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                              Area / Extents
                            </label>
                            <input
                              type="text"
                              value={plan.sqft}
                              onChange={(e) => {
                                const copy = [...formData.floorPlans];
                                copy[idx] = { ...copy[idx], sqft: e.target.value };
                                setFormData({ ...formData, floorPlans: copy });
                              }}
                              placeholder="e.g. 850 Sq. Ft. or 30x40"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20"
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          {plan.imageUrl && (
                            <a
                              href={plan.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-10 items-center gap-1 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                              title="Preview Blueprint"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Preview</span>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                floorPlans: formData.floorPlans.filter((_: any, i: number) => i !== idx),
                              })
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete this plan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              SUB-TAB 3: VIDEO (Walkthrough Video)
          ======================================================== */}
          {mediaSubTab === 'video' && (
            <div className="space-y-5">
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/40 p-5">
                <div className="flex items-center gap-2 text-slate-800">
                  <Video className="h-4 w-4 text-[#f12131]" />
                  <label className="text-xs font-extrabold uppercase tracking-wider">
                    Walkthrough Video Source
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  Enter a YouTube/Vimeo URL or directly upload an MP4 walkthrough video file.
                </p>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <input
                      type="text"
                      value={formData.walkthroughVideoUrl}
                      onChange={(e) => setFormData({ ...formData, walkthroughVideoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=... or MP4 URL"
                      className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20"
                    />

                    <label
                      className={`flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 text-xs font-bold text-white transition-colors ${
                        isUploadingVideo ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 cursor-pointer'
                      }`}
                    >
                      {isUploadingVideo ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Uploading Video...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload Video File (MP4)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg"
                        disabled={isUploadingVideo}
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {formData.walkthroughVideoUrl && (
                    <div className="mt-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Live Embedded Video Player Preview:
                      </p>
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black aspect-video max-w-2xl shadow-md">
                        {(() => {
                          const url = formData.walkthroughVideoUrl;
                          const ytMatch = url.match(
                            /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
                          );
                          if (ytMatch) {
                            return (
                              <iframe
                                title="Video Walkthrough Preview"
                                src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                                className="h-full w-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            );
                          }
                          const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
                          if (vimeoMatch) {
                            return (
                              <iframe
                                title="Video Walkthrough Preview"
                                src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
                                className="h-full w-full border-0"
                                allowFullScreen
                              />
                            );
                          }
                          return (
                            <video controls className="h-full w-full object-contain">
                              <source src={url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SUB-TAB 4: STREET VIEW (360 Google Street View / Virtual Tour)
          ======================================================== */}
          {mediaSubTab === 'streetview' && (
            <div className="space-y-4">
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/40 p-5">
                <div className="flex items-center gap-2 text-slate-800">
                  <Compass className="h-4 w-4 text-[#29247c]" />
                  <label className="text-xs font-extrabold uppercase tracking-wider">
                    360 Street View & Virtual Tour Embed
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  Paste the Google Maps Street View iframe URL or Matterport 360 embed link.
                </p>

                <input
                  type="text"
                  value={formData.streetViewUrl}
                  onChange={(e) => setFormData({ ...formData, streetViewUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=!4v... (Google Street View 360)"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20"
                />

                {formData.streetViewUrl && (
                  <div className="mt-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Live 360 Interactive Viewer Preview:
                    </p>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 aspect-video max-w-2xl shadow-md">
                      <iframe
                        title="360 Interactive Street View Preview"
                        src={formData.streetViewUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              SUB-TAB 5: BROCHURE (Official Project PDF)
          ======================================================== */}
          {mediaSubTab === 'brochure' && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Official Project Brochure (PDF)
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload a PDF brochure or enter a link. Powers the &quot;Download Official Brochure&quot; button on the project page.
                  </p>
                </div>

                {formData.brochureUrl ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 self-start sm:self-auto">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Brochure Attached
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200 self-start sm:self-auto">
                    No brochure attached
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.brochureUrl}
                    onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })}
                    placeholder="e.g. /brouchure/Project_Brochure.pdf or upload below"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#f12131]/20 transition-all"
                  />
                </div>

                <label
                  className={`flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 text-xs font-bold text-white transition-all shadow-sm ${
                    isUploadingBrochure
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-[#f12131] hover:bg-red-600 active:scale-95 cursor-pointer'
                  }`}
                >
                  {isUploadingBrochure ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload PDF</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="application/pdf"
                    disabled={isUploadingBrochure}
                    onChange={(e) => handleFileUpload(e, 'brochure')}
                    className="hidden"
                  />
                </label>
              </div>

              {formData.brochureUrl && (
                <div className="flex items-center justify-between rounded-xl bg-white border border-slate-200 p-3 text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 truncate block">
                        {formData.brochureUrl.split('/').pop() || 'Brochure PDF'}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate block">
                        {formData.brochureUrl}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={encodeURI(formData.brochureUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Preview</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, brochureUrl: '' })}
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="Remove brochure"
                    >
                      <X className="h-3 w-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: AMENITIES */}
      {activeTab === 'amenities' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c]">
              Project Features & Amenities
            </h3>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  amenities: [
                    ...formData.amenities,
                    { name: 'Club House', icon: 'Building', description: 'Community recreation center' },
                  ],
                })
              }
              className="flex h-9 items-center gap-2 rounded-full bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Amenity</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.amenities.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <input
                  type="text"
                  placeholder="Amenity Name (e.g. Swimming Pool)"
                  value={item.name}
                  onChange={(e) => {
                    const copy = [...formData.amenities];
                    copy[idx].name = e.target.value;
                    setFormData({ ...formData, amenities: copy });
                  }}
                  className="h-10 flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const copy = [...formData.amenities];
                    copy[idx].description = e.target.value;
                    setFormData({ ...formData, amenities: copy });
                  }}
                  className="h-10 flex-1 min-w-[220px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      amenities: formData.amenities.filter((_: any, i: number) => i !== idx),
                    })
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SPECIFICATIONS */}
      {activeTab === 'specs' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c]">
            Technical Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {['structure', 'flooring', 'doors', 'windows', 'electrical', 'plumbing', 'kitchen', 'others'].map((specKey) => (
              <div key={specKey}>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  {specKey}
                </label>
                <input
                  type="text"
                  value={formData.specifications[specKey] || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: {
                        ...formData.specifications,
                        [specKey]: e.target.value,
                      },
                    })
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: NEARBY LANDMARKS */}
      {activeTab === 'nearby' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c]">
              Nearby Landmarks & Distances
            </h3>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  nearbyLocations: [
                    ...formData.nearbyLocations,
                    { name: 'Hospital', distance: '2.0 km', description: 'Emergency medical center' },
                  ],
                })
              }
              className="flex h-9 items-center gap-2 rounded-full bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Landmark</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.nearbyLocations.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <input
                  type="text"
                  placeholder="Location Name"
                  value={item.name}
                  onChange={(e) => {
                    const copy = [...formData.nearbyLocations];
                    copy[idx].name = e.target.value;
                    setFormData({ ...formData, nearbyLocations: copy });
                  }}
                  className="h-10 flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Distance (e.g. 1.5 km)"
                  value={item.distance}
                  onChange={(e) => {
                    const copy = [...formData.nearbyLocations];
                    copy[idx].distance = e.target.value;
                    setFormData({ ...formData, nearbyLocations: copy });
                  }}
                  className="h-10 w-36 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      nearbyLocations: formData.nearbyLocations.filter((_: any, i: number) => i !== idx),
                    })
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: FAQS & MAPS */}
      {activeTab === 'faqs' && (
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Google Maps Embed URL
              </label>
              <input
                type="text"
                value={formData.mapEmbedUrl}
                onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
              />
            </div>

            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="h-5 w-5 rounded-md border-slate-300 text-[#f12131] focus:ring-[#f12131]"
                />
                <span className="text-xs font-bold text-slate-800">
                  Feature on Homepage Showcase (Sticky runway)
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#29247c]">
              Frequently Asked Questions
            </h3>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  faqs: [
                    ...formData.faqs,
                    { question: 'New Question?', answer: 'Answer details here...', order: formData.faqs.length + 1 },
                  ],
                })
              }
              className="flex h-9 items-center gap-2 rounded-full bg-slate-100 px-4 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.faqs.map((faq: any, idx: number) => (
              <div key={idx} className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => {
                      const copy = [...formData.faqs];
                      copy[idx].question = e.target.value;
                      setFormData({ ...formData, faqs: copy });
                    }}
                    className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        faqs: formData.faqs.filter((_: any, i: number) => i !== idx),
                      })
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => {
                    const copy = [...formData.faqs];
                    copy[idx].answer = e.target.value;
                    setFormData({ ...formData, faqs: copy });
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
