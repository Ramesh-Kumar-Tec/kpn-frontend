'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { blogData, BlogPostItem } from '@/data/siteData';
import { getBlogs } from '@/lib/cmsClient';
import RunningPillBadge from '../ui/RunningPillBadge';
import FadeIn from '../animation/FadeIn';
import StaggerContainer from '../animation/StaggerContainer';
import StaggerItem from '../animation/StaggerItem';

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPostItem[]>(blogData.slice(0, 3));

  useEffect(() => {
    async function loadLatest() {
      try {
        const fetched = await getBlogs();
        if (fetched && fetched.length > 0) {
          setPosts(fetched.slice(0, 3));
        }
      } catch {
        // fallback preserved
      }
    }
    loadLatest();
  }, []);

  return (
    <section id="blog" className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <FadeIn direction="up" className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <RunningPillBadge text="POSTS • ARTICLES" />
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#29247c] tracking-tight leading-tight">
              Discover inspiration and trends
            </h2>
          </div>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-4 rounded-full border border-slate-200 bg-white py-2 pl-6 pr-2 text-sm font-bold text-[#29247c] shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow hover:scale-[1.02] active:scale-98"
          >
            <span>View All Posts</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f12131] text-white transition-transform duration-300 group-hover:scale-110">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </FadeIn>

        {/* Articles Cards */}
        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {posts.map((post, idx) => (
            <StaggerItem
              key={post.id || idx}
              className="group flex flex-col justify-between cursor-pointer"
            >
              <Link href={`/blogs/${post.slug}`}>
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] shadow-lg">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Metadata row */}
                <div className="flex items-center justify-between gap-4 mt-6">
                  <span className="bg-[#f12131] text-white text-[11px] font-extrabold px-5 py-1.5 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                  <hr className="flex-1 border-t border-slate-200" />
                  <span className="text-xs font-semibold text-slate-400">
                    {post.date}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-4 leading-snug tracking-tight group-hover:text-[#f12131] transition-colors duration-300">
                  {post.title}
                </h3>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
}