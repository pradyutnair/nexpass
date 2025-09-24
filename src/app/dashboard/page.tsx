"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppBar } from "@/components/dashboard/AppBar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { TimeseriesChart } from "@/components/dashboard/TimeseriesChart";
import { ChatPanel } from "@/components/dashboard/ChatPanel";
import { RecentExpensesTable } from "@/components/dashboard/RecentExpensesTable";
import { CategoriesPie } from "@/components/dashboard/CategoriesPie";
import { useAccounts, useTransactions } from "@/lib/api";
import { useBankConnection } from "@/hooks/useBankConnection";

// Mock data for demonstration
const mockTimeseriesData = [
  { date: "Jan 1", income: 3500, expenses: 2100 },
  { date: "Jan 8", income: 3200, expenses: 2400 },
  { date: "Jan 15", income: 3800, expenses: 2200 },
  { date: "Jan 22", income: 3600, expenses: 2800 },
  { date: "Jan 29", income: 4000, expenses: 2300 },
  { date: "Feb 5", income: 3700, expenses: 2600 },
];

export default function Dashboard() {
  const router = useRouter();
  const { isLoading: isBankLoading, hasConnectedBanks } = useBankConnection();
  
  // Integrate with GoCardless API
  const { data: accounts } = useAccounts();
  const { data: transactions } = useTransactions({ limit: 10 });

  // Redirect to bank connection if no banks are connected
  useEffect(() => {
    if (!isBankLoading && !hasConnectedBanks) {
      router.push('/dashboard/banks');
    }
  }, [isBankLoading, hasConnectedBanks, router]);

  // Calculate metrics from real data or use mock data
  const totalBalance = accounts?.reduce((sum, account) => sum + (account.balance || 0), 0) || 16740.20;
  const totalIncome = transactions?.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) || 14750;
  const totalExpenses = Math.abs(transactions?.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0) || 9420);
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  // Show loading state while checking bank connections
  if (isBankLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-card p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // If no connected banks, this component won't render (will redirect)
  if (!hasConnectedBanks) {
    return null;
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          {/* App Bar */}
          <AppBar />

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard title="Balance" value={totalBalance} />
            <KpiCard title="Income" value={totalIncome} />
            <KpiCard title="Expenses" value={totalExpenses} />
            <KpiCard title="Savings" value={savingsRate} isPercentage />
          </div>

          {/* Time Series Chart */}
          <TimeseriesChart data={mockTimeseriesData} />

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-[400px]">
              <ChatPanel />
            </div>
            <RecentExpensesTable transactions={transactions} />
            <CategoriesPie />
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}