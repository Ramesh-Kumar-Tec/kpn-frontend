'use strict';
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import { BlogPostItem } from '@/data/siteData';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import FadeIn from '@/components/animation/FadeIn';
import ImageReveal from '@/components/animation/ImageReveal';

interface BlogDetailClientProps {
  post: BlogPostItem;
  allPosts: BlogPostItem[];
}

export default function BlogDetailClient({
  post,
  allPosts,
}: BlogDetailClientProps) {
  const [commentSent, setCommentSent] = useState(false);

  // Previous post link
  const postIndex = allPosts.findIndex(
    (p) => p.slug === post.slug || p.id === post.id
  );
  const prevPost =
    allPosts.length > 1
      ? allPosts[(postIndex - 1 + allPosts.length) % allPosts.length]
      : null;

  // Comment submission handler
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentSent(true);
  };

  return (
    <>
      <Navbar variant="hero" />
      <InnerPageHero
        title={post.title}
        breadcrumb={`Blogs • ${post.category} • ${post.title}`}
        description="Read detailed analysis, market updates, and expert real estate commentary."
        image={post.bannerImage || post.image || '/images/blog/blog_1.jpg'}
      />

      <section className="bg-white px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1400px]">

          {/* Category Pill, Date & Article Title */}
          <FadeIn direction="up" className="text-center space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="rounded-full bg-[#f12131] px-6 py-2 text-xs font-extrabold text-white shadow-md">
                {post.category}
              </span>
              <span className="text-sm font-bold text-slate-400">
                {post.date}
              </span>
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight tracking-tight text-[#29247c] sm:text-5xl lg:text-[54px]">
              {post.title}
            </h1>
          </FadeIn>

          {/* Featured Cover Banner Image */}
          <FadeIn direction="up" delay={0.15}>
            <ImageReveal className="mx-auto my-12 max-w-5xl overflow-hidden rounded-[32px] border border-slate-100 shadow-xl">
              <img
                src={post.image || '/images/blog/blog_1.jpg'}
                alt={post.title}
                className="h-[450px] w-full object-cover sm:h-[550px] transition-transform duration-700 hover:scale-105"
              />
            </ImageReveal>
          </FadeIn>

          {/* Article Body & 2-Column Image Gallery */}
          <FadeIn direction="up" delay={0.2} className="mx-auto max-w-4xl space-y-8 text-lg font-medium leading-relaxed text-slate-600">
            {post.content && post.content[0] && (
              <p>{post.content[0]}</p>
            )}

            {/* 2-Column Side-by-Side Image Gallery */}
            {((post.galleryImages && post.galleryImages.length > 0) || true) && (
              <div className="my-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="overflow-hidden rounded-[28px] border border-slate-100 shadow-md">
                  <img
                    src={
                      post.galleryImages?.[0] ||
                      '/images/projects/project_1.jpg'
                    }
                    alt="Article Gallery 1"
                    className="h-[320px] w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="overflow-hidden rounded-[28px] border border-slate-100 shadow-md">
                  <img
                    src={
                      post.galleryImages?.[1] ||
                      '/images/projects/project_2.jpg'
                    }
                    alt="Article Gallery 2"
                    className="h-[320px] w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            )}

            {post.content && post.content[1] && (
              <p>{post.content[1]}</p>
            )}

            {/* Stylized Blockquote Quote Block */}
            <blockquote className="my-10 border-l-4 border-[#f12131] bg-slate-50/80 p-8 rounded-r-3xl italic text-xl font-bold text-slate-800 shadow-xs leading-relaxed">
              <p>“{post.quoteText || 'Investing in real estate is more than just acquiring property; it is about establishing a lasting legacy of security and peace of mind for your family.'}”</p>
              <cite className="block mt-4 not-italic text-sm font-black uppercase tracking-widest text-[#29247c]">
                — {post.quoteAuthor || 'KPN Editorial Team'}
              </cite>
            </blockquote>

            {/* Remaining Paragraphs */}
            {post.content && post.content.slice(2).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </FadeIn>

          <hr className="mx-auto my-16 max-w-4xl border-t border-slate-200/80" />

          {/* Previous Post Link */}
          {prevPost && (
            <FadeIn direction="up" className="mx-auto max-w-4xl">
              <Link
                href={`/blogs/${prevPost.slug}`}
                className="group flex flex-col space-y-2 cursor-pointer"
              >
                <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  <ArrowLeft className="h-3.5 w-3.5 text-[#f12131] transition-transform group-hover:-translate-x-1" />
                  PREVIOUS POST
                </span>
                <h4 className="text-2xl font-extrabold text-[#29247c] transition-colors duration-300 group-hover:text-[#f12131]">
                  {prevPost.title}
                </h4>
              </Link>
            </FadeIn>
          )}

          <hr className="mx-auto my-16 max-w-4xl border-t border-slate-200/80" />

          {/* Leave a Reply / Comment Form */}
          <FadeIn direction="up" className="mx-auto max-w-4xl space-y-8">
            <div>
              <h3 className="text-3xl font-extrabold text-[#29247c]">
                Leave a Reply
              </h3>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Your email address will not be published. Required fields are
                marked *
              </p>
            </div>

            {commentSent ? (
              <div className="rounded-[28px] bg-emerald-50 p-8 border border-emerald-200 text-emerald-800">
                <h4 className="font-bold text-lg">Thank you!</h4>
                <p className="text-sm mt-1">Your reply has been submitted and will appear once approved.</p>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="space-y-6">
                {/* Comment Textarea */}
                <textarea
                  required
                  rows={6}
                  placeholder="Comment"
                  className="w-full resize-none rounded-[28px] border-0 bg-slate-100/80 p-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30 transition-all"
                />

                {/* 3-Column Inputs Row */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    className="h-14 w-full rounded-full border-0 bg-slate-100/80 px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30 transition-all"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.com"
                    title="Email must include '@' and end with '.com' (e.g. name@gmail.com)"
                    className="h-14 w-full rounded-full border-0 bg-slate-100/80 px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Your Website"
                    className="h-14 w-full rounded-full border-0 bg-slate-100/80 px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30 transition-all"
                  />
                </div>

                {/* Save info Checkbox */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="save-info"
                    className="h-4 w-4 rounded border-slate-300 text-[#f12131] focus:ring-[#f12131]"
                  />
                  <label
                    htmlFor="save-info"
                    className="text-xs font-semibold text-slate-500 cursor-pointer"
                  >
                    Save my name, email, and website in this browser for the next
                    time I comment.
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="group flex h-14 items-center gap-5 rounded-full border border-slate-200 bg-white pl-8 pr-2 text-sm font-extrabold text-slate-900 shadow-md transition hover:shadow-lg active:scale-98 cursor-pointer"
                  >
                    <span>Post Comment</span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f12131] text-white transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </button>
                </div>
              </form>
            )}
          </FadeIn>

        </div>
      </section>
    </>
  );
}
