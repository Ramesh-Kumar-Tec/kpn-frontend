'use client';

import * as React from 'react';
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
  Menu as MenuIcon,
  PanelBottom,
  Users,
  Settings,
  LogOut,
  PlusCircle,
  PartyPopper,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/lib/authContext';

const navigationItems = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
      { title: 'Enquiries', url: '/admin/enquiries', icon: Inbox },
    ],
  },
  {
    title: 'Real Estate CMS',
    items: [
      { title: 'Projects', url: '/admin/projects', icon: Building2 },
      { title: 'New Project', url: '/admin/projects/new', icon: PlusCircle },
    ],
  },
  {
    title: 'Content & Media',
    items: [
      { title: 'Blogs', url: '/admin/blogs', icon: FileText },
      { title: 'Celebrations', url: '/admin/celebrations', icon: PartyPopper },
      // { title: 'Media Library', url: '/admin/media', icon: ImageIcon },
      { title: 'Awards', url: '/admin/awards', icon: Trophy },
      { title: 'Testimonials', url: '/admin/testimonials', icon: MessageSquareQuote },
      // { title: 'Videos', url: '/admin/videos', icon: Video },
    ],
  },
  {
    title: 'Website CMS',
    items: [
      // { title: 'Homepage', url: '/admin/cms/home', icon: Home },
      { title: 'Menu Navigation', url: '/admin/cms/menu', icon: MenuIcon },
      { title: 'Footer', url: '/admin/cms/footer', icon: PanelBottom },
    ],
  },
  {
    title: 'System',
    items: [
      // { title: 'Referrals', url: '/admin/referrals', icon: Users },
      { title: 'Settings', url: '/admin/settings', icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isActive = (url: string) => {
    if (url === '/admin') return pathname === '/admin';
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <Sidebar className="font-sans border-r border-slate-200/80 bg-white shadow-xs">
      {/* Header Logo */}
      <SidebarHeader className="border-b border-slate-100 pb-3 pt-4 px-4">
        <Link
          href="/admin"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-1 py-1 rounded-xl hover:bg-slate-50 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          {isCollapsed ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#29247c] to-[#1a174d] text-white shadow-xs">
              <span className="text-base font-black font-heading">K</span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <img
                src="/images/newlogoo.jpeg"
                alt="KPN Promoters"
                className="h-10 w-auto object-contain"
              />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#f12131] bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-full font-heading">
                CMS
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-2 py-3">
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title} className="py-1.5">
            <SidebarGroupLabel className="font-heading font-black text-[10px] uppercase tracking-widest text-slate-400 px-3">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(item.url);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                      >
                        <Link
                          href={item.url}
                          onClick={handleLinkClick}
                          className="flex items-center gap-2.5"
                        >
                          <Icon className={`h-4 w-4 shrink-0 transition-colors ${active ? 'text-[#f12131]' : 'text-slate-400 group-hover:text-[#29247c]'}`} />
                          {!isCollapsed && (
                            <span className={`truncate text-xs ${active ? 'font-black text-[#29247c] font-heading' : 'font-semibold text-slate-600'}`}>
                              {item.title}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter className="border-t border-slate-100 p-3">
        <div
          className={`flex items-center rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 ${
            isCollapsed ? 'justify-center p-1.5' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#29247c] text-xs font-black text-white shadow-xs font-heading">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="truncate text-xs font-extrabold text-[#29247c] font-heading leading-tight">
                  {user?.name || 'KPN Admin'}
                </p>
                <p className="truncate text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {user?.role || 'Superadmin'}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => {
                handleLinkClick();
                logout();
              }}
              title="Logout"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-[#f12131] transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
