import {
  projectsData,
  blogData,
  awardsData,
  testimonialsData,
  navigationLinks,
  ProjectItem,
  BlogPostItem,
  AwardItem,
} from '@/data/siteData';

export interface TestimonialItem {
  id?: string;
  title: string;
  author: string;
  role: string;
  avatar: string;
  quote: string;
  rating?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all published projects from MongoDB backend API with fallback to local siteData
 */
export async function getProjects(): Promise<ProjectItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          slug: p.slug,
          bhk: p.bhk,
          location: p.location,
          budget: p.budget,
          image: p.image,
          status: p.status,
          propertyType: p.propertyType,
          type: p.propertyType || p.type || 'Apartments',
          address: p.address,
          description: p.description,
          streetViewUrl: p.streetViewUrl,
          mapEmbedUrl: p.mapEmbedUrl,
          totalUnits: p.totalUnits,
          availableUnits: p.availableUnits,
          commencementDate: p.commencementDate,
          handoverTimeline: p.handoverTimeline,
          amenities: p.amenities?.map((a: any) => (typeof a === 'string' ? a : a.name)) || [],
          details: {
            propertyType: p.propertyType || p.type,
            status: p.status,
            handover: p.handoverTimeline,
            units: p.totalUnits
              ? `${p.totalUnits} ${
                  p.propertyType === 'Plots'
                    ? 'Plots'
                    : p.propertyType === 'Villas'
                    ? 'Villas'
                    : 'Units'
                }`
              : undefined,
          },
        }));
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Backend projects fetch failed, using fallback static data:', (err as Error).message);
  }

  // Fallback to static siteData
  return projectsData;
}

/**
 * Fetch a single project by slug from MongoDB backend API with fallback
 */
export async function getProjectBySlug(slug: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${slug}`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn(`[cmsClient] Backend fetch for slug "${slug}" failed, checking siteData fallback.`);
  }

  // Fallback to local siteData
  const fallback = projectsData.find((p) => p.slug === slug);
  return fallback || null;
}

/**
 * Fetch project units availability matrix from backend
 */
export async function getProjectUnits(projectIdOrSlug: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${projectIdOrSlug}/units`, {
      next: { revalidate: 10 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn(`[cmsClient] Failed to fetch units for ${projectIdOrSlug}`);
  }

  return [];
}

/**
 * Fetch blogs from backend API with fallback
 */
export async function getBlogs(): Promise<BlogPostItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((b: any) => ({
          id: b._id || b.id || b.slug,
          title: b.title,
          slug: b.slug,
          category: b.category,
          date: new Date(b.publishedDate || b.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          excerpt: b.shortDescription,
          image: b.featuredImage || '/images/blog/blog_1.jpg',
          bannerImage: b.bannerImage,
          content: typeof b.content === 'string' ? b.content.split('\n\n') : b.content,
          galleryImages: b.galleryImages || [],
          quoteText: b.quoteText,
          quoteAuthor: b.quoteAuthor,
        }));
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Failed to fetch blogs from backend, using fallback:', (err as Error).message);
  }

  return blogData;
}

/**
 * Fetch a single blog post by slug with fallback
 */
export async function getBlogBySlug(slug: string): Promise<BlogPostItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/${slug}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        const b = data.data;
        return {
          id: b._id || b.id || b.slug,
          title: b.title,
          slug: b.slug,
          category: b.category,
          date: new Date(b.publishedDate || b.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          excerpt: b.shortDescription,
          image: b.featuredImage || '/images/blog/blog_1.jpg',
          bannerImage: b.bannerImage,
          content: typeof b.content === 'string' ? b.content.split('\n\n') : b.content,
          galleryImages: b.galleryImages || [],
          quoteText: b.quoteText,
          quoteAuthor: b.quoteAuthor,
        };
      }
    }
  } catch (err) {
    console.warn(`[cmsClient] Failed to fetch blog slug "${slug}"`);
  }

  const fallback = blogData.find((b) => b.slug === slug);
  return fallback || null;
}

/**
 * Fetch awards with fallback
 */
export async function getAwards(): Promise<AwardItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/awards`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((a: any) => ({
          id: a._id,
          title: a.title,
          organization: a.organization,
          year: a.year,
          image: a.image,
          description: a.description,
        }));
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Failed to fetch awards from backend, using fallback');
  }

  return awardsData;
}

/**
 * Fetch testimonials with fallback
 */
export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/testimonials`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((t: any) => ({
          id: t._id || t.id,
          title: t.title,
          author: t.author,
          role: t.role,
          avatar: t.avatar,
          quote: t.quote,
          rating: Number(t.rating) || 5,
        }));
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Failed to fetch testimonials from backend, using fallback');
  }

  return testimonialsData;
}

/**
 * Submit lead enquiry from public website to backend
 */
export async function submitEnquiry(enquiryData: {
  name: string;
  phone: string;
  email?: string;
  projectId?: string;
  projectName?: string;
  block?: string;
  floor?: string;
  unitNumber?: string;
  unitType?: string;
  message?: string;
  source?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiryData),
  });

  return res.json();
}

/**
 * Fetch dynamic header navigation menu from backend CMS
 */
export async function getMenu(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/cms/menu`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data?.items) && data.data.items.length > 0) {
        // Filter only visible items (isEnabled !== false) and sort by order
        return data.data.items
          .filter((item: any) => item.isEnabled !== false)
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          .map((item: any) => ({
            ...item,
            children: (item.children || [])
              .filter((c: any) => c.isEnabled !== false)
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
          }));
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Failed to fetch dynamic menu, using siteData navigationLinks');
  }

  return navigationLinks;
}

/**
 * Fetch dynamic footer from backend CMS
 */
export async function getFooter(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/cms/footer`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Failed to fetch dynamic footer');
  }

  return null;
}

/**
 * Fetch dynamic Homepage CMS data
 */
export async function getHomepageCMS(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/cms/home`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Failed to fetch homepage CMS');
  }

  return null;
}

export interface CelebrationItem {
  _id?: string;
  id?: string;
  title: string;
  subheading: string;
  description?: string;
  image: string;
  gallery?: string[];
  date?: string;
  year?: string;
  category?: 'Trip' | 'Office' | 'Launch' | 'Festival' | 'Milestone' | 'Meeting' | 'General' | string;
  order?: number;
  status?: 'Draft' | 'Published';
  createdAt?: string;
}

export const fallbackCelebrations: CelebrationItem[] = [
  {
    title: 'Bangalore Office Opening',
    subheading: 'Expanding Horizons — Now Open in Bangalore!',
    description: 'A landmark expansion milestone for KPN Promoters as we officially inaugurate our Bangalore regional branch office.',
    image: '/images/celebrations/blr_office_opening.jpeg',
    year: '2025',
    date: 'February 2025',
    category: 'Office',
    order: 1,
    status: 'Published',
  },
  {
    title: 'GOA Trip 2025',
    subheading: 'Goa 2025 – Where Every Sunset Tells a Story!',
    description: 'Celebrating teamwork, camaraderie, and record-breaking annual developer milestones with our cherished sales, engineering, and leadership teams in sunny Goa.',
    image: '/images/celebrations/goa_trip_2025.jpeg',
    year: '2025',
    date: 'January 2025',
    category: 'Trip',
    order: 2,
    status: 'Published',
  },
  {
    title: 'Munnar trip',
    subheading: 'Breathe the clouds, live the moments.',
    description: 'A refreshing retreat to the tranquil mist-covered hills of Munnar, fostering deeper unity and mutual inspiration across the KPN family.',
    image: '/images/celebrations/munnar_trip.jpeg',
    year: '2024',
    date: 'September 2024',
    category: 'Trip',
    order: 3,
    status: 'Published',
  },
  {
    title: 'KMT-PH1 LAUNCH',
    subheading: 'Announcing new projects with enthusiasm.',
    description: 'Groundbreaking ceremony and public unveiling of KPN Marvel Township Phase 1, welcoming prospective homeowners and strategic associates.',
    image: '/images/celebrations/kmt_ph1_launch.jpeg',
    year: '2024',
    date: 'June 2024',
    category: 'Launch',
    order: 4,
    status: 'Published',
  },
  {
    title: 'MD Birthday',
    subheading: 'Celebrating the vision, the leader, and the journey — Happy Birthday',
    description: 'Honoring our Managing Director Mr. Kanniappan, whose dedication, integrity, and visionary leadership have propelled KPN Promoters to 20+ years of excellence.',
    image: '/images/celebrations/md_birthday.jpeg',
    year: '2024',
    date: 'May 2024',
    category: 'Milestone',
    order: 5,
    status: 'Published',
  },
  {
    title: 'Pongal Celebration',
    subheading: 'Celebrating the spirit of harvest, culture, and togetherness',
    description: 'Traditional Tamil Pongal festivities at KPN headquarters with traditional attire, sugarcane, sweet pongal, and cultural harmony.',
    image: '/images/celebrations/pongal_celebration.jpeg',
    year: '2024',
    date: 'January 2024',
    category: 'Festival',
    order: 6,
    status: 'Published',
  },
];

/**
 * Fetch all published celebrations from backend API with fallback
 */
export async function getCelebrations(category?: string): Promise<CelebrationItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${baseUrl}/celebrations${query}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Failed to fetch celebrations, using fallback data:', err);
  }

  if (category && category !== 'All') {
    return fallbackCelebrations.filter((c) => c.category === category);
  }
  return fallbackCelebrations;
}



