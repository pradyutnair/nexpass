"use client";

import { cn, formatCurrency, formatPercentage } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: number;
  currency?: string;
  isPercentage?: boolean;
  className?: string;
}

export function KpiCard({ 
  title, 
  value, 
  currency = "EUR",
  isPercentage = false,
  className 
}: KpiCardProps) {
  const formattedValue = isPercentage 
    ? formatPercentage(value)
    : formatCurrency(value, currency);

  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="space-y-2">
        <p className="text-white/60 text-sm">{title}</p>
        <p className="text-2xl font-mono text-white">
          {formattedValue}
        </p>
      </div>
    </div>
  );
}