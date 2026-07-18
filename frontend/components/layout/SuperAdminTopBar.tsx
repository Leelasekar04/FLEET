"use client";

import { Bell, Search, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function SuperAdminTopBar() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("super_admin_profile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  return (
    <header className="topbar flex items-center justify-between">
      {/* Search - simplified for super admin */}
      <div className="topbar-search">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
        <input 
          type="text" 
          placeholder="Search companies, users, or subscriptions..." 
          className="topbar-search-input pl-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-sm">/</kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="topbar-right">
        <button className="topbar-icon-btn topbar-icon-btn-notif" title="Notifications">
          <Bell size={16} />
          <span className="topbar-notif-badge">2</span>
        </button>

        <div className="topbar-divider" />

        {/* Profile Dropdown (Simplified) */}
        <div className="topbar-user">
          <div className="topbar-user-avatar bg-slate-100 overflow-hidden text-slate-700">
            {profile?.avatar_url ? (
               <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               <User size={16} className="text-slate-500" />
            )}
          </div>
          <div className="hidden sm:block text-left">
            <div className="topbar-user-name group-hover:text-blue-600 transition-colors">
              {profile?.name || "Super Admin"}
            </div>
            <div className="topbar-user-role uppercase tracking-wider">
              Platform Owner
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
