"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectBankDialog } from "@/components/banks/ConnectBankDialog";
import { formatCurrency } from "@/lib/utils";
import { useAccounts } from "@/lib/api";

// Mock data for connected banks
const connectedBanks = [
  {
    id: "1",
    name: "Chase Bank",
    type: "Checking",
    balance: 5240.50,
    currency: "EUR",
    status: "connected",
  },
  {
    id: "2",
    name: "Bank of America", 
    type: "Savings",
    balance: 12750.00,
    currency: "EUR",
    status: "connected",
  },
  {
    id: "3",
    name: "Wells Fargo",
    type: "Credit",
    balance: -1250.30,
    currency: "EUR",
    status: "error",
  }
];

export default function Banks() {
  // Use real data from GoCardless API
  const { data: accounts, isLoading } = useAccounts();
  
  // Use real accounts or fallback to mock data
  const displayBanks = accounts?.length ? accounts.map(account => ({
    id: account.id,
    name: account.name || "Bank Account",
    type: account.type || "Account",
    balance: account.balance || 0,
    currency: account.currency || "EUR",
    status: account.status || "connected",
  })) : connectedBanks;

  const totalBalance = displayBanks.reduce((sum, bank) => sum + bank.balance, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Banks</h1>
            <ConnectBankDialog>
              <Button className="glass-button bg-white/10 hover:bg-white/15 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Connect
              </Button>
            </ConnectBankDialog>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-20 bg-white/5 rounded"></div>
              </div>
            ))
          ) : (
            displayBanks.map((bank) => (
              <div key={bank.id} className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{bank.name}</h3>
                    <p className="text-white/60 text-xs">{bank.type}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-mono text-white">
                    {formatCurrency(bank.balance, bank.currency)}
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    {bank.status === 'connected' ? 'Connected' : 'Error'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="glass-card p-6">
          <div className="text-center">
            <p className="text-3xl font-mono text-white mb-2">
              {formatCurrency(totalBalance)}
            </p>
            <p className="text-white/60 text-sm">Total Balance</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}