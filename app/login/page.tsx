'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Globe, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, registerWithEmail, setLanguage, language } = useAppStore();
  
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'role' | 'auth'>('role');
  const [role, setRole] = useState<'parent' | 'teacher'>('parent');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (authMode === 'signup' && !formData.fullName) {
      setError('Please enter your full name');
      return;
    }

    setIsLoading(true);

    if (authMode === 'login') {
      const result = await loginWithEmail(formData.email, formData.password);
      setIsLoading(false);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } else {
      const result = await registerWithEmail(formData.email, formData.password, formData.fullName, role);
      setIsLoading(false);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden font-sans">
      {/* Top Banner */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-parent rounded-lg flex items-center justify-center text-white font-bold italic">E</div>
          <span className="font-bold text-slate-800 tracking-tight">EduLink Nepal</span>
        </div>
        <button 
          onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          {language === 'en' ? 'नेपाली' : 'English'}
        </button>
      </div>

      <main className="flex-1 flex flex-col px-8 justify-center max-w-md mx-auto w-full space-y-8">
        <AnimatePresence mode="wait">
          {step === 'role' ? (
            <motion.div 
              key="role"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back!
                </h1>
                <p className="text-slate-500 font-medium">Choose your role to continue</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => { setRole('parent'); setStep('auth'); }}
                  className="group relative flex items-center gap-4 p-5 bg-white border-2 border-slate-100 rounded-3xl hover:border-parent hover:shadow-xl hover:shadow-parent/10 transition-all text-left"
                >
                  <div className="w-14 h-14 bg-parent/10 rounded-2xl flex items-center justify-center text-parent">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">I am a Parent</h3>
                    <p className="text-xs text-slate-500">Track child progress</p>
                  </div>
                  <ChevronRight className="absolute right-6 w-5 h-5 text-slate-300 group-hover:text-parent group-hover:translate-x-1 transition-all" />
                </button>

                <button 
                  onClick={() => { setRole('teacher'); setStep('auth'); }}
                  className="group relative flex items-center gap-4 p-5 bg-white border-2 border-slate-100 rounded-3xl hover:border-teacher hover:shadow-xl hover:shadow-teacher/10 transition-all text-left"
                >
                  <div className="w-14 h-14 bg-teacher/10 rounded-2xl flex items-center justify-center text-teacher">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">I am a Teacher</h3>
                    <p className="text-xs text-slate-500">Manage classroom reports</p>
                  </div>
                  <ChevronRight className="absolute right-6 w-5 h-5 text-slate-300 group-hover:text-teacher group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="auth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <button onClick={() => setStep('role')} className="text-slate-400 font-bold text-xs flex items-center gap-1 mb-4">
                  <ChevronRight className="w-4 h-4 rotate-180" /> Back
                </button>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {authMode === 'login' ? 'Login' : 'Create Account'}
                </h1>
                <p className="text-slate-500 font-medium">
                  {authMode === 'login' 
                    ? `Welcome back, ${role}!` 
                    : `Join us as a ${role} to get started`}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'signup' && (
                  <div className="space-y-1">
                    <input 
                      type="text"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-parent focus:outline-none font-bold text-slate-800 transition-all"
                    />
                  </div>
                )}
                
                <div className="space-y-1">
                  <input 
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-parent focus:outline-none font-bold text-slate-800 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <input 
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-parent focus:outline-none font-bold text-slate-800 transition-all"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-4 rounded-2xl text-xs font-bold border border-rose-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                </button>
              </form>

              <div className="text-center">
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-slate-400 font-bold text-xs hover:text-parent transition-colors"
                >
                  {authMode === 'login' 
                    ? "Don't have an account? Sign Up" 
                    : "Already have an account? Log In"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by Singha Tamang</p>
      </footer>
    </div>
  );
}
