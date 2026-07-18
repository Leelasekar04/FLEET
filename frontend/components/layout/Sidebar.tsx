"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Route, Receipt, BookOpen, BarChart3,
  Truck, LogOut, MessageSquare, Fuel, Milestone, Wallet,
  ShieldAlert, Settings, ChevronDown, Building2, Wrench, FileText
} from "lucide-react";
import { useState, useEffect } from "react";

const navGroups = [
  {
    label: "Main",
    items: [
      { label: "Dashboard",    href: "/dashboard",  icon: LayoutDashboard, exact: true },
      { label: "WhatsApp",     href: "/whatsapp",   icon: MessageSquare },
    ],
  },
  {
    label: "Fleet",
    items: [
      { label: "Vehicles",     href: "/vehicles",   icon: Truck },
      { label: "Drivers",      href: "/drivers",    icon: Users },
      { label: "Trips",        href: "/trips",      icon: Route },
      { label: "Fuel",         href: "/fuel",       icon: Fuel },
      { label: "Toll",         href: "/toll",       icon: Milestone },
      { label: "Maintenance",  href: "/maintenance",icon: Wrench },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Invoices",     href: "/invoices",   icon: FileText },
      { label: "Expenses",     href: "/expenses",   icon: Receipt },
      { label: "Batta",        href: "/batta",      icon: Wallet },
      { label: "Ledger",       href: "/ledger",     icon: BookOpen },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports",      href: "/reports",    icon: BarChart3 },
      { label: "Compliance",   href: "/compliance", icon: ShieldAlert },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Settings",     href: "/settings",   icon: Settings },
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
        const isActive = item.exact
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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    try {
      const uStr = localStorage.getItem("user");
      if (uStr) {
        setUserRole(JSON.parse(uStr).role);
      }
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#3b82f6] flex items-center justify-center flex-shrink-0">
            <Truck size={17} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 leading-tight">FleetManager</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-widest">Pro v2.0</div>
          </div>
        </div>
      </div>

      {/* Company selector */}
      <div className="px-3 py-2 border-b border-slate-200">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left">
          <div className="w-6 h-6 rounded-lg bg-[#3b82f6]/20 flex items-center justify-center flex-shrink-0">
            <Building2 size={12} color="#3b82f6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-900 truncate">Kumar Transport Co.</div>
            <div className="text-[10px] text-slate-500">Chennai Branch</div>
          </div>
          <ChevronDown size={12} className="text-slate-400 flex-shrink-0" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navGroups.map((g) => (
          <NavGroup key={g.label} group={g} pathname={pathname} />
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-200">
        <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#3b82f6] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            FM
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-900 truncate">Fleet Owner</div>
            <div className="text-[10px] text-slate-500 truncate">admin@fleetpro.in</div>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1 transition-colors">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
