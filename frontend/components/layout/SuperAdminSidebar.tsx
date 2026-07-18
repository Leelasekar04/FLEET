"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, MapPin, Users, Activity, CreditCard, List,
  RefreshCw, ArrowUpCircle, Clock, Shield, Lock, History, Truck, Route,
  Droplet, FileText, DollarSign, BarChart3, Receipt, Headphones, AlertTriangle,
  BookOpen, UserCheck, Building, ShieldAlert, Settings, Mail, MessageSquare,
  Phone, Map, Database, PieChart, Globe, LogOut, ChevronDown
} from "lucide-react";
import { useState } from "react";

const navGroups = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Tenant Management",
    items: [
      { label: "Companies", href: "/super-admin/companies", icon: Building2 },
      { label: "Branches", href: "/super-admin/branches", icon: MapPin },
      { label: "Company Users", href: "/super-admin/company-users", icon: Users },
      { label: "Company Status", href: "/super-admin/company-status", icon: Activity },
    ],
  },
  {
    label: "Subscription Management",
    items: [
      { label: "Plans", href: "/super-admin/subscriptions/plans", icon: CreditCard },
      { label: "Plan Features", href: "/super-admin/subscriptions/features", icon: List },
      { label: "Renewals", href: "/super-admin/subscriptions/renewals", icon: RefreshCw },
      { label: "Upgrades", href: "/super-admin/subscriptions/upgrades", icon: ArrowUpCircle },
      { label: "Expiry Tracking", href: "/super-admin/subscriptions/expiry", icon: Clock },
    ],
  },
  {
    label: "User Management",
    items: [
      { label: "Users", href: "/super-admin/users", icon: Users },
      { label: "Roles", href: "/super-admin/roles", icon: Shield },
      { label: "Permissions", href: "/super-admin/permissions", icon: Lock },
      { label: "Login History", href: "/super-admin/login-history", icon: History },
    ],
  },
  {
    label: "Fleet Analytics",
    items: [
      { label: "Total Vehicles", href: "/super-admin/analytics/vehicles", icon: Truck },
      { label: "Total Drivers", href: "/super-admin/analytics/drivers", icon: Users },
      { label: "Trips Analytics", href: "/super-admin/analytics/trips", icon: Route },
      { label: "Fuel Analytics", href: "/super-admin/analytics/fuel", icon: Droplet },
    ],
  },
  {
    label: "Billing & Revenue",
    items: [
      { label: "Invoices", href: "/super-admin/billing/invoices", icon: FileText },
      { label: "Payments", href: "/super-admin/billing/payments", icon: DollarSign },
      { label: "Revenue Reports", href: "/super-admin/billing/revenue", icon: BarChart3 },
      { label: "Tax Reports", href: "/super-admin/billing/tax", icon: Receipt },
    ],
  },
  {
    label: "Support Center",
    items: [
      { label: "Tickets", href: "/super-admin/support/tickets", icon: Headphones },
      { label: "Escalations", href: "/super-admin/support/escalations", icon: AlertTriangle },
      { label: "Knowledge Base", href: "/super-admin/support/kb", icon: BookOpen },
    ],
  },
  {
    label: "Audit Logs",
    items: [
      { label: "User Activities", href: "/super-admin/audit/users", icon: UserCheck },
      { label: "Company Activities", href: "/super-admin/audit/companies", icon: Building },
      { label: "Security Logs", href: "/super-admin/audit/security", icon: ShieldAlert },
    ],
  },
  {
    label: "System Settings",
    items: [
      { label: "General Settings", href: "/super-admin/settings/general", icon: Settings },
      { label: "SMTP Settings", href: "/super-admin/settings/smtp", icon: Mail },
      { label: "SMS Gateway", href: "/super-admin/settings/sms", icon: MessageSquare },
      { label: "WhatsApp API", href: "/super-admin/settings/whatsapp", icon: Phone },
      { label: "GPS Providers", href: "/super-admin/settings/gps", icon: Map },
      { label: "Payment Gateway", href: "/super-admin/settings/payment", icon: CreditCard },
      { label: "Backup Settings", href: "/super-admin/settings/backup", icon: Database },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Company Reports", href: "/super-admin/reports/company", icon: PieChart },
      { label: "User Reports", href: "/super-admin/reports/user", icon: Users },
      { label: "Subscription Reports", href: "/super-admin/reports/subscription", icon: FileText },
      { label: "Revenue Reports", href: "/super-admin/reports/revenue", icon: BarChart3 },
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

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("super_admin_token");
    localStorage.removeItem("super_admin_user");
    window.location.href = "/super-admin/login";
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
            <Globe size={18} />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-slate-900 block leading-none">PLATFORM</span>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Super Admin</span>
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
