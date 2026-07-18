"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Route, Truck, Receipt, 
  FileText, LogOut, Fuel, User, Settings,
  ChevronDown, Bell, MapPin, Briefcase
} from "lucide-react";
import { useState } from "react";

const navGroups = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/driver/dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "My Trips", href: "/driver/trips", icon: Route },
      { label: "Assigned Vehicles", href: "/driver/vehicles", icon: Truck },
    ],
  },
  {
    label: "Financial",
    items: [
      { label: "Fuel Entries", href: "/driver/fuel", icon: Fuel },
      { label: "Expenses", href: "/driver/expenses", icon: Receipt },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Documents", href: "/driver/documents", icon: FileText },
      { label: "Profile", href: "/driver/profile", icon: User },
    ],
  },
];

function NavGroup({ group, pathname }: { group: (typeof navGroups)[0]; pathname: string }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-1">
      <button
        className="w-full flex items-center justify-between px-6 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#4b5563] hover:text-[#6b7280] transition-colors"
        onClick={() => setOpen(!open)}
      >
        {group.label}
        <ChevronDown size={10} className={`transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && group.items.map((item) => {
        const Icon = item.icon;
        const isActive = 'exact' in item && item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{item.label}</span>
            {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00d4aa]" />}
          </Link>
        );
      })}
    </div>
  );
}

export default function DriverSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("driver_token");
    localStorage.removeItem("driver_profile");
    window.location.href = "/driver/login";
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
            <Briefcase size={18} />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-slate-900 block leading-none">PLATFORM</span>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Driver Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {navGroups.map((group) => (
          <NavGroup key={group.label} group={group} pathname={pathname} />
        ))}
      </div>

      {/* Bottom Profile / Logout */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

