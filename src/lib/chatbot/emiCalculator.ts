import { BotAction, EmiDetails, QuickChip } from './types';

export interface EmiResult {
  isEmiQuery: boolean;
  reply: string;
  action?: BotAction;
  quickChips?: QuickChip[];
  showLeadForm?: boolean;
}

/**
 * Calculates monthly EMI, total interest, and total payable
 */
export function calculateEmi(
  loanAmountLakhs: number,
  tenureYears: number = 20,
  annualInterestRate: number = 8.5
): EmiDetails {
  const principal = loanAmountLakhs * 100000;
  const monthlyRate = annualInterestRate / (12 * 100);
  const totalMonths = tenureYears * 12;

  const emiFactor = Math.pow(1 + monthlyRate, totalMonths);
  const monthlyEmi = Math.round((principal * monthlyRate * emiFactor) / (emiFactor - 1));

  const totalPayable = monthlyEmi * totalMonths;
  const totalInterest = totalPayable - principal;

  return {
    loanAmountLakhs,
    tenureYears,
    interestRate: annualInterestRate,
    monthlyEmi,
    totalInterestLakhs: parseFloat((totalInterest / 100000).toFixed(2)),
    totalPayableLakhs: parseFloat((totalPayable / 100000).toFixed(2)),
  };
}

/**
 * Checks if user message is asking for EMI or loan calculation
 */
export function resolveEmiIntent(userMessage: string): EmiResult {
  const text = userMessage.toLowerCase().trim();

  const isEmiQuery =
    text.includes('emi') ||
    text.includes('loan') ||
    text.includes('mortgage') ||
    text.includes('monthly payment') ||
    text.includes('monthly installment') ||
    text.includes('interest rate');

  if (!isEmiQuery) {
    return { isEmiQuery: false, reply: '' };
  }

  // Extract loan amount in Lakhs (default: 25 Lakhs if not specified)
  let loanLakhs = 25;
  const amountMatch = text.match(/([0-9.]+)\s*(?:l|lakh|lakhs|lac|lacs)/);
  if (amountMatch) {
    const val = parseFloat(amountMatch[1]);
    if (val > 0 && val < 500) {
      loanLakhs = val;
    }
  } else {
    // Check raw rupee amount like 2000000
    const rawNum = text.match(/([0-9]{6,8})/);
    if (rawNum) {
      loanLakhs = parseFloat(rawNum[1]) / 100000;
    }
  }

  // Extract tenure in years (default: 20 years)
  let tenureYears = 20;
  const tenureMatch = text.match(/([0-9]{1,2})\s*(?:year|years|yr|yrs)/);
  if (tenureMatch) {
    const yrs = parseInt(tenureMatch[1], 10);
    if (yrs >= 1 && yrs <= 30) {
      tenureYears = yrs;
    }
  }

  const emiData = calculateEmi(loanLakhs, tenureYears, 8.5);

  const reply =
    `Here is your estimated **Home Loan EMI calculation** for **₹${loanLakhs} Lakhs**:\n\n` +
    `• **Monthly EMI**: **₹${emiData.monthlyEmi.toLocaleString('en-IN')} / month**\n` +
    `• **Loan Tenure**: ${tenureYears} Years (${tenureYears * 12} months)\n` +
    `• **Estimated Interest Rate**: 8.5% p.a. (SBI / HDFC standard rate)\n` +
    `• **Total Interest Payable**: ₹${emiData.totalInterestLakhs} Lakhs\n` +
    `• **Total Amount Payable**: ₹${emiData.totalPayableLakhs} Lakhs\n\n` +
    `🏦 **Bank Loan Assistance:**\n` +
    `KPN Promoters provides up to **80% - 90% bank loan approval assistance** through our partner banks (SBI, HDFC, LIC HFL, Axis Bank, and ICICI). Our team handles all documentation for you!\n\n` +
    `Would you like our loan specialist to check your home loan eligibility?`;

  return {
    isEmiQuery: true,
    reply,
    action: {
      type: 'CALCULATE_EMI',
      emiDetails: emiData,
    },
    showLeadForm: true,
    quickChips: [
      { label: '💰 EMI for ₹20 Lakhs', query: 'What is the EMI for 20 Lakhs loan?' },
      { label: '💰 EMI for ₹35 Lakhs', query: 'What is the EMI for 35 Lakhs loan?' },
      { label: '🏢 View ₹19L Homes', query: 'Show me apartments under 35 Lakhs' },
      { label: '📅 Book Free Site Visit', query: 'I want to book a free site visit' },
    ],
  };
}
