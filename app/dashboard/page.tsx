'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plus, 
  MessageCircle, 
  FileText, 
  ChevronRight,
  TrendingUp,
  Star,
  Settings,
  Calendar
} from 'lucide-react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { useAppStore } from '@/lib/store';
import { type Student, type Update } from '@/lib/mock-data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Internal Component: Child Card
const ChildCard = ({ student }: { student: Student }) => {
  const router = useRouter();
  
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(`/child/${student.id}`)}
      className="min-w-[280px] sm:min-w-0 bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex items-center gap-4 group cursor-pointer hover:shadow-md hover:border-parent/20 transition-all"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 ring-4 ring-slate-50">
          <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center">
          <TrendingUp className="w-3 h-3 text-white" />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-900 group-hover:text-parent transition-colors">{student.name}</h3>
        <p className="text-xs text-slate-500 mb-2">{student.grade} • {student.section}</p>
        <StatusBadge type={student.statusType} text={student.status} />
      </div>
    </motion.div>
  );
};

// Internal Component: Update Card
const UpdateCard = ({ update }: { update: Update }) => {
  const students = useAppStore(state => state.students);
  const student = students.find(s => s.id === update.studentId);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-parent/10 flex items-center justify-center text-parent">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{update.teacherName}</h4>
            <p className="text-[10px] font-bold text-parent uppercase tracking-wider">{update.subject}</p>
          </div>
        </div>
        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
          {update.time}
        </span>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed">
        {update.message}
      </p>

      {student && (
        <div className="flex items-center justify-between pt-4 border-t border-dashed border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200">
              <img src={student.image} alt={student.name} />
            </div>
            <span className="text-xs font-bold text-slate-500">Update for {student.name.split(' ')[0]}</span>
          </div>
          <button className="text-parent font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all">
            View Details <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const { students, updates, isLoggedIn, currentUser, logout, userRole, fetchInitialData } = useAppStore();

  // Auth Guard & Initial Data Fetch
  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      fetchInitialData();
    }
  }, [isLoggedIn, router, fetchInitialData]);

  if (!isLoggedIn || !currentUser) return null;

  // Filter students to only show the parent's children (with safety checks)
  const myChildren = userRole === 'parent' && 'childIds' in currentUser 
    ? students.filter(s => currentUser.childIds?.includes(s.id))
    : [];

  const myUpdates = userRole === 'parent' && 'childIds' in currentUser
    ? updates.filter(u => currentUser.childIds?.includes(u.studentId))
    : [];

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <DashboardHeader title="Home Dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column / Top Section: Greetings & Children */}
          <div className="lg:col-span-8 space-y-8">
            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-1"
              >
                <h2 className="text-3xl font-bold text-slate-900">Namaste, {currentUser.name.split(' ')[0]} 👋</h2>
                <p className="text-slate-500 font-medium">Your children are having a great week at school.</p>
              </motion.div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={logout}
                  className="px-4 py-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 font-bold text-xs hover:bg-rose-100 transition-colors"
                >
                  Logout
                </button>
                <button className="hidden sm:flex p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-500 hover:text-parent transition-colors">
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">My Children</h3>
                <button className="text-parent font-bold text-sm hover:underline">View All</button>
              </div>
              
              <div className="flex lg:grid lg:grid-cols-2 gap-4 overflow-x-auto pb-4 lg:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {myChildren.map(student => (
                  <ChildCard key={student.id} student={student} />
                ))}
                <div className="min-w-[140px] sm:min-w-0 bg-slate-100/50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all">
                  <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold">Add Child</span>
                </div>
              </div>
            </section>

            {/* Updates Feed (Large screen) */}
            <section className="hidden lg:block space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Recent Updates</h3>
                <div className="flex gap-2">
                   <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:border-parent transition-all">All Updates</button>
                   <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:border-parent transition-all">Behavior</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {myUpdates.map(update => (
                  <UpdateCard key={update.id} update={update} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column / Side Section: Quick Actions & Feed (Mobile) */}
          <div className="lg:col-span-4 space-y-8">
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                {[
                  { icon: Plus, label: 'Add Observation', color: 'bg-emerald-500', desc: 'Share a strength or milestone' },
                  { icon: MessageCircle, label: 'Message Teacher', color: 'bg-parent', desc: 'Start a conversation' },
                  { icon: FileText, label: 'View Reports', color: 'bg-amber-500', desc: 'Academic & behavior history' },
                ].map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-4 p-3 lg:p-4 bg-white rounded-2xl border border-slate-100 shadow-sm group text-center lg:text-left"
                  >
                    <div className={cn(
                      "w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform shrink-0",
                      action.color
                    )}>
                      <action.icon className="w-6 h-6 lg:w-7 lg:h-7" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] lg:text-sm font-bold text-slate-900 leading-tight">
                        {action.label}
                      </span>
                      <p className="hidden lg:block text-[11px] text-slate-400 font-medium">{action.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Mobile Updates Feed */}
            <section className="lg:hidden space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Recent Updates</h3>
                <button className="text-slate-400 font-bold text-xs">View All</button>
              </div>
              <div className="space-y-4">
                {myUpdates.map(update => (
                  <UpdateCard key={update.id} update={update} />
                ))}
              </div>
            </section>

            {/* Upcoming Events / Calendar Placeholder for Desktop */}
            <section className="hidden lg:block bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-bold">Upcoming School Event</h3>
                  <p className="text-slate-400 text-sm">Parent-Teacher Meeting is scheduled for next Friday.</p>
                  <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm shadow-xl shadow-white/10 hover:bg-slate-100 transition-all">
                    Set Reminder
                  </button>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-parent/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
            </section>
          </div>
        </div>
      </main>

      <BottomNav />
      
      {/* Background decoration for desktop */}
      <div className="fixed top-0 right-0 w-[40%] h-screen bg-slate-100/50 -z-10 hidden lg:block" />
    </div>
  );
}
