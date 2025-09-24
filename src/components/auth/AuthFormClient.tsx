'use client';

import dynamic from 'next/dynamic';
import { ClientOnly } from '@/components/ClientOnly';

const AuthForm = dynamic(() => import('./AuthForm').then(mod => ({ default: mod.AuthForm })), {
  ssr: false,
  loading: () => (
    <div className="glass-card p-8 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading authentication...</p>
      </div>
    </div>
  )
});

interface AuthFormClientProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

export function AuthFormClient({ mode, onToggleMode }: AuthFormClientProps) {
  return (
    <ClientOnly
      fallback={
        <div className="glass-card p-8 w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Initializing...</p>
          </div>
        </div>
      }
    >
      <AuthForm mode={mode} onToggleMode={onToggleMode} />
    </ClientOnly>
  );
}
