"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Globe, LogOut, Receipt, DollarSign, BarChart2, ReceiptText } from "lucide-react";

export default function AccountantSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accountant_token");
    localStorage.removeItem("accountant_profile");
    window.location.href = "/accountant/login";
  };

  const navItems = [
    { label: "Dashboard", href: "/accountant/dashboard", icon: LayoutDashboard },
    { label: "Review Expenses", href: "/accountant/expenses", icon: FileText },
  ];

  const salesNavItems = [
    { label: "Invoices", href: "/accountant/invoices", icon: Receipt },
    { label: "Payments", href: "/accountant/payments", icon: DollarSign },
    { label: "Revenue Reports", href: "/accountant/revenue-reports", icon: BarChart2 },
    { label: "Tax Reports", href: "/accountant/tax-reports", icon: ReceiptText },
  ];

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
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Accountant</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <div className="mb-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
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

        <div className="px-5 mt-6 mb-2">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sales & Revenue</h3>
        </div>
        <div className="mb-1">
          {salesNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
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
