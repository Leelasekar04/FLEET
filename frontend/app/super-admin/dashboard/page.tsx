"use client";

import { useState, useEffect } from "react";
import { 
  Building2, Truck, Users, DollarSign, Activity, 
  CreditCard, ShieldAlert, BarChart3, PieChart, TrendingUp, AlertTriangle, UserPlus, Clock
} from "lucide-react";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Mocking the backend call until we build it
    setTimeout(() => {
      setStats({
        companies: { total: 142, active: 128, trial: 12, expired: 2 },
        users: { total: 2450 },
        drivers: { total: 4200 },
        vehicles: { total: 3800 },
        revenue: { mrr: 125000, total: 4500000 },
        renewals: { pending: 15 },
        support: { openTickets: 24 },
        recentActivities: [
          { id: 1, type: 'registration', title: 'New Registration', desc: 'Acme Logistics joined', time: '10 mins ago' },
          { id: 2, type: 'payment', title: 'Payment Received', desc: '$4,500 from FastFreight', time: '2 hours ago' },
          { id: 3, type: 'registration', title: 'New Registration', desc: 'Global Transit joined', time: '5 hours ago' },
          { id: 4, type: 'system', title: 'System Update', desc: 'v2.4 deployed', time: '1 day ago' },
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const kpiCards = [
    { label: "Total Companies", value: stats.companies.total, icon: Building2, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Active Companies", value: stats.companies.active, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Trial Companies", value: stats.companies.trial, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Expired Companies", value: stats.companies.expired, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
    { label: "Total Users", value: stats.users.total, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Drivers", value: stats.drivers.total, icon: UserPlus, color: "text-cyan-600", bg: "bg-cyan-100" },
    { label: "Total Vehicles", value: stats.vehicles.total, icon: Truck, color: "text-sky-600", bg: "bg-sky-100" },
    { label: "Total Revenue", value: `$${(stats.revenue.total / 1000000).toFixed(1)}M`, icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { label: "MRR", value: `$${(stats.revenue.mrr / 1000).toFixed(1)}k`, icon: TrendingUp, color: "text-teal-600", bg: "bg-teal-100" },
    { label: "Pending Renewals", value: stats.renewals.pending, icon: CreditCard, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Open Tickets", value: stats.support.openTickets, icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-100" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Super Admin Dashboard</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Platform-wide KPI overview and analytics</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <Building2 size={16} /> Add Company
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon || Building2;
          return (
            <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={20} strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{kpi.value}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1" title={kpi.label}>{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Analytics */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-[250px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-indigo-600" /> Company Growth
                </h2>
              </div>
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                <p className="text-slate-400 font-bold text-sm">Company Growth Chart</p>
              </div>
            </div>

            {/* Chart 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-[250px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 size={18} className="text-teal-600" /> Revenue Analytics
                </h2>
              </div>
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                <p className="text-slate-400 font-bold text-sm">Revenue Bar Chart</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
             {/* Chart 3 */}
             <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 h-[250px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <PieChart size={18} className="text-purple-600" /> Subscription Distribution
                </h2>
              </div>
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                <p className="text-slate-400 font-bold text-sm">Subscription Pie Chart</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Feeds */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" /> Recent Activities
            </h2>
            <div className="space-y-5">
              {stats.recentActivities.map((act: any) => (
                <div key={act.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {act.type === 'registration' && <Building2 size={16} className="text-indigo-600" />}
                    {act.type === 'payment' && <DollarSign size={16} className="text-green-600" />}
                    {act.type === 'system' && <ShieldAlert size={16} className="text-rose-600" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{act.title}</h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{act.desc}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors">
              View All Activities
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

