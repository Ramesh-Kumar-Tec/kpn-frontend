import { BotAction, QuickChip } from './types';
import { projectsData } from '@/data/siteData';

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
  description: string;
  projectSlugs: Array<{ slug: string; distance: string }>;
}

const LANDMARKS: LandmarkProfile[] = [
  {
    name: 'Kilambakkam Kalaignar Centenary Bus Terminus (KCBT)',
    keywords: ['kilambakkam', 'kcbt', 'mufassil bus terminus', 'new bus stand'],
    description: 'Chennai’s premier southern transit hub connecting all districts with upcoming Metro extension.',
    projectSlugs: [
      { slug: 'kpn-vijayalakshmi', distance: '5 mins (3.5 Kms)' },
      { slug: 'kpn-lenid', distance: '8 mins (5 Kms)' },
      { slug: 'dgm-monica-residency', distance: '10 mins (6 Kms)' },
      { slug: 'avp-kanagam-avenue', distance: '12 mins (9 Kms)' },
    ],
  },
  {
    name: 'Guduvanchery Railway Station & Hub',
    keywords: ['guduvanchery station', 'guduvanchery railway', 'guduvanchery junction'],
    description: 'Rapid suburban train connectivity on Chennai Beach-Tambaram-Chengalpattu line.',
    projectSlugs: [
      { slug: 'dgm-monica-residency', distance: '4 mins (2 Kms)' },
      { slug: 'kpn-omega-town', distance: '8 mins (4 Kms)' },
      { slug: 'avp-kanagam-avenue', distance: '10 mins (6 Kms)' },
    ],
  },
  {
    name: 'Urapakkam Railway Station & Karanai Puducherry Road',
    keywords: ['urapakkam station', 'urapakkam railway', 'karanai puducherry', 'adhanur'],
    description: 'Prime residential enclave with top CBSE schools, banks, and direct GST Road access.',
    projectSlugs: [
      { slug: 'royal-oak', distance: '1 min (Opp. Station)' },
      { slug: 'kpn-lenid', distance: '4 mins (1.5 Kms)' },
      { slug: 'sp2k-serenity-skyline', distance: '5 mins (2 Kms)' },
      { slug: 'kpn-enclave', distance: '6 mins (2.5 Kms)' },
    ],
  },
  {
    name: 'Mahindra World City & Chengalpattu Corridor',
    keywords: ['mahindra world city', 'mwc', 'chengalpattu', 'paranur', 'singaperumal koil', 'sp koil'],
    description: 'Global IT and manufacturing SEZ housing Infosys, BMW, Renault Nissan, and 50+ multinationals.',
    projectSlugs: [
      { slug: 'kpn-thulir', distance: '5 mins to Singaperumal Koil' },
      { slug: 'sri-ranga-nagar', distance: '12 mins to MWC' },
      { slug: 'kpn-sri-sai-baba-nagar', distance: '10 mins to Maraimalai Nagar / MWC' },
    ],
  },
  {
    name: 'SRM University & Hospital Hub',
    keywords: ['srm', 'srm university', 'srm hospital', 'potheri'],
    description: 'World-renowned medical, engineering, and research campus in Potheri / Kattankulathur.',
    projectSlugs: [
      { slug: 'dgm-monica-residency', distance: '8 mins (5 Kms)' },
      { slug: 'avp-kanagam-avenue', distance: '10 mins (6.5 Kms)' },
      { slug: 'kpn-omega-town', distance: '10 mins (7 Kms)' },
    ],
  },
];

export function resolveLandmarkIntent(userMessage: string): LandmarkResult {
  const text = userMessage.toLowerCase().trim();

  // Check if near/proximity/distance/landmark query
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

    if (matchesLandmark && (hasProximityWords || text.includes('project') || text.includes('property') || text.includes('home'))) {
      const nearbyList = lm.projectSlugs
        .map((item) => {
          const proj = projectsData.find((p) => p.slug === item.slug);
          if (!proj) return null;
          return {
            name: proj.name,
            distance: item.distance,
            slug: proj.slug,
            budget: proj.budget,
            type: proj.type,
            image: proj.image,
          };
        })
        .filter(Boolean) as any[];

      let reply = `Here are our verified projects closest to **${lm.name}**:\n\n`;
      nearbyList.forEach((p) => {
        reply += `• **${p.name}** (${p.type}) — **${p.distance}**\n`;
        reply += `  - Starting from: **${p.budget}**\n\n`;
      });
      reply += `These projects offer high capital appreciation and rental yield due to rapid infrastructure growth. Would you like to schedule a site visit?`;

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
          { label: '📅 Book Free Site Visit', query: `I want to visit projects near ${lm.name}` },
          { label: '🏢 View All Projects', query: 'open projects page' },
          { label: '💰 Check Loan EMI', query: 'What is the EMI for 25 Lakhs loan?' },
        ],
      };
    }
  }

  return { isLandmarkQuery: false, reply: '' };
}
