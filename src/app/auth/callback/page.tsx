'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Account } from 'appwrite';
import { createAppwriteClient, createUserPrivateRecord } from '@/lib/auth';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const client = createAppwriteClient();
        const account = new Account(client);

        // Get the current user after OAuth callback
        const user = await account.get();
        
        if (user) {
          // Create or update user private record
          await createUserPrivateRecord(user.$id, user.email, user.name);
          
          // Redirect directly to dashboard without showing success screen
          router.push('/dashboard');
        } else {
          throw new Error('No user found after authentication');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed');
        
        // Redirect to auth page after error
        setTimeout(() => {
          router.push('/auth');
        }, 3000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl float-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl float-animation" style={{ animationDelay: '-3s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h1 className="text-xl font-semibold text-white">Processing...</h1>
              <p className="text-gray-400">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-green-400">Success!</h1>
              <p className="text-gray-400">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-red-400">Error</h1>
              <p className="text-gray-400">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
