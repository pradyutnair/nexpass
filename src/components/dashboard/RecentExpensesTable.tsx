"use client";

import { formatCurrency, cn } from "@/lib/utils";
import { Transaction } from "@/lib/api";

interface RecentExpensesTableProps {
  transactions?: Transaction[];
  className?: string;
}

// Mock data for demonstration
const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15",
    merchant: "Starbucks",
    category: "Food",
    amount: -4.50,
    currency: "EUR",
    accountId: "mock"
  },
  {
    id: "2",
    date: "2024-01-14",
    merchant: "Amazon",
    category: "Shopping",
    amount: -89.99,
    currency: "EUR",
    accountId: "mock"
  },
  {
    id: "3",
    date: "2024-01-14",
    merchant: "Uber",
    category: "Transport",
    amount: -12.30,
    currency: "EUR",
    accountId: "mock"
  },
  {
    id: "4",
    date: "2024-01-13",
    merchant: "Restaurant",
    category: "Food",
    amount: -67.80,
    currency: "EUR",
    accountId: "mock"
  },
  {
    id: "5",
    date: "2024-01-13",
    merchant: "Netflix",
    category: "Entertainment",
    amount: -14.99,
    currency: "EUR",
    accountId: "mock"
  },
];

export function RecentExpensesTable({ 
  transactions = mockTransactions, 
  className 
}: RecentExpensesTableProps) {
  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="space-y-4">
        {transactions.slice(0, 5).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-2"
          >
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">
                {transaction.merchant}
              </p>
              <p className="text-white/40 text-xs">
                {transaction.category || "Other"}
              </p>
            </div>
            <span className="text-white/80 font-mono text-sm">
              {formatCurrency(Math.abs(transaction.amount), transaction.currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}