"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Truck, Users, Route, Fuel, Wrench, FileText, 
  Map, Activity, Bell, BarChart3, Settings 
} from "lucide-react";

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Vehicles", href: "/fleet/vehicles", icon: Truck },
    { name: "Drivers", href: "/fleet/drivers", icon: Users },
    { name: "Trips", href: "/fleet/trips", icon: Route },
    { name: "Fuel", href: "/fleet/fuel", icon: Fuel },
    { name: "Maintenance", href: "/fleet/maintenance", icon: Wrench },
    { name: "Documents", href: "/fleet/documents", icon: FileText },
    { name: "GPS Tracking", href: "/fleet/gps", icon: Map },
    { name: "Performance", href: "/fleet/performance", icon: Activity },
    { name: "Alerts", href: "/fleet/alerts", icon: Bell },
    { name: "Reports", href: "/fleet/reports", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* ── FLEET HEADER ── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-md">
            <Truck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">Fleet Monitoring</h1>
            <p className="text-[12px] font-medium text-slate-500">Motive / Fleetio Enterprise Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── SIDEBAR ── */}
        <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto hidden md:flex flex-col">
          <div className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-bold transition-all
                    ${isActive 
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <Icon size={16} className={isActive ? "text-slate-300" : "text-slate-400"} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
}
