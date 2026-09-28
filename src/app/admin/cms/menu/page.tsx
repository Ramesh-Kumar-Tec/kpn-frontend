'use client';

import React, { useEffect, useState } from 'react';
import {
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  RotateCcw,
  Compass,
  FolderTree,
} from 'lucide-react';
import { api } from '@/lib/api';

const DEFAULT_MENU_ITEMS = [
  { label: 'Home', href: '/', order: 1, isEnabled: true, children: [] },
  {
    label: 'Pages',
    href: '',
    order: 2,
    isEnabled: true,
    children: [
      { label: 'About Us', href: '/about-us', order: 1, isEnabled: true },
      { label: 'Our Awards', href: '/our-awards', order: 2, isEnabled: true },
    ],
  },
  {
    label: 'Associate',
    href: '',
    order: 3,
    isEnabled: true,
    children: [
      { label: 'Investors', href: '/investors', order: 1, isEnabled: true },
      { label: 'Our Venture', href: '/our-ventures', order: 2, isEnabled: true },
      { label: 'Joint Development', href: '/joint-development', order: 3, isEnabled: true },
      { label: 'Industrial', href: '/industrial', order: 4, isEnabled: true },
      { label: 'NRI Services', href: '/nri', order: 5, isEnabled: true },
      { label: 'Channel Partners', href: '/channel-partners', order: 6, isEnabled: true },
    ],
  },
  { label: 'Projects', href: '/projects', order: 4, isEnabled: true, children: [] },
  { label: 'Blogs', href: '/blogs', order: 5, isEnabled: true, children: [] },
  { label: 'Contact', href: '/contact-us', order: 6, isEnabled: true, children: [] },
];

export default function AdminMenuCMSPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await api.get('/cms/menu');
        if (res.success && res.data?.items && res.data.items.length > 0) {
          setItems(res.data.items);
        } else {
          // If empty, auto-populate with the standard website menu
          setItems(DEFAULT_MENU_ITEMS);
        }
      } catch (err) {
        console.warn('Failed to load menu:', err);
        setItems(DEFAULT_MENU_ITEMS);
      } finally {
        setIsLoading(false);
      }
    }

    loadMenu();
  }, []);

  const handleAddParentItem = () => {
    setItems([
      ...items,
      {
        label: 'New Link',
        href: '/',
        order: items.length + 1,
        isEnabled: true,
        children: [],
      },
    ]);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset navigation menu to default website structure?')) {
      setItems(DEFAULT_MENU_ITEMS);
    }
  };

  const handleAddChildItem = (parentIdx: number) => {
    const updated = [...items];
    if (!updated[parentIdx].children) updated[parentIdx].children = [];
    updated[parentIdx].children.push({
      label: 'Sub Link',
      href: '/new-page',
      order: updated[parentIdx].children.length + 1,
      isEnabled: true,
    });
    setItems(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await api.put('/cms/menu', { items });
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save menu');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
        Loading navigation menu structure...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#29247c]">
            Header Navigation Menu CMS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Configure desktop navigation bar dropdowns and mobile menu hierarchy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToDefault}
            title="Reset to default website menu"
            className="flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleAddParentItem}
            className="flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Menu Item</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#f12131] px-5 text-xs font-bold text-white shadow-xs hover:bg-[#d81928] transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Save Navigation Menu'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Navigation menu saved successfully!</span>
        </div>
      )}

      {/* If No Items */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
            <Compass className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No Navigation Menu Items
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Your navigation tree is currently empty. Click below to load the default KPN website navigation structure with full dropdowns.
          </p>
          <button
            type="button"
            onClick={() => setItems(DEFAULT_MENU_ITEMS)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#29247c] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#1f1a66] transition-colors"
          >
            <FolderTree className="h-4 w-4" />
            <span>Load Default Website Menu</span>
          </button>
        </div>
      ) : (
        /* Menu Tree List */
        <div className="space-y-4">
          {items.map((item, parentIdx) => (
            <div
              key={parentIdx}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3"
            >
              {/* Parent Row */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-600">
                    {parentIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[parentIdx].label = e.target.value;
                      setItems(copy);
                    }}
                    placeholder="Menu Label"
                    className="h-9 w-44 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
                  />
                </div>

                <input
                  type="text"
                  value={item.href || ''}
                  onChange={(e) => {
                    const copy = [...items];
                    copy[parentIdx].href = e.target.value;
                    setItems(copy);
                  }}
                  placeholder="Link URL (e.g. /projects - leave empty if dropdown)"
                  className="h-9 flex-1 min-w-[220px] rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
                />

                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const copy = [...items];
                      copy[parentIdx].isEnabled = !copy[parentIdx].isEnabled;
                      setItems(copy);
                    }}
                    className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-colors ${
                      item.isEnabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {item.isEnabled ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                    <span>{item.isEnabled ? 'Visible' : 'Hidden'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddChildItem(parentIdx)}
                    className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-[#29247c] hover:bg-slate-50 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Submenu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setItems(items.filter((_, i) => i !== parentIdx))}
                    title="Delete Menu Item"
                    className="flex h-9 w-9 items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Child Items Dropdown List */}
              {item.children && item.children.length > 0 && (
                <div className="pl-6 pt-2 pb-1 space-y-2 border-l-2 border-slate-200 ml-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Dropdown Submenu Links ({item.children.length})
                  </div>
                  {item.children.map((child: any, childIdx: number) => (
                    <div key={childIdx} className="flex flex-wrap items-center gap-2.5">
                      <span className="text-slate-400 text-xs font-bold">↳</span>
                      <input
                        type="text"
                        value={child.label}
                        onChange={(e) => {
                          const copy = [...items];
                          copy[parentIdx].children[childIdx].label = e.target.value;
                          setItems(copy);
                        }}
                        placeholder="Submenu Label"
                        className="h-8 w-40 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
                      />

                      <input
                        type="text"
                        value={child.href}
                        onChange={(e) => {
                          const copy = [...items];
                          copy[parentIdx].children[childIdx].href = e.target.value;
                          setItems(copy);
                        }}
                        placeholder="Submenu URL (e.g. /about-us)"
                        className="h-8 flex-1 min-w-[180px] rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f12131]"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...items];
                          copy[parentIdx].children = copy[parentIdx].children.filter(
                            (_: any, ci: number) => ci !== childIdx
                          );
                          setItems(copy);
                        }}
                        title="Remove Submenu Link"
                        className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
