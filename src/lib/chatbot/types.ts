import { ProjectItem } from '@/data/siteData';

export type BotActionType =
  | 'NAVIGATE'
  | 'FILTER_PROPERTIES'
  | 'NOT_FOUND_SUGGEST'
  | 'BOOK_VISIT'
  | 'CALCULATE_EMI'
  | 'CALL_ADVISOR'
  | 'DOWNLOAD_BROCHURE';

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
  brochureUrl?: string;
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
  showLeadForm?: boolean;
  action?: BotAction;
  quickChips?: QuickChip[];
}
