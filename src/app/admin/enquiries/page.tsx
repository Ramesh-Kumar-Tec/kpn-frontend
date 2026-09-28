'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Inbox,
  Search,
  Trash2,
  CheckCircle2,
  Send,
  X,
  Eye,
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

export interface FormCategoryMeta {
  key: string;
  label: string;
  badgeColor: string;
  icon: string;
}

export function getEnquiryFormCategory(e: any): FormCategoryMeta {
  const source = (e.source || '').toLowerCase();
  const project = (e.projectName || '').toLowerCase();
  const message = (e.message || '').toLowerCase();

  // 1. Joint Development Form
  if (
    source.includes('joint development') ||
    project.includes('joint development') ||
    message.includes('joint development')
  ) {
    return {
      key: 'Joint Development',
      label: 'Joint Development Form',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200/90',
      icon: '🤝',
    };
  }

  // 2. Investor Relations
  if (
    project.includes('investor') ||
    source.includes('investor') ||
    message.includes('investor')
  ) {
    return {
      key: 'Investors',
      label: 'Investor Relations',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/90',
      icon: '📈',
    };
  }

  // 3. Our Venture
  if (
    project.includes('venture') ||
    source.includes('venture') ||
    message.includes('venture')
  ) {
    return {
      key: 'Our Venture',
      label: 'Our Venture',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/90',
      icon: '🚀',
    };
  }

  // 4. Industrial & Warehousing
  if (
    project.includes('industrial') ||
    source.includes('industrial') ||
    message.includes('industrial') ||
    project.includes('warehouse')
  ) {
    return {
      key: 'Industrial',
      label: 'Industrial & Warehousing',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200/90',
      icon: '🏭',
    };
  }

  // 5. NRI Services
  if (
    project.includes('nri') ||
    source.includes('nri') ||
    message.includes('nri')
  ) {
    return {
      key: 'NRI Services',
      label: 'NRI Services',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/90',
      icon: '🌐',
    };
  }

  // 6. Channel Partners
  if (
    project.includes('channel partner') ||
    source.includes('channel partner') ||
    message.includes('channel partner')
  ) {
    return {
      key: 'Channel Partners',
      label: 'Channel Partner',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/90',
      icon: '💼',
    };
  }

  // 7. Unit Booking Navigator
  if (source.includes('unit booking') || Boolean(e.unitNumber)) {
    return {
      key: 'Unit Booking',
      label: 'Unit Booking Navigator',
      badgeColor: 'bg-indigo-50 text-[#29247c] border-indigo-200/90',
      icon: '🏢',
    };
  }

  // 8. Brochure Download Request
  if (source.includes('brochure')) {
    return {
      key: 'Brochure Download',
      label: 'Brochure Request',
      badgeColor: 'bg-pink-50 text-pink-700 border-pink-200/90',
      icon: '📄',
    };
  }

  // 9. Scroll Popup Quote
  if (source.includes('scroll') || source.includes('quote')) {
    return {
      key: 'Scroll Quote',
      label: 'Scroll Quote Popup',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200/90',
      icon: '💬',
    };
  }

  // 10. Default: Contact Page / General
  return {
    key: 'Contact Page',
    label: e.source || 'Contact Page / General',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: '📞',
  };
}

const FORM_FILTER_OPTIONS = [
  { value: 'All', label: 'All Forms & Sources', icon: '📋' },
  { value: 'Joint Development', label: 'Joint Development Form', icon: '🤝' },
  { value: 'Investors', label: 'Investor Relations', icon: '📈' },
  { value: 'Our Venture', label: 'Our Venture', icon: '🚀' },
  { value: 'Industrial', label: 'Industrial & Warehousing', icon: '🏭' },
  { value: 'NRI Services', label: 'NRI Services', icon: '🌐' },
  { value: 'Channel Partners', label: 'Channel Partners', icon: '💼' },
  { value: 'Unit Booking', label: 'Unit Booking Navigator', icon: '🏢' },
  { value: 'Brochure Download', label: 'Brochure Requests', icon: '📄' },
  { value: 'Scroll Quote', label: 'Scroll Quote Popups', icon: '💬' },
  { value: 'Contact Page', label: 'Contact Us / General', icon: '📞' },
];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [unitFilter, setUnitFilter] = useState('All');
  const [formFilter, setFormFilter] = useState('All');
  const [contestedOnly, setContestedOnly] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAllocating, setIsAllocating] = useState(false);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/enquiries');
      if (res.success) {
        setEnquiries(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to load enquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Lock background scrolling when Customer Details modal is open
  useEffect(() => {
    if (!selectedEnquiry) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEnquiry(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEnquiry]);

  // Compute unit enquiry counts to detect contested units (2+ enquiries for same unit)
  const unitCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    enquiries.forEach((e) => {
      const key = e.unitNumber?.trim();
      if (key) {
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [enquiries]);

  const uniqueUnits = useMemo(() => {
    const set = new Set<string>();
    enquiries.forEach((e) => {
      const key = e.unitNumber?.trim();
      if (key) set.add(key);
    });
    return Array.from(set).sort();
  }, [enquiries]);

  const contestedUnitsCount = useMemo(() => {
    return Object.values(unitCounts).filter((c) => c > 1).length;
  }, [unitCounts]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await api.patch(`/enquiries/${id}/status`, { status: newStatus });
      if (res.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !noteText.trim()) return;

    setIsAddingNote(true);
    try {
      const res = await api.post(`/enquiries/${selectedEnquiry._id}/notes`, { text: noteText });
      if (res.success) {
        setSelectedEnquiry((prev: any) => ({ ...prev, notes: res.data }));
        setEnquiries((prev) =>
          prev.map((item) =>
            item._id === selectedEnquiry._id ? { ...item, notes: res.data } : item
          )
        );
        setNoteText('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/enquiries/${deleteTarget.id}`);
      if (res.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== deleteTarget.id));
        if (selectedEnquiry?._id === deleteTarget.id) setSelectedEnquiry(null);
        setDeleteTarget(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  // Direct Unit Allocation from Enquiries CRM
  const handleAllocateUnit = async (enquiry: any, action: 'booked' | 'sold') => {
    if (!enquiry || !enquiry.unitNumber) return;
    setIsAllocating(true);
    try {
      const res = await api.post('/enquiries/allocate-unit', {
        projectId: enquiry.projectId || enquiry.project,
        unitNumber: enquiry.unitNumber,
        blockId: enquiry.block,
        floorNumber: enquiry.floor,
        enquiryId: enquiry._id || enquiry.id,
        action,
      });

      if (res.success) {
        await fetchEnquiries();
        setSelectedEnquiry((prev: any) =>
          prev && (prev._id === enquiry._id || prev.id === enquiry.id)
            ? { ...prev, status: action === 'sold' ? 'Sold' : 'Booked' }
            : prev
        );
      } else {
        alert(res.message || 'Failed to allocate unit');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to allocate unit');
    } finally {
      setIsAllocating(false);
    }
  };

  const formCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: enquiries.length,
      'Joint Development': 0,
      'Investors': 0,
      'Our Venture': 0,
      'Industrial': 0,
      'NRI Services': 0,
      'Channel Partners': 0,
      'Unit Booking': 0,
      'Brochure Download': 0,
      'Scroll Quote': 0,
      'Contact Page': 0,
    };
    enquiries.forEach((e) => {
      const cat = getEnquiryFormCategory(e);
      counts[cat.key] = (counts[cat.key] || 0) + 1;
    });
    return counts;
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      if (statusFilter !== 'All' && e.status !== statusFilter) return false;
      if (unitFilter !== 'All' && e.unitNumber !== unitFilter) return false;
      if (formFilter !== 'All') {
        const cat = getEnquiryFormCategory(e);
        if (cat.key !== formFilter) return false;
      }
      if (contestedOnly) {
        if (!e.unitNumber || (unitCounts[e.unitNumber.trim()] || 0) < 2) {
          return false;
        }
      }
      if (search) {
        const query = search.toLowerCase();
        return (
          e.name?.toLowerCase().includes(query) ||
          e.phone?.includes(query) ||
          (e.email && e.email.toLowerCase().includes(query)) ||
          e.projectName?.toLowerCase().includes(query) ||
          e.source?.toLowerCase().includes(query) ||
          e.message?.toLowerCase().includes(query) ||
          (e.unitNumber && e.unitNumber.toLowerCase().includes(query)) ||
          (e.block && e.block.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [enquiries, statusFilter, unitFilter, formFilter, contestedOnly, search, unitCounts]);

  const stats = useMemo(() => {
    return {
      total: enquiries.length,
      new: enquiries.filter((e) => e.status === 'New').length,
      contacted: enquiries.filter((e) => e.status === 'Contacted').length,
      siteVisit: enquiries.filter((e) => e.status === 'Site Visit').length,
      booked: enquiries.filter((e) => e.status === 'Booked').length,
    };
  }, [enquiries]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Site Visit':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Interested':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Booked':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
          Customer Enquiry & Lead Management
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Track property inquiries, follow up with home buyers, and schedule site visits.
        </p>
      </div>

      {/* KPI Stats Summary Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Enquiries</p>
          <p className="text-2xl font-black text-[#29247c] mt-1">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">New Leads</p>
          <p className="text-2xl font-black text-red-700 mt-1">{stats.new}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">Contacted</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{stats.contacted}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Site Visits</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{stats.siteVisit}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">Booked</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{stats.booked}</p>
        </div>
        <div
          onClick={() => setContestedOnly(!contestedOnly)}
          className={`rounded-2xl border p-4 shadow-xs cursor-pointer transition-all ${
            contestedOnly
              ? 'border-orange-500 bg-orange-100 ring-2 ring-orange-400 shadow-md'
              : 'border-orange-200 bg-orange-50/60 hover:bg-orange-100/70'
          }`}
          title="Click to filter contested units with 2+ enquiries"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700">Contested Units</p>
            <span className="text-xs">🔥</span>
          </div>
          <p className="text-2xl font-black text-orange-700 mt-1">{contestedUnitsCount}</p>
        </div>
      </div>

      {/* Filters Bar with Search and 2x2 Filter Grid */}
      <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3.5">
          {/* Left: Search Bar */}
          <div className="relative flex-1 flex flex-col justify-center">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads by customer name, phone, project, unit, message..."
                className="h-10 sm:h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-10 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-[#29247c]/30 focus:ring-4 focus:ring-[#29247c]/5"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Active Filters status row */}
            {(statusFilter !== 'All' || unitFilter !== 'All' || formFilter !== 'All' || contestedOnly || search) && (
              <div className="flex items-center gap-2 mt-2 px-1">
                <span className="text-[11px] font-bold text-slate-500">
                  Showing {filteredEnquiries.length} of {enquiries.length} leads
                </span>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('All');
                    setUnitFilter('All');
                    setFormFilter('All');
                    setContestedOnly(false);
                    setSearch('');
                  }}
                  className="text-[11px] font-black text-red-600 hover:underline cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Right: 2x2 Filter Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 shrink-0 w-full lg:w-[480px]">
            {/* [1, 1] Form / Origin Filter */}
            <Select value={formFilter} onValueChange={setFormFilter}>
              <SelectTrigger className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none shadow-none cursor-pointer hover:border-slate-300">
                <SelectValue placeholder="All Forms & Sources">
                  {(() => {
                    const currentOpt = FORM_FILTER_OPTIONS.find((o) => o.value === formFilter);
                    return (
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{currentOpt?.icon || '📋'}</span>
                        <span className="truncate">{currentOpt?.label || 'All Forms & Sources'}</span>
                        {formFilter !== 'All' && (
                          <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] font-extrabold text-slate-600">
                            {formCounts[formFilter] || 0}
                          </span>
                        )}
                      </span>
                    );
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl max-h-80 w-[240px]">
                {FORM_FILTER_OPTIONS.map((opt) => {
                  const count = formCounts[opt.value] || 0;
                  return (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs font-bold py-2 px-2.5 rounded-xl cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full gap-2">
                        <span className="flex items-center gap-2 truncate">
                          <span>{opt.icon}</span>
                          <span className="truncate">{opt.label}</span>
                        </span>
                        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600 shrink-0">
                          {count}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* [1, 2] Lead Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none shadow-none cursor-pointer hover:border-slate-300">
                <SelectValue placeholder="All Lead Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
                <SelectItem value="All" className="text-xs font-bold">All Lead Statuses</SelectItem>
                <SelectItem value="New" className="text-xs font-bold">New</SelectItem>
                <SelectItem value="Contacted" className="text-xs font-bold">Contacted</SelectItem>
                <SelectItem value="Site Visit" className="text-xs font-bold">Site Visit</SelectItem>
                <SelectItem value="Interested" className="text-xs font-bold">Interested</SelectItem>
                <SelectItem value="Negotiation" className="text-xs font-bold">Negotiation</SelectItem>
                <SelectItem value="Booked" className="text-xs font-bold">Booked</SelectItem>
                <SelectItem value="Closed" className="text-xs font-bold">Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* [2, 1] Unit Filter */}
            <Select value={unitFilter} onValueChange={setUnitFilter}>
              <SelectTrigger className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none shadow-none cursor-pointer hover:border-slate-300">
                <SelectValue placeholder="All Units" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl max-h-64">
                <SelectItem value="All" className="text-xs font-bold">All Units</SelectItem>
                {uniqueUnits.map((u) => (
                  <SelectItem key={u} value={u} className="text-xs font-semibold">
                    Unit {u} {unitCounts[u] > 1 ? `(🔥 ${unitCounts[u]} leads)` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* [2, 2] Quick Contested Toggle Button */}
            <button
              type="button"
              onClick={() => setContestedOnly(!contestedOnly)}
              className={`flex items-center justify-center gap-1.5 h-10 w-full px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                contestedOnly
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                  : 'border border-orange-200 bg-orange-50/70 text-orange-800 hover:bg-orange-100'
              }`}
            >
              <span>🔥</span>
              <span className="truncate">Contested Units ({contestedUnitsCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-width Enquiries Table */}
      <div className="w-full">
        <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-xs">
          {isLoading ? (
            <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
              Loading inquiries from database...
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="p-16 text-center">
              <Inbox className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p className="text-base font-extrabold text-slate-700">No enquiries found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-4 py-4">Contact</th>
                    <th className="px-4 py-4">Project / Form Origin</th>
                    <th className="px-4 py-4">Unit / Property</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredEnquiries.map((enquiry) => {
                    const unitKey = enquiry.unitNumber?.trim();
                    const enquiryCountForUnit = unitKey ? unitCounts[unitKey] || 0 : 0;
                    const isContested = enquiryCountForUnit > 1;
                    const formCat = getEnquiryFormCategory(enquiry);

                    return (
                      <tr
                        key={enquiry._id}
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="cursor-pointer transition-colors hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-4">
                          <span className="font-black text-[#29247c] block text-sm">
                            {enquiry.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(enquiry.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="font-bold text-slate-900 block">📞 {enquiry.phone}</span>
                          {enquiry.email && (
                            <span className="text-[11px] text-slate-500">✉️ {enquiry.email}</span>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black border ${formCat.badgeColor}`}>
                              <span>{formCat.icon}</span>
                              <span>{formCat.label}</span>
                            </span>
                            {enquiry.projectName && enquiry.projectName !== formCat.label && (
                              <span className="text-xs font-bold text-slate-800">
                                {enquiry.projectName}
                              </span>
                            )}
                            {enquiry.source && enquiry.source !== formCat.label && enquiry.source !== enquiry.projectName && (
                              <span className="text-[10px] text-slate-400 font-medium">
                                via {enquiry.source}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Unit / Property Column */}
                        <td className="px-4 py-4">
                          {enquiry.unitNumber ? (
                            <div className="flex flex-col gap-1 items-start">
                              <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 text-[#29247c] px-2.5 py-0.5 text-xs font-black border border-indigo-200/60">
                                Unit {enquiry.unitNumber}
                              </span>
                              {(enquiry.block || enquiry.floor) && (
                                <span className="text-[10px] text-slate-400 font-semibold">
                                  {enquiry.block} {enquiry.floor ? `• ${enquiry.floor}` : ''}
                                </span>
                              )}
                              {isContested && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUnitFilter(unitKey);
                                  }}
                                  className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-800 px-2 py-0.5 text-[9px] font-black hover:bg-orange-200 transition-colors"
                                  title="Click to view all leads for this unit"
                                >
                                  <span>🔥</span>
                                  <span>{enquiryCountForUnit} Leads</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic font-medium">General</span>
                          )}
                        </td>

                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={enquiry.status}
                            onValueChange={(val) => handleStatusChange(enquiry._id, val)}
                          >
                            <SelectTrigger className={`h-7 rounded-full border px-2.5 text-[10px] font-extrabold outline-none shadow-none cursor-pointer ${getStatusBadge(
                              enquiry.status
                            )}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-xl">
                              <SelectItem value="New" className="text-xs font-bold">New</SelectItem>
                              <SelectItem value="Contacted" className="text-xs font-bold">Contacted</SelectItem>
                              <SelectItem value="Site Visit" className="text-xs font-bold">Site Visit</SelectItem>
                              <SelectItem value="Interested" className="text-xs font-bold">Interested</SelectItem>
                              <SelectItem value="Negotiation" className="text-xs font-bold">Negotiation</SelectItem>
                              <SelectItem value="Booked" className="text-xs font-bold">Booked</SelectItem>
                              <SelectItem value="Closed" className="text-xs font-bold">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>

                        <td className="px-5 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedEnquiry(enquiry)}
                            title="View enquiry details modal"
                            className="h-8 px-3 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-[#29247c] transition-colors inline-flex items-center gap-1.5 mr-1.5 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ id: enquiry._id, title: `${enquiry.name} (${enquiry.projectName || 'General Inquiry'})` })}
                            title="Delete enquiry"
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors inline-flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Customer Enquiry Details Modal ("Module") */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            {(() => {
              const modalCat = getEnquiryFormCategory(selectedEnquiry);
              return (
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-black tracking-tight text-[#29247c]">
                        {selectedEnquiry.name}
                      </h2>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold ${getStatusBadge(
                          selectedEnquiry.status
                        )}`}
                      >
                        {selectedEnquiry.status}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black border ${modalCat.badgeColor}`}
                      >
                        <span>{modalCat.icon}</span>
                        <span>{modalCat.label}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Lead captured on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedEnquiry.status}
                      onValueChange={(val) => handleStatusChange(selectedEnquiry._id, val)}
                    >
                      <SelectTrigger
                        className={`h-8 rounded-full border px-3 text-[11px] font-extrabold outline-none shadow-none cursor-pointer ${getStatusBadge(
                          selectedEnquiry.status
                        )}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-xl">
                        <SelectItem value="New" className="text-xs font-bold">New</SelectItem>
                        <SelectItem value="Contacted" className="text-xs font-bold">Contacted</SelectItem>
                        <SelectItem value="Site Visit" className="text-xs font-bold">Site Visit</SelectItem>
                        <SelectItem value="Interested" className="text-xs font-bold">Interested</SelectItem>
                        <SelectItem value="Negotiation" className="text-xs font-bold">Negotiation</SelectItem>
                        <SelectItem value="Booked" className="text-xs font-bold">Booked</SelectItem>
                        <SelectItem value="Closed" className="text-xs font-bold">Closed</SelectItem>
                      </SelectContent>
                    </Select>

                    <button
                      type="button"
                      onClick={() => setSelectedEnquiry(null)}
                      className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
                      title="Close modal (Esc)"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Unit Details Box if enquired for a specific unit */}
            {selectedEnquiry.unitNumber && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
                    Enquired Unit
                  </span>
                  {(unitCounts[selectedEnquiry.unitNumber?.trim()] || 0) > 1 && (
                    <span className="rounded-full bg-orange-100 text-orange-800 px-2.5 py-0.5 text-[10px] font-black flex items-center gap-1 border border-orange-200">
                      <span>🔥</span> Contested Unit ({unitCounts[selectedEnquiry.unitNumber?.trim()]} Leads)
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-slate-900">
                    Unit {selectedEnquiry.unitNumber}
                  </span>
                  {selectedEnquiry.unitType && (
                    <span className="text-xs font-bold text-slate-600">
                      ({selectedEnquiry.unitType})
                    </span>
                  )}
                </div>
                {(selectedEnquiry.block || selectedEnquiry.floor) && (
                  <p className="text-xs text-slate-600 font-semibold">
                    {selectedEnquiry.block} {selectedEnquiry.floor ? `• ${selectedEnquiry.floor}` : ''}
                  </p>
                )}

                {/* Direct 1-Click Allocation to this Lead */}
                <div className="pt-2.5 border-t border-indigo-200/60 flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    disabled={isAllocating || selectedEnquiry.status === 'Booked' || selectedEnquiry.status === 'Sold'}
                    onClick={() => handleAllocateUnit(selectedEnquiry, 'booked')}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    title={`Book Unit ${selectedEnquiry.unitNumber} to ${selectedEnquiry.name}`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Book to {selectedEnquiry.name.split(' ')[0]}</span>
                  </button>
                  <button
                    type="button"
                    disabled={isAllocating || selectedEnquiry.status === 'Sold'}
                    onClick={() => handleAllocateUnit(selectedEnquiry, 'sold')}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    title={`Mark Sold to ${selectedEnquiry.name}`}
                  >
                    <span>Sell to {selectedEnquiry.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Competing Leads for this Unit */}
            {selectedEnquiry.unitNumber && (unitCounts[selectedEnquiry.unitNumber?.trim()] || 0) > 1 && (
              <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-orange-900 flex items-center gap-1">
                    <span>🔥</span> Competing Buyers for Unit {selectedEnquiry.unitNumber}
                  </span>
                  <span className="rounded-full bg-orange-200 px-2 py-0.5 text-[10px] font-black text-orange-900">
                    {(unitCounts[selectedEnquiry.unitNumber?.trim()] || 0) - 1} Other Leads
                  </span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {enquiries
                    .filter(
                      (e) =>
                        e._id !== selectedEnquiry._id &&
                        e.unitNumber?.trim() === selectedEnquiry.unitNumber?.trim()
                    )
                    .map((comp) => (
                      <div
                        key={comp._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-white p-3 text-xs border border-orange-200/60 shadow-xs"
                      >
                        <div
                          onClick={() => setSelectedEnquiry(comp)}
                          className="cursor-pointer flex-1"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{comp.name}</span>
                            <span
                              className={`rounded-full px-2 py-0.2 text-[9px] font-black uppercase ${
                                comp.status === 'Booked'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : comp.status === 'Sold'
                                  ? 'bg-rose-100 text-rose-800'
                                  : comp.status === 'Waitlisted'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {comp.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            📞 {comp.phone} • {new Date(comp.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Direct action buttons for competing leads */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            disabled={isAllocating || comp.status === 'Booked' || comp.status === 'Sold'}
                            onClick={() => handleAllocateUnit(comp, 'booked')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black transition cursor-pointer shadow-2xs disabled:opacity-40"
                            title={`Book Unit to ${comp.name}`}
                          >
                            Book
                          </button>
                          <button
                            type="button"
                            disabled={isAllocating || comp.status === 'Sold'}
                            onClick={() => handleAllocateUnit(comp, 'sold')}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black transition cursor-pointer shadow-2xs disabled:opacity-40"
                            title={`Sell Unit to ${comp.name}`}
                          >
                            Sell
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Contact Details */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                <div className="rounded-xl bg-white p-3 border border-slate-200/60 shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Customer Phone
                  </span>
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="text-sm font-black text-slate-900 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                  >
                    <span>📞</span>
                    <span>{selectedEnquiry.phone}</span>
                  </a>
                </div>

                <div className="rounded-xl bg-white p-3 border border-slate-200/60 shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Email Address
                  </span>
                  {selectedEnquiry.email ? (
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1.5 truncate transition-colors"
                    >
                      <span>✉️</span>
                      <span className="truncate">{selectedEnquiry.email}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Not provided</span>
                  )}
                </div>

                <div className="rounded-xl bg-white p-3 border border-slate-200/60 shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Project / Program
                  </span>
                  <span className="text-xs font-extrabold text-[#f12131] flex items-center gap-1.5">
                    <span>🏢</span>
                    <span>{selectedEnquiry.projectName || 'General Inquiry'}</span>
                  </span>
                </div>

                <div className="rounded-xl bg-white p-3 border border-slate-200/60 shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Lead Source / Form
                  </span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>📍</span>
                    <span>{selectedEnquiry.source || 'Website Contact Section'}</span>
                  </span>
                </div>
              </div>

              {selectedEnquiry.message && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                    Message / Requirement:
                  </span>
                  <p className="font-medium text-xs leading-relaxed text-slate-800 bg-white p-3.5 rounded-xl border border-slate-200/70 whitespace-pre-line shadow-2xs">
                    &quot;{selectedEnquiry.message}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Staff Notes History */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Staff Follow-Up Notes
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(!selectedEnquiry.notes || selectedEnquiry.notes.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                ) : (
                  selectedEnquiry.notes.map((note: any, idx: number) => (
                    <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
                      <p className="font-semibold text-slate-800">{note.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        By {note.author} • {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a follow-up note..."
                  className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-[#f12131]/20"
                />
                <button
                  type="submit"
                  disabled={isAddingNote || !noteText.trim()}
                  className="h-10 px-4 rounded-xl bg-[#f12131] text-xs font-bold text-white hover:bg-[#d81928] disabled:opacity-50 transition cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Customer Enquiry?"
        itemName={deleteTarget?.title}
        message="Are you sure you want to delete this enquiry lead record? This action cannot be undone."
        confirmText="Delete Enquiry"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
