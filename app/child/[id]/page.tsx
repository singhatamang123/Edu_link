'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Calendar, 
  Award, 
  Heart, 
  Book, 
  Edit3, 
  FlaskConical,
  Star,
  Activity,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { type TimelineEvent } from '@/lib/mock-data';
import { BottomNav } from '@/components/layout/BottomNav';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'star': return <Star className="w-5 h-5" />;
    case 'heart': return <Heart className="w-5 h-5" />;
    case 'edit': return <Edit3 className="w-5 h-5" />;
    case 'book': return <Book className="w-5 h-5" />;
    case 'flask': return <FlaskConical className="w-5 h-5" />;
    default: return <Book className="w-5 h-5" />;
  }
};

const getTypeStyles = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'achievement': return 'bg-amber-100 text-amber-600 border-amber-200';
    case 'behavior': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
    case 'academic': return 'bg-parent/10 text-parent border-parent/20';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

export default function ChildProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  
  const { students, timeline: allTimeline } = useAppStore();
  const student = students.find(s => s.id === studentId) || students[0];
  const timeline = allTimeline.filter(e => e.studentId === studentId);

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header Profile Section */}
      <section className="relative h-72 sm:h-80 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-parent/40 to-slate-900 z-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-parent/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-30 p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2.5rem] bg-white p-1 shadow-2xl"
            >
              <div className="w-full h-full rounded-[2.25rem] overflow-hidden bg-slate-100">
                <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{student.name}</h1>
              <p className="text-slate-300 font-medium">{student.grade} • {student.section}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance</p>
                <p className="text-lg font-bold text-emerald-400">{student.attendance}</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Points</p>
                <p className="text-lg font-bold text-amber-400">1,240</p>
             </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 pt-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Left Column: Skills & Info */}
        <div className="md:col-span-4 space-y-8">
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-parent" />
              Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {student.strengths.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-nepal-red" />
              Areas to Improve
            </h3>
            <div className="flex flex-wrap gap-2">
              {student.weaknesses.map((w, i) => (
                <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-100">
                  {w}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
             <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">Teacher Contact</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
             </div>
             <p className="text-xs text-slate-500">Regular contact with Mrs. Sharma (Grade Teacher)</p>
             <button className="w-full py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Message Teacher <ArrowUpRight className="w-4 h-4" />
             </button>
          </section>
        </div>

        {/* Right Column: Timeline */}
        <div className="md:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Education Timeline</h3>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Calendar className="w-4 h-4" />
              Term 1, 2026
            </div>
          </div>

          <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:left-[15px] before:w-0.5 before:bg-slate-100 before:z-0">
            {timeline.map((event, idx) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative z-10"
              >
                <div className={cn(
                  "absolute -left-8 top-0 w-8 h-8 rounded-xl border-4 border-white flex items-center justify-center z-20",
                  getTypeStyles(event.type)
                )}>
                  {getIcon(event.icon)}
                </div>
                
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.date}</span>
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                      getTypeStyles(event.type)
                    )}>
                      {event.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{event.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
