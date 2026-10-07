import { BotAction, BrochureDetails, QuickChip } from './types';
import { ProjectItem } from '@/data/siteData';

export interface BrochureResult {
  isBrochureQuery: boolean;
  reply: string;
  action?: BotAction;
  quickChips?: QuickChip[];
  showLeadForm?: boolean;
}

/**
 * 100% Pure Dynamic Brochure Resolver
 * Uses live projects from the database. Zero hardcoded brochure lists.
 */
export function resolveBrochureIntent(
  userMessage: string,
  catalog: ProjectItem[] = []
): BrochureResult {
  const text = userMessage.toLowerCase().trim();

  const isBrochure =
    text.includes('brochure') ||
    text.includes('brouchure') ||
    text.includes('floor plan') ||
    text.includes('layout map') ||
    text.includes('master plan') ||
    text.includes('pdf') ||
    text.includes('catalogue');

  if (!isBrochure) {
    return { isBrochureQuery: false, reply: '' };
  }

  // 1. Check if user specified a particular project name or slug from live catalog
  const matchedProject = catalog.find((p) => {
    const pName = p.name.toLowerCase();
    const pSlug = p.slug.toLowerCase().replace(/-/g, ' ');
    return text.includes(pName) || text.includes(pSlug);
  });

  if (matchedProject) {
    if (matchedProject.brochureUrl) {
      return {
        isBrochureQuery: true,
        reply:
          `Here is the official **${matchedProject.name}** project brochure!\n\n` +
          `You can download the full PDF below to view approved layout maps, floor plans, specifications, and location advantages.`,
        action: {
          type: 'DOWNLOAD_BROCHURE',
          brochureDetails: {
            projectName: matchedProject.name,
            brochureUrl: matchedProject.brochureUrl,
            title: `${matchedProject.name} - Official Brochure & Layout Details`,
          },
        },
        showLeadForm: true,
        quickChips: [
          { label: '📅 Book Free Site Visit', query: `I want to visit ${matchedProject.name}` },
          { label: '💰 Check Loan EMI', query: 'What is the EMI for 25 Lakhs loan?' },
          { label: '🏢 View All Projects', query: 'open projects page' },
        ],
      };
    } else {
      return {
        isBrochureQuery: true,
        reply:
          `The digital brochure for **${matchedProject.name}** is being prepared by our sales desk.\n\n` +
          `Please share your phone number below or message us on WhatsApp, and we will send the complete floor plan and pricing sheet directly to your phone!`,
        action: {
          type: 'NAVIGATE',
          url: `/projects/${matchedProject.slug}`,
          pageTitle: matchedProject.name,
          description: `View complete details of ${matchedProject.name}`,
        },
        showLeadForm: true,
        quickChips: [
          { label: '📅 Book Site Visit', query: `I want to visit ${matchedProject.name}` },
          { label: '📞 Speak with Advisor', query: 'how can I connect with you' },
          { label: '🏢 View All Projects', query: 'open projects page' },
        ],
      };
    }
  }

  // 2. General request: dynamically list active projects from live catalog
  const projectsWithBrochures = catalog.filter((p) => Boolean(p.brochureUrl));
  const activeDisplayProjects = (projectsWithBrochures.length > 0 ? projectsWithBrochures : catalog).slice(0, 5);

  let reply = `We have official **PDF Brochures & Floor Plans** available for our active projects:\n\n`;
  activeDisplayProjects.forEach((p) => {
    reply += `• **${p.name}** (${p.type} in ${p.location})\n`;
  });
  reply += `\nWhich project brochure would you like to download?`;

  const chips: QuickChip[] = activeDisplayProjects.slice(0, 3).map((p) => ({
    label: `📄 ${p.name}`,
    query: `download brochure for ${p.name}`,
  }));

  chips.push({ label: '📅 Book Free Site Visit', query: 'I want to book a free site visit' });

  return {
    isBrochureQuery: true,
    reply,
    quickChips: chips,
  };
}
