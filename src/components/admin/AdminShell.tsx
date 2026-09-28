'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { AppSidebar } from './AppSidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { useBreadcrumbs, BreadcrumbCrumb } from '@/lib/breadcrumbContext';
import { api } from '@/lib/api';

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const { isLoading, isAuthenticated, user } = useAuth();
  const { customCrumbs, entityTitles, setEntityTitle } = useBreadcrumbs();

  // Auto-resolve dynamic entity titles (e.g. project name or blog title) in background
  useEffect(() => {
    // Match /admin/projects/:id/...
    const projMatch = pathname?.match(/\/admin\/projects\/([a-zA-Z0-9_-]+)/);
    if (projMatch && projMatch[1] && projMatch[1] !== 'new') {
      const projId = projMatch[1];
      if (!entityTitles[projId]) {
        api
          .get(`/projects/${projId}`)
          .then((res) => {
            if (res.success && res.data?.name) {
              setEntityTitle(projId, res.data.name);
            }
          })
          .catch(() => {});
      }
    }

    // Match /admin/blogs/:id/...
    const blogMatch = pathname?.match(/\/admin\/blogs\/([a-zA-Z0-9_-]+)/);
    if (blogMatch && blogMatch[1] && blogMatch[1] !== 'new') {
      const blogId = blogMatch[1];
      if (!entityTitles[blogId]) {
        api
          .get(`/blogs/${blogId}`)
          .then((res) => {
            if (res.success && res.data?.title) {
              setEntityTitle(blogId, res.data.title);
            }
          })
          .catch(() => {});
      }
    }
  }, [pathname, entityTitles, setEntityTitle]);

  // Login page has its own standalone layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading state

  if (!isAuthenticated) {
    return null;
  }

  // Construct dynamic breadcrumb hierarchy
  const getCrumbs = (): BreadcrumbCrumb[] => {
    if (customCrumbs && customCrumbs.length > 0) {
      return [{ label: 'Home', href: '/admin' }, ...customCrumbs];
    }

    const path = pathname || '';

    // Route: /admin (Dashboard)
    if (path === '/admin' || path === '/admin/') {
      return [{ label: 'Home' }];
    }

    // Route: /admin/projects/...
    if (path.startsWith('/admin/projects')) {
      const parts = path.split('/').filter(Boolean); // ['admin', 'projects', ...]
      if (parts.length === 2) {
        return [{ label: 'Home', href: '/admin' }, { label: 'Projects' }];
      }
      if (parts[2] === 'new') {
        return [
          { label: 'Home', href: '/admin' },
          { label: 'Projects', href: '/admin/projects' },
          { label: 'New Project' },
        ];
      }
      const projId = parts[2];
      const projName = entityTitles[projId] || 'Project';

      if (parts.length >= 4 && parts[3] === 'units') {
        return [
          { label: 'Home', href: '/admin' },
          { label: 'Projects', href: '/admin/projects' },
          { label: projName, href: `/admin/projects/${projId}/edit` },
          { label: 'Units & Inventory' },
        ];
      }

      // /admin/projects/:id/edit or /admin/projects/:id
      return [
        { label: 'Home', href: '/admin' },
        { label: 'Projects', href: '/admin/projects' },
        { label: projName },
      ];
    }

    // Route: /admin/blogs/...
    if (path.startsWith('/admin/blogs')) {
      const parts = path.split('/').filter(Boolean);
      if (parts.length === 2) {
        return [{ label: 'Home', href: '/admin' }, { label: 'Blogs' }];
      }
      if (parts[2] === 'new') {
        return [
          { label: 'Home', href: '/admin' },
          { label: 'Blogs', href: '/admin/blogs' },
          { label: 'New Post' },
        ];
      }
      const blogId = parts[2];
      const blogTitle = entityTitles[blogId] || 'Blog Post';
      return [
        { label: 'Home', href: '/admin' },
        { label: 'Blogs', href: '/admin/blogs' },
        { label: blogTitle },
      ];
    }

    // Route: /admin/cms/...
    if (path.startsWith('/admin/cms')) {
      const parts = path.split('/').filter(Boolean);
      const sub = parts[2];
      let subTitle = 'Website CMS';
      if (sub === 'home') subTitle = 'Homepage';
      else if (sub === 'menu') subTitle = 'Navigation Menu';
      else if (sub === 'footer') subTitle = 'Footer';

      return [
        { label: 'Home', href: '/admin' },
        { label: 'Website CMS', href: '/admin/cms/menu' },
        { label: subTitle },
      ];
    }

    // Top-level mapped sections
    const parts = path.split('/').filter(Boolean).filter((s) => s !== 'admin');
    if (parts.length === 0) {
      return [{ label: 'Home' }];
    }

    const titleMap: Record<string, string> = {
      testimonials: 'Testimonials',
      celebrations: 'Celebrations',
      awards: 'Awards',
      enquiries: 'Enquiries & Leads',
      referrals: 'Referrals',
      settings: 'Settings',
      media: 'Media Library',
      videos: 'Videos',
    };

    const topSection = parts[0];
    const topTitle =
      titleMap[topSection] ||
      topSection.charAt(0).toUpperCase() + topSection.slice(1).replace(/-/g, ' ');

    return [{ label: 'Home', href: '/admin' }, { label: topTitle }];
  };

  const crumbs = getCrumbs();

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        {/* Header with Dynamic Shadcn Breadcrumbs */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur shadow-2xs font-sans">
          <div className="flex items-center gap-3.5 min-w-0">
            <SidebarTrigger className="text-slate-600 hover:text-[#29247c] hover:bg-rose-50/60 transition-colors shrink-0" />
            <Separator orientation="vertical" className="h-4 bg-slate-200 shrink-0" />
            <Breadcrumb className="min-w-0">
              <BreadcrumbList className="flex-nowrap sm:flex-wrap">
                {crumbs.map((crumb, index) => {
                  const isLast = index === crumbs.length - 1;
                  return (
                    <React.Fragment key={index}>
                      <BreadcrumbItem className="min-w-0">
                        {isLast ? (
                          <BreadcrumbPage className="text-xs font-black text-[#29247c] font-heading tracking-tight max-w-[140px] sm:max-w-[280px] md:max-w-[420px] truncate">
                            {crumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link
                              href={crumb.href || '/admin'}
                              className="text-xs font-bold text-slate-400 hover:text-[#29247c] transition-colors whitespace-nowrap"
                            >
                              {crumb.label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && (
                        <BreadcrumbSeparator className="text-slate-300 shrink-0">
                          <ChevronRight className="h-3.5 w-3.5" />
                        </BreadcrumbSeparator>
                      )}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 hover:border-[#f12131] hover:text-[#f12131] hover:bg-rose-50/50 transition-all shadow-2xs group"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#f12131] transition-colors" />
              <span className="hidden sm:inline">Live Website</span>
            </Link>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#29247c] text-xs font-black text-white shadow-xs font-heading">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <span className="text-xs font-extrabold text-slate-800 hidden md:inline">
                {user?.name || 'Administrator'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-8 bg-[#f8fafc]">
          <div className="mx-auto max-w-[1500px] w-full font-sans">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
