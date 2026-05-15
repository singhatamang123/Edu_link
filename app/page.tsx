'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export default function RootPage() {
  const router = useRouter();
  const { isLoggedIn, hasCompletedOnboarding } = useAppStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    } else if (!hasCompletedOnboarding) {
      router.push('/welcome');
    } else {
      router.push('/dashboard');
    }
  }, [isLoggedIn, hasCompletedOnboarding, router]);

  return (
    <div className="h-screen w-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-parent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
