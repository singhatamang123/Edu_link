'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MessageSquare, 
  ChevronRight, 
  User, 
  GraduationCap,
  Clock,
  MoreVertical
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore, REGISTERED_PARENTS, REGISTERED_TEACHERS } from '@/lib/store';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MessagesPage() {
  const router = useRouter();
  const { userRole, messages, currentUser } = useAppStore();

  // Determine who the user can chat with
  const contacts = userRole === 'parent' ? REGISTERED_TEACHERS : REGISTERED_PARENTS;

  const getLatestMessage = (contactPhone: string) => {
    const chatMessages = messages.filter(m => 
      (m.senderId === contactPhone && m.receiverId === currentUser?.phone) ||
      (m.senderId === currentUser?.phone && m.receiverId === contactPhone)
    );
    return chatMessages[chatMessages.length - 1];
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <DashboardHeader title="Messages" />

      <main className="max-w-2xl mx-auto px-6 pt-8 space-y-6">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-parent transition-colors" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:border-parent focus:ring-4 focus:ring-parent/5 transition-all text-sm font-medium"
          />
        </div>

        {/* Chat List */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-parent" />
              Recent Chats
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
              {contacts.length} Contacts
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            {contacts.map((contact, idx) => {
              const latestMsg = getLatestMessage(contact.phone);
              
              return (
                <motion.div 
                  key={contact.phone}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => router.push(`/messages/${contact.phone}`)}
                  className="p-5 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-all active:scale-[0.99] group"
                >
                  <div className="relative shrink-0">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm",
                      userRole === 'parent' ? "bg-teacher/10 text-teacher" : "bg-parent/10 text-parent"
                    )}>
                      {userRole === 'parent' ? <GraduationCap className="w-7 h-7" /> : <User className="w-7 h-7" />}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900 truncate group-hover:text-parent transition-colors">
                        {contact.name}
                      </h4>
                      <span className="text-[10px] font-medium text-slate-400">
                        {latestMsg ? latestMsg.timestamp : 'New'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate font-medium">
                      {latestMsg ? latestMsg.text : (userRole === 'parent' ? `Subject: ${'subjects' in contact ? contact.subjects.join(', ') : ''}` : 'Start a new conversation')}
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-slate-400 transition-colors" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
