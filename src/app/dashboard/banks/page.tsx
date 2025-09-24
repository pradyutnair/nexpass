'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BankConnectionScreen } from '@/components/banks/BankConnectionScreen';
import { useBankConnection } from '@/hooks/useBankConnection';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BanksPage() {
  const { isLoading, hasConnectedBanks, user } = useBankConnection();
  const router = useRouter();

  // Redirect to dashboard if user already has connected banks
  useEffect(() => {
    if (!isLoading && hasConnectedBanks) {
      router.push('/dashboard');
    }
  }, [isLoading, hasConnectedBanks, router]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-card p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Checking bank connections...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // If user has connected banks, this page shouldn't show (will redirect)
  if (hasConnectedBanks) {
    return null;
  }

  return (
    <ProtectedRoute>
      <BankConnectionScreen 
        userId={user?.$id || ''} 
        onConnectionSuccess={() => router.push('/dashboard')}
      />
    </ProtectedRoute>
  );
}
