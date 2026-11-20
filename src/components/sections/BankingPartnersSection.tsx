'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface BankingPartner {
  id: string;
  name: string;
  component: () => React.JSX.Element;
}

const bankingPartners: BankingPartner[] = [
  {
    id: 'lic-hfl',
    name: 'LIC Housing Finance Ltd',
    component: function LicHflLogo() {
      return (
        <div className="flex flex-col items-center justify-center select-none">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 60 50" className="h-8 w-10 fill-[#0e3e7e]" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 2 L56 22 H48 V46 H12 V22 H4 Z" fill="#0e3e7e" />
                <path d="M30 14 C32 18 34 22 30 27 C26 22 28 18 30 14 Z" fill="#ffffff" />
                <path d="M22 28 C24 35 36 35 38 28 C36 38 24 38 22 28 Z" fill="#ffffff" />
                <path d="M18 24 C16 32 24 40 30 42 C36 40 44 32 42 24 C38 32 32 35 30 35 C28 35 22 32 18 24 Z" fill="#ffffff" />
              </svg>
              <span className="text-[6px] font-bold text-[#0e3e7e] leading-none mt-0.5 tracking-tight">योगक्षेमं वहाम्यहम्</span>
            </div>
            <div className="bg-[#fcd206] px-2.5 py-1 rounded-sm border border-[#0e3e7e]/20 shadow-xs flex items-center justify-center">
              <span className="text-[17px] font-black tracking-tight text-[#0e3e7e]">LIC HFL</span>
            </div>
          </div>
          <span className="text-[7.5px] font-bold text-[#0e3e7e] tracking-wider mt-1 uppercase whitespace-nowrap">
            LIC HOUSING FINANCE LTD
          </span>
        </div>
      );
    },
  },
  {
    id: 'tata-capital',
    name: 'Tata Capital Housing Finance',
    component: function TataCapitalLogo() {
      return (
        <div className="bg-[#0b5fa5] px-3.5 py-2 rounded-md shadow-xs flex flex-col justify-center min-w-[150px] select-none">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-white text-[14px] font-black tracking-wider uppercase">TATA</span>
            <span className="text-white text-[14px] font-extrabold tracking-wide uppercase">CAPITAL</span>
          </div>
          <div className="h-[2px] w-full bg-[#fed100] my-1 rounded-full" />
          <span className="text-white text-[10.5px] font-medium tracking-tight whitespace-nowrap">
            Housing Finance
          </span>
        </div>
      );
    },
  },
  {
    id: 'sbi',
    name: 'SBI Home Loans',
    component: function SbiHomeLoansLogo() {
      return (
        <div className="flex items-center gap-2 px-1 select-none">
          <svg viewBox="0 0 100 100" className="h-9 w-9 shrink-0">
            <circle cx="50" cy="50" r="48" fill="#00a5db" />
            <circle cx="50" cy="40" r="14" fill="#ffffff" />
            <rect x="45" y="40" width="10" height="40" fill="#ffffff" />
          </svg>
          <span className="text-[23px] font-black tracking-tight text-[#1b2559]">SBI</span>
          <div className="h-8 w-[1.5px] bg-[#1b2559]/70 mx-0.5" />
          <div className="flex flex-col text-[#1b2559] leading-[1.05]">
            <span className="text-[12px] font-black tracking-wide">HOME</span>
            <span className="text-[12px] font-black tracking-wide">LOANS</span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'piramal',
    name: 'Piramal Finance',
    component: function PiramalFinanceLogo() {
      return (
        <div className="bg-[#0f3d63] px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-2.5 min-w-[145px] select-none">
          <svg viewBox="0 0 40 40" className="h-7 w-7 shrink-0 fill-none stroke-white stroke-[2.5]" strokeLinecap="round">
            <path d="M20 20 C20 10 28 8 30 8 C30 16 24 19 20 20" />
            <path d="M20 20 C30 20 32 28 32 30 C24 30 21 24 20 20" />
            <path d="M20 20 C20 30 12 32 10 32 C10 24 16 21 20 20" />
            <path d="M20 20 C10 20 8 12 8 10 C16 10 19 16 20 20" />
          </svg>
          <div className="flex flex-col text-white leading-tight">
            <span className="text-[15px] font-bold tracking-tight font-serif">Piramal</span>
            <span className="text-[10.5px] font-normal tracking-wide text-slate-200">Finance</span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    component: function AxisBankLogo() {
      return (
        <div className="flex items-center gap-2 px-1 select-none">
          <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0 fill-[#861f41]">
            <path d="M20 4 L4 36 H14 L20 22 L26 36 H36 Z" />
            <path d="M20 12 L14 26 H26 Z" fill="#ffffff" />
          </svg>
          <span className="text-[#861f41] text-[18px] font-black tracking-tight whitespace-nowrap">AXIS BANK</span>
        </div>
      );
    },
  },
  {
    id: 'sundaram',
    name: 'Sundaram Home',
    component: function SundaramHomeLogo() {
      return (
        <div className="flex items-center gap-1.5 px-1 select-none">
          <div className="flex items-center justify-center">
            <span className="text-[#0f4c81] text-[24px] font-black lowercase tracking-tighter italic leading-none">sf</span>
          </div>
          <div className="h-7 w-[1.5px] bg-slate-300 mx-0.5" />
          <div className="flex flex-col text-slate-800 leading-tight">
            <span className="text-[12px] font-black tracking-tight uppercase text-[#0f4c81] whitespace-nowrap">SUNDARAM HOME</span>
            <span className="text-[7.5px] font-medium tracking-tight text-slate-500 whitespace-nowrap">— Sundaram Finance Group —</span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    component: function HdfcBankLogo() {
      return (
        <div className="flex items-center gap-0 rounded-sm overflow-hidden shadow-xs select-none">
          <div className="h-9 w-9 bg-white border border-slate-200 flex items-center justify-center p-1 relative shrink-0">
            <div className="absolute inset-1 border-[1.5px] border-[#ed232a]" />
            <div className="h-3.5 w-3.5 bg-[#004c8f] relative z-10" />
          </div>
          <div className="h-9 bg-[#004c8f] px-3 flex items-center justify-center">
            <span className="text-white text-[14px] font-black tracking-wide whitespace-nowrap">HDFC BANK</span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'icici-hfc',
    name: 'ICICI Home Finance',
    component: function IciciHomeFinanceLogo() {
      return (
        <div className="flex items-center gap-2 px-1 select-none">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#9b2226] to-[#e35205] flex items-center justify-center text-white font-serif font-black italic text-base shadow-xs shrink-0">
            i
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13.5px] font-black italic text-[#0f356d] tracking-tight whitespace-nowrap">
              ICICI Home Finance
            </span>
            <span className="text-[8px] font-medium text-slate-500 tracking-tight whitespace-nowrap">
              www.icicihfc.com
            </span>
          </div>
        </div>
      );
    },
  },
];

export default function BankingPartnersSection() {
  const duplicatedBankingPartners = useMemo(
    () => [...bankingPartners, ...bankingPartners],
    []
  );

  return (
    <section className="relative w-full overflow-hidden bg-white pb-16 pt-12 border-b border-slate-100">
      {/* Top subtle divider matching the design */}
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="border-t border-slate-200/80" />
      </div>

      {/* Heading */}
      <div className="pt-12 pb-4 text-center px-4">
        <h3
          className="
            text-3xl
            sm:text-4xl
            md:text-[42px]
            font-bold
            tracking-tight
            text-[#1f2462]
            font-serif
          "
        >
          Our Banking Partners
        </h3>
        <p className="mt-3 text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto">
          Approved by leading banks and financial institutions for hassle-free home loan approvals
        </p>
      </div>

      {/* =====================================================
          CONTINUOUS LOGO MARQUEE (EXACTLY AS BEFORE)
          RIGHT → LEFT (Hardware-accelerated CSS marquee)
      ===================================================== */}
      <div className="mt-10 w-full overflow-hidden py-4">
        <div
          className="flex w-max items-center gap-12 pr-12 md:gap-16 md:pr-16 animate-marquee hover:[animation-play-state:paused]"
          style={{ animationDuration: '28s' }}
        >
          {duplicatedBankingPartners.map((bank, index) => {
            const LogoComponent = bank.component;
            return (
              <div
                key={`${bank.id}-${index}`}
                className="flex h-20 min-w-[180px] shrink-0 items-center justify-center transition-transform duration-300 hover:scale-105"
                title={bank.name}
              >
                <LogoComponent />
              </div>
            );
          })}
        </div>
      </div>

      {/* Spacing */}
      <div className="h-8" />
    </section>
  );
}
