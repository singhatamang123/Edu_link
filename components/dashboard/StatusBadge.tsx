'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type StatusType = 'positive' | 'attention' | 'neutral';

interface StatusBadgeProps {
  type: StatusType;
  text: string;
}

export const StatusBadge = ({ type, text }: StatusBadgeProps) => {
  const configs = {
    positive: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      icon: CheckCircle2
    },
    attention: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      icon: AlertCircle
    },
    neutral: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-100',
      icon: Info
    }
  };

  const { bg, text: textColor, border, icon: Icon } = configs[type];

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider",
      bg, textColor, border
    )}>
      <Icon className="w-3 h-3" />
      {text}
    </div>
  );
};
