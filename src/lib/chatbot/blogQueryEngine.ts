import { LiveBlogItem } from './liveKnowledgeService';
import { BotAction, QuickChip } from './types';

export interface BlogQueryResult {
  isBlogQuery: boolean;
  reply: string;
  matchedBlogs: LiveBlogItem[];
  action?: BotAction;
  quickChips?: QuickChip[];
}

/**
 * Checks if user is explicitly asking for articles, blogs, guides, investment advice reads, or news.
 * ONLY triggers when explicit editorial/reading keywords are used so it never hijacks property searches.
 */
export function executeBlogQuery(
  userMessage: string,
  blogs: LiveBlogItem[]
): BlogQueryResult {
  const text = userMessage.toLowerCase().trim();

  // Explicit editorial & reading trigger keywords
  const explicitBlogKeywords = [
    'blog',
    'blogs',
    'article',
    'articles',
    'read guide',
    'reading guide',
    'guides',
    'editorial',
    'news',
    'press',
    'market trend',
    'market trends',
    'investment tip',
    'investment tips',
  ];

  const hasExplicitBlogWord = explicitBlogKeywords.some((kw) => text.includes(kw));

  // If user didn't ask for a blog/article/guide or if there are no blogs, DO NOT intercept!
  if (!hasExplicitBlogWord || blogs.length === 0) {
    return { isBlogQuery: false, reply: '', matchedBlogs: [] };
  }

  // Filter matched blogs by topic
  let matched = blogs.filter((b) => {
    const title = b.title.toLowerCase();
    const cat = b.category.toLowerCase();
    const desc = (b.shortDescription || '').toLowerCase();
    const tags = (b.tags || []).map((t) => t.toLowerCase());

    if (text.includes('dtcp') && (title.includes('dtcp') || desc.includes('dtcp'))) return true;
    if (text.includes('cmda') && (title.includes('cmda') || desc.includes('cmda'))) return true;
    if (text.includes('rera') && (title.includes('rera') || desc.includes('rera'))) return true;
    if (text.includes('investment') && (title.includes('invest') || cat.includes('invest'))) return true;
    if (text.includes('urapakkam') && (title.includes('urapakkam') || desc.includes('urapakkam'))) return true;
    if (text.includes('kilambakkam') && (title.includes('kilambakkam') || desc.includes('kilambakkam'))) return true;
    if ((text.includes('loan') || text.includes('emi')) && (title.includes('loan') || title.includes('finance'))) return true;

    // Direct search query in title/category
    const words = text
      .replace(/[^a-z0-9 ]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['show', 'give', 'what', 'have', 'your', 'about', 'some', 'tell', 'read', 'article', 'blog', 'guide'].includes(w));

    return words.some((w) => title.includes(w) || cat.includes(w) || tags.includes(w));
  });

  // If user asked general "show me blogs" or "articles", return latest blogs
  if (matched.length === 0) {
    matched = blogs.slice(0, 3);
  }

  const topBlogs = matched.slice(0, 3);
  let reply = `Here are our helpful **Articles & Real Estate Guides** published by our property experts:\n\n`;

  topBlogs.forEach((b) => {
    reply += `• **${b.title}** (${b.category})\n`;
    if (b.shortDescription) {
      reply += `  ${b.shortDescription}\n`;
    }
    reply += `\n`;
  });

  reply += `You can click any article card below to read the complete guide, or ask me specific questions about Chennai real estate!`;

  return {
    isBlogQuery: true,
    reply,
    matchedBlogs: topBlogs,
    action: {
      type: 'NAVIGATE',
      url: `/blogs/${topBlogs[0].slug}`,
      pageTitle: topBlogs[0].title,
      description: topBlogs[0].shortDescription || 'Read our in-depth property guide.',
    },
    quickChips: [
      { label: '📰 View All Blogs', query: 'open blogs page' },
      { label: '🏢 View Projects', query: 'open projects page' },
      { label: '📞 Talk to Advisor', query: 'how can I connect with you' },
    ],
  };
}
