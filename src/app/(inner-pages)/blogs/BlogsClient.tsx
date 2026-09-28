'use strict';
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import { BlogPostItem } from '@/data/siteData';
import FadeIn from '@/components/animation/FadeIn';

interface BlogsClientProps {
  initialPosts: BlogPostItem[];
}

export default function BlogsClient({ initialPosts }: BlogsClientProps) {
  const [posts] = useState<BlogPostItem[]>(initialPosts);

  // Derive categories dynamically from the loaded posts
  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(posts.map((p) => p.category).filter(Boolean))
    );
    return ['All Posts', ...cats];
  }, [posts]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All Posts');

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All Posts') return posts;
    return posts.filter(
      (post) =>
        (post.category || '').trim().toLowerCase() ===
        selectedCategory.trim().toLowerCase()
    );
  }, [selectedCategory, posts]);

  return (
    <>
      <Navbar variant="hero" />
      <InnerPageHero
        title="Blogs"
        breadcrumb="Blogs"
        description="Stay updated with the latest real estate trends, architectural insights, and community news."
        image="/images/blog/blog_1.jpg"
      />

      <section className="bg-white px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1500px]">

          {/* Header & Filter Tabs Row */}
          <FadeIn direction="up" className="mb-12 flex flex-wrap items-center justify-between gap-6">
            <h2 className="text-4xl font-extrabold tracking-tight text-[#29247c] sm:text-5xl">
              Latest
            </h2>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`h-11 rounded-full px-6 text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#f12131] text-white shadow-md scale-105'
                      : 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* 3-Column Blog Cards Grid */}
          {filteredPosts.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-slate-300 p-16 text-center">
              <h3 className="text-xl font-bold text-slate-800">
                No blog posts found in this category
              </h3>
              <button
                onClick={() => setSelectedCategory('All Posts')}
                className="mt-4 rounded-full bg-[#f12131] px-6 py-2 text-xs font-bold text-white shadow-md cursor-pointer hover:bg-[#d81928] transition-colors"
              >
                View All Posts
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post, idx) => (
                <motion.article
                  key={post.id || post.slug || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(idx * 0.06, 0.36),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex flex-col"
                >
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="group flex flex-col h-full cursor-pointer"
                  >
                    {/* Blog Image */}
                    <div className="overflow-hidden rounded-[32px] shadow-sm bg-slate-100 aspect-[16/10] relative">
                      <img
                        src={post.image || '/images/blog/blog_1.jpg'}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Meta Details Row with Inset Horizontal Line */}
                    <div className="mt-4 flex items-center justify-between gap-4">
                      {/* Left: Category Badge */}
                      <span className="inline-flex items-center rounded-full bg-[#f12131] px-5 py-1.5 text-xs font-extrabold text-white shadow-xs">
                        {post.category}
                      </span>

                      {/* Middle: Horizontal Divider Line */}
                      <div className="h-px flex-1 bg-slate-200/80" />

                      {/* Right: Date */}
                      <span className="shrink-0 text-xs font-semibold text-slate-400">
                        {post.date}
                      </span>
                    </div>

                    {/* Blog Title */}
                    <h3 className="mt-3.5 text-2xl font-extrabold leading-snug tracking-tight text-[#29247c] transition-colors duration-300 group-hover:text-[#f12131]">
                      {post.title}
                    </h3>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}
