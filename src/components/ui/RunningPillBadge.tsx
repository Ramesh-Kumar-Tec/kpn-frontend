'use client';

import { motion } from 'framer-motion';

interface RunningPillBadgeProps {
  /** The text to display in the ticker badge (e.g. "WHO WE ARE") */
  text: string;
  /** Separator between repeated items (default: "-") */
  separator?: string;
  /** Animation speed / duration in seconds per full cycle (default: 8) */
  speed?: number;
  /** Color theme variant: 'light' (white bg, dark text) or 'dark' (black bg, white text) */
  variant?: 'light' | 'dark';
  /** Custom additional styling for the outer pill container */
  className?: string;
}

export default function RunningPillBadge({
  text,
  separator = '-',
  speed,
  variant = 'light',
  className = '',
}: RunningPillBadgeProps) {
  // Repeat the text 4 times in one set so there is always continuous content flowing
  const items = [text, text, text];

  const isDark = variant === 'dark';

  // Automatically normalize the scroll speed so longer phrases don't scroll too fast
  // Standard speed: ~14 characters completes in ~8s. Longer phrases scale duration proportionally.
  const animationDuration = speed ?? Math.max(8, Math.round((text.length / 14) * 8 * 10) / 10);

  const renderItemSet = () => (
    <div className="flex items-center gap-3 pr-3 shrink-0">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-3 whitespace-nowrap">
          <span>{item}</span>
          <span className={isDark ? "text-[#f12131] font-bold" : "text-red-400 font-normal"}>{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`
        inline-flex
        items-center
        overflow-hidden
        rounded-full
        border
        border-[#f12131]/80
        h-[34px]
        w-[180px]
        px-3
        shadow-xs
        text-xs
        font-semibold
        uppercase
        tracking-wider
        select-none
        relative
        ${isDark ? 'bg-black text-white' : 'bg-white text-slate-800'}
        ${className}
      `}>
      <motion.div
        className="flex w-max items-center"
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          duration: animationDuration,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {renderItemSet()}
        {renderItemSet()}
      </motion.div>
    </div>
  );
}

