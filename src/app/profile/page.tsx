"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { User, Mail, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <h1 className="text-2xl font-semibold text-white">Profile</h1>
        </div>

        {/* Profile Info */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Alex Johnson</h3>
              <p className="text-white/60 text-sm">alex@example.com</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white/70 text-sm mb-2 block">Name</label>
              <Input 
                defaultValue="Alex Johnson"
                className="glass-input text-white"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-2 block">Email</label>
              <Input 
                defaultValue="alex@example.com"
                className="glass-input text-white"
              />
            </div>
          </div>

          <Button className="glass-button bg-white/10 hover:bg-white/15 text-white mt-6">
            Save
          </Button>
        </div>

        {/* Settings */}
        <div className="glass-card p-6">
          <h3 className="text-white font-semibold mb-4">Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-white/60" />
                <span className="text-white text-sm">Email notifications</span>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="w-4 h-4 text-white/60" />
                <span className="text-white text-sm">Data sharing</span>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}