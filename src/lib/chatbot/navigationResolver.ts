import { BotAction, QuickChip } from './types';
import { ProjectItem } from '@/data/siteData';

interface NavigationMatch {
  matched: boolean;
  reply: string;
  action?: BotAction;
  quickChips?: QuickChip[];
}

interface RouteDefinition {
  path: string;
  title: string;
  description: string;
  keywords: string[];
}

const SITE_ROUTES: RouteDefinition[] = [
  {
    path: '/projects',
    title: 'Projects Directory',
    description: 'Explore all ongoing & upcoming apartments, plots, and villas across Chennai.',
    keywords: [
      'project', 'projects', 'properties', 'all projects', 'all properties',
      'project page', 'projects page', 'apartments page', 'plots page',
      'property list', 'view projects', 'browse projects'
    ],
  },
  {
    path: '/contact-us',
    title: 'Contact Us',
    description: 'Get in touch with our property consultants or visit our Urapakkam head office.',
    keywords: [
      'contact', 'contact us', 'contact page', 'contact us page',
      'reach us', 'office address', 'head office', 'phone number', 'call us',
      'location map', 'get in touch'
    ],
  },
  {
    path: '/about-us',
    title: 'About KPN Promoters',
    description: 'Learn about our 30+ year legacy, leadership, and mission in Chennai real estate.',
    keywords: [
      'about', 'about us', 'about us page', 'who are you', 'company profile',
      'about kpn', 'history', 'legacy'
    ],
  },
  {
    path: '/why-choose-us',
    title: 'Why Choose Us',
    description: 'Discover our 100% legal title guarantees, DTCP/RERA approvals, and construction quality.',
    keywords: [
      'why choose us', 'why kpn', 'advantages', 'features', 'benefits'
    ],
  },
  {
    path: '/our-awards',
    title: 'Our Awards & Recognition',
    description: 'Explore the industry awards and honors presented to KPN Promoters over the decades.',
    keywords: [
      'award', 'awards', 'our awards', 'recognition', 'achievements', 'honors'
    ],
  },
  {
    path: '/celebrations',
    title: 'Celebrations & Events',
    description: 'Memorable milestones, handover ceremonies, and festive celebrations at KPN.',
    keywords: [
      'celebration', 'celebrations', 'events', 'customer meets', 'handover'
    ],
  },
  {
    path: '/careers',
    title: 'Careers at KPN',
    description: 'Join our growing team of real estate experts, architects, and sales leaders.',
    keywords: [
      'career', 'careers', 'job', 'jobs', 'hiring', 'openings', 'work with us'
    ],
  },
  {
    path: '/blogs',
    title: 'News & Real Estate Insights',
    description: 'Stay updated with market trends, GST road developments, and property investment guides.',
    keywords: [
      'blog', 'blogs', 'news', 'articles', 'insights', 'press'
    ],
  },
  {
    path: '/joint-development',
    title: 'Joint Development',
    description: 'Partner with KPN to maximize the value of your prime land parcels with transparent sharing.',
    keywords: [
      'joint development', 'jd', 'land collaboration', 'partner with us', 'land owners'
    ],
  },
  {
    path: '/nri',
    title: 'NRI Real Estate Services',
    description: 'Dedicated end-to-end property advisory, documentation, and rental care for NRI investors.',
    keywords: [
      'nri', 'nri services', 'nri investment', 'overseas'
    ],
  },
  {
    path: '/channel-partners',
    title: 'Channel Partners',
    description: 'Register as an accredited channel partner and grow your real estate business with KPN.',
    keywords: [
      'channel partner', 'channel partners', 'broker', 'agents'
    ],
  },
  {
    path: '/industrial',
    title: 'Industrial & Warehousing',
    description: 'Explore industrial land and park infrastructure along prime Chennai logistics corridors.',
    keywords: [
      'industrial', 'warehouse', 'warehousing', 'logistics park'
    ],
  },
  {
    path: '/investors',
    title: 'Investor Relations',
    description: 'High-yield real estate investment opportunities and capital growth partnerships.',
    keywords: [
      'investor', 'investors', 'investment opportunities'
    ],
  },
];

/**
 * 100% Pure Dynamic Navigation Intent Resolver
 * Checks live catalog projects and site pages.
 */
export function resolveNavigationIntent(
  message: string,
  catalog: ProjectItem[] = []
): NavigationMatch {
  const clean = message.toLowerCase().trim();

  // Navigation action indicator words
  const navTriggers = [
    'open', 'go to', 'take me to', 'navigate to', 'show me', 'visit',
    'lead me to', 'switch to', 'bring me to', 'head to', 'display'
  ];

  const hasNavVerb = navTriggers.some((t) => clean.includes(t));

  // 1. Check for specific project direct navigation dynamically against live catalog
  for (const proj of catalog) {
    const slugName = proj.name.toLowerCase();
    const shortName = proj.slug.toLowerCase().replace(/-/g, ' ');

    if (
      (clean.includes(slugName) || clean.includes(shortName)) &&
      (hasNavVerb || clean.includes('page') || clean.includes('details') || clean.includes('brochure'))
    ) {
      return {
        matched: true,
        reply: `Certainly! Taking you to the details page for **${proj.name}** in ${proj.location}.`,
        action: {
          type: 'NAVIGATE',
          url: `/projects/${proj.slug}`,
          pageTitle: proj.name,
          description: `${proj.type} in ${proj.location} • Starting from ${proj.budget}`,
          autoRedirect: true,
        },
        quickChips: [
          { label: '🏢 View All Projects', query: 'open projects page' },
          { label: '📅 Book Site Visit', query: `I want to visit ${proj.name}` },
          { label: '📞 Contact Advisor', query: 'open contact page' },
        ],
      };
    }
  }

  // 2. Check for site route matches
  for (const route of SITE_ROUTES) {
    const isKeywordMatch = route.keywords.some((kw) => {
      if (clean.includes(kw) && (hasNavVerb || clean.includes('page') || clean === kw)) {
        return true;
      }
      return false;
    });

    if (isKeywordMatch) {
      return {
        matched: true,
        reply: `Sure! I am opening the **${route.title}** page for you. You can explore full details there.`,
        action: {
          type: 'NAVIGATE',
          url: route.path,
          pageTitle: route.title,
          description: route.description,
          autoRedirect: true,
        },
        quickChips: [
          { label: '🏢 View All Projects', query: 'open projects page' },
          { label: '📞 Contact Us', query: 'open contact page' },
          { label: '💬 Ask a Question', query: 'What properties are available?' },
        ],
      };
    }
  }

  return { matched: false, reply: '' };
}
