"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface CategoryData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

interface CategoriesPieProps {
  data?: CategoryData[];
  className?: string;
}

// Mock data - white to greyish gradient
const mockData: CategoryData[] = [
  { name: "Food", value: 35, color: "#FFFFFF" },
  { name: "Shopping", value: 25, color: "#CCCCCC" },
  { name: "Transport", value: 20, color: "#999999" },
  { name: "Entertainment", value: 15, color: "#666666" },
  { name: "Other", value: 5, color: "#444444" },
];

export function CategoriesPie({ 
  data = mockData, 
  className 
}: CategoriesPieProps) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}