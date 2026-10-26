'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Inbox,
  FileText,
  Image as ImageIcon,
  Trophy,
  MessageSquareQuote,
  Video,
  Home,
  Menu,
  PanelBottom,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  PartyPopper,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const navSections = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
    ],
  },
  {
    title: 'REAL ESTATE CMS',
    items: [
      { label: 'All Projects', href: '/admin/projects', icon: Building2 },
      { label: 'Add New Project', href: '/admin/projects/new', icon: PlusCircle },
    ],
  },
  {
    title: 'CONTENT & MEDIA',
    items: [
      { label: 'Blogs & Articles', href: '/admin/blogs', icon: FileText },
      { label: 'Celebrations', href: '/admin/celebrations', icon: PartyPopper },
      // { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
      { label: 'Awards & Honors', href: '/admin/awards', icon: Trophy },
      { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
      { label: 'Videos', href: '/admin/videos', icon: Video },
    ],
  },
  {
    title: 'WEBSITE CMS',
    items: [
      // { label: 'Homepage CMS', href: '/admin/cms/home', icon: Home },
      { label: 'Header Menu', href: '/admin/cms/menu', icon: Menu },
      { label: 'Footer CMS', href: '/admin/cms/footer', icon: PanelBottom },
    ],
  },
  {
    title: 'GROWTH & SYSTEM',
    items: [
      // { label: 'Referrals', href: '/admin/referrals', icon: Users },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-[#0b1329] text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800/80 px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f12131] text-white shadow-md">
              <span className="text-xl font-black">K</span>
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">
                KPN Promoters
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#f12131]">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* External Public View */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Live Public Website"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {/* Navigation Links Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <p className="px-3 text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
                {section.title}
              </p>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200
                      ${
                        active
                          ? 'bg-[#f12131] text-white shadow-md shadow-red-900/30'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {active && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Footer Profile & Logout */}
        <div className="border-t border-slate-800/80 p-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-3 border border-slate-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#29247c] text-xs font-extrabold text-white border border-indigo-400/30">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-bold text-white leading-tight">
                  {user?.name || 'Administrator'}
                </p>
                <p className="truncate text-[10px] text-slate-400">
                  {user?.email || 'admin@kpnpromoters.in'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout from Admin Panel"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-[#f12131] transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
