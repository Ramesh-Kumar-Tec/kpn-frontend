import { BotAction, QuickChip } from './types';
import { ProjectItem } from '@/data/siteData';

export interface LandmarkResult {
  isLandmarkQuery: boolean;
  reply: string;
  action?: BotAction;
  quickChips?: QuickChip[];
  showLeadForm?: boolean;
}

interface LandmarkProfile {
  name: string;
  keywords: string[];
  areaKeywords: string[];
  description: string;
}

const LANDMARKS: LandmarkProfile[] = [
  {
    name: 'Kilambakkam Kalaignar Centenary Bus Terminus (KCBT)',
    keywords: ['kilambakkam', 'kcbt', 'mufassil bus terminus', 'new bus stand'],
    areaKeywords: ['kilambakkam', 'urapakkam', 'vandalur'],
    description: 'Chennai’s premier southern transit hub connecting all districts with upcoming Metro extension.',
  },
  {
    name: 'Guduvanchery Railway Station & Hub',
    keywords: ['guduvanchery station', 'guduvanchery railway', 'guduvanchery junction'],
    areaKeywords: ['guduvanchery', 'urapakkam'],
    description: 'Rapid suburban train connectivity on Chennai Beach-Tambaram-Chengalpattu line.',
  },
  {
    name: 'Urapakkam Railway Station & Karanai Puducherry Road',
    keywords: ['urapakkam station', 'urapakkam railway', 'karanai puducherry', 'adhanur'],
    areaKeywords: ['urapakkam', 'karanai puducherry', 'adhanur'],
    description: 'Prime residential enclave with top CBSE schools, banks, and direct GST Road access.',
  },
  {
    name: 'Mahindra World City & Chengalpattu Corridor',
    keywords: ['mahindra world city', 'mwc', 'chengalpattu', 'paranur', 'singaperumal koil', 'sp koil'],
    areaKeywords: ['chengalpattu', 'singaperumal koil', 'maraimalai nagar', 'nenmeli', 'mwc'],
    description: 'Global IT and manufacturing SEZ housing Infosys, BMW, Renault Nissan, and 50+ multinationals.',
  },
  {
    name: 'SRM University & Hospital Hub',
    keywords: ['srm', 'srm university', 'srm hospital', 'potheri'],
    areaKeywords: ['guduvanchery', 'potheri', 'kattankulathur'],
    description: 'World-renowned medical, engineering, and research campus in Potheri / Kattankulathur.',
  },
];

/**
 * 100% Pure Dynamic Landmark Resolver
 * Dynamically queries active projects in the live database catalog by matching locations.
 * Zero hardcoded project slugs.
 */
export function resolveLandmarkIntent(
  userMessage: string,
  catalog: ProjectItem[] = []
): LandmarkResult {
  const text = userMessage.toLowerCase().trim();

  const hasProximityWords =
    text.includes('near') ||
    text.includes('close to') ||
    text.includes('distance') ||
    text.includes('proximity') ||
    text.includes('how far') ||
    text.includes('which project is near') ||
    text.includes('projects near') ||
    text.includes('surrounding');

  for (const lm of LANDMARKS) {
    const matchesLandmark = lm.keywords.some((kw) => text.includes(kw));

    if (
      matchesLandmark &&
      (hasProximityWords ||
        text.includes('project') ||
        text.includes('property') ||
        text.includes('home') ||
        text.includes('plot') ||
        text.includes('apartment') ||
        text.includes('flat'))
    ) {
      // Dynamically filter matching projects from the live database catalog
      const matchingProjects = catalog.filter((p) => {
        const loc = (p.location || '').toLowerCase();
        const addr = (p.address || '').toLowerCase();
        const name = (p.name || '').toLowerCase();

        return lm.areaKeywords.some((area) => loc.includes(area) || addr.includes(area) || name.includes(area));
      });

      if (matchingProjects.length === 0) {
        // If no projects in that specific corridor, inform dynamically
        return {
          isLandmarkQuery: true,
          reply:
            `We currently don't have active projects directly in the **${lm.name}** immediate zone in our live database, but we have upcoming projects along the GST Road corridor.\n\n` +
            `Would you like to speak with our advisor to check upcoming land launches near ${lm.name}?`,
          action: {
            type: 'NAVIGATE',
            url: '/contact-us',
            pageTitle: 'Contact Property Advisor',
            description: `Inquire about upcoming projects near ${lm.name}`,
          },
          showLeadForm: true,
          quickChips: [
            { label: '🏢 View All Projects', query: 'open projects page' },
            { label: '📞 Contact Advisor', query: 'open contact page' },
          ],
        };
      }

      const nearbyList = matchingProjects.slice(0, 4).map((proj) => ({
        name: proj.name,
        distance: `Located in ${proj.location}`,
        slug: proj.slug,
        budget: proj.budget,
        type: proj.type,
        image: proj.image,
      }));

      let reply = `Here are our verified active projects closest to **${lm.name}**:\n\n`;
      nearbyList.forEach((p) => {
        reply += `• **${p.name}** (${p.type}) — **${p.distance}**\n`;
        reply += `  - Price: **${p.budget}**\n\n`;
      });
      reply += `These projects offer high capital appreciation and rental yield due to rapid infrastructure growth. Would you like to schedule a free site visit?`;

      return {
        isLandmarkQuery: true,
        reply,
        action: {
          type: 'LANDMARK_SEARCH',
          landmarkDetails: {
            landmarkName: lm.name,
            description: lm.description,
            nearbyProjects: nearbyList,
          },
        },
        showLeadForm: true,
        quickChips: [
          { label: '📅 Book Free Site Visit', query: `I want to visit ${nearbyList[0].name}` },
          { label: '🏢 View All Projects', query: 'open projects page' },
          { label: '💰 Check Loan EMI', query: 'What is the EMI for 25 Lakhs loan?' },
        ],
      };
    }
  }

  return { isLandmarkQuery: false, reply: '' };
}
