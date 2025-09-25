"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/ClientOnly";

export function AppBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleConnectBank = () => {
    router.push('/dashboard/banks');
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
          <ClientOnly
            fallback={
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
            }
          >
            {user && (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleConnectBank}
                  className="glass-button text-white text-sm px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30"
                >
                  + Connect Bank
                </Button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  className="glass-button text-white text-sm px-4 py-2"
                >
                  Logout
                </Button>
              </div>
            )}
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}