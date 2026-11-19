'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

interface EmiCalculatorCardProps {
  initialAmount?: number;
  className?: string;
}

export default function EmiCalculatorCard({
  initialAmount = 2500000,
  className = '',
}: EmiCalculatorCardProps) {
  const [loanAmount, setLoanAmount] = useState<number>(initialAmount);
  const [interestRate, setInterestRate] = useState<number>(9);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // Sync loan amount if initialAmount prop changes (e.g. project changes)
  useEffect(() => {
    if (initialAmount && initialAmount > 0) {
      setLoanAmount(initialAmount);
    }
  }, [initialAmount]);

  // Indian currency formatter (e.g. ₹25,00,000)
  const formatINR = (val: number) => {
    if (isNaN(val) || val < 0) return '0';
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Standard Indian Banking EMI calculation
  const monthlyEmi = useMemo(() => {
    if (!loanAmount || loanAmount <= 0) return 0;
    if (!interestRate || interestRate <= 0) return Math.round(loanAmount / ((tenureYears || 1) * 12));
    if (!tenureYears || tenureYears <= 0) return 0;

    const monthlyRate = interestRate / (12 * 100);
    const totalMonths = tenureYears * 12;
    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    return Math.round(emi);
  }, [loanAmount, interestRate, tenureYears]);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 300);
  };

  return (
    <div
      className={`rounded-[32px] border border-slate-200/90 bg-white p-7 sm:p-9 shadow-sm transition-all ${className}`}
    >
      {/* Header Tagline */}
      <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#f12131] uppercase mb-2">
        <span>PLAN YOUR PURCHASE</span>
      </div>

      {/* Title */}
      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#29247c] tracking-tight">
        Calculate your property EMI.
      </h3>

      {/* Description */}
      <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
        Adjust the loan amount, interest rate and tenure to estimate your monthly repayment. This is
        an indicative calculation, not a loan offer.
      </p>

      {/* Form Inputs */}
      <div className="mt-7 space-y-4">
        {/* Loan Amount Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Loan amount (₹)
          </label>
          <div className="relative">
            <input
              type="number"
              min="100000"
              step="50000"
              value={loanAmount || ''}
              onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
              className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-5 text-sm sm:text-base font-bold text-slate-900 outline-none transition focus:border-[#29247c] focus:bg-white focus:ring-2 focus:ring-[#29247c]/15"
              placeholder="e.g. 2500000"
            />
          </div>
        </div>

        {/* Interest Rate & Tenure 2-Column Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Interest Rate */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Interest rate (% p.a.)
            </label>
            <input
              type="number"
              min="1"
              max="25"
              step="0.1"
              value={interestRate || ''}
              onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
              className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-5 text-sm sm:text-base font-bold text-slate-900 outline-none transition focus:border-[#29247c] focus:bg-white focus:ring-2 focus:ring-[#29247c]/15"
              placeholder="e.g. 9"
            />
          </div>

          {/* Loan Tenure */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Loan tenure (years)
            </label>
            <input
              type="number"
              min="1"
              max="40"
              step="1"
              value={tenureYears || ''}
              onChange={(e) => setTenureYears(Number(e.target.value) || 0)}
              className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-5 text-sm sm:text-base font-bold text-slate-900 outline-none transition focus:border-[#29247c] focus:bg-white focus:ring-2 focus:ring-[#29247c]/15"
              placeholder="e.g. 15"
            />
          </div>
        </div>
      </div>

      {/* Result Box */}
      <div
        className={`mt-6 rounded-2xl border border-[#29247c]/10 bg-gradient-to-br from-[#f8f9ff] to-[#f0f3ff] p-5 sm:p-6 transition-all duration-300 ${
          isRecalculating ? 'scale-[0.99] opacity-80' : 'scale-100 opacity-100'
        }`}
      >
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Estimated monthly EMI
        </p>
        <p className="mt-1.5 text-3xl sm:text-4xl font-extrabold text-[#29247c] tracking-tight">
          ₹{formatINR(monthlyEmi)}
        </p>
        <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-600">
          For ₹{formatINR(loanAmount)} over {tenureYears} years at {interestRate}% p.a.
        </p>
      </div>

      {/* Recalculate Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleRecalculate}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs hover:border-[#29247c] hover:text-[#29247c] hover:bg-slate-50/80 active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className={`h-4 w-4 text-[#f12131] ${isRecalculating ? 'animate-spin' : ''}`} />
          <span>Recalculate EMI</span>
        </button>
      </div>
    </div>
  );
}

