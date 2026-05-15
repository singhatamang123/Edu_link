'use client';

import React from 'react';
import { Bell, Search, BookOpen } from 'lucide-react';

export const DashboardHeader = ({ title = "Home" }: { title?: string }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center justify-center">
      <div className="w-full max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-parent rounded-lg flex items-center justify-center text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 hidden sm:block">EduLink Nepal</span>
        </div>

        <h1 className="text-lg font-bold text-slate-900 hidden sm:block">{title}</h1>
        <h1 className="text-lg font-bold text-slate-900 sm:hidden">EduLink</h1>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-900">Singha Tamang</p>
              <p className="text-[10px] text-slate-500">Parent Account</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Parent" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
