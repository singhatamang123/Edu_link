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
  const { login, setLanguage, language, hasCompletedOnboarding } = useAppStore();
  
  const [step, setStep] = useState<'role' | 'phone' | 'otp'>('role');
  const [role, setRole] = useState<'parent' | 'teacher'>('parent');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle OTP timer
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = () => {
    if (phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setTimer(30);
    }, 1500);
  };

  const handleVerifyOTP = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setError('Please enter the complete 4-digit OTP');
      return;
    }

    setIsLoading(true);
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      if (enteredOtp === '1234') { // Mock OTP
        const success = login(phoneNumber, role);
        if (success) {
          if (role === 'teacher') {
            router.push('/teacher/review');
          } else if (!hasCompletedOnboarding) {
            router.push('/welcome');
          } else {
            router.push('/dashboard');
          }
        } else {
          setError(`This number is not registered as a ${role} in our records.`);
          setStep('phone');
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden font-sans">
      {/* Top Banner - Language Selection */}
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
          {/* Step 1: Role Selection */}
          {step === 'role' && (
            <motion.div 
              key="role"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Welcome to <span className="text-parent">EduLink</span>
                </h1>
                <p className="text-slate-500 font-medium">Please select your role to continue</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => { setRole('parent'); setStep('phone'); }}
                  className="group relative flex items-center gap-4 p-5 bg-white border-2 border-slate-100 rounded-3xl hover:border-parent hover:shadow-xl hover:shadow-parent/10 transition-all text-left"
                >
                  <div className="w-14 h-14 bg-parent/10 rounded-2xl flex items-center justify-center text-parent group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">I am a Parent</h3>
                    <p className="text-xs text-slate-500">Track child progress & updates</p>
                  </div>
                  <ChevronRight className="absolute right-6 w-5 h-5 text-slate-300 group-hover:text-parent group-hover:translate-x-1 transition-all" />
                </button>

                <button 
                  onClick={() => { setRole('teacher'); setStep('phone'); }}
                  className="group relative flex items-center gap-4 p-5 bg-white border-2 border-slate-100 rounded-3xl hover:border-teacher hover:shadow-xl hover:shadow-teacher/10 transition-all text-left"
                >
                  <div className="w-14 h-14 bg-teacher/10 rounded-2xl flex items-center justify-center text-teacher group-hover:scale-110 transition-transform">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">I am a Teacher</h3>
                    <p className="text-xs text-slate-500">Submit reviews & manage classes</p>
                  </div>
                  <ChevronRight className="absolute right-6 w-5 h-5 text-slate-300 group-hover:text-teacher group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Phone Input */}
          {step === 'phone' && (
            <motion.div 
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <button onClick={() => setStep('role')} className="text-slate-400 font-bold text-xs flex items-center gap-1 mb-4">
                  <ChevronRight className="w-4 h-4 rotate-180" /> Back
                </button>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {role === 'parent' ? 'Parent' : 'Teacher'} Login
                </h1>
                <p className="text-slate-500 font-medium">Enter your registered mobile number</p>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-200 pr-3">
                    <span className="text-sm font-bold text-slate-400">+977</span>
                  </div>
                  <input 
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98XXXXXXXX"
                    className={cn(
                      "w-full pl-20 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:outline-none font-bold text-slate-800 transition-all",
                      role === 'teacher' ? "focus:border-teacher" : "focus:border-parent"
                    )}
                  />
                  <Phone className={cn(
                    "absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 transition-colors",
                    role === 'teacher' ? "group-focus-within:text-teacher" : "group-focus-within:text-parent"
                  )} />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-3 rounded-2xl text-xs font-bold border border-rose-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button 
                  onClick={handleSendOTP}
                  disabled={isLoading || phoneNumber.length < 10}
                  className={cn(
                    "w-full disabled:bg-slate-200 text-white py-5 rounded-[2rem] font-bold shadow-xl transition-all flex items-center justify-center gap-2",
                    role === 'teacher' ? "bg-slate-900 hover:bg-teacher" : "bg-slate-900 hover:bg-parent"
                  )}
                >
                  {isLoading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  Get OTP
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: OTP Verification */}
          {step === 'otp' && (
            <motion.div 
              key="otp"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="space-y-2 text-center">
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4",
                  role === 'teacher' ? "bg-teacher/10 text-teacher" : "bg-parent/10 text-parent"
                )}>
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verify Identity</h1>
                <p className="text-slate-500 font-medium">We've sent a code to <br/> <span className="text-slate-900 font-bold">+977 {phoneNumber}</span></p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="tel"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className={cn(
                        "w-14 h-16 bg-slate-50 border-2 border-transparent rounded-2xl text-center text-2xl font-bold text-slate-900 focus:bg-white focus:outline-none transition-all shadow-sm",
                        role === 'teacher' ? "focus:border-teacher" : "focus:border-parent"
                      )}
                    />
                  ))}
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-rose-500 text-center justify-center font-bold text-xs">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}

                <button 
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                  className={cn(
                    "w-full text-white py-5 rounded-[2rem] font-bold shadow-xl transition-all flex items-center justify-center gap-2",
                    role === 'teacher' ? "bg-teacher shadow-teacher/30 hover:bg-teacher-hover" : "bg-parent shadow-parent/30 hover:bg-parent-dark"
                  )}
                >
                  {isLoading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
                </button>

                <div className="text-center">
                  <button 
                    disabled={timer > 0}
                    onClick={() => { setTimer(30); setOtp(['','','','']); }}
                    className="text-slate-400 font-bold text-xs hover:text-parent transition-colors disabled:opacity-50"
                  >
                    {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive code? Resend"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="py-8 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by Singha Tamang</p>
      </footer>
    </div>
  );
}
