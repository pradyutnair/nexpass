'use client';

import { useState } from 'react';
import { Account, ID } from 'appwrite';
import { createAppwriteClient, createUserPrivateRecord } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const client = createAppwriteClient();
  const account = new Account(client);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        // Create account
        const user = await account.create(
          ID.unique(),
          email,
          password,
          name
        );
        
        // Create session after signup
        await account.createEmailPasswordSession(email, password);
        
        // Create user private record
        await createUserPrivateRecord(user.$id, email, name);
      } else {
        // Sign in
        await account.createEmailPasswordSession(email, password);
        const user = await account.get();
        
        // Ensure user private record exists
        await createUserPrivateRecord(user.$id, user.email, user.name);
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Create OAuth2 session with Google
      await account.createOAuth2Session(
        'google',
        `${window.location.origin}/auth/callback`,
        `${window.location.origin}/auth/failure`
      );
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">
          {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
        </h1>
        <p className="text-gray-400">
          {mode === 'signin' 
            ? 'Sign in to your account to continue' 
            : 'Create your account to get started'
          }
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailAuth} className="space-y-6">
        {mode === 'signup' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input text-white placeholder-gray-400"
              placeholder="Enter your full name"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input text-white placeholder-gray-400"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input text-white placeholder-gray-400"
            placeholder="Enter your password"
            required
            minLength={8}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full glass-button text-white font-medium py-3 glow-hover"
        >
          {isLoading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        
      </div>

      <Button
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className="w-full glass-button text-white font-medium py-3 glow-hover flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="text-center mt-6">
        <button
          onClick={onToggleMode}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          {mode === 'signin' 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Sign in"
          }
        </button>
      </div>
    </div>
  );
}
