"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency, cn } from "@/lib/utils";
import { useState } from "react";

// Mock transaction data
const mockTransactions = [
  {
    id: "1",
    date: "Jan 15",
    merchant: "Starbucks",
    category: "Food",
    amount: -4.50,
    currency: "EUR",
  },
  {
    id: "2", 
    date: "Jan 15",
    merchant: "Salary",
    category: "Income",
    amount: 3500.00,
    currency: "EUR",
  },
  {
    id: "3",
    date: "Jan 14",
    merchant: "Amazon",
    category: "Shopping",
    amount: -89.99,
    currency: "EUR",
  },
  {
    id: "4",
    date: "Jan 14",
    merchant: "Uber",
    category: "Transport",
    amount: -12.30,
    currency: "EUR",
  },
  {
    id: "5",
    date: "Jan 13",
    merchant: "Restaurant",
    category: "Food",
    amount: -67.80,
    currency: "EUR",
  },
];

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = mockTransactions.filter(transaction =>
    transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <h1 className="text-2xl font-semibold text-white mb-4">Transactions</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input pl-10 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {/* Transactions List */}
        <div className="glass-card p-6">
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium text-sm">
                      {transaction.merchant}
                    </p>
                    <span className="text-white/80 font-mono text-sm">
                      {transaction.amount >= 0 ? "+" : ""}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-white/40 text-xs">
                      {transaction.category}
                    </p>
                    <p className="text-white/40 text-xs">
                      {transaction.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}