'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';
import { configureAmplify } from '@/lib/amplify';

configureAmplify();

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        await getCurrentUser();
        router.push('/dashboard');
      } catch {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}