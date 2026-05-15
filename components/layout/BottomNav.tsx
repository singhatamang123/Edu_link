'use client';

import React from 'react';
import { Home, Users, Bell, MessageSquare, MoreHorizontal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Users, label: 'My Kids', active: false },
  { icon: Bell, label: 'Updates', active: false },
  { icon: MessageSquare, label: 'Messages', active: false },
  { icon: MoreHorizontal, label: 'More', active: false },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-lg border border-slate-100 px-6 py-3 flex justify-between items-center w-[90%] max-w-lg rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
      {navItems.map((item, idx) => (
        <button
          key={idx}
          className="flex flex-col items-center gap-1 group relative px-2"
        >
          <div className={cn(
            "p-2 rounded-2xl transition-all duration-300",
            item.active ? "bg-parent text-white shadow-lg shadow-parent/30" : "text-slate-400 group-hover:text-parent group-hover:bg-parent/5"
          )}>
            <item.icon className="w-6 h-6" />
          </div>
          <span className={cn(
            "text-[10px] font-bold tracking-tight transition-colors",
            item.active ? "text-parent" : "text-slate-400"
          )}>
            {item.label}
          </span>
          {item.active && (
            <div className="absolute -bottom-1 w-1 h-1 bg-parent rounded-full" />
          )}
        </button>
      ))}
    </nav>
  );
};
