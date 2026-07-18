"use client";
import { LogOut, Bell, MessageSquare, Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DriverTopBar() {
  const router = useRouter();
  const [profile, setProfile] = useState<{name: string, phone: string, employee_id: string} | null>(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem("driver_profile");
      if (p) setProfile(JSON.parse(p));
    } catch (err) {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("driver_token");
    localStorage.removeItem("driver_profile");
    window.location.href = "/driver/login";
  };

  const getInitials = (name: string) => {
    if (!name) return "D";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <header className="topbar flex items-center justify-between">
      {/* ── Search ── */}
      <div className="topbar-search">
        <input
          id="topbar-search"
          type="text"
          placeholder="Search assigned trips, fuel logs, or enter ID..."
          className="topbar-search-input"
        />
        <span className="topbar-search-kbd">
          Enter
        </span>
      </div>

      {/* ── Right Side ── */}
      <div className="topbar-right">
        {/* Fullscreen */}
        <button className="topbar-icon-btn" title="Full screen">
          <Maximize2 size={16} />
        </button>

        {/* Messages */}
        <button className="topbar-icon-btn" title="Messages">
          <MessageSquare size={16} />
        </button>

        {/* Notifications */}
        <button className="topbar-icon-btn topbar-icon-btn-notif" title="Notifications">
          <Bell size={16} />
          <span className="topbar-notif-badge">2</span>
        </button>

        {/* Divider */}
        <div className="topbar-divider" />

        {/* User Profile */}
        <div className="topbar-user" onClick={() => router.push('/driver/profile')}>
          <div className="topbar-user-avatar">
            {getInitials(profile?.name || "")}
          </div>
          <div>
            <div className="topbar-user-name">{profile?.name || "Ali Khan"}</div>
            <div className="topbar-user-role">Driver ({profile?.employee_id || "DRV-002"})</div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="ml-2 px-4 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-[13px] font-semibold transition-colors flex items-center gap-2"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
