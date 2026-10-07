import { ProjectItem } from '@/data/siteData';

export interface LiveBlogItem {
  id: number | string;
  title: string;
  slug: string;
  category: string;
  shortDescription?: string;
  content?: string;
  image?: string;
  publishedDate?: string;
  author?: string;
  tags?: string[];
  status?: string;
}

export interface LiveCmsInfo {
  phonePrimary: string;
  phoneSecondary: string;
  whatsapp: string;
  address: string;
  email: string;
  experienceYears: string;
  happyFamilies: string;
  completedProjects: string;
}

export interface LiveKnowledgeData {
  catalog: ProjectItem[];
  blogs: LiveBlogItem[];
  cms: LiveCmsInfo;
  awards: Array<{ id: any; title: string; year?: string }>;
  lastFetchedAt: number;
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');
const CACHE_TTL_MS = 60_000; // 1 minute in-memory cache

let cachedKnowledge: LiveKnowledgeData | null = null;

const DEFAULT_CMS_INFO: LiveCmsInfo = {
  phonePrimary: '+91 8925924128',
  phoneSecondary: '+91 7338834233',
  whatsapp: '+91 8925924128',
  address: 'No. 48, Karanai Puducherry Road, Urapakkam, Chennai - 603210, Tamil Nadu, India',
  email: 'info@kpnpromoters.in',
  experienceYears: '30+',
  happyFamilies: '10,000+',
  completedProjects: '50+',
};

/**
 * Fetches all live published projects from backend API
 */
async function fetchLiveProjects(): Promise<ProjectItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects?limit=100`, {
      signal: AbortSignal.timeout(3000),
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const payload = await res.json();
    if (!Array.isArray(payload?.data)) return [];

    return payload.data
      .filter((p: any) => p.isPublished !== false)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        location: p.location || 'Chennai',
        address: p.address || p.location || '',
        bhk: p.bhk || '',
        budget: p.budget || p.price || 'Price on Request',
        type: p.propertyType || p.type || 'Apartments',
        status: p.status || 'Ongoing',
        image: p.image || '/images/kpn_logo.webp',
        description: p.shortDescription || p.description || '',
        availableUnits: p.availableUnits,
        plots: p.plots,
        brochureUrl: p.brochureUrl,
      })) as ProjectItem[];
  } catch (err) {
    console.warn('[LiveKnowledge] Could not fetch live projects from backend:', err);
    return [];
  }
}

/**
 * Fetches all live published blogs from backend API
 */
async function fetchLiveBlogs(): Promise<LiveBlogItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs?limit=50`, {
      signal: AbortSignal.timeout(3000),
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const payload = await res.json();
    if (!Array.isArray(payload?.data)) return [];

    return payload.data
      .filter((b: any) => b.status === 'Published' || !b.status)
      .map((b: any) => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        category: b.category || 'Real Estate',
        shortDescription: b.shortDescription || '',
        content: b.content ? b.content.replace(/<[^>]*>?/gm, '').slice(0, 300) : '',
        image: b.image || '/images/kpn_logo.webp',
        publishedDate: b.publishedDate || '',
        author: b.author || 'KPN Promoters',
        tags: Array.isArray(b.tags) ? b.tags : [],
      }));
  } catch (err) {
    console.warn('[LiveKnowledge] Could not fetch live blogs from backend:', err);
    return [];
  }
}

/**
 * Fetches CMS details from backend API
 */
async function fetchLiveCms(): Promise<LiveCmsInfo> {
  try {
    const res = await fetch(`${API_BASE_URL}/cms/footer`, {
      signal: AbortSignal.timeout(2000),
      cache: 'no-store',
    });
    if (!res.ok) return DEFAULT_CMS_INFO;
    const payload = await res.json();
    const data = payload?.data || {};

    return {
      phonePrimary: data.phone || DEFAULT_CMS_INFO.phonePrimary,
      phoneSecondary: data.phoneSecondary || DEFAULT_CMS_INFO.phoneSecondary,
      whatsapp: data.whatsapp || data.phone || DEFAULT_CMS_INFO.whatsapp,
      address: data.address || DEFAULT_CMS_INFO.address,
      email: data.email || DEFAULT_CMS_INFO.email,
      experienceYears: data.experienceYears || DEFAULT_CMS_INFO.experienceYears,
      happyFamilies: data.happyFamilies || DEFAULT_CMS_INFO.happyFamilies,
      completedProjects: data.completedProjects || DEFAULT_CMS_INFO.completedProjects,
    };
  } catch (err) {
    return DEFAULT_CMS_INFO;
  }
}

/**
 * Get unified live knowledge with in-memory TTL caching
 */
export async function getLiveKnowledge(): Promise<LiveKnowledgeData> {
  const now = Date.now();
  if (cachedKnowledge && now - cachedKnowledge.lastFetchedAt < CACHE_TTL_MS) {
    return cachedKnowledge;
  }

  const [catalog, blogs, cms] = await Promise.all([
    fetchLiveProjects(),
    fetchLiveBlogs(),
    fetchLiveCms(),
  ]);

  cachedKnowledge = {
    catalog,
    blogs,
    cms,
    awards: [],
    lastFetchedAt: now,
  };

  return cachedKnowledge;
}

/**
 * Dynamically constructs Gemini's AI System Instruction
 * NEVER hardcodes any projects, blogs, or prices.
 */
export function buildDynamicSystemPrompt(
  catalog: ProjectItem[],
  blogs: LiveBlogItem[],
  cms: LiveCmsInfo
): string {
  // Group live projects by category
  const apartments = catalog.filter((p) => p.type === 'Apartments');
  const plots = catalog.filter((p) => p.type === 'Plots');
  const villas = catalog.filter((p) => p.type === 'Villas');

  const apartmentsSection =
    apartments.length > 0
      ? apartments
          .map(
            (p, i) =>
              `${i + 1}. ${p.name} - ${p.location}. Type: ${p.bhk || '1 & 2 BHK'}. Budget: ${p.budget}. Status: ${p.status}. Slug: /projects/${p.slug}`
          )
          .join('\n')
      : 'No apartments currently published.';

  const plotsSection =
    plots.length > 0
      ? plots
          .map(
            (p, i) =>
              `${i + 1}. ${p.name} - ${p.location}. Rate/Budget: ${p.budget}. Status: ${p.status}. Slug: /projects/${p.slug}`
          )
          .join('\n')
      : 'No plots currently published.';

  const villasSection =
    villas.length > 0
      ? villas
          .map(
            (p, i) =>
              `${i + 1}. ${p.name} - ${p.location}. Type: ${p.bhk || 'Villa'}. Budget: ${p.budget}. Status: ${p.status}. Slug: /projects/${p.slug}`
          )
          .join('\n')
      : '';

  const blogsSection =
    blogs.length > 0
      ? blogs
          .slice(0, 10)
          .map(
            (b, i) =>
              `${i + 1}. "${b.title}" (Category: ${b.category}) - ${b.shortDescription || ''}. URL: /blogs/${b.slug}`
          )
          .join('\n')
      : 'No recent articles.';

  return `
You are "KPN Assistant", the smart, friendly, and professional AI Real Estate Consultant for KPN Promoters Pvt Ltd, a premier real estate developer in Chennai with over ${cms.experienceYears} years of trust and ${cms.happyFamilies} happy property owners.

STRICT ACCURACY RULES (CRITICAL):
1. LIVE PROJECTS ONLY: Recommend and discuss ONLY the properties listed in the "CURRENT LIVE PROJECTS" section below. NEVER invent, assume, or mention projects not listed below. If a user asks for a project that is not in the list, inform them politely that it is currently unavailable and suggest active alternatives.
2. CAB / TRANSPORTATION: KPN Promoters does NOT provide free cab, taxi, pickup, or drop services. If asked about cab or transport, clarify: "We do not provide cab pickup or drop facilities, but we warmly invite you for a free guided site visit with our property managers! You can visit our project sites directly or meet us at our head office."
3. BLOGS & GUIDES: When users ask about market trends, buying tips, DTCP/CMDA approvals, or legal guides, reference the relevant articles listed in the "PUBLISHED ARTICLES & GUIDES" section below and invite them to read more.
4. OUTPUT CLEANLINESS: Output ONLY the direct answer for the website user. NEVER output meta-commentary, draft labels (e.g. "Draft Content", "Note:"), internal notes, or thought traces.
5. CONVERSATIONAL TONE: Answer strictly what the customer asks. Keep answers friendly, concise (2 to 3 short paragraphs or bullet points), and invite the user to connect on WhatsApp (${cms.whatsapp}) or call ${cms.phonePrimary}.
6. LANGUAGES: Communicate fluently in English, Tamil, and Tanglish depending on the user's language.

COMPANY DETAILS:
- Address: ${cms.address}
- Contact Number: ${cms.phonePrimary} / ${cms.phoneSecondary}
- WhatsApp: ${cms.whatsapp}
- Email: ${cms.email}
- Key Advantages: 100% Clear Legal Titles, DTCP & RERA Approvals, Bank Loan Assistance (up to 80-90%), Rapidly Developing Corridor along GST Road & Kilambakkam Terminus.

CURRENT LIVE PROJECTS:

APARTMENTS:
${apartmentsSection}

PLOTS & TOWNSHIPS (DTCP & RERA APPROVED):
${plotsSection}
${villasSection ? `\nVILLAS / HOUSES:\n${villasSection}` : ''}

PUBLISHED ARTICLES & GUIDES:
${blogsSection}
`;
}
