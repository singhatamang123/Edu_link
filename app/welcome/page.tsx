'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  MessageSquare, 
  TrendingUp, 
  ChevronRight,
  Globe,
  Bell
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const slides = [
  {
    icon: Bell,
    title: "Real-time Updates",
    description: "Get instant notifications from teachers about your child's activities and academic progress.",
    color: "bg-parent"
  },
  {
    icon: TrendingUp,
    title: "Track Growth",
    description: "Visualize strengths and identify areas for improvement with detailed progress charts.",
    color: "bg-emerald-500"
  },
  {
    icon: MessageSquare,
    title: "Direct Connection",
    description: "Message teachers directly for any concerns, questions, or updates about your child.",
    color: "bg-amber-500"
  }
];

export default function WelcomePage() {
  const router = useRouter();
  const { completeOnboarding, currentUser, setLanguage, language } = useAppStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = async () => {

    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      await completeOnboarding();
      router.push('/dashboard');
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-8 py-6">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 tracking-wider uppercase"
        >
          <Globe className="w-3.5 h-3.5" />
          {language === 'en' ? 'नेपाली' : 'English'}
        </button>
        <button 
          onClick={async () => { await completeOnboarding(); router.push('/dashboard'); }}
          className="text-slate-400 font-bold text-xs uppercase tracking-widest"
        >
          Skip
        </button>
      </div>

      <main className="flex-1 flex flex-col px-10 items-center justify-center text-center max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="space-y-10 w-full"
          >
            <div className={cn(
              "w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl transition-all",
              slides[currentSlide].color
            )}>
              {React.createElement(slides[currentSlide].icon, { className: "w-10 h-10" })}
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {slides[currentSlide].title}
              </h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                {slides[currentSlide].description}
              </p>


            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="flex gap-2 mt-12">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                currentSlide === idx ? "w-8 bg-parent" : "w-2 bg-slate-200"
              )}
            />
          ))}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="p-10 flex flex-col items-center gap-6">
        <button 
          onClick={handleNext}
          className="w-full max-w-xs bg-slate-900 text-white py-5 rounded-[2rem] font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        

      </footer>
    </div>
  );
}
