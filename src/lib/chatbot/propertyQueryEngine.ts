import { projectsData, ProjectItem } from '@/data/siteData';
import { BotAction, QuickChip } from './types';

export interface PropertyQueryResult {
  isQuery: boolean;
  reply: string;
  matchedProjects: ProjectItem[];
  action?: BotAction;
  quickChips?: QuickChip[];
  showLeadForm?: boolean;
}

/**
 * Extracts numeric Lakhs price from an apartment/villa budget string
 * e.g., "₹ 19L Onwards" -> 19, "₹ 30L Onwards" -> 30, "₹ 1.2 Cr" -> 120
 */
export function extractLakhsFromBudget(budgetStr: string): number | null {
  if (!budgetStr) return null;
  const clean = budgetStr.toLowerCase().replace(/,/g, '');

  // Check Crore format e.g. 1.2 cr
  const crMatch = clean.match(/([0-9.]+)\s*(?:cr|crore|crores)/);
  if (crMatch) {
    return parseFloat(crMatch[1]) * 100;
  }

  // Check Lakh format e.g. 19l, 19 lakhs, 19 lac, 19l onwards
  const lakhMatch = clean.match(/([0-9.]+)\s*(?:l|lakh|lakhs|lac|lacs)/);
  if (lakhMatch) {
    return parseFloat(lakhMatch[1]);
  }

  // Check raw rupee number without L (e.g. 1900000)
  const numMatch = clean.match(/([0-9]{6,8})/);
  if (numMatch) {
    return parseFloat(numMatch[1]) / 100000;
  }

  return null;
}

/**
 * Extracts rate per sqft from plot budget string
 * e.g. "₹ 2799/Sq.Ft" -> 2799, "₹ 999/Sq.Ft" -> 999
 */
export function extractSqFtRate(budgetStr: string): number | null {
  if (!budgetStr) return null;
  const clean = budgetStr.toLowerCase();
  const match = clean.match(/([0-9,.]+)\s*(?:\/|\s*per\s*)sq\.?ft/);
  if (match) {
    return parseFloat(match[1].replace(/,/g, ''));
  }
  return null;
}

interface ParsedCriteria {
  hasFilterIntent: boolean;
  type?: 'Apartments' | 'Plots' | 'Villas';
  maxBudgetLakhs?: number;
  minBudgetLakhs?: number;
  maxSqFtRate?: number;
  bhk?: number;
  location?: string;
  sortBy?: 'price-asc' | 'price-desc';
}

/**
 * Parse user query to detect real estate search parameters
 */
export function parsePropertyCriteria(userMessage: string): ParsedCriteria {
  const text = userMessage.toLowerCase().trim();

  let type: 'Apartments' | 'Plots' | 'Villas' | undefined = undefined;
  if (
    text.includes('apartment') ||
    text.includes('flat') ||
    text.includes('flats') ||
    text.includes('bhk') ||
    text.includes('home') ||
    text.includes('veedu') ||
    text.includes('veedugal') ||
    text.includes('kudiyiruppu')
  ) {
    type = 'Apartments';
  } else if (
    text.includes('plot') ||
    text.includes('plots') ||
    text.includes('land') ||
    text.includes('layout') ||
    text.includes('township') ||
    text.includes('sq.ft') ||
    text.includes('sqft') ||
    text.includes('manai') ||
    text.includes('manaigal') ||
    text.includes('idam')
  ) {
    type = 'Plots';
  } else if (
    text.includes('villa') ||
    text.includes('villas') ||
    text.includes('duplex') ||
    text.includes('independent house') ||
    text.includes('thani veedu')
  ) {
    type = 'Villas';
  }

  // Detect BHK
  let bhk: number | undefined = undefined;
  const bhkMatch = text.match(/([1-4])\s*(?:bhk|bedroom|bed)/);
  if (bhkMatch) {
    bhk = parseInt(bhkMatch[1], 10);
  } else if (text.includes('1 bhk') || text.includes('1bhk') || text.includes('one bhk') || text.includes('oru bhk')) {
    bhk = 1;
  } else if (text.includes('2 bhk') || text.includes('2bhk') || text.includes('two bhk') || text.includes('rendu bhk')) {
    bhk = 2;
  } else if (text.includes('3 bhk') || text.includes('3bhk') || text.includes('three bhk') || text.includes('moonu bhk')) {
    bhk = 3;
  }

  // Detect Location (support suffixes like "urapakkam la", "guduvanchery il")
  let location: string | undefined = undefined;
  const locations = [
    'urapakkam',
    'guduvanchery',
    'maraimalai nagar',
    'singaperumal koil',
    'sp koil',
    'chengalpattu',
    'nenmeli',
    'kilambakkam',
    'vandalur',
  ];
  for (const loc of locations) {
    if (text.includes(loc)) {
      location = loc === 'sp koil' ? 'singaperumal koil' : loc;
      break;
    }
  }

  // Detect Budget in Lakhs
  let maxBudgetLakhs: number | undefined = undefined;
  let minBudgetLakhs: number | undefined = undefined;
  let maxSqFtRate: number | undefined = undefined;

  let sortBy: 'price-asc' | 'price-desc' | undefined;
  if (
    /\b(low\s*to\s*high|lowest\s*to\s*highest|cheapest|cheapest\s*first|most affordable|lowest price|ascending|asc)\b/.test(text)
  ) {
    sortBy = 'price-asc';
  } else if (
    /\b(high\s*to\s*low|highest\s*to\s*lowest|most expensive|highest price|costliest\s*first|descending|desc)\b/.test(text)
  ) {
    sortBy = 'price-desc';
  }

  // Check sqft rate e.g. "under 2000 sqft", "below 1500 per sqft"
  const sqftMatch = text.match(/(?:under|below|less than|upto|within)\s*([0-9,]+)\s*(?:\/|\s*per\s*)?sq\.?ft/);
  if (sqftMatch) {
    maxSqFtRate = parseFloat(sqftMatch[1].replace(/,/g, ''));
  }

  // Check "under 12 L", "below 35 lakhs", "within 20L", "less than 40 lakhs", "< 30l"
  const underMatch = text.match(/(?:under|below|less than|upto|within|max|<|cheap(?:er)? than)\s*([0-9.]+)\s*(?:l|lakh|lakhs|lac|lacs)?/);
  if (underMatch) {
    const val = parseFloat(underMatch[1]);
    // If the number is something reasonable like 10, 12, 19, 35, 50, 80 (Lakhs)
    if (val < 500) {
      maxBudgetLakhs = val;
    } else if (val >= 500000) {
      maxBudgetLakhs = val / 100000;
    }
  }

  // Check "between/inbetween 20 and 40 lakhs" and "from 20L to 40L"
  const betweenMatch = text.match(/(?:between|inbetween|from)\s*([0-9.]+)\s*(?:l|lakh|lakhs|lac|lacs)?\s*(?:and|to|-)\s*([0-9.]+)\s*(?:l|lakh|lakhs|lac|lacs)?/);
  if (betweenMatch) {
    minBudgetLakhs = parseFloat(betweenMatch[1]);
    maxBudgetLakhs = parseFloat(betweenMatch[2]);
  }

  // Check minimum budget questions such as "apartments above 40L" or
  // "plots starting from 2000 per sq.ft".
  if (minBudgetLakhs === undefined && maxBudgetLakhs === undefined) {
    const minimumMatch = text.match(/(?:above|over|more than|at least|starting from|from)\s*([0-9.]+)\s*(?:l|lakh|lakhs|lac|lacs)/);
    if (minimumMatch) {
      minBudgetLakhs = parseFloat(minimumMatch[1]);
    }
  }

  // If no under match, check standalone e.g. "12 l apartments", "12 lakhs flat"
  if (maxBudgetLakhs === undefined && minBudgetLakhs === undefined) {
    const directMatch = text.match(/([0-9.]+)\s*(?:l|lakh|lakhs|lac|lacs)\s*(?:apartment|apartments|flat|flats|home|bhk|budget)?/);
    if (directMatch) {
      const val = parseFloat(directMatch[1]);
      if (val < 500) {
        maxBudgetLakhs = val;
      }
    }
  }

  const hasFilterIntent = Boolean(
    maxBudgetLakhs !== undefined ||
    minBudgetLakhs !== undefined ||
    maxSqFtRate !== undefined ||
    type !== undefined ||
    bhk !== undefined ||
    (location !== undefined && (text.includes('project') || text.includes('house') || text.includes('property') || text.includes('price')))
  );

  return {
    hasFilterIntent,
    type,
    maxBudgetLakhs,
    minBudgetLakhs,
    maxSqFtRate,
    bhk,
    location,
    sortBy,
  };
}

/**
 * Execute real estate search and formulate structured response
 */
export function executePropertyQuery(
  userMessage: string,
  catalog: ProjectItem[] = projectsData
): PropertyQueryResult {
  const criteria = parsePropertyCriteria(userMessage);

  if (!criteria.hasFilterIntent) {
    return { isQuery: false, reply: '', matchedProjects: [] };
  }

  const { type, maxBudgetLakhs, minBudgetLakhs, maxSqFtRate, bhk, location, sortBy } = criteria;

  // Target property category (default to Apartments if budget in Lakhs or BHK mentioned, otherwise all)
  const targetType = type || (maxBudgetLakhs !== undefined || minBudgetLakhs !== undefined || bhk !== undefined ? 'Apartments' : undefined);

  // Filter projects
  const matched = catalog.filter((p) => {
    // Category match
    if (targetType && p.type.toLowerCase() !== targetType.toLowerCase()) {
      return false;
    }

    // Location match
    if (
      location &&
      !p.location.toLowerCase().includes(location) &&
      (!p.address || !p.address.toLowerCase().includes(location))
    ) {
      return false;
    }

    // BHK match
    if (bhk && p.bhk) {
      if (!p.bhk.includes(`${bhk} BHK`)) {
        return false;
      }
    }

    // Budget match for Apartments / Villas
    if ((maxBudgetLakhs !== undefined || minBudgetLakhs !== undefined) && (p.type === 'Apartments' || p.type === 'Villas')) {
      const pLakhs = extractLakhsFromBudget(p.budget);
      if (pLakhs !== null && maxBudgetLakhs !== undefined && pLakhs > maxBudgetLakhs) {
        return false;
      }
      if (minBudgetLakhs !== undefined && pLakhs !== null && pLakhs < minBudgetLakhs) {
        return false;
      }
    }

    // SqFt rate match for Plots
    if (maxSqFtRate !== undefined && p.type === 'Plots') {
      const pRate = extractSqFtRate(p.budget);
      if (pRate !== null && pRate > maxSqFtRate) {
        return false;
      }
    }

    return true;
  });

  if (sortBy) {
    matched.sort((a, b) => {
      const aPrice = extractSqFtRate(a.budget) ?? ((extractLakhsFromBudget(a.budget) ?? Number.POSITIVE_INFINITY) * 100000);
      const bPrice = extractSqFtRate(b.budget) ?? ((extractLakhsFromBudget(b.budget) ?? Number.POSITIVE_INFINITY) * 100000);
      return sortBy === 'price-asc' ? aPrice - bPrice : bPrice - aPrice;
    });
  }

  // =========================================================================
  // CASE 1: MATCHES FOUND (> 0)
  // =========================================================================
  if (matched.length > 0) {
    let reply = '';
    const typeLabel = targetType || 'Properties';
    const budgetLabel = maxBudgetLakhs
      ? minBudgetLakhs
        ? `between ₹${minBudgetLakhs}L and ₹${maxBudgetLakhs}L`
        : `under ₹${maxBudgetLakhs} Lakhs`
      : minBudgetLakhs
        ? `from ₹${minBudgetLakhs} Lakhs`
        : '';
    const locLabel = location ? `in ${location.toUpperCase()}` : '';
    const sortLabel = sortBy === 'price-asc'
      ? 'lowest price first'
      : sortBy === 'price-desc'
        ? 'highest price first'
        : '';

    reply = `Here are our verified **${typeLabel}** ${budgetLabel} ${locLabel}${sortLabel ? `, sorted ${sortLabel}` : ''}:\n\n`;

    matched.forEach((p) => {
      reply += `• **${p.name}** (${p.location})\n`;
      reply += `  - **Type/BHK**: ${p.bhk || p.type}\n`;
      reply += `  - **Price**: ${p.budget}\n`;
      reply += `  - **Status**: ${p.status}\n\n`;
    });

    reply += `Would you like to schedule a **free guided site visit** or explore floor plans for any of these?`;

    return {
      isQuery: true,
      reply,
      matchedProjects: matched,
      action: {
        type: 'FILTER_PROPERTIES',
        filterCriteria: {
          type: targetType as any,
          maxBudgetLakhs,
          minBudgetLakhs,
          bhk: bhk ? [bhk] : undefined,
          location,
        },
      },
      showLeadForm: true,
      quickChips: [
        { label: '🏢 View on Projects Page', query: 'open projects page' },
        { label: '📅 Book Free Site Visit', query: `I want to visit ${matched[0].name}` },
        { label: '📞 Speak with Advisor', query: 'open contact page' },
      ],
    };
  }

  // =========================================================================
  // CASE 2: ZERO MATCHES FOUND (The User's Exact Requirement: "under 12 L apartments")
  // =========================================================================
  if (targetType === 'Apartments' && maxBudgetLakhs !== undefined) {
    // Find the absolute lowest budget apartment dynamically in the live catalog
    const allApts = catalog.filter((p) => p.type === 'Apartments');
    const sortedApts = [...allApts].sort((a, b) => {
      const priceA = extractLakhsFromBudget(a.budget) || 999;
      const priceB = extractLakhsFromBudget(b.budget) || 999;
      return priceA - priceB;
    });

    const lowestApt = sortedApts[0];
    const lowestAptPrice = lowestApt ? (extractLakhsFromBudget(lowestApt.budget) || lowestApt.budget) : null;

    // Find affordable plots that fit within or near the requested budget
    const budgetPlots = catalog.filter((p) => p.type === 'Plots');
    const lowestPlot = budgetPlots.find((p) => p.name.toLowerCase().includes('sai baba')) || budgetPlots[0];

    let reply = `We currently **do not have apartments under ₹${maxBudgetLakhs} Lakhs**.\n\n`;

    if (lowestApt && lowestAptPrice) {
      reply += `🏢 **Our Most Affordable Apartment:**\n` +
        `• **${lowestApt.name}** in ${lowestApt.location} starts at **₹${lowestAptPrice} Lakhs** (${lowestApt.bhk || '1 & 2 BHK'}). It features clear legal titles, bank loan approvals (up to 90%), and modern construction.\n\n`;
    }

    if (lowestPlot) {
      reply += `🏡 **Great Alternative (Approved Plots):**\n` +
        `• If your investment budget is around ₹${maxBudgetLakhs} Lakhs, our **DTCP & RERA Approved Plots** at **${lowestPlot.name}** start at just **${lowestPlot.budget}**! A standard plot totals approximately **₹8 to ₹12 Lakhs**, offering tremendous appreciation potential along GST Road.\n\n`;
    }

    reply += lowestApt
      ? `Would you like to explore **${lowestApt.name}** or view our **Approved Plots**?`
      : `Would you like to browse our available projects or speak with our property advisor?`;

    const matchedAlt = [lowestApt, lowestPlot].filter(Boolean) as ProjectItem[];

    return {
      isQuery: true,
      reply,
      matchedProjects: matchedAlt,
      action: {
        type: 'NOT_FOUND_SUGGEST',
        filterCriteria: {
          type: 'Apartments',
          maxBudgetLakhs,
        },
        suggestedAlternative: lowestApt
          ? `No apartments under ₹${maxBudgetLakhs}L. Nearest is ${lowestApt.name} starting from ₹${lowestAptPrice}L.`
          : undefined,
      },
      showLeadForm: true,
      quickChips: [
        ...(lowestApt ? [{ label: `🏢 View ${lowestApt.name}`, query: `Tell me more about ${lowestApt.name}` }] : []),
        ...(lowestPlot ? [{ label: '🏡 View Budget Plots', query: 'What DTCP and RERA approved plots do you have available?' }] : []),
        { label: '📅 Book Free Site Visit', query: 'I want to book a free site visit' },
      ],
    };
  }

  // General zero-results fallback
  const firstApt = catalog.find((p) => p.type === 'Apartments');
  const firstPlot = catalog.find((p) => p.type === 'Plots');
  const fallbackProjects = [firstApt, firstPlot].filter(Boolean) as ProjectItem[];

  return {
    isQuery: true,
    reply:
      `We could not find active properties matching your exact criteria right now.\n\n` +
      `However, KPN Promoters offers premium **Apartments** and **Approved Plots** in prime locations along GST Road.\n\n` +
      `Would you like to browse all available projects or speak to our property advisor?`,
    matchedProjects: fallbackProjects.length > 0 ? fallbackProjects : catalog.slice(0, 2),
    action: {
      type: 'NOT_FOUND_SUGGEST',
    },
    showLeadForm: true,
    quickChips: [
      { label: '🏢 View All Projects', query: 'open projects page' },
      { label: '🏡 View Plots', query: 'What DTCP and RERA approved plots do you have available?' },
      { label: '📞 Contact Advisor', query: 'open contact page' },
    ],
  };
}
