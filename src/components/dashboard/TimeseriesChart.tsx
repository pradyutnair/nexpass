"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer
} from "recharts";

interface TimeseriesData {
  date: string;
  income: number;
  expenses: number;
}

interface TimeseriesChartProps {
  data: TimeseriesData[];
  className?: string;
}

export function TimeseriesChart({ data, className }: TimeseriesChartProps) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.4)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.4)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              hide
            />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#FFFFFF" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#888888" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}