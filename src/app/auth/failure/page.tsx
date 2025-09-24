'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AuthFailurePage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/auth');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl float-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl float-animation" style={{ animationDelay: '-3s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Authentication Failed</h1>
            <p className="text-gray-400">
              We couldn't complete the authentication process. This could be due to:
            </p>
          </div>

          <div className="text-left space-y-2">
            <p className="text-sm text-gray-400">• Cancelled authentication</p>
            <p className="text-sm text-gray-400">• Network connection issues</p>
            <p className="text-sm text-gray-400">• Provider authentication error</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push('/auth')}
              className="w-full glass-button text-white font-medium py-3 glow-hover"
            >
              Try Again
            </Button>
            
            <p className="text-xs text-gray-500">
              Automatically redirecting in 5 seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
