"use client";

export function AppBar() {
  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-white/10"></div>
        </div>
      </div>
    </div>
  );
}