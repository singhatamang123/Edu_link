'use client';

import React from 'react';
import { Home, Users, Bell, MessageSquare, ClipboardList, Settings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, messages, currentUser } = useAppStore();

  const unreadCount = messages.filter(m => m.receiverId === currentUser?.phone).length;

  const parentItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Users, label: 'My Kids', path: '/dashboard' }, // Simplified for now
    { icon: MessageSquare, label: 'Messages', path: '/messages', badge: unreadCount },
    { icon: Settings, label: 'Settings', path: '/dashboard' },
  ];

  const teacherItems = [
    { icon: ClipboardList, label: 'Reviews', path: '/teacher/review' },
    { icon: MessageSquare, label: 'Messages', path: '/messages', badge: unreadCount },
    { icon: Settings, label: 'Settings', path: '/teacher/review' },
  ];

  const navItems = userRole === 'parent' ? parentItems : teacherItems;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-lg border border-slate-100 px-6 py-3 flex justify-between items-center w-[90%] max-w-lg rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
      {navItems.map((item, idx) => {
        const isActive = pathname.startsWith(item.path);
        const colorClass = userRole === 'parent' ? "bg-parent shadow-parent/30" : "bg-teacher shadow-teacher/30";
        const textColorClass = userRole === 'parent' ? "text-parent" : "text-teacher";
        const hoverClass = userRole === 'parent' ? "group-hover:text-parent group-hover:bg-parent/5" : "group-hover:text-teacher group-hover:bg-teacher/5";

        return (
          <button
            key={idx}
            onClick={() => router.push(item.path)}
            className="flex flex-col items-center gap-1 group relative px-2 transition-transform active:scale-90"
          >
            <div className={cn(
              "p-2 rounded-2xl transition-all duration-300",
              isActive ? `${colorClass} text-white shadow-lg` : `text-slate-400 ${hoverClass}`
            )}>
              <item.icon className="w-6 h-6" />
            </div>
            
            {item.badge > 0 && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-nepal-red text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {item.badge}
              </div>
            )}

            <span className={cn(
              "text-[9px] font-bold tracking-tight transition-colors",
              isActive ? textColorClass : "text-slate-400"
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
