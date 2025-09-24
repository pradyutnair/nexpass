'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ClientOnly } from '@/components/ClientOnly';

export default function BankCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing bank connection...');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the requisition ID from URL parameters
        const ref = searchParams?.get('ref');
        const error = searchParams?.get('error');
        
        if (error) {
          throw new Error(error);
        }

        if (!ref) {
          throw new Error('No reference found in callback');
        }

        setMessage('Verifying bank connection...');

        // Call our API to process the callback and fetch account data
        const response = await fetch(`/api/gocardless/requisitions/${ref}`, {
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to process bank connection');
        }

        const data = await response.json();
        
        if (data.status === 'LINKED') {
          setStatus('success');
          setMessage('Bank connected successfully! Fetching your account data...');
          
          // Wait a moment then redirect to dashboard
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          throw new Error(`Connection status: ${data.status}. Please try connecting again.`);
        }
      } catch (error: any) {
        console.error('Bank callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to connect bank account');
        
        // Redirect back to bank connection screen after error
        setTimeout(() => {
          router.push('/dashboard/banks');
        }, 3000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <ClientOnly>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl float-animation"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl float-animation" style={{ animationDelay: '-3s' }}></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 w-full max-w-md">
          <div className="glass-card p-8 text-center">
            {status === 'loading' && (
              <div className="space-y-4">
                <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h1 className="text-2xl font-semibold text-white">Processing...</h1>
                <p className="text-gray-400">{message}</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-green-400">Success!</h1>
                <p className="text-gray-400">{message}</p>
                <div className="text-sm text-gray-500">Redirecting to dashboard...</div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-red-400">Connection Failed</h1>
                <p className="text-gray-400">{message}</p>
                <div className="text-sm text-gray-500">Redirecting back to bank selection...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
