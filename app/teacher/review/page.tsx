'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Send, 
  User, 
  GraduationCap, 
  MessageSquare, 
  Star, 
  AlertCircle,
  Plus,
  X,
  CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAppStore } from '@/lib/store';
import { type Student, type Update, type TimelineEvent } from '@/lib/mock-data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function TeacherReviewPage() {
  const router = useRouter();
  const { students, addUpdate, addTimelineEvent, updateStudentSkills, messages, currentUser } = useAppStore();

  // Calculate unread messages for teacher
  const teacherMessages = messages.filter(m => m.receiverId === currentUser?.phone);
  
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '');
  const [category, setCategory] = useState<'academic' | 'behavior' | 'achievement'>('academic');
  const [message, setMessage] = useState('');
  const [strength, setStrength] = useState('');
  const [weakness, setWeakness] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const student = students.find(s => s.id === selectedStudent);
    if (!student) return;

    // Add to Recent Updates Feed
    const newUpdate: Update = {
      id: Date.now().toString(),
      teacherName: currentUser?.name || 'Teacher', 
      subject: category === 'academic' ? 'Mathematics' : 'General',
      message: message,
      time: 'Just now',
      type: category === 'academic' ? 'progress' : 'behavior',
      studentId: selectedStudent
    };

    // Add to Timeline
    const newTimelineEvent: TimelineEvent = {
      id: `t-${Date.now()}`,
      studentId: selectedStudent,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Update`,
      description: message,
      type: category,
      icon: category === 'achievement' ? 'star' : category === 'behavior' ? 'heart' : 'book'
    };

    addUpdate(newUpdate);
    addTimelineEvent(newTimelineEvent);
    
    if (strength || weakness) {
      updateStudentSkills(selectedStudent, strength, weakness);
    }

    setTimeout(() => {
      setIsSubmitted(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <DashboardHeader title="Submit Review" />

      <main className="max-w-2xl mx-auto px-6 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">Teacher Portal</h2>
              <p className="text-sm text-slate-500 font-medium">Share student progress with parents</p>
            </div>
            <div className="relative group cursor-pointer" onClick={() => router.push('/messages')}>
              <div className="w-12 h-12 bg-teacher/10 rounded-2xl flex items-center justify-center text-teacher group-hover:bg-teacher group-hover:text-white transition-all">
                <MessageSquare className="w-6 h-6" />
              </div>
              {teacherMessages.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-nepal-red text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {teacherMessages.length}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-teacher" />
                Select Student
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {students.map(student => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => setSelectedStudent(student.id)}
                    className={cn(
                      "flex flex-col items-center p-3 rounded-2xl border-2 transition-all",
                      selectedStudent === student.id 
                        ? "bg-teacher/5 border-teacher ring-4 ring-teacher/10" 
                        : "bg-white border-slate-100 hover:border-teacher/20"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden mb-2 ring-2 ring-white shadow-sm">
                      <img src={student.image} alt={student.name} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold text-center",
                      selectedStudent === student.id ? "text-teacher" : "text-slate-500"
                    )}>{student.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Star className="w-4 h-4 text-teacher" />
                Review Category
              </label>
              <div className="flex flex-wrap gap-2">
                {(['academic', 'behavior', 'achievement'] as const).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border-2",
                      category === cat 
                        ? "bg-teacher text-white border-teacher shadow-lg shadow-teacher/20" 
                        : "bg-white text-slate-500 border-slate-100 hover:border-teacher/20"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teacher" />
                Feedback Message
              </label>
              <textarea 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the student's progress or observation..."
                className="w-full min-h-[160px] p-5 rounded-3xl border-2 border-slate-100 bg-white focus:outline-none focus:border-teacher focus:ring-4 focus:ring-teacher/10 transition-all text-sm leading-relaxed"
              ></textarea>
            </div>

            {/* Strength/Weakness Update (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-3">
                 <label className="text-xs font-bold text-slate-500">Update Strength (Optional)</label>
                 <div className="relative">
                   <input 
                    type="text" 
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    placeholder="e.g. Science" 
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-white text-xs focus:border-teacher focus:outline-none" 
                   />
                   <Plus className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 </div>
               </div>
               <div className="space-y-3">
                 <label className="text-xs font-bold text-slate-500">Update Area to Improve</label>
                 <div className="relative">
                   <input 
                    type="text" 
                    value={weakness}
                    onChange={(e) => setWeakness(e.target.value)}
                    placeholder="e.g. Focus" 
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-white text-xs focus:border-nepal-red focus:outline-none" 
                   />
                   <Plus className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button 
                type="submit"
                disabled={isSubmitted}
                className="flex-1 bg-teacher text-white py-4 rounded-2xl font-bold shadow-xl shadow-teacher/20 hover:bg-teacher-hover transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitted ? <CheckCircle2 className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
                {isSubmitted ? 'Sent Successfully' : 'Submit Review'}
              </button>
              <button 
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 bg-teacher rounded-full flex items-center justify-center text-white mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Review Submitted</h3>
              <p className="text-slate-500 text-center">The parents will be notified <br />immediately.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
