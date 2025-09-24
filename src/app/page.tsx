"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Account } from "appwrite";
import { createAppwriteClient } from "@/lib/auth";
import { ClientOnly } from "@/components/ClientOnly";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const client = createAppwriteClient();
        const account = new Account(client);
        
        // Check if user is authenticated
        await account.get();
        
        // If authenticated, redirect to dashboard
        router.push("/dashboard");
      } catch (error) {
        // If not authenticated, redirect to auth page
        router.push("/auth");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-card p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Nexpass</h1>
            <p className="text-white/60">Loading...</p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Nexpass</h1>
          <p className="text-white/60">
            {isChecking ? "Checking authentication..." : "Redirecting..."}
          </p>
        </div>
      </div>
    </ClientOnly>
  );
}