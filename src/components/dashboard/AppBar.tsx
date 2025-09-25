"use client";

import { useAuth } from "@/contexts/AuthContext";
import { UserCard } from "./UserCard";
import DateRangePicker from "@/components/ui/date-range-picker";

export function AppBar() {
  const { user } = useAuth();

  const handleDateRangeUpdate = (values: any) => {
    console.log("Date range updated:", values);
    // TODO: Handle date range changes to filter dashboard data
  };

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">
            Dashboard
          </h1>
          {user && (
            <p className="text-sm text-gray-400">
              Welcome back, {user.name || user.email}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Date Range Picker */}
          <div className="w-64">
            <DateRangePicker
              onUpdate={handleDateRangeUpdate}
              align="end"
              showCompare={false}
            />
          </div>
          
          {/* User Card */}
          <UserCard />
        </div>
      </div>
    </div>
  );
}