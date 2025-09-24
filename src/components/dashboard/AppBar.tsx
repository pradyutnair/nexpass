"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Account } from "appwrite";
import { createAppwriteClient } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/ClientOnly";

export function AppBar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const client = createAppwriteClient();
        const account = new Account(client);
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to get user:", error);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      const client = createAppwriteClient();
      const account = new Account(client);
      await account.deleteSession('current');
      router.push('/auth');
    } catch (error) {
      console.error("Logout failed:", error);
    }
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