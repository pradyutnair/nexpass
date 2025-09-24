'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientOnly } from '@/components/ClientOnly';

interface Institution {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
  logo?: string;
}

interface BankConnectionScreenProps {
  userId: string;
  onConnectionSuccess?: () => void;
}

export function BankConnectionScreen({ userId, onConnectionSuccess }: BankConnectionScreenProps) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('GB'); // Default to UK
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  // Fetch institutions on component mount
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/gocardless/institutions?country=${selectedCountry}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Institutions API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          });
          throw new Error(errorData.error || `Failed to fetch institutions (${response.status})`);
        }
        
        const data = await response.json();
        setInstitutions(data);
        setFilteredInstitutions(data);
      } catch (error: any) {
        console.error('Error fetching institutions:', error);
        setError(error.message || 'Failed to load banks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitutions();
  }, [selectedCountry]);

  // Filter institutions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInstitutions(institutions);
    } else {
      const filtered = institutions.filter(institution =>
        institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.bic.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInstitutions(filtered);
    }
  }, [searchTerm, institutions]);

  const getAuthToken = async () => {
    // We don't need to send a token since the API uses cookies/session
    return '';
  };

  const handleInstitutionSelect = async (institution: Institution) => {
    setIsConnecting(true);
    setError('');

    try {
      // Step 1: Create requisition according to GoCardless flow
      const requisitionResponse = await fetch('/api/gocardless/requisitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          institutionId: institution.id,
          redirect: `${window.location.origin}/dashboard/banks/callback`,
          reference: `user_${userId}_${Date.now()}`, // Unique reference for this user
          userLanguage: 'en',
        })
      });

      if (!requisitionResponse.ok) {
        const errorData = await requisitionResponse.json();
        throw new Error(errorData.error || 'Failed to create bank connection');
      }

      const requisitionData = await requisitionResponse.json();
      
      // Step 2: Redirect user to GoCardless consent page
      if (requisitionData.link) {
        window.location.href = requisitionData.link;
      } else {
        throw new Error('No consent link received from GoCardless');
      }
    } catch (error: any) {
      console.error('Error connecting to bank:', error);
      setError(error.message || 'Failed to connect to bank');
      setIsConnecting(false);
    }
  };

  const countries = [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'IE', name: 'Ireland' },
  ];

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl float-animation"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl float-animation" style={{ animationDelay: '-3s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-4">Connect Your Bank</h1>
            <p className="text-xl text-gray-300 mb-2">
              Link your bank account to start tracking your finances
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We use bank-grade security through GoCardless to safely connect to your bank. 
              We can access up to 24 months of transaction history and provide continuous access for 90 days.
            </p>
          </div>

          {/* Country Selection */}
          <div className="glass-card p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                  Select Country
                </label>
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="glass-input text-white w-full sm:w-auto min-w-[200px]"
                  disabled={isLoading || isConnecting}
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code} className="bg-gray-900 text-white">
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                  Search Banks
                </label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search for your bank..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input text-white placeholder-gray-400"
                  disabled={isLoading || isConnecting}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="glass-card p-8 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading banks...</p>
            </div>
          )}

          {/* Institutions List */}
          {!isLoading && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Available Banks ({filteredInstitutions.length})
              </h2>
              
              {filteredInstitutions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    {searchTerm ? 'No banks found matching your search.' : 'No banks available for this country.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {filteredInstitutions.map((institution) => (
                    <button
                      key={institution.id}
                      onClick={() => handleInstitutionSelect(institution)}
                      disabled={isConnecting}
                      className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                        isConnecting
                          ? 'bg-gray-800/50 border-gray-700 cursor-not-allowed opacity-50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {institution.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">
                            {institution.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {institution.transaction_total_days} days history
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Connecting State */}
          {isConnecting && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="glass-card p-8 text-center max-w-md mx-4">
                <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-white mb-2">Connecting to your bank...</h3>
                <p className="text-gray-400">
                  You'll be redirected to your bank's secure login page in a moment.
                </p>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-8 glass-card p-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Your data is secure</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• We use bank-grade encryption and security</li>
                  <li>• We never store your banking credentials</li>
                  <li>• You can disconnect your bank at any time</li>
                  <li>• We only access the data you explicitly consent to</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
