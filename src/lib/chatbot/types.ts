import { ProjectItem } from '@/data/siteData';
import { LiveBlogItem } from './liveKnowledgeService';

export type BotActionType =
  | 'NAVIGATE'
  | 'FILTER_PROPERTIES'
  | 'NOT_FOUND_SUGGEST'
  | 'BOOK_VISIT'
  | 'CALCULATE_EMI'
  | 'CALL_ADVISOR'
  | 'DOWNLOAD_BROCHURE'
  | 'LANDMARK_SEARCH'
  | 'VIEW_BLOG';

export interface EmiDetails {
  loanAmountLakhs: number;
  tenureYears: number;
  interestRate: number;
  monthlyEmi: number;
  totalInterestLakhs: number;
  totalPayableLakhs: number;
}

export interface BrochureDetails {
  projectName: string;
  brochureUrl: string;
  title: string;
}

export interface LandmarkDetails {
  landmarkName: string;
  description: string;
  nearbyProjects: Array<{
    name: string;
    distance: string;
    slug: string;
    budget: string;
    type: string;
    image: string;
  }>;
}

export interface BotAction {
  type: BotActionType;
  url?: string;
  pageTitle?: string;
  description?: string;
  autoRedirect?: boolean;
  filterCriteria?: {
    type?: 'Apartments' | 'Plots' | 'Villas' | 'All';
    maxBudgetLakhs?: number;
    minBudgetLakhs?: number;
    bhk?: number[];
    location?: string;
  };
  suggestedAlternative?: string;
  emiDetails?: EmiDetails;
  brochureDetails?: BrochureDetails;
  landmarkDetails?: LandmarkDetails;
}

export interface QuickChip {
  label: string;
  query: string;
  actionType?: BotActionType;
}

export interface ExtendedChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  recommendedProjects?: ProjectItem[];
  recommendedBlogs?: LiveBlogItem[];
  showLeadForm?: boolean;
  action?: BotAction;
  quickChips?: QuickChip[];
}

