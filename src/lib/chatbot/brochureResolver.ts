import { BotAction, BrochureDetails, QuickChip } from './types';

export interface BrochureResult {
  isBrochureQuery: boolean;
  reply: string;
  action?: BotAction;
  quickChips?: QuickChip[];
  showLeadForm?: boolean;
}

interface BrochureEntry {
  projectName: string;
  keywords: string[];
  brochureUrl: string;
  title: string;
  description: string;
}

const AVAILABLE_BROCHURES: BrochureEntry[] = [
  {
    projectName: 'DGM Monica Residency',
    keywords: ['monica', 'dgm', 'monica residency', 'dgm monica'],
    brochureUrl: '/brouchure/DGM Monika Brouchure (4).pdf',
    title: 'DGM Monica Residency - Official Brochure & Floor Plans',
    description: '1 & 2 BHK ready-to-move apartments in Guduvanchery / Urapakkam.',
  },
  {
    projectName: 'KPN Marvel Township',
    keywords: ['marvel', 'marvel township', 'kpn marvel'],
    brochureUrl: '/brouchure/Marvel Township Broucher.pdf',
    title: 'KPN Marvel Township - Layout Plan & Brochure',
    description: 'DTCP & RERA approved premium plots in Urapakkam starting at ₹2,799/Sq.Ft.',
  },
  {
    projectName: 'AVP Kanagam Avenue',
    keywords: ['kanagam avenue', 'avp kanagam avenue', 'kanagam'],
    brochureUrl: '/brouchure/AVP Kanagam Avenue Brouchure (1).pdf',
    title: 'AVP Kanagam Avenue - Masterplan & Brochure',
    description: 'Premium CMDA & RERA approved residential plots in Guduvanchery off GST Road.',
  },
  {
    projectName: 'AVP Kanagam Nagar',
    keywords: ['kanagam nagar', 'avp kanagam nagar', 'kalivanthapattu'],
    brochureUrl: '/brouchure/AVP Kanagam Nagar - 4 Side.pdf',
    title: 'AVP Kanagam Nagar - Layout & Location Map',
    description: 'RERA approved ready-to-construct plots in Maraimalai Nagar.',
  },
  {
    projectName: 'Sri Bhavai Amman Nagar II',
    keywords: ['bhavai amman', 'sri bhavai amman', 'sban'],
    brochureUrl: '/brouchure/SBAN-II-Brochure - 4Side.pdf',
    title: 'Sri Bhavai Amman Nagar II - Official Brochure',
    description: 'Prime residential plots in Urapakkam near Karanai Puducherry.',
  },
  {
    projectName: 'Sri Ranga Nagar',
    keywords: ['ranga nagar', 'sri ranga nagar', 'nenmeli', 'chengalpattu plots'],
    brochureUrl: '/brouchure/SriRangaNagar-4-Page.pdf',
    title: 'Sri Ranga Nagar - Project Brochure & Floor Plan',
    description: 'Approved plots in Nenmeli / Chengalpattu near Mahindra World City.',
  },
  {
    projectName: 'KPN Blue Meadows',
    keywords: ['blue meadows', 'kpn blue meadows'],
    brochureUrl: '/brouchure/KPN Blue Meadows - Brochure.pdf',
    title: 'KPN Blue Meadows - Township Layout & Details',
    description: 'Gated township layout with blacktop roads and full infrastructure.',
  },
];

export function resolveBrochureIntent(userMessage: string): BrochureResult {
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

  // 1. Check if user specified a particular project
  for (const b of AVAILABLE_BROCHURES) {
    const matchesProject = b.keywords.some((kw) => text.includes(kw));
    if (matchesProject) {
      return {
        isBrochureQuery: true,
        reply:
          `Here is the official **${b.projectName}** project brochure!\n\n` +
          `You can download the full PDF below to view approved layout maps, floor plans, specifications, and location advantages.`,
        action: {
          type: 'DOWNLOAD_BROCHURE',
          brochureDetails: {
            projectName: b.projectName,
            brochureUrl: b.brochureUrl,
            title: b.title,
          },
        },
        showLeadForm: true,
        quickChips: [
          { label: '📅 Book Free Site Visit', query: `I want to visit ${b.projectName}` },
          { label: '💰 Check Loan EMI', query: 'What is the EMI for 25 Lakhs loan?' },
          { label: '🏢 View All Projects', query: 'open projects page' },
        ],
      };
    }
  }

  // 2. If general request e.g. "send me brochure" or "download brochure"
  return {
    isBrochureQuery: true,
    reply:
      `We have official **PDF Brochures & Floor Plans** available for instant download for all our signature projects:\n\n` +
      `• **DGM Monica Residency** (Apartments in Guduvanchery)\n` +
      `• **KPN Marvel Township** (Plots in Urapakkam)\n` +
      `• **AVP Kanagam Avenue** (Plots in Guduvanchery off GST Rd)\n` +
      `• **Sri Bhavai Amman Nagar II** (Plots in Urapakkam)\n` +
      `• **Sri Ranga Nagar** (Plots in Nenmeli / Chengalpattu)\n\n` +
      `Which project brochure would you like to download?`,
    quickChips: [
      { label: '📄 DGM Monica Brochure', query: 'download brochure for Monica Residency' },
      { label: '📄 Marvel Township Brochure', query: 'download brochure for Marvel Township' },
      { label: '📄 AVP Kanagam Brochure', query: 'download brochure for Kanagam Avenue' },
      { label: '📅 Book Free Site Visit', query: 'I want to book a free site visit' },
    ],
  };
}
