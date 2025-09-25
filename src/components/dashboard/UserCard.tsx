"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { 
  PersonIcon, 
  LinkBreak2Icon, 
  GearIcon, 
  ExitIcon,
  SunIcon,
  MoonIcon 
} from "@radix-ui/react-icons";
import { ClientOnly } from "@/components/ClientOnly";
import { useState } from "react";

export function UserCard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleLinkAccount = () => {
    router.push('/dashboard/banks');
  };

  const handleSettings = () => {
    // TODO: Implement settings page
    console.log("Settings clicked");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement theme switching logic
    console.log("Theme toggled:", !isDarkMode ? "dark" : "light");
  };

  if (!user) return null;

  return (
    <ClientOnly
      fallback={
        <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse"></div>
      }
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-white/20 transition-all duration-200">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 glass-card border-white/20 bg-black/80 backdrop-blur-xl text-white" 
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel className="text-white">
            <div className="flex flex-col space-y-1">
              <p className="font-medium">{user.name || 'User'}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="bg-white/20" />
          
          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center space-x-2">
              <SunIcon className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Dark Mode</span>
              <MoonIcon className="h-4 w-4 text-blue-400" />
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
          
          <DropdownMenuSeparator className="bg-white/20" />
          
          <DropdownMenuItem 
            onClick={handleProfile}
            className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
          >
            <PersonIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <span className="ml-auto text-xs text-gray-400">⌘⇧P</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleLinkAccount}
            className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
          >
            <LinkBreak2Icon className="mr-2 h-4 w-4" />
            <span>Link an account</span>
            <span className="ml-auto text-xs text-gray-400">⌘⇧L</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleSettings}
            className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
          >
            <GearIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <span className="ml-auto text-xs text-gray-400">⌘⇧S</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-white/20" />
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer"
          >
            <ExitIcon className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ClientOnly>
  );
}
