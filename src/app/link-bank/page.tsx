'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BankConnectionScreen } from '@/components/banks/BankConnectionScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LinkBankPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-card p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
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
