"use client";

import { cn } from "@/lib/utils";
import { 
  Home, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Banks", href: "/banks", icon: CreditCard },
  { name: "Transactions", href: "/transactions", icon: TrendingUp },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={cn(
      "relative h-screen flex flex-col transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Sidebar Glass Container */}
      <div className="glass-card m-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-white font-semibold text-lg">Nexpass</span>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="glass-button p-2 hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-white" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-white/10 hover:backdrop-blur-md",
                  isActive 
                    ? "bg-white/15 text-white shadow-lg border border-white/20" 
                    : "text-white/70 hover:text-white",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className={cn(
            "flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer",
            isCollapsed && "justify-center"
          )}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-white font-medium text-sm">Alex Johnson</p>
                <p className="text-white/60 text-xs">alex@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
