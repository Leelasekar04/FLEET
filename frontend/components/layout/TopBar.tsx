"use client";
import { Bell, Maximize2, MessageSquare, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="topbar flex items-center justify-between">
      {/* ── Search ── */}
      <div className="topbar-search">
        <input
          id="topbar-search"
          type="text"
          placeholder="Search vehicles, drivers, trips or press Enter..."
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
          <span className="topbar-notif-badge">3</span>
        </button>

        {/* Divider */}
        <div className="topbar-divider" />

        {/* User Profile */}
        <div className="topbar-user">
          <div className="topbar-user-avatar">
            IK
          </div>
          <div>
            <div className="topbar-user-name">Imran Khan</div>
            <div className="topbar-user-role">Fleet Admin</div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="ml-2 px-4 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-[13px] font-semibold transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
